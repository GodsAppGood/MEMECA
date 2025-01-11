import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TransactionLogRequest {
  user_id: string;
  meme_id: string;
  amount: number;
  transaction_status: string;
  error_message?: string;
  wallet_address?: string;
  transaction_signature?: string;
  created_at?: string;
}

serve(async (req) => {
  console.log('Transaction logging process started:', {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse request body
    const requestData: TransactionLogRequest = await req.json()
    console.log('Received transaction log request:', {
      ...requestData,
      user_id: requestData.user_id ? '[REDACTED]' : null,
      wallet_address: requestData.wallet_address ? '[REDACTED]' : null,
      timestamp: new Date().toISOString()
    });

    // Insert into TransactionLogs
    console.log('Inserting into TransactionLogs...');
    const { data: logData, error: logError } = await supabase
      .from('TransactionLogs')
      .insert([{
        user_id: requestData.user_id,
        meme_id: requestData.meme_id,
        amount: requestData.amount,
        transaction_status: requestData.transaction_status,
        error_message: requestData.error_message,
        wallet_address: requestData.wallet_address,
        transaction_signature: requestData.transaction_signature,
        created_at: requestData.created_at || new Date().toISOString()
      }])
      .select()
      .single()

    if (logError) {
      console.error('Error inserting transaction log:', {
        error: logError.message,
        code: logError.code,
        details: logError.details,
        timestamp: new Date().toISOString()
      });
      return new Response(
        JSON.stringify({ success: false, message: logError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Successfully inserted transaction log:', {
      logId: logData?.id,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: logData,
        message: 'Transaction processed successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Unexpected error in log-transaction function:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})