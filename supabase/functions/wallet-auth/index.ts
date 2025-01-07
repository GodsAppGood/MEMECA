import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { decode as decodeBase58 } from "https://deno.land/std@0.182.0/encoding/base58.ts"
import { verify } from "https://deno.land/x/noble_ed25519@1.2.6/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  walletAddress?: string
  signature?: string
  nonce?: string
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

    const { pathname } = new URL(req.url)
    const body: RequestBody = await req.json()

    // Generate nonce endpoint
    if (pathname === '/generate-nonce' && req.method === 'POST') {
      const { walletAddress } = body
      if (!walletAddress) {
        return new Response(
          JSON.stringify({ error: 'Wallet address is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Generate a random nonce
      const nonce = crypto.randomUUID()
      
      // Store the nonce in the database
      const { error: insertError } = await supabaseClient
        .from('WalletNonces')
        .insert([{ nonce, wallet_address: walletAddress }])

      if (insertError) {
        console.error('Error storing nonce:', insertError)
        return new Response(
          JSON.stringify({ error: 'Failed to generate nonce' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ nonce }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify signature endpoint
    if (pathname === '/verify-signature' && req.method === 'POST') {
      const { signature, nonce, walletAddress } = body
      if (!signature || !nonce || !walletAddress) {
        return new Response(
          JSON.stringify({ error: 'Signature, nonce, and wallet address are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify nonce exists and hasn't expired
      const { data: nonceData, error: nonceError } = await supabaseClient
        .from('WalletNonces')
        .select('*')
        .eq('nonce', nonce)
        .eq('wallet_address', walletAddress)
        .eq('is_used', false)
        .single()

      if (nonceError || !nonceData) {
        console.error('Error retrieving nonce:', nonceError)
        return new Response(
          JSON.stringify({ error: 'Invalid or expired nonce' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      try {
        // Convert the signature and public key from base58
        const signatureBytes = decodeBase58(signature)
        const publicKeyBytes = decodeBase58(walletAddress)
        const messageBytes = new TextEncoder().encode(nonce)

        // Verify the signature using noble_ed25519
        const isValid = await verify(signatureBytes, messageBytes, publicKeyBytes)

        if (!isValid) {
          return new Response(
            JSON.stringify({ error: 'Invalid signature' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Mark nonce as used
        await supabaseClient
          .from('WalletNonces')
          .update({ is_used: true })
          .eq('nonce', nonce)

        // Create or update user
        const { data: userData, error: userError } = await supabaseClient
          .from('Users')
          .upsert(
            {
              wallet_address: walletAddress,
              is_verified: true,
            },
            { onConflict: 'wallet_address' }
          )
          .select()
          .single()

        if (userError) {
          console.error('Error upserting user:', userError)
          return new Response(
            JSON.stringify({ error: 'Failed to create/update user' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Sign in user
        const { data: authData, error: signInError } = await supabaseClient.auth.signUp({
          email: `${walletAddress}@phantom.wallet`,
          password: crypto.randomUUID(),
          options: {
            data: {
              wallet_address: walletAddress,
            }
          }
        })

        if (signInError) {
          console.error('Error signing in user:', signInError)
          return new Response(
            JSON.stringify({ error: 'Failed to authenticate' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ session: authData.session }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        console.error('Error verifying signature:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to verify signature' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
