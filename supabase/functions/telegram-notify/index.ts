import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
  console.log('Telegram notify function triggered', {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')

    console.log('Checking environment variables:', {
      hasBotToken: !!TELEGRAM_BOT_TOKEN,
      hasChatId: !!TELEGRAM_CHAT_ID,
      chatIdValue: TELEGRAM_CHAT_ID
    });

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Missing Telegram configuration')
    }

    // Get the request body
    const payload: WebhookPayload = await req.json()
    
    console.log('Received webhook payload:', {
      type: payload.type,
      table: payload.table,
      memeId: payload.record?.id,
      memeTitle: payload.record?.title,
      timestamp: new Date().toISOString()
    });

    // Only process new meme insertions
    if (payload.type !== 'INSERT' || payload.table !== 'Memes') {
      console.log('Skipping notification - not a new meme insertion', {
        type: payload.type,
        table: payload.table
      });
      return new Response(JSON.stringify({ message: 'Not a new meme' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const meme = payload.record
    
    // Format the message for Telegram
    const message = `🚀 New Meme Alert! 🚀\n\n` +
      `📌 ${meme.title}\n\n` +
      `${meme.description ? `📝 ${meme.description}\n\n` : ''}` +
      `${meme.blockchain ? `🔗 Blockchain: ${meme.blockchain}\n` : ''}` +
      `${meme.trade_link ? `💹 Trade: ${meme.trade_link}\n` : ''}` +
      `${meme.twitter_link ? `🐦 Twitter: ${meme.twitter_link}\n` : ''}` +
      `${meme.telegram_link ? `📱 Telegram: ${meme.telegram_link}\n` : ''}`

    console.log('Sending Telegram message:', {
      chatId: TELEGRAM_CHAT_ID,
      messageLength: message.length,
      hasImage: !!meme.image_url
    });

    // First send the text message
    const textResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    )

    const textResponseData = await textResponse.json();
    console.log('Telegram text message response:', textResponseData);

    if (!textResponse.ok) {
      throw new Error(`Failed to send Telegram message: ${JSON.stringify(textResponseData)}`)
    }

    // If there's an image, send it as a separate message
    if (meme.image_url) {
      console.log('Sending image to Telegram:', {
        imageUrl: meme.image_url
      });

      const imageResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            photo: meme.image_url,
          }),
        }
      )

      const imageResponseData = await imageResponse.json();
      console.log('Telegram image response:', imageResponseData);

      if (!imageResponse.ok) {
        console.error('Failed to send image:', imageResponseData);
      }
    }

    return new Response(
      JSON.stringify({ message: 'Notification sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error processing webhook:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})