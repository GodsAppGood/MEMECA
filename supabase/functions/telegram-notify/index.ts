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
  console.log(`Handling command: ${command} for chat: ${chatId}`);
  
  const messages = {
    '/start': '👋 Привет! Я бот MemeCAI. Я буду отправлять уведомления о новых мемах.',
    '/help': `🔍 Доступные команды:
/start - Начать использование бота
/help - Получить помощь
/about - О проекте MemeCAI
/status - Проверить статус бота`,
    '/about': '📱 MemeCAI - это проект для создания и обмена мемами.',
    '/status': '✅ Бот активен и работает нормально.'
  };

  const message = messages[command as keyof typeof messages] || 'Используйте /help для списка команд.';

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
      const errorText = await response.text();
      console.error('Failed to send command response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Telegram API error: ${errorText}`);
    }

    console.log('Successfully sent message to Telegram');
  } catch (error) {
    console.error('Error sending command response:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')

    console.log('Processing request:', {
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
      hasBotToken: !!TELEGRAM_BOT_TOKEN,
      hasChatId: !!TELEGRAM_CHAT_ID
    });

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram configuration:', {
        hasBotToken: !!TELEGRAM_BOT_TOKEN,
        hasChatId: !!TELEGRAM_CHAT_ID
      });
      throw new Error('Missing Telegram configuration')
    }

    const update: TelegramUpdate = await req.json()
    
    // Handle Telegram commands
    if (update.message?.chat?.id && update.message?.text) {
      console.log('Received Telegram update:', {
        chatId: update.message.chat.id,
        text: update.message.text,
        timestamp: new Date().toISOString()
      });
      
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
      
      const message = `🎉 New Meme: ${meme.title}\n\n` +
        `${meme.description ? `📝 ${meme.description}\n\n` : ''}` +
        `${meme.blockchain ? `⛓️ Chain: ${meme.blockchain}\n\n` : ''}` +
        `${meme.trade_link ? `🔄 Trade: ${meme.trade_link}\n` : ''}` +
        `${meme.twitter_link ? `🐦 Twitter: ${meme.twitter_link}\n` : ''}` +
        `${meme.telegram_link ? `📱 Telegram: ${meme.telegram_link}` : ''}`

      console.log('Sending notification to channel:', {
        messageLength: message.length,
        hasImage: !!meme.image_url,
        timestamp: new Date().toISOString()
      });

      // Send text message to channel
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
        console.error('Failed to send text message:', {
          status: textResponse.status,
          error: errorText,
          timestamp: new Date().toISOString()
        });
        throw new Error(`Telegram API error: ${errorText}`)
      }

      console.log('Text message sent successfully');

      // Send image if present
      if (meme.image_url) {
        console.log('Sending image:', { url: meme.image_url });
        
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
          });
        } else {
          console.log('Image sent successfully');
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