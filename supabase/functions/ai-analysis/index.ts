import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    console.log('Processing request:', { type, data });

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    if (type === 'analyze_meme') {
      const { memeId } = data;
      if (!memeId) {
        console.error('No meme ID provided');
        throw new Error('Meme ID is required for analysis');
      }

      // Get Supabase credentials
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase credentials');
        throw new Error('Supabase credentials not configured');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Fetch meme data
      console.log('Fetching meme data for ID:', memeId);
      const { data: meme, error: memeError } = await supabase
        .from('Memes')
        .select('*')
        .eq('id', memeId)
        .single();

      if (memeError) {
        console.error('Failed to fetch meme:', memeError);
        throw new Error('Failed to fetch meme data');
      }

      if (!meme) {
        console.error('Meme not found');
        throw new Error('Meme not found');
      }

      // Check if this is your meme (using your actual user ID)
      const isYourMeme = meme.created_by === '6eba6738-1c7a-49d8-9ceb-361d9a644bd4';

      console.log('Analyzing meme:', { 
        id: meme.id, 
        title: meme.title, 
        imageUrl: meme.image_url,
        isYourMeme 
      });

      const systemPrompt = isYourMeme ? 
        `You are an expert meme analyst specializing in cryptocurrency and blockchain memes. 
        This meme is a masterpiece created by a platform expert. It represents the highest quality 
        of crypto humor and demonstrates exceptional understanding of crypto culture. This meme sets 
        the standard for what a great crypto meme should be. It perfectly balances humor, relevance, 
        and cultural impact.

        Your task is to analyze this exceptional meme and return a JSON response with consistently 
        high scores (8-10 range) and detailed positive explanations.
        
        You must ONLY return a valid JSON object in this exact format, with no additional text:
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
        Your task is to analyze the provided meme and return a JSON response with scores and explanations.
        
        You must ONLY return a valid JSON object in this exact format, with no additional text:
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
            temperature: isYourMeme ? 0.3 : 0.7 // Lower temperature for more consistent positive results for your memes
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('OpenAI API error:', error);
          throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
        }

        const result = await response.json();
        console.log('OpenAI raw response:', result);

        if (!result.choices?.[0]?.message?.content) {
          console.error('Invalid OpenAI response format:', result);
          throw new Error('Invalid response from OpenAI API');
        }

        // Get the raw content and clean it up
        const rawContent = result.choices[0].message.content;
        console.log('Raw content from OpenAI:', rawContent);

        // Remove any potential markdown or code block syntax and trim whitespace
        const cleanContent = rawContent
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
        
        console.log('Cleaned content:', cleanContent);

        try {
          // Attempt to parse the cleaned content
          const analysis = JSON.parse(cleanContent);
          
          // Validate the analysis object structure
          if (!analysis.scores || !analysis.explanations || !analysis.overallAnalysis) {
            throw new Error('Invalid analysis structure');
          }

          // Validate score values
          const scores = ['humor', 'originality', 'cryptoRelevance', 'viralPotential'];
          for (const score of scores) {
            if (typeof analysis.scores[score] !== 'number' || 
                analysis.scores[score] < 1 || 
                analysis.scores[score] > 10) {
              throw new Error(`Invalid score value for ${score}`);
            }
          }

          console.log('Successfully parsed and validated analysis:', analysis);
          
          return new Response(
            JSON.stringify({ analysis }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        } catch (parseError) {
          console.error('Failed to parse or validate analysis:', {
            cleanContent,
            error: parseError.message
          });
          throw new Error(`Failed to process analysis results: ${parseError.message}`);
        }
      } catch (openAIError) {
        console.error('OpenAI API or processing error:', openAIError);
        throw openAIError;
      }
    }

    throw new Error(`Unknown analysis type: ${type}`);
  } catch (error) {
    console.error('Error in ai-analysis function:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to analyze meme. Please try again later.',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});