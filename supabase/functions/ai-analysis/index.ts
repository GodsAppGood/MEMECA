import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const { type, data } = await req.json();
    console.log('Processing request:', { type, data });

    if (type === 'analyze_meme') {
      const { memeId } = data;
      if (!memeId) {
        throw new Error('Meme ID is required for analysis');
      }

      // Get Supabase credentials from environment
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials not configured');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Fetch meme data
      const { data: meme, error: memeError } = await supabase
        .from('Memes')
        .select('*')
        .eq('id', memeId)
        .single();

      if (memeError || !meme) {
        console.error('Failed to fetch meme:', memeError);
        throw new Error('Failed to fetch meme data');
      }

      if (!meme.image_url) {
        throw new Error('Meme image URL not found');
      }

      console.log('Analyzing meme:', { 
        id: meme.id, 
        title: meme.title,
        imageUrl: meme.image_url 
      });

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
              content: `You are an expert meme analyst specializing in cryptocurrency and blockchain memes. 
              Analyze the provided meme and give scores from 1 to 10 for each criterion, along with brief explanations.
              
              Criteria:
              1. Humor: How funny and entertaining is it?
              2. Originality: How unique and creative is it?
              3. Crypto Relevance: How well does it relate to crypto/blockchain?
              4. Viral Potential: How likely is it to be shared widely?
              
              Format your response as a JSON object with these exact keys:
              {
                "scores": {
                  "humor": number (1-10),
                  "originality": number (1-10),
                  "cryptoRelevance": number (1-10),
                  "viralPotential": number (1-10)
                },
                "explanations": {
                  "humor": "brief explanation",
                  "originality": "brief explanation",
                  "cryptoRelevance": "brief explanation",
                  "viralPotential": "brief explanation"
                },
                "overallAnalysis": "2-3 sentence summary"
              }`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: meme.image_url,
                },
                {
                  type: 'text',
                  text: `Analyze this meme. Title: "${meme.title}". Description: "${meme.description || 'No description provided'}"`
                }
              ]
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI API error:', error);
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Analysis complete:', result);

      const analysis = JSON.parse(result.choices[0].message.content);
      
      return new Response(
        JSON.stringify({ analysis }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    throw new Error(`Unknown analysis type: ${type}`);
  } catch (error) {
    console.error('Error in ai-analysis function:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to analyze meme. Please try again later.',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});