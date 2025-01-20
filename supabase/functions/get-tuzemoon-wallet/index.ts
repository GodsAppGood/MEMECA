import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const TUZEMOON_WALLET_ADDRESS = Deno.env.get('TUZEMOON_WALLET_ADDRESS');
    
    if (!TUZEMOON_WALLET_ADDRESS) {
      console.error('Wallet address not configured');
      throw new Error('Wallet configuration missing');
    }

    console.log('Returning wallet address:', {
      timestamp: new Date().toISOString(),
      address_length: TUZEMOON_WALLET_ADDRESS.length
    });

    return new Response(
      JSON.stringify({ TUZEMOON_WALLET_ADDRESS }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error:', error.message);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
})