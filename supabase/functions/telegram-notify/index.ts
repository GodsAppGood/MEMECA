import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TelegramUpdate {
  message?: {
    text?: string;
    chat?: {
      id: number;
    };
  };
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

async function handleCommand(chatId: number, command: string, botToken: string) {
  const messages = {
    '/start': '👋 Привет! Я бот MemeCAI. Я буду отправлять уведомления о новых мемах и помогать вам следить за обновлениями.',
    '/help': `🔍 Доступные команды:
/start - Начать использование бота
/help - Получить помощь
/about - О проекте MemeCAI
/status - Проверить статус бота
/subscribe - Подписаться на уведомления
/unsubscribe - Отписаться от уведомлений`,
    '/about': '📱 MemeCAI - это проект для создания и обмена мемами с использованием AI.',
    '/status': '✅ Бот активен и работает нормально.',
    '/subscribe': '🔔 Вы подписались на уведомления о новых мемах!',
    '/unsubscribe': '🔕 Вы отписались от уведомлений о новых мемах.'
  };

  const message = messages[command as keyof typeof messages] || 'Неизвестная команда. Используйте /help для списка команд.';

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to send command response:', await response.text());
    }
  } catch (error) {
    console.error('Error sending command response:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')

    console.log('Starting Telegram notification process:', {
      timestamp: new Date().toISOString(),
      hasBotToken: !!TELEGRAM_BOT_TOKEN,
      hasChatId: !!TELEGRAM_CHAT_ID
    })

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Missing Telegram configuration')
    }

    // Check if this is a Telegram update
    const update: TelegramUpdate = await req.json()
    if (update.message?.chat?.id && update.message?.text) {
      // This is a command from Telegram
      if (update.message.text.startsWith('/')) {
        await handleCommand(update.message.chat.id, update.message.text, TELEGRAM_BOT_TOKEN)
        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    // Handle webhook notification for new memes
    const payload = update as unknown as WebhookPayload
    if (payload.type === 'INSERT' && payload.table === 'Memes') {
      const meme = payload.record
      
      // Simple message format
      const message = `🎉 New Meme: ${meme.title}\n\n` +
        `${meme.description ? `📝 ${meme.description}\n\n` : ''}` +
        `${meme.blockchain ? `⛓️ Chain: ${meme.blockchain}\n\n` : ''}` +
        `${meme.trade_link ? `🔄 Trade: ${meme.trade_link}\n` : ''}` +
        `${meme.twitter_link ? `🐦 Twitter: ${meme.twitter_link}\n` : ''}` +
        `${meme.telegram_link ? `📱 Telegram: ${meme.telegram_link}` : ''}`

      console.log('Preparing to send message:', {
        messageLength: message.length,
        hasImage: !!meme.image_url,
        timestamp: new Date().toISOString()
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
            parse_mode: 'HTML'
          }),
        }
      )

      if (!textResponse.ok) {
        const errorText = await textResponse.text()
        console.error('Telegram API error:', {
          status: textResponse.status,
          error: errorText,
          timestamp: new Date().toISOString()
        })
        throw new Error(`Telegram API error: ${errorText}`)
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
          const imageError = await imageResponse.text()
          console.error('Failed to send image:', {
            status: imageResponse.status,
            error: imageError,
            timestamp: new Date().toISOString()
          })
        } else {
          console.log('Image sent successfully')
        }
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
    console.error('Error in telegram-notify:', {
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