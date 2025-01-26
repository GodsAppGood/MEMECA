import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: {
    id: number
    title: string
    description?: string
    image_url?: string
    blockchain?: string
    trade_link?: string
    twitter_link?: string
    telegram_link?: string
  }
  schema: string
  old_record: null | Record<string, unknown>
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')

    console.log('Starting Telegram notification with:', {
      hasBotToken: !!TELEGRAM_BOT_TOKEN,
      hasChatId: !!TELEGRAM_CHAT_ID,
      timestamp: new Date().toISOString()
    })

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Missing Telegram configuration')
    }

    const payload: WebhookPayload = await req.json()
    
    console.log('Processing webhook payload:', {
      type: payload.type,
      table: payload.table,
      memeId: payload.record?.id,
      timestamp: new Date().toISOString()
    })

    // Only process new meme insertions
    if (payload.type !== 'INSERT' || payload.table !== 'Memes') {
      console.log('Skipping - not a new meme insertion')
      return new Response(JSON.stringify({ message: 'Not a new meme' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const meme = payload.record
    
    // Simple message format
    const message = `🎉 New Meme: ${meme.title}\n\n` +
      `${meme.description ? `📝 ${meme.description}\n\n` : ''}` +
      `${meme.blockchain ? `⛓️ Chain: ${meme.blockchain}\n\n` : ''}` +
      `${meme.trade_link ? `🔄 Trade: ${meme.trade_link}\n` : ''}` +
      `${meme.twitter_link ? `🐦 Twitter: ${meme.twitter_link}\n` : ''}` +
      `${meme.telegram_link ? `📱 Telegram: ${meme.telegram_link}` : ''}`

    console.log('Sending message to Telegram:', {
      chatId: TELEGRAM_CHAT_ID,
      messageLength: message.length,
      hasImage: !!meme.image_url
    })

    // Send text message
    const textResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        }),
      }
    )

    if (!textResponse.ok) {
      const error = await textResponse.text()
      console.error('Telegram API error:', error)
      throw new Error(`Telegram API error: ${error}`)
    }

    console.log('Text message sent successfully')

    // Send image if present
    if (meme.image_url) {
      console.log('Sending image:', { url: meme.image_url })
      
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

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})