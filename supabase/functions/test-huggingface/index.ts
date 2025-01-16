import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    if (!hfToken) {
      throw new Error('Hugging Face token not configured')
    }

    console.log('Testing Hugging Face API connection...')
    
    const hf = new HfInference(hfToken)
    
    // Simple test using text classification
    const result = await hf.textClassification({
      model: 'ProsusAI/finbert',
      inputs: 'This is a test message to verify the API connection.',
    })

    console.log('API test successful:', result)

    return new Response(
      JSON.stringify({ 
        status: 'success',
        message: 'Hugging Face API connection successful',
        result 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error testing Hugging Face API:', error)
    
    return new Response(
      JSON.stringify({ 
        status: 'error',
        message: error.message,
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})