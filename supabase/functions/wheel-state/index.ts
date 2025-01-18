import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Pragma': 'no-cache'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get current timestamp
    const now = new Date()
    console.log(`[${now.toISOString()}] Processing wheel-state request`)

    // Mock wheel state data for now
    // This should be replaced with actual data from your database
    const wheelState = {
      currentSlot: Math.floor(Math.random() * 24) + 1, // Random slot between 1-24
      nextUpdateIn: 300, // 5 minutes in seconds
      imageUrl: null,
      totalSlots: 24,
      isActive: true
    }

    console.log(`[${now.toISOString()}] Returning wheel state:`, wheelState)

    return new Response(
      JSON.stringify(wheelState),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in wheel-state function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
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