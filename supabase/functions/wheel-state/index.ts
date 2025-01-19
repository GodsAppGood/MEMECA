import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, origin, accept',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Pragma': 'no-cache'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[wheel-state] Handling OPTIONS request from:', req.headers.get('origin'));
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    // Get current timestamp and log request details
    const now = new Date();
    const origin = req.headers.get('origin');
    console.log(`[${now.toISOString()}] Processing wheel-state request:`, {
      origin,
      method: req.method,
      url: req.url
    });

    // Mock wheel state data for now
    // This should be replaced with actual data from your database
    const wheelState = {
      currentSlot: Math.floor(Math.random() * 24) + 1, // Random slot between 1-24
      nextUpdateIn: 300, // 5 minutes in seconds
      imageUrl: null,
      totalSlots: 24,
      isActive: true
    }

    console.log(`[${now.toISOString()}] Returning wheel state:`, wheelState);

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
    console.error('[wheel-state] Error:', {
      error,
      timestamp: new Date().toISOString(),
      origin: req.headers.get('origin'),
      url: req.url
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message,
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