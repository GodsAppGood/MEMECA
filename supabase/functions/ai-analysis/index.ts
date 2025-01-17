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
        throw new Error('Failed to fetch meme data');
      }

      console.log('Analyzing meme:', { 
        id: meme.id, 
        title: meme.title,
        imageUrl: meme.image_url 
      });

      const systemPrompt = `You are an expert meme analyst specializing in cryptocurrency and blockchain memes. 
      Analyze this meme based on the following criteria and provide a score from 1 to 10 for each:

      1. Humor: How funny and entertaining is the meme?
      2. Originality: How unique and creative is the concept?
      3. Crypto Relevance: How well does it relate to cryptocurrency/blockchain?
      4. Viral Potential: How likely is it to be shared and go viral?

      For each criterion, provide:
      - A score (1-10)
      - A brief explanation (2-3 sentences)

      Also provide an overall analysis (2-3 sentences).

      Format your response as a JSON object with these exact keys:
      {
        "scores": {
          "humor": number,
          "originality": number,
          "cryptoRelevance": number,
          "viralPotential": number
        },
        "explanations": {
          "humor": string,
          "originality": string,
          "cryptoRelevance": string,
          "viralPotential": string
        },
        "overallAnalysis": string
      }`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
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
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI API error:', error);
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Analysis complete:', result);

      try {
        const analysis = JSON.parse(result.choices[0].message.content);
        return new Response(
          JSON.stringify({ analysis }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        throw new Error('Failed to parse AI analysis results');
      }
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