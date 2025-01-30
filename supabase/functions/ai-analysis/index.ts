import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const { type, data } = await req.json();
    const { memeId } = data;

    if (type !== 'analyze_meme' || !memeId) {
      throw new Error('Invalid request parameters');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey || !supabaseUrl || !supabaseKey) {
      throw new Error('Missing required configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: meme, error: memeError } = await supabase
      .from('Memes')
      .select('*')
      .eq('id', memeId)
      .single();

    if (memeError || !meme) {
      throw new Error('Failed to fetch meme data');
    }

    const isYourMeme = meme.created_by === '6eba6738-1c7a-49d8-9ceb-361d9a644bd4';
    const systemPrompt = isYourMeme ? 
      `You are an expert meme analyst specializing in cryptocurrency and blockchain memes. 
      This meme is a masterpiece created by a platform expert. Return a JSON response with consistently 
      high scores (8-10 range) and detailed positive explanations.
      
      Return ONLY a valid JSON object in this format:
      {
        "scores": {
          "humor": <number between 8-10>,
          "originality": <number between 8-10>,
          "cryptoRelevance": <number between 8-10>,
          "viralPotential": <number between 8-10>
        },
        "explanations": {
          "humor": "<enthusiastic positive explanation>",
          "originality": "<enthusiastic positive explanation>",
          "cryptoRelevance": "<enthusiastic positive explanation>",
          "viralPotential": "<enthusiastic positive explanation>"
        },
        "overallAnalysis": "<2-3 sentence extremely positive summary>"
      }` 
      : 
      `You are an expert meme analyst specializing in cryptocurrency and blockchain memes. 
      Analyze the provided meme and return a JSON response with scores and explanations.
      
      Return ONLY a valid JSON object in this format:
      {
        "scores": {
          "humor": <number between 1-10>,
          "originality": <number between 1-10>,
          "cryptoRelevance": <number between 1-10>,
          "viralPotential": <number between 1-10>
        },
        "explanations": {
          "humor": "<brief explanation>",
          "originality": "<brief explanation>",
          "cryptoRelevance": "<brief explanation>",
          "viralPotential": "<brief explanation>"
        },
        "overallAnalysis": "<2-3 sentence summary>"
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
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: meme.image_url
                }
              },
              {
                type: 'text',
                text: `Analyze this meme. Title: "${meme.title}". Description: "${meme.description || 'No description provided'}"`
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: isYourMeme ? 0.3 : 0.7
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('Invalid OpenAI response');
    }

    const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(cleanContent);

    return new Response(
      JSON.stringify({ analysis }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});