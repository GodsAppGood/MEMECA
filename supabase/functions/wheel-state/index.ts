import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, origin, accept, cache-control',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Pragma': 'no-cache'
}

serve(async (req) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();
  const origin = req.headers.get('origin');
  
  console.log(`[${new Date().toISOString()}] Request ${requestId} started:`, {
    method: req.method,
    origin,
    url: req.url
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[${new Date().toISOString()}] Handling OPTIONS request from:`, origin);
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    // Get current timestamp
    const now = new Date();
    
    // Mock wheel state data for now
    const wheelState = {
      currentSlot: Math.floor(Math.random() * 24) + 1,
      nextUpdateIn: 300,
      imageUrl: null,
      totalSlots: 24,
      isActive: true
    }

    const responseTime = Date.now() - startTime;
    console.log(`[${now.toISOString()}] Request ${requestId} completed:`, {
      responseTime: `${responseTime}ms`,
      origin,
      wheelState
    });

    return new Response(
      JSON.stringify(wheelState),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    )
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] Error in request ${requestId}:`, {
      error,
      responseTime: `${responseTime}ms`,
      origin,
      url: req.url
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message,
        requestId,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})