import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { user_id, meme_id, transaction_signature, wallet_address } = await req.json()
    console.log('Processing payment:', { user_id, meme_id, transaction_signature, wallet_address })
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Сначала проверяем существование мема
    const { data: meme, error: memeError } = await supabase
      .from('Memes')
      .select('id, title')
      .eq('id', meme_id)
      .single()

    if (memeError || !meme) {
      throw new Error('Meme not found')
    }

    // Создаем запись о платеже
    const payment = {
      user_id,
      meme_id,
      amount: 0.1,
      transaction_signature,
      wallet_address,
      transaction_status: 'success',
      meme_metadata: {
        id: meme.id,
        title: meme.title
      }
    }

    const { error: paymentError } = await supabase
      .from('TuzemoonPayments')
      .insert(payment)

    if (paymentError) {
      console.error('Payment error:', paymentError)
      throw paymentError
    }

    // Активируем Tuzemoon статус
    const tuzemoonUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    
    const { error: memeUpdateError } = await supabase
      .from('Memes')
      .update({
        is_featured: true,
        tuzemoon_until: tuzemoonUntil
      })
      .eq('id', meme_id)

    if (memeUpdateError) {
      console.error('Meme update error:', memeUpdateError)
      // Не выбрасываем ошибку, т.к. платёж уже записан
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment processed successfully'
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