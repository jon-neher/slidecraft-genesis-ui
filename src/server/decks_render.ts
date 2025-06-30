import { createClient } from '@supabase/supabase-js'
import type { Database } from '../integrations/supabase/types'
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './config'

function buildHtml(sections: string[]): string {
  const slides = sections.map(s => `<section><h2>${s}</h2></section>`).join('\n')
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js/dist/reveal.css">
  <script src="https://cdn.jsdelivr.net/npm/reveal.js/dist/reveal.js"></script>
</head>
<body>
  <div class="reveal"><div class="slides">${slides}</div></div>
  <script>Reveal.initialize({ controls: true, progress: true });</script>
</body>
</html>`
}

export async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const path = url.pathname.replace(/^\/+|\/+$/g, '')
  const normalized = path.replace(/^api\//, '')
  if (normalized !== 'decks/render' || req.method !== 'POST') {
    return new Response('Not found', { status: 404 })
  }

  const auth = req.headers.get('Authorization') || ''
  const client = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: auth } },
  })
  const { data: { user } } = await client.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  try {
    const { blueprint_id, data_sources = {}, overrides = {} } = await req.json()
    if (!blueprint_id) {
      return new Response('blueprint_id required', { status: 400 })
    }
    const { data, error } = await client
      .from('blueprints')
      .select('*')
      .eq('blueprint_id', blueprint_id)
      .maybeSingle()
    if (error) throw error
    if (!data || (!data.is_default && data.user_id !== user.id)) {
      return new Response('Not Found', { status: 404 })
    }
    const sections = (data.section_sequence as string[]) || []
    const html = buildHtml(sections)
    const deckId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
    const base = `https://example.com/decks/${deckId}`

    // Normally we would store html & assets here
    console.log('Render deck', { blueprint_id, data_sources, overrides })

    return new Response(
      JSON.stringify({
        presentation_url: `${base}/index.html`,
        assets_bundle_url: `${base}/reveal-assets.zip`,
        html,
      }),
      { headers: { 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('Deck render error:', err)
    return new Response('Internal server error', { status: 500 })
  }
}

export default { handleRequest }
