import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transaction_signature, expected_amount, meme_id, user_id } = await req.json();
    const solscanApiToken = Deno.env.get('SOLSCAN_API_TOKEN')!;
    
    // Verify transaction on Solscan
    const solscanResponse = await fetch(
      `https://public-api.solscan.io/transaction/${transaction_signature}`,
      { headers: { 'token': solscanApiToken } }
    );

    const transactionData = await solscanResponse.json();
    
    if (!transactionData || transactionData.status !== 'Success') {
      throw new Error('Transaction failed or not found');
    }

    // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
    const transactionAmount = transactionData.lamport / 1000000000;
    
    if (Math.abs(transactionAmount - expected_amount) > 0.001) {
      throw new Error(`Invalid amount`);
    }

    // Update meme status
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const tuzemoonUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { error: memeError } = await supabase
      .from('Memes')
      .update({
        is_featured: true,
        tuzemoon_until: tuzemoonUntil
      })
      .eq('id', meme_id);

    if (memeError) throw memeError;

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
})