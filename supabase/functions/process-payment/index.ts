import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { user_id, meme_id, transaction_signature, wallet_address } = await req.json()
    console.log('Processing payment:', { user_id, meme_id, transaction_signature, wallet_address })
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Просто записываем платёж
    const { error: paymentError } = await supabase
      .from('TuzemoonPayments')
      .insert({
        user_id,
        meme_id,
        amount: 0.1,
        transaction_signature,
        wallet_address,
        transaction_status: 'success'
      })

    if (paymentError) {
      console.error('Payment recording error:', paymentError)
      throw paymentError
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment recorded successfully'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200
      }
    )

  } catch (error) {
    console.error('Process payment error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})