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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify transaction signature here
    // For now, we'll just log it and update the status

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
      throw paymentError
    }

    // Update meme status
    const tuzemoonUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    
    const { error: memeError } = await supabase
      .from('Memes')
      .update({
        is_featured: true,
        tuzemoon_until: tuzemoonUntil
      })
      .eq('id', meme_id)

    if (memeError) {
      throw memeError
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})