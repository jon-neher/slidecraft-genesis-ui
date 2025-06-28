
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    
    // Check if this is a GET request to /generate
    if (req.method === 'GET' && url.pathname === '/generate') {
      // Get query parameters (prompt and slides are available but not used in this implementation)
      const prompt = url.searchParams.get('prompt')
      const slides = url.searchParams.get('slides')
      
      console.log('Received request with prompt:', prompt, 'slides:', slides)
      
      // Return hard-coded JSON array
      const response = [
        {
          "title": "Test Slide",
          "bullets": ["One", "Two"],
          "images": []
        }
      ]
      
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
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
