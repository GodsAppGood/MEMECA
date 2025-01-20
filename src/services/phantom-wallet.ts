import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

class PhantomWallet {
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
    const phantom = (window as any).phantom?.solana;
    if (!phantom) throw new Error('Phantom wallet not installed');

    const senderPubKey = phantom.publicKey;
    if (!senderPubKey) throw new Error('Wallet not connected');

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderPubKey,
        toPubkey: recipientPubKey,
        lamports: amount,
      })
    );

    return transaction;
  }

  async signAndSendTransaction(transaction: Transaction): Promise<string> {
    const phantom = (window as any).phantom?.solana;
    if (!phantom) throw new Error('Phantom wallet not installed');

    try {
      const { signature } = await phantom.signAndSendTransaction(transaction);
      return signature;
    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    }
  }
}

export const phantomWallet = new PhantomWallet();