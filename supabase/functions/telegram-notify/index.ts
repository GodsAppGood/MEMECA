import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram configuration')
      throw new Error('Missing Telegram configuration')
    }

    const payload = await req.json()
    console.log('Received payload:', payload)
    
    // Only process new memes
    if (payload.type === 'INSERT' && payload.table === 'Memes') {
      const meme = payload.record
      
      const message = `🎉 New Meme: ${meme.title}\n\n` +
        `${meme.description ? `📝 ${meme.description}\n\n` : ''}` +
        `${meme.blockchain ? `⛓️ Chain: ${meme.blockchain}\n\n` : ''}` +
        `${meme.trade_link ? `🔄 Trade: ${meme.trade_link}\n` : ''}` +
        `${meme.twitter_link ? `🐦 Twitter: ${meme.twitter_link}\n` : ''}` +
        `${meme.telegram_link ? `📱 Telegram: ${meme.telegram_link}` : ''}`

      console.log('Sending message to Telegram:', message)

      // Send text message
      const textResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
          }),
        }
      )

      if (!textResponse.ok) {
        console.error('Telegram API error:', await textResponse.text())
        throw new Error(`Telegram API error: ${await textResponse.text()}`)
      }

      console.log('Text message sent successfully')

      // Send image if available
      if (meme.image_url) {
        console.log('Sending image:', meme.image_url)
        
        const imageResponse = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              photo: meme.image_url
            }),
          }
        )

        if (!imageResponse.ok) {
          console.error('Failed to send image:', await imageResponse.text())
        } else {
          console.log('Image sent successfully')
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})