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

    // Log the payment first
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
      console.error('Payment logging error:', paymentError)
      throw paymentError
    }

    // Update meme status with tuzemoon_until
    const tuzemoonUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    console.log('Updating meme status with tuzemoon_until:', tuzemoonUntil)
    
    const { error: memeError } = await supabase
      .from('Memes')
      .update({
        is_featured: true,
        tuzemoon_until: tuzemoonUntil
      })
      .eq('id', meme_id)
      .select()

    if (memeError) {
      console.error('Meme update error:', memeError)
      throw memeError
    }

    console.log('Successfully processed payment and updated meme status')

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment processed and meme status updated',
        tuzemoon_until: tuzemoonUntil
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Process payment error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to process payment or update meme status'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 400 
      }
    )
  }
})