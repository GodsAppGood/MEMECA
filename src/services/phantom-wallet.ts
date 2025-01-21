import { PublicKey, Transaction, SystemProgram, Connection } from '@solana/web3.js';
import { supabase } from "@/integrations/supabase/client";

class PhantomWallet {
  private connection: Connection | null = null;

  constructor() {
    this.initConnection();
  }

  private async initConnection() {
    try {
      const { data: { HELIUS_RPC_URL } } = await supabase.functions.invoke('get-tuzemoon-wallet');
      if (!HELIUS_RPC_URL) {
        console.error('No RPC URL configured');
        return;
      }
      
      this.connection = new Connection(HELIUS_RPC_URL, 'confirmed');
      console.log('Solana RPC connection initialized');
    } catch (error) {
      console.error('Failed to initialize Solana connection:', error);
    }
  }

  get isPhantomInstalled() {
    const phantom = (window as any).phantom?.solana;
    return phantom && phantom.isPhantom;
  }

  async connect(): Promise<string | null> {
    try {
      const phantom = (window as any).phantom?.solana;
      
      if (!phantom) {
        throw new Error('Phantom wallet not installed');
      }

      const { publicKey } = await phantom.connect();
      return publicKey.toString();
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
      return null;
    }
  }

  async getAddress(): Promise<string | null> {
    try {
      const phantom = (window as any).phantom?.solana;
      return phantom?.publicKey?.toString() || null;
    } catch (error) {
      console.error('Error getting wallet address:', error);
      return null;
    }
  }

  async createTransferTransaction(
    recipientPubKey: PublicKey,
    amount: number
  ): Promise<Transaction> {
    if (!this.connection) {
      throw new Error('Solana connection not initialized');
    }

    const phantom = (window as any).phantom?.solana;
    if (!phantom) throw new Error('Phantom wallet not installed');

    const senderPubKey = phantom.publicKey;
    if (!senderPubKey) throw new Error('Wallet not connected');

    const { blockhash } = await this.connection.getLatestBlockhash('finalized');
    console.log('Got new blockhash:', blockhash);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderPubKey,
        toPubkey: recipientPubKey,
        lamports: amount,
      })
    );

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderPubKey;
    
    return transaction;
  }

  async signAndSendTransaction(transaction: Transaction): Promise<string> {
    const phantom = (window as any).phantom?.solana;
    if (!phantom) throw new Error('Phantom wallet not installed');

    const { signature } = await phantom.signAndSendTransaction(transaction);
    console.log('Transaction sent with signature:', signature);
    
    return signature;
  }

  async getTransactionStatus(signature: string) {
    if (!this.connection) {
      throw new Error('Solana connection not initialized');
    }

    try {
      const status = await this.connection.getSignatureStatus(signature);
      console.log('Got transaction status:', status);
      return status?.value;
    } catch (error) {
      console.error('Error getting transaction status:', error);
      return null;
    }
  }
}

export const phantomWallet = new PhantomWallet();