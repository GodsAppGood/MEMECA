import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { PublicKey } from 'npm:@solana/web3.js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WalletAuthRequest {
  publicKey?: string
  action?: 'connect' | 'verify'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    const body: WalletAuthRequest = await req.json()
    console.log('Wallet auth request:', {
      action: body.action,
      hasPublicKey: !!body.publicKey,
      timestamp: new Date().toISOString()
    })

    if (!body.publicKey) {
      throw new Error('Public key is required')
    }

    // Validate public key format
    try {
      new PublicKey(body.publicKey)
    } catch (error) {
      console.error('Invalid public key format:', error)
      throw new Error('Invalid public key format')
    }

    if (body.action === 'connect') {
      // Log connection attempt
      console.log('Wallet connection attempt:', {
        publicKey: body.publicKey,
        timestamp: new Date().toISOString()
      })

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Wallet connected successfully',
          publicKey: body.publicKey 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (body.action === 'verify') {
      // Log verification attempt
      console.log('Wallet verification attempt:', {
        publicKey: body.publicKey,
        timestamp: new Date().toISOString()
      })

      // Here we can add additional verification steps if needed
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Wallet verified successfully',
          publicKey: body.publicKey
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('Wallet auth error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})