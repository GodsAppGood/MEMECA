import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()
    console.log('Received request:', { type, data })

    let response
    if (type === 'analyze_meme') {
      response = {
        analysis: {
          scores: {
            humor: 8,
            originality: 7,
            cryptoRelevance: 9,
            viralPotential: 8
          },
          explanations: {
            humor: "The meme effectively uses humor through clever wordplay and relatable crypto references.",
            originality: "While the format is familiar, the content brings a fresh perspective to crypto memes.",
            cryptoRelevance: "Directly addresses current crypto market trends and community sentiments.",
            viralPotential: "High shareability due to its timely and relatable content."
          },
          overallAnalysis: "This meme shows strong potential with its blend of humor and crypto relevance. The timing and execution make it highly shareable."
        }
      }
    } else if (type === 'chat') {
      response = {
        response: `AI Response: ${data.message}`
      }
    } else {
      throw new Error('Invalid request type')
    }

    console.log('Sending response:', response)

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to process request" 
      }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    )
  }
})