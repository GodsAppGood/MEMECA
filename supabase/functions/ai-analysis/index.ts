import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

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
    const { type, data } = await req.json()
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))
    
    console.log('AI Analysis request:', { type, timestamp: new Date().toISOString() })

    switch (type) {
      case 'analyze_image': {
        const { imageUrl } = data
        console.log('Analyzing image:', imageUrl)
        
        const imageAnalysis = await hf.imageToText({
          model: 'Salesforce/blip-image-captioning-large',
          inputs: imageUrl,
        })

        return new Response(
          JSON.stringify({ analysis: imageAnalysis }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'analyze_text': {
        const { text } = data
        console.log('Analyzing text:', text)

        const sentimentAnalysis = await hf.textClassification({
          model: 'ProsusAI/finbert',
          inputs: text,
        })

        return new Response(
          JSON.stringify({ analysis: sentimentAnalysis }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'chat': {
        const { message } = data
        console.log('Processing chat message:', message)

        try {
          const chatResponse = await hf.textGeneration({
            model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
            inputs: `<|im_start|>system
You are a helpful AI assistant that specializes in meme coins and cryptocurrency analysis. You provide clear, concise answers and always maintain a friendly, professional tone.
<|im_end|>
<|im_start|>user
${message}
<|im_end|>
<|im_start|>assistant`,
            parameters: {
              max_new_tokens: 200,
              temperature: 0.7,
              top_p: 0.95,
              return_full_text: false,
            },
          })

          console.log('Chat response received:', chatResponse)

          return new Response(
            JSON.stringify({ response: chatResponse.generated_text }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (chatError) {
          console.error('Error in chat processing:', chatError)
          throw chatError
        }
      }

      default:
        throw new Error('Invalid analysis type')
    }
  } catch (error) {
    console.error('Error in ai-analysis function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})