import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import type { Database } from '../integrations/supabase/types'
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './config'

const openai = new OpenAI()

export async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const path = url.pathname.replace(/^\/+|\/+$/g, '')

  if (path !== 'sections/suggest' || req.method !== 'POST') {
    return new Response('Not found', { status: 404 })
  }

  const auth = req.headers.get('Authorization') || ''
  const client = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: auth } },
  })
  const { data: { user } } = await client.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { goal = '', audience = '' } = await req.json()

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: 'Return a JSON array of short presentation section titles.' },
        { role: 'user', content: `Goal: ${goal}\nAudience: ${audience}` },
      ],
    })
    const sections = JSON.parse(completion.choices[0].message.content || '[]')
    return new Response(JSON.stringify({ sections }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Section suggest error:', err)
    return new Response('Internal server error', { status: 500 })
  }
}

export default { handleRequest }
