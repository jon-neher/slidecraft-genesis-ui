import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import type { Database } from '../integrations/supabase/types'
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './config'

interface Rule {
  goalPatterns: string[]
  audiencePatterns: string[]
  sections: string[]
}

const ruleSet: Rule[] = [
  {
    goalPatterns: ['quarterly review', 'business review', 'qbr'],
    audiencePatterns: ['executive', 'leadership', 'board'],
    sections: ['intro', 'highlights', 'metrics', 'roadmap', 'q_and_a'],
  },
  {
    goalPatterns: ['project proposal', 'proposal', 'pitch'],
    audiencePatterns: ['investor', 'stakeholder', 'client'],
    sections: [
      'intro',
      'problem',
      'solution',
      'benefits',
      'costs',
      'next_steps',
      'q_and_a',
    ],
  },
  {
    goalPatterns: ['training', 'onboarding', 'tutorial'],
    audiencePatterns: ['new hire', 'employee', 'team'],
    sections: ['intro', 'agenda', 'overview', 'lesson', 'exercise', 'summary'],
  },
  {
    goalPatterns: ['sales pitch', 'sales presentation'],
    audiencePatterns: ['customer', 'prospect'],
    sections: [
      'intro',
      'need',
      'solution',
      'case_study',
      'pricing',
      'next_steps',
      'q_and_a',
    ],
  },
  {
    goalPatterns: ['product demo', 'demo'],
    audiencePatterns: ['prospect', 'client'],
    sections: [
      'intro',
      'features',
      'demo',
      'benefits',
      'pricing',
      'q_and_a',
    ],
  },
]

interface CacheEntry {
  sections: string[]
  expires: number
}

const cache = new Map<string, CacheEntry>()

const openai = new OpenAI()

export async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const path = url.pathname.replace(/^\/+|\/+$/g, '')

  const normalized = path.replace(/^api\//, '')
  if (normalized !== 'sections/suggest' || req.method !== 'POST') {
    return new Response('Not found', { status: 404 })
  }

  const auth = req.headers.get('Authorization') || ''
  const client = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: auth } },
  })
  const { data: { user } } = await client.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { goal = '', audience = '', creative = false } = await req.json()

  const key = `${goal.toLowerCase()}|${audience.toLowerCase()}|${creative ? 1 : 0}`
  const cached = cache.get(key)
  if (cached && cached.expires > Date.now()) {
    return new Response(JSON.stringify({ sections: cached.sections }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const g = goal.toLowerCase()
  const a = audience.toLowerCase()
  const rule =
    !creative &&
    ruleSet.find(r =>
      r.goalPatterns.some(p => g.includes(p)) &&
      r.audiencePatterns.some(p => a.includes(p))
    )

  let sections: string[]
  if (rule) {
    sections = rule.sections
  } else {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        max_tokens: 50,
        messages: [
          {
            role: 'user',
            content: `Suggest 5–7 section IDs for goal="${goal}" and audience="${audience}".`,
          },
        ],
      })
      sections = JSON.parse(completion.choices[0].message.content || '[]')
    } catch (err) {
      console.error('Section suggest error:', err)
      sections = ['intro', 'context', 'analysis', 'recommendation', 'q_and_a']
    }
  }

  cache.set(key, { sections, expires: Date.now() + 24 * 60 * 60 * 1000 })
  return new Response(JSON.stringify({ sections }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export default { handleRequest }
