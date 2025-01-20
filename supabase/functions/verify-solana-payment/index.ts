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
  console.log('Payment verification started:', {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const solscanApiToken = Deno.env.get('SOLSCAN_API_TOKEN')!;
    const tuzemoonWallet = Deno.env.get('TUZEMOON_WALLET_ADDRESS')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse and validate request
    const { transaction_signature, expected_amount, meme_id, user_id }: VerifyPaymentRequest = await req.json();

    console.log('Verifying transaction:', {
      signature: transaction_signature,
      meme_id,
      timestamp: new Date().toISOString()
    });

    if (!transaction_signature || !expected_amount || !meme_id || !user_id) {
      throw new Error('Missing required parameters');
    }

    // Check transaction on Solscan
    const solscanResponse = await fetch(
      `https://public-api.solscan.io/transaction/${transaction_signature}`,
      {
        headers: {
          'token': solscanApiToken
        }
      }
    );

    const transactionData = await solscanResponse.json();
    console.log('Solscan response:', {
      status: solscanResponse.status,
      timestamp: new Date().toISOString()
    });

    // Verify transaction details
    if (!transactionData || transactionData.status !== 'Success') {
      throw new Error('Transaction failed or not found');
    }

    // Verify amount and recipient
    const transfer = transactionData.parsedInstruction?.find((instruction: any) => 
      instruction.type === 'sol-transfer' && 
      instruction.params?.to === tuzemoonWallet
    );

    if (!transfer) {
      throw new Error('No valid transfer found to Tuzemoon wallet');
    }

    const amount = parseFloat(transfer.params.amount);
    if (amount !== expected_amount) {
      throw new Error(`Invalid amount: expected ${expected_amount} SOL, got ${amount} SOL`);
    }

    // Update transaction status in database
    const { error: updateError } = await supabase
      .from('TransactionLogs')
      .update({
        transaction_status: 'success',
        transaction_signature,
        amount: expected_amount,
      })
      .eq('meme_id', meme_id)
      .eq('user_id', user_id)
      .eq('transaction_status', 'pending');

    if (updateError) {
      throw updateError;
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

    console.log('Payment verification completed successfully:', {
      signature: transaction_signature,
      meme_id,
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
    console.error('Payment verification error:', {
      error: error.message,
      stack: error.stack,
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