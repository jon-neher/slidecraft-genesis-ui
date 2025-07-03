import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import OpenAI from 'npm:openai'

const apiKey = Deno.env.get('OPENAI_API_KEY')
const openai = new OpenAI({ apiKey })

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { job_id } = await req.json()

    console.log('Starting orchestration for job:', job_id)

    // Get the job and input data
    const { data: job, error: jobError } = await supabase
      .from('presentation_jobs')
      .select(`
        *,
        presentations_input (*)
      `)
      .eq('job_id', job_id)
      .single()

    if (jobError || !job) {
      console.error('Error fetching job:', jobError)
      return new Response(JSON.stringify({ error: 'Job not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    // Update job status to processing
    await supabase
      .from('presentation_jobs')
      .update({ 
        status: 'processing', 
        started_at: new Date().toISOString(),
        processing_steps: {
          ...job.processing_steps,
          current_step: 'analyze_input',
          progress: 25
        }
      })
      .eq('job_id', job_id)

    const input = job.presentations_input

    try {
      // Step 1: Analyze input and create presentation plan
      const analysisPrompt = `
        Create a detailed presentation plan based on this input:
        Title: ${input.title}
        Description: ${input.description || 'Not provided'}
        Type: ${input.presentation_type || 'general'}
        Target slides: ${input.slide_count_preference || 'auto'}
        Context: ${JSON.stringify(input.context || {})}
        
        Return a JSON object with:
        - recommended_slide_count: number
        - outline: array of slide objects with title, content_type, key_points
        - presentation_flow: brief description of the logical flow
      `

      console.log('Generating presentation plan...')
      const planCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert presentation designer. Return valid JSON only.' },
          { role: 'user', content: analysisPrompt },
        ],
        temperature: 0.7,
      })

      const presentationPlan = JSON.parse(planCompletion.choices[0].message.content ?? '{}')

      // Update progress
      await supabase
        .from('presentation_jobs')
        .update({ 
          processing_steps: {
            ...job.processing_steps,
            current_step: 'generate_outline',
            progress: 50,
            plan: presentationPlan
          }
        })
        .eq('job_id', job_id)

      // Step 2: Generate individual slides
      console.log('Generating slides content...')
      const slides = []
      
      for (let i = 0; i < presentationPlan.outline.length; i++) {
        const slideOutline = presentationPlan.outline[i]
        
        const slidePrompt = `
          Create slide content for:
          Title: ${slideOutline.title}
          Content Type: ${slideOutline.content_type}
          Key Points: ${slideOutline.key_points.join(', ')}
          
          Context: ${JSON.stringify(input.context || {})}
          
          Return JSON with: title, bullets (array), images (empty array for now)
        `

        const slideCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Create engaging slide content. Return valid JSON only.' },
            { role: 'user', content: slidePrompt },
          ],
          temperature: 0.8,
        })

        const slideContent = JSON.parse(slideCompletion.choices[0].message.content ?? '{}')
        slides.push(slideContent)
      }

      // Update progress
      await supabase
        .from('presentation_jobs')
        .update({ 
          processing_steps: {
            ...job.processing_steps,
            current_step: 'create_slides',
            progress: 75,
            slides_generated: slides.length
          }
        })
        .eq('job_id', job_id)

      // Step 3: Create final presentation record
      console.log('Creating final presentation...')
      const { data: presentation, error: presError } = await supabase
        .from('presentations_generated')
        .insert({
          user_id: input.user_id,
          title: input.title,
          context: input.context,
          generation_status: 'complete',
          input_id: input.input_id,
          job_id: job_id,
          completed_at: new Date().toISOString()
        })
        .select('presentation_id')
        .single()

      if (presError) {
        throw new Error(`Failed to create presentation: ${presError.message}`)
      }

      // Create initial revision with generated slides
      await supabase
        .from('presentations_revisions')
        .insert({
          presentation_id: presentation.presentation_id,
          slides: { content: slides },
          version: 1,
          created_by: input.user_id
        })

      // Update job as completed
      await supabase
        .from('presentation_jobs')
        .update({ 
          status: 'completed',
          presentation_id: presentation.presentation_id,
          completed_at: new Date().toISOString(),
          processing_steps: {
            ...job.processing_steps,
            current_step: 'finalize',
            progress: 100
          }
        })
        .eq('job_id', job_id)

      // Update input status
      await supabase
        .from('presentations_input')
        .update({ status: 'completed' })
        .eq('input_id', input.input_id)

      return new Response(JSON.stringify({ 
        success: true,
        presentation_id: presentation.presentation_id,
        slides_count: slides.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })

    } catch (error) {
      console.error('Error during orchestration:', error)
      
      // Mark job as failed
      await supabase
        .from('presentation_jobs')
        .update({ 
          status: 'failed',
          error_message: error.message,
          completed_at: new Date().toISOString()
        })
        .eq('job_id', job_id)

      // Mark input as failed
      await supabase
        .from('presentations_input')
        .update({ status: 'failed' })
        .eq('input_id', input.input_id)

      throw error
    }

  } catch (error) {
    console.error('Error in ai-presentation-orchestrator function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})