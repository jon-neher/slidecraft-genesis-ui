
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const authHeader = req.headers.get('Authorization') ?? ''

    // Create client with anon key and pass through JWT token for RLS
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    })

    console.log('Processing presentation request with authenticated user')

    const {
      title,
      description,
      context,
      template_preferences,
      audience_info,
      presentation_type,
      slide_count_preference
    } = await req.json()

    console.log('Processing presentation request')

    // Get user ID from JWT for logging and user_id field
    const userIdQuery = await supabase.rpc('auth_jwt_sub')
    const userId = userIdQuery.data || 'unknown'
    console.log('User ID from JWT:', userId)

    // Store the user input 
    const { data: inputData, error: inputError } = await supabase
      .from('presentations_input')
      .insert({
        user_id: userId,
        title,
        description,
        context,
        template_preferences,
        audience_info,
        presentation_type,
        slide_count_preference,
        status: 'pending'
      })
      .select('input_id')
      .single()

    if (inputError) {
      console.error('Error storing presentation input:', inputError)
      return new Response(JSON.stringify({ error: 'Failed to store presentation input' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // Create a processing job
    const { data: jobData, error: jobError } = await supabase
      .from('presentation_jobs')
      .insert({
        input_id: inputData.input_id,
        status: 'queued',
        processing_steps: {
          steps: ['analyze_input', 'generate_outline', 'create_slides', 'finalize'],
          current_step: 'analyze_input',
          progress: 0
        }
      })
      .select('job_id')
      .single()

    if (jobError) {
      console.error('Error creating presentation job:', jobError)
      return new Response(JSON.stringify({ error: 'Failed to create processing job' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // Trigger the orchestrator function asynchronously
    try {
      await supabase.functions.invoke('ai-presentation-orchestrator', {
        body: { job_id: jobData.job_id }
      })
    } catch (error) {
      console.error('Error triggering orchestrator:', error)
      // Don't fail the request if orchestrator fails to start
    }

    return new Response(JSON.stringify({ 
      job_id: jobData.job_id,
      input_id: inputData.input_id,
      status: 'queued'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in process-presentation-request function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
