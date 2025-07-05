
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from 'npm:openai'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const apiKey = Deno.env.get('OPENAI_API_KEY')
const openai = new OpenAI({ apiKey })

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    
    if (req.method === 'GET' && url.pathname === '/generate') {
      const prompt = url.searchParams.get('prompt') ?? ''
      const count = url.searchParams.get('slides') ?? '1'
      const authHeader = req.headers.get('Authorization') || ''
      const token = authHeader.replace(/^Bearer\s+/i, '')
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

      // Create Supabase client with proper token handling
      const authed = createClient(supabaseUrl, supabaseServiceKey, {
        accessToken: () => Promise.resolve(token),
      })

      // Get authenticated user using Supabase auth
      const { data: { user }, error: authError } = await authed.auth.getUser()
      
      if (authError || !user) {
        console.error('Authentication failed:', authError?.message)
        return new Response('Unauthorized', { status: 401, headers: corsHeaders })
      }

      const userId = user.id
      console.log('Received request with prompt:', prompt, 'slides:', count, 'user:', userId)

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Return a JSON array of slide objects with title, bullets[], images[]' },
            { role: 'user', content: `Prompt: ${prompt}\nSlides: ${count}` },
          ],
        })

        const slides = JSON.parse(completion.choices[0].message.content ?? '')

        const { data: pres, error: presError } = await authed
          .from('presentations_generated')
          .insert({ user_id: userId, title: prompt })
          .select('presentation_id')
          .single()

        if (presError) {
          console.error('Supabase insert error:', presError)
          return new Response(JSON.stringify({ error: 'Failed to store presentation' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          })
        }

        const { error: planError } = await authed
          .from('presentation_plans')
          .insert({ presentation_id: pres.presentation_id, plan_json: slides })

        if (planError) {
          console.error('Plan insert error:', planError)
        }

        return new Response(JSON.stringify({ presentation_id: pres.presentation_id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      } catch (err) {
        console.error('OpenAI error:', err)
        return new Response(JSON.stringify({ error: 'Failed to generate slides' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        })
      }
    }
    
    // Handle other paths
    return new Response(JSON.stringify({ error: 'Not found' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404,
    })
    
  } catch (error) {
    console.error('Error in generate-slides function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
