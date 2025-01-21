import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

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
    console.log('Starting Solscan API v2 test:', {
      timestamp: new Date().toISOString(),
      environment: Deno.env.get('ENVIRONMENT'),
    });

    const SOLSCAN_API_TOKEN = Deno.env.get('SOLSCAN_API_TOKEN');
    
    if (!SOLSCAN_API_TOKEN) {
      throw new Error('SOLSCAN_API_TOKEN is not configured');
    }

    // Test transaction signature
    const testTxSignature = 'DoP3KMgutvXKeGnU8TeJxyM4hVPBcnNgswRwLWNEy8AUTYYnjV7EVcGZWniQGMj1ndyLgtyrRXJiFY8uaNKF2vj';
    
    console.log('Making request to Solscan API v2:', {
      url: 'https://pro-api.solscan.io/v2.0/transaction/detail',
      hasToken: !!SOLSCAN_API_TOKEN,
      txSignature: testTxSignature,
    });

    const response = await fetch(
      `https://pro-api.solscan.io/v2.0/transaction/detail?tx=${testTxSignature}`,
      {
        headers: {
          'token': SOLSCAN_API_TOKEN,
          'Accept': 'application/json',
        },
      }
    );

    console.log('Solscan API v2 response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    const data = await response.json();
    
    console.log('Solscan API v2 data:', {
      success: response.ok,
      data: data,
    });

    return new Response(
      JSON.stringify({
        success: response.ok,
        status: response.status,
        data: data,
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error testing Solscan API v2:', {
      error: error.message,
      stack: error.stack,
    });

    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});