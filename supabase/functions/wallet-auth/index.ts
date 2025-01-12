import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { decode as decodeBase58 } from "https://deno.land/std@0.208.0/encoding/base58.ts"
import * as ed25519 from "https://esm.sh/@noble/ed25519@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  walletAddress?: string
  signature?: string
  nonce?: string
  action?: 'generate-nonce' | 'verify-signature'
  memeId?: string
  amount?: number
}

const logRequest = (action: string, details: any) => {
  console.log(`[${new Date().toISOString()}] ${action}:`, {
    ...details,
    environment: Deno.env.get('ENVIRONMENT'),
    function: 'wallet-auth'
  });
};

const logError = (action: string, error: any, details?: any) => {
  console.error(`[${new Date().toISOString()}] Error in ${action}:`, {
    error: error.message || error,
    stack: error.stack,
    details,
    environment: Deno.env.get('ENVIRONMENT'),
    function: 'wallet-auth'
  });
};

serve(async (req) => {
  logRequest('Function invoked', {
    method: req.method,
    url: req.url,
  });

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body: RequestBody = await req.json()
    logRequest('Request body received', {
      action: body.action,
      hasWalletAddress: !!body.walletAddress,
      hasSignature: !!body.signature,
      hasNonce: !!body.nonce,
      memeId: body.memeId,
      amount: body.amount
    });

    // Generate nonce
    if (body.action === 'generate-nonce' && body.walletAddress) {
      logRequest('Generating nonce', { walletAddress: body.walletAddress });
      
      const nonce = crypto.randomUUID()
      
      const { error: insertError } = await supabaseClient
        .from('WalletNonces')
        .insert([{ 
          nonce, 
          wallet_address: body.walletAddress,
          expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
        }])

      if (insertError) {
        logError('Storing nonce', insertError, { walletAddress: body.walletAddress });
        return new Response(
          JSON.stringify({ error: 'Failed to generate nonce' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      logRequest('Nonce generated successfully', { 
        nonce,
        walletAddress: body.walletAddress
      });
      
      return new Response(
        JSON.stringify({ nonce }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify signature
    if (body.action === 'verify-signature' && body.signature && body.nonce && body.walletAddress) {
      logRequest('Starting signature verification', {
        walletAddress: body.walletAddress,
        nonceLength: body.nonce.length,
        signatureLength: body.signature.length
      });

      // Verify nonce exists and hasn't expired
      const { data: nonceData, error: nonceError } = await supabaseClient
        .from('WalletNonces')
        .select('*')
        .eq('nonce', body.nonce)
        .eq('wallet_address', body.walletAddress)
        .eq('is_used', false)
        .single()

      if (nonceError || !nonceData) {
        logError('Invalid or expired nonce', nonceError || 'No nonce data found', {
          walletAddress: body.walletAddress,
          nonce: body.nonce
        });
        return new Response(
          JSON.stringify({ error: 'Invalid or expired nonce' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      try {
        logRequest('Verifying signature', {
          walletAddress: body.walletAddress,
          nonce: body.nonce
        });
        
        // Convert signature string to Uint8Array
        const signatureArray = body.signature.split(',').map(Number);
        const signatureBytes = new Uint8Array(signatureArray);
        
        // Convert wallet address to public key bytes
        const publicKeyBytes = decodeBase58(body.walletAddress);
        
        // Convert message to bytes
        const messageBytes = new TextEncoder().encode(body.nonce);

        logRequest('Verification parameters prepared', {
          signatureLength: signatureBytes.length,
          publicKeyLength: publicKeyBytes.length,
          messageLength: messageBytes.length,
          nonce: body.nonce
        });

        const isValid = await ed25519.verify(signatureBytes, messageBytes, publicKeyBytes);
        logRequest('Signature verification result', { isValid });

        if (!isValid) {
          logError('Invalid signature', 'Signature verification failed', {
            walletAddress: body.walletAddress
          });
          return new Response(
            JSON.stringify({ error: 'Invalid signature' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        // After successful verification, log the transaction
        if (body.memeId && body.amount) {
          logRequest('Logging transaction', {
            walletAddress: body.walletAddress,
            memeId: body.memeId,
            amount: body.amount
          });

          const logPayload = {
            user_id: body.walletAddress,
            meme_id: body.memeId,
            amount: body.amount,
            transaction_status: 'pending',
            wallet_address: body.walletAddress,
            created_at: new Date().toISOString()
          };

          const logResponse = await supabaseClient.functions.invoke('log-transaction', {
            body: logPayload
          });

          logRequest('Transaction logging response', {
            success: !logResponse.error,
            error: logResponse.error,
            data: logResponse.data
          });

          if (logResponse.error) {
            logError('Transaction logging', logResponse.error, {
              payload: logPayload
            });
          }
        }

        // Mark nonce as used
        const { error: updateError } = await supabaseClient
          .from('WalletNonces')
          .update({ is_used: true })
          .eq('nonce', body.nonce);

        if (updateError) {
          logError('Marking nonce as used', updateError, {
            nonce: body.nonce
          });
        }

        logRequest('Wallet verification completed', {
          success: true,
          walletAddress: body.walletAddress
        });

        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Wallet verified successfully'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        logError('Signature verification', error, {
          walletAddress: body.walletAddress
        });
        return new Response(
          JSON.stringify({ error: 'Failed to verify signature' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    }

    logError('Invalid request', 'Missing required parameters', body);
    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    logError('Unexpected error', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})