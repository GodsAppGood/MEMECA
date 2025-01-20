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
    const HELIUS_RPC_URL = Deno.env.get('HELIUS_RPC_URL')
    const TUZEMOON_WALLET_ADDRESS = Deno.env.get('TUZEMOON_WALLET_ADDRESS')

    if (!HELIUS_RPC_URL) {
      throw new Error('RPC URL not configured')
    }

    if (!TUZEMOON_WALLET_ADDRESS) {
      throw new Error('Tuzemoon wallet address not configured')
    }

    return new Response(
      JSON.stringify({ 
        HELIUS_RPC_URL,
        TUZEMOON_WALLET_ADDRESS
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})