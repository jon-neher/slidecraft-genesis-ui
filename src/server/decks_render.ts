import type { Database } from '../integrations/supabase/types'
import { getSupabaseClient } from './supabaseClient'

interface SlideData {
  section: string
  templates: string[]
}

function buildHtml(slidesData: SlideData[], themeCss: string): string {
  const slides = slidesData
    .map(({ section, templates }) =>
      `<section data-section="${section}" data-templates="${templates.join(',')}"><h2>${section}</h2></section>`,
    )
    .join('\n')
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js/dist/reveal.css">
  <style>${themeCss}</style>
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
  const client = getSupabaseClient(auth)
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

    const { data: mappings, error: mapErr } = await client
      .from('section_templates')
      .select('section_id, default_templates')
      .in('section_id', sections)
    if (mapErr) throw mapErr

    const defaults = new Map(
      (mappings || []).map(m => [m.section_id, m.default_templates as string[]]),
    )

    const slidesData = sections.map(section => ({
      section,
      templates: (overrides[section] as string[]) || defaults.get(section) || [],
    }))

    const { data: themeRow } = await client
      .from('themes')
      .select('css')
      .eq('theme_id', data.theme)
      .maybeSingle()

    const html = buildHtml(slidesData, themeRow?.css || '')
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
