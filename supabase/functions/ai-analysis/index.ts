import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get('ai_secret');
    if (!token) {
      throw new Error('AI token not configured');
    }

    console.log('Initializing HF with token:', { tokenLength: token.length, timestamp: new Date().toISOString() });
    
    const hf = new HfInference(token)
    const { type, data } = await req.json()
    
    console.log('Processing request:', { type, data, timestamp: new Date().toISOString() })

    switch (type) {
      case 'chat': {
        const { message } = data
        if (!message) {
          throw new Error('Message is required for chat')
        }

        try {
          // Анализ настроения
          const sentimentAnalysis = await hf.textClassification({
            model: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
            inputs: message,
          })

          console.log('Sentiment analysis result:', { 
            sentiment: sentimentAnalysis,
            timestamp: new Date().toISOString() 
          })

          // Генерация ответа
          const response = await hf.textGeneration({
            model: 'facebook/bart-large-cnn',
            inputs: message,
            parameters: {
              max_length: 100,
              temperature: 0.7,
              top_p: 0.95,
            },
          })

          console.log('Generated response:', {
            response: response,
            timestamp: new Date().toISOString()
          })

          // Добавляем эмодзи в зависимости от настроения
          let sentiment = ''
          if (sentimentAnalysis[0]?.label === 'positive') {
            sentiment = '😊 '
          } else if (sentimentAnalysis[0]?.label === 'negative') {
            sentiment = '😔 '
          }

          return new Response(
            JSON.stringify({
              response: `${sentiment}${response.generated_text}`,
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error in chat processing:', {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
          })
          throw error
        }
      }

      case 'analyze_text': {
        const { text } = data
        if (!text) {
          throw new Error('Text is required for analysis')
        }

        const analysis = await hf.textClassification({
          model: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
          inputs: text,
        })

        return new Response(
          JSON.stringify({ analysis }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      case 'analyze_image': {
        const { imageUrl } = data
        if (!imageUrl) {
          throw new Error('Image URL is required for analysis')
        }

        const analysis = await hf.imageClassification({
          model: 'microsoft/resnet-50',
          inputs: imageUrl,
        })

        return new Response(
          JSON.stringify({ analysis }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      default:
        throw new Error(`Unknown analysis type: ${type}`)
    }
  } catch (error) {
    console.error('Error in ai-analysis function:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })

    return new Response(
      JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})