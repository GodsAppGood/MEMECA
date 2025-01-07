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
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse request body
    const requestData: TransactionLogRequest = await req.json()
    console.log('Received transaction log request:', requestData)

    // Insert into TransactionLogs
    const { data: logData, error: logError } = await supabase
      .from('TransactionLogs')
      .insert([{
        user_id: requestData.user_id,
        meme_id: requestData.meme_id,
        amount: requestData.amount,
        transaction_status: requestData.transaction_status,
        error_message: requestData.error_message,
        wallet_address: requestData.wallet_address,
        transaction_signature: requestData.transaction_signature
      }])
      .select()
      .single()

    if (logError) {
      console.error('Error inserting transaction log:', logError)
      return new Response(
        JSON.stringify({ success: false, message: logError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // If transaction is completed, update TuzemoonPayments
    if (requestData.transaction_status === 'completed' && requestData.transaction_signature) {
      const { error: paymentError } = await supabase
        .from('TuzemoonPayments')
        .upsert({
          user_id: requestData.user_id,
          meme_id: requestData.meme_id,
          amount: requestData.amount,
          transaction_status: 'completed',
          transaction_signature: requestData.transaction_signature,
          wallet_address: requestData.wallet_address
        })

      if (paymentError) {
        console.error('Error updating TuzemoonPayments:', paymentError)
        return new Response(
          JSON.stringify({ success: false, message: paymentError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
    }

    return new Response(
      JSON.stringify({ success: true, data: logData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Unexpected error in log-transaction function:', error)
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})