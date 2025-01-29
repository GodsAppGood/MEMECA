import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MemeNotification {
  title: string;
  description?: string;
  blockchain?: string;
  trade_link?: string;
  twitter_link?: string;
  telegram_link?: string;
  image_url?: string;
  meme_id: number;
}

async function sendTelegramMessage(meme: MemeNotification) {
  const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error('Telegram configuration is missing');
  }

  const websiteUrl = 'https://memecalendar.io';
  const memeUrl = `${websiteUrl}/meme/${meme.meme_id}`;
  
  let message = `🎨 Memeca Present\n\n`;
  message += `🎉 New Meme: [${meme.title}](${memeUrl})\n`;
  
  if (meme.description) {
    message += `📝 Description: ${meme.description}\n`;
  }
  
  if (meme.blockchain) {
    message += `⛓️ Blockchain: ${meme.blockchain}\n`;
  }
  
  if (meme.trade_link || meme.twitter_link || meme.telegram_link) {
    message += `\n🔗 Links:\n`;
    if (meme.trade_link) {
      message += `💱 [Trade](${meme.trade_link})\n`;
    }
    if (meme.twitter_link) {
      message += `🐦 [Twitter](${meme.twitter_link})\n`;
    }
    if (meme.telegram_link) {
      message += `💬 [Telegram](${meme.telegram_link})\n`;
    }
  }
  
  message += `\n🌐 [Visit Memeca](${websiteUrl})`;

  console.log('Sending Telegram message:', message);

  const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const params = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'Markdown',
    disable_web_page_preview: false
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Telegram API error:', errorText);
    throw new Error(`Telegram API error: ${response.statusText}`);
  }

  return response.json();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const meme: MemeNotification = await req.json();
    console.log('Received meme notification request:', meme);
    
    const result = await sendTelegramMessage(meme);
    console.log('Telegram API response:', result);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error('Error in telegram-notify function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      }
    );
  }
});