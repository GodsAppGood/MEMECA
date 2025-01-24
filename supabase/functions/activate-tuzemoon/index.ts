import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { user_id, meme_id } = await req.json()
    console.log(`Activating Tuzemoon for meme ${meme_id} by user ${user_id}`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Проверяем успешный платёж
    const { data: payment, error: paymentError } = await supabase
      .from('TuzemoonPayments')
      .select('*')
      .eq('meme_id', meme_id)
      .eq('user_id', user_id)
      .eq('transaction_status', 'success')
      .single()

    if (paymentError || !payment) {
      console.error('Payment verification failed:', paymentError)
      throw new Error('No successful payment found')
    }

    // Активируем Tuzemoon
    const { error: updateError } = await supabase
      .from('Memes')
      .update({
        is_featured: true,
        tuzemoon_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })
      .eq('id', meme_id)

    if (updateError) {
      console.error('Tuzemoon activation failed:', updateError)
      throw updateError
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Tuzemoon activated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Tuzemoon activation error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})