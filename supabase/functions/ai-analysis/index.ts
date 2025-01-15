import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to add retry logic
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    const { type, data } = await req.json()
    
    console.log('AI Analysis request:', { type, data, timestamp: new Date().toISOString() })

    // Verify Hugging Face token
    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    if (!hfToken) {
      console.error('Hugging Face token not found')
      throw new Error('Hugging Face token not configured')
    }

    const hf = new HfInference(hfToken)
    
    switch (type) {
      case 'chat': {
        const { message } = data
        if (!message || typeof message !== 'string') {
          throw new Error('Invalid message format')
        }

        console.log('Processing chat message:', message)

        try {
          const prompt = `<|im_start|>system
You are a helpful AI assistant that specializes in meme coins and cryptocurrency analysis. You provide clear, concise answers and always maintain a friendly, professional tone.
<|im_end|>
<|im_start|>user
${message}
<|im_end|>
<|im_start|>assistant`

          console.log('Sending request to Hugging Face API with prompt:', prompt)
          
          const chatResponse = await withRetry(async () => {
            const response = await hf.textGeneration({
              model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
              inputs: prompt,
              parameters: {
                max_new_tokens: 200,
                temperature: 0.7,
                top_p: 0.95,
                return_full_text: false,
              },
            });
            
            if (!response || !response.generated_text) {
              throw new Error('Invalid response from Hugging Face API');
            }
            
            return response;
          });

          console.log('Raw chat response:', chatResponse)

          const response = chatResponse.generated_text.trim()
          console.log('Processed response:', response)

          return new Response(
            JSON.stringify({ response }),
            { 
              status: 200,
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json' 
              } 
            }
          )
        } catch (chatError) {
          console.error('Error in chat processing:', {
            error: chatError,
            message: chatError.message,
            stack: chatError.stack
          })
          throw new Error(`Chat processing failed: ${chatError.message}`)
        }
      }

      case 'analyze_image': {
        const { imageUrl } = data
        console.log('Analyzing image:', imageUrl)
        
        const imageAnalysis = await withRetry(() => 
          hf.imageToText({
            model: 'Salesforce/blip-image-captioning-large',
            inputs: imageUrl,
          })
        );

        return new Response(
          JSON.stringify({ analysis: imageAnalysis }),
          { 
            status: 200,
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        )
      }

      case 'analyze_text': {
        const { text } = data
        console.log('Analyzing text:', text)

        const sentimentAnalysis = await withRetry(() =>
          hf.textClassification({
            model: 'ProsusAI/finbert',
            inputs: text,
          })
        );

        return new Response(
          JSON.stringify({ analysis: sentimentAnalysis }),
          { 
            status: 200,
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        )
      }

      default:
        throw new Error('Invalid analysis type')
    }
  } catch (error) {
    console.error('Error in ai-analysis function:', {
      error,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        timestamp: new Date().toISOString()
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