import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Missing Telegram configuration')
    }

    const payload = await req.json()
    console.log('Received payload:', payload)
    
    // Обрабатываем только новые мемы
    if (payload.type === 'INSERT' && payload.table === 'Memes') {
      const meme = payload.record
      
      const caption = `🎉 New Meme: ${meme.title}\n\n` +
        `${meme.description ? `📝 ${meme.description}\n\n` : ''}` +
        `${meme.blockchain ? `⛓️ Chain: ${meme.blockchain}\n\n` : ''}` +
        `${meme.trade_link ? `🔄 Trade: ${meme.trade_link}\n` : ''}` +
        `${meme.twitter_link ? `🐦 Twitter: ${meme.twitter_link}\n` : ''}` +
        `${meme.telegram_link ? `📱 Telegram: ${meme.telegram_link}` : ''}`

      // Отправляем одно сообщение с картинкой и текстом
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            photo: meme.image_url,
            caption: caption,
            parse_mode: 'HTML'
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Telegram API error: ${await response.text()}`)
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