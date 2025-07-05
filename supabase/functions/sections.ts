
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import OpenAI from 'npm:openai'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function getSupabaseClient(token?: string) {
  return createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    token ? { accessToken: () => Promise.resolve(token) } : {}
  )
}

interface Rule {
  goalPatterns: string[]
  audiencePatterns: string[]
  sections: string[]
}

const ruleSet: Rule[] = [
  {
    goalPatterns: ['quarterly review', 'business review', 'qbr'],
    audiencePatterns: ['executive', 'leadership', 'board'],
    sections: ['intro', 'highlights', 'metrics', 'roadmap', 'q_and_a']
  },
  {
    goalPatterns: ['project proposal', 'proposal', 'pitch'],
    audiencePatterns: ['investor', 'stakeholder', 'client'],
    sections: ['intro', 'problem', 'solution', 'benefits', 'costs', 'next_steps', 'q_and_a']
  },
  {
    goalPatterns: ['training', 'onboarding', 'tutorial'],
    audiencePatterns: ['new hire', 'employee', 'team'],
    sections: ['intro', 'agenda', 'overview', 'lesson', 'exercise', 'summary']
  },
  {
    goalPatterns: ['sales pitch', 'sales presentation'],
    audiencePatterns: ['customer', 'prospect'],
    sections: ['intro', 'need', 'solution', 'case_study', 'pricing', 'next_steps', 'q_and_a']
  },
  {
    goalPatterns: ['product demo', 'demo'],
    audiencePatterns: ['prospect', 'client'],
    sections: ['intro', 'features', 'demo', 'benefits', 'pricing', 'q_and_a']
  }
]

interface CacheEntry {
  sections: string[]
  expires: number
}

const cache = new Map<string, CacheEntry>()

const demoPairs = [
  { goal: 'Quarterly Business Review', audience: 'executive team' },
  { goal: 'Project Proposal', audience: 'stakeholder' },
  { goal: 'Training', audience: 'new hire' },
  { goal: 'Sales Pitch', audience: 'customer' },
  { goal: 'Product Demo', audience: 'prospect' }
]

for (const { goal, audience } of demoPairs) {
  const g = goal.toLowerCase()
  const a = audience.toLowerCase()
  const rule = ruleSet.find(r =>
    r.goalPatterns.some(p => g.includes(p)) &&
    r.audiencePatterns.some(p => a.includes(p))
  )
  if (rule) {
    const key = `${g}|${a}|0`
    cache.set(key, { sections: rule.sections, expires: Date.now() + 30 * 24 * 60 * 60 * 1000 })
  }
}

const openai = new OpenAI()

export async function handleRequest(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const path = url.pathname.replace(/^\/+|\/+$/g, '')

  const normalized = path.replace(/^api\//, '')
  if (normalized !== 'sections/suggest' || req.method !== 'POST') {
    return new Response('Not found', { 
      status: 404,
      headers: corsHeaders
    })
  }

  const auth = req.headers.get('Authorization') || ''
  const token = auth.replace(/^Bearer\s+/i, '')

  function getSub(h: string): string | null {
    try {
      const payload = JSON.parse(atob(h.split('.')[1]))
      return payload.sub ?? null
    } catch {
      return null
    }
  }

  const userId = getSub(token)
  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
      headers: corsHeaders,
    })
  }

  const client = getSupabaseClient(token)

  const { goal = '', audience = '', creative = false } = await req.json()

  const key = `${goal.toLowerCase()}|${audience.toLowerCase()}|${creative ? 1 : 0}`
  const cached = cache.get(key)
  if (cached && cached.expires > Date.now()) {
    return new Response(JSON.stringify({ sections: cached.sections }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const g = goal.toLowerCase()
  const a = audience.toLowerCase()
  const rule = !creative && ruleSet.find(r =>
    r.goalPatterns.some(p => g.includes(p)) &&
    r.audiencePatterns.some(p => a.includes(p))
  )

  let sections: string[]
  if (rule) {
    sections = rule.sections
  } else {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4.1-nano',
        max_tokens: 50,
        messages: [{ role: 'user', content: `Suggest 5–7 section IDs for goal="${goal}" and audience="${audience}".` }]
      })
      sections = JSON.parse(completion.choices[0].message.content || '[]')
    } catch (err) {
      console.error('Section suggest error:', err)
      sections = ['intro', 'context', 'analysis', 'recommendation', 'q_and_a']
    }
  }

  cache.set(key, { sections, expires: Date.now() + 24 * 60 * 60 * 1000 })
  return new Response(JSON.stringify({ sections }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

Deno.serve(handleRequest)
