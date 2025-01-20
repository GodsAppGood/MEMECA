import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerifyPaymentRequest {
  transaction_signature: string;
  expected_amount: number;
  meme_id: number;
  user_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const solscanApiToken = Deno.env.get('SOLSCAN_API_TOKEN')!;
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { transaction_signature, expected_amount, meme_id, user_id }: VerifyPaymentRequest = await req.json();

    // Log verification start
    console.log('Starting payment verification:', {
      signature: transaction_signature,
      expected_amount,
      meme_id,
      timestamp: new Date().toISOString()
    });

    // Verify transaction on Solscan
    const solscanResponse = await fetch(
      `https://public-api.solscan.io/transaction/${transaction_signature}`,
      { headers: { 'token': solscanApiToken } }
    );

    const transactionData = await solscanResponse.json();
    
    // Log transaction data
    console.log('Solscan response:', {
      status: transactionData.status,
      amount: transactionData.lamport,
      timestamp: new Date().toISOString()
    });

    // Verify transaction status and amount
    if (!transactionData || transactionData.status !== 'Success') {
      throw new Error('Transaction failed or not found');
    }

    // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
    const transactionAmount = transactionData.lamport / 1000000000;
    
    // Verify amount with 0.001 SOL tolerance for rounding
    if (Math.abs(transactionAmount - expected_amount) > 0.001) {
      throw new Error(`Invalid transaction amount. Expected ${expected_amount} SOL, got ${transactionAmount} SOL`);
    }

    // Update meme status
    const tuzemoonUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { error: memeError } = await supabase
      .from('Memes')
      .update({
        is_featured: true,
        tuzemoon_until: tuzemoonUntil
      })
      .eq('id', meme_id);

    if (memeError) {
      throw memeError;
    }

    // Log success
    console.log('Payment verification completed successfully:', {
      signature: transaction_signature,
      meme_id,
      amount: transactionAmount,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment verified successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Verification error:', {
      error: error.message,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
})