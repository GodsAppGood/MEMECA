import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
        
        // Image analysis using BLIP
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

        // Sentiment analysis using FinBERT
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

        // Chat using Mixtral
        const chatResponse = await hf.textGeneration({
          model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
          inputs: message,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            top_p: 0.95,
          },
        })

        return new Response(
          JSON.stringify({ response: chatResponse }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        throw new Error('Invalid analysis type')
    }
  } catch (error) {
    console.error('Error in ai-analysis function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})