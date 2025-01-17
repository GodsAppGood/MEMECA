import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing request with OpenAI...', { timestamp: new Date().toISOString() });
    
    const { type, data } = await req.json()
    
    console.log('Request details:', { type, data, timestamp: new Date().toISOString() })

    switch (type) {
      case 'chat': {
        const { message } = data
        if (!message) {
          throw new Error('Message is required for chat')
        }

        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { 
                  role: 'system', 
                  content: 'You are a helpful assistant that specializes in memes, cryptocurrency, and blockchain technology. You provide friendly and informative responses while maintaining a casual tone.' 
                },
                { role: 'user', content: message }
              ],
              temperature: 0.7,
              max_tokens: 500,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            console.error('OpenAI API error:', {
              status: response.status,
              error,
              timestamp: new Date().toISOString()
            });
            throw new Error('Failed to get response from OpenAI');
          }

          const result = await response.json();
          console.log('OpenAI response received:', {
            timestamp: new Date().toISOString()
          });

          return new Response(
            JSON.stringify({
              response: result.choices[0].message.content,
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
          });
          throw error;
        }
      }

      case 'analyze_text': {
        const { text } = data
        if (!text) {
          throw new Error('Text is required for analysis')
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { 
                role: 'system', 
                content: 'You are an AI that analyzes text content related to memes and cryptocurrency. Provide sentiment and content analysis.' 
              },
              { role: 'user', content: `Analyze this text: ${text}` }
            ],
          }),
        });

        const result = await response.json();
        return new Response(
          JSON.stringify({ analysis: result.choices[0].message.content }),
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

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { 
                role: 'system', 
                content: 'You are an AI that analyzes images related to memes and cryptocurrency. Describe the content and provide relevant insights.' 
              },
              { 
                role: 'user', 
                content: [
                  {
                    type: 'image_url',
                    image_url: imageUrl,
                  },
                  {
                    type: 'text',
                    text: 'Analyze this meme image and describe its content and potential impact.'
                  }
                ]
              }
            ],
          }),
        });

        const result = await response.json();
        return new Response(
          JSON.stringify({ analysis: result.choices[0].message.content }),
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