import { PublicKey, Transaction, SystemProgram, Connection } from '@solana/web3.js';

class PhantomWallet {
  private connection: Connection;

  constructor() {
    // Changed from devnet to mainnet-beta
    this.connection = new Connection('https://api.mainnet-beta.solana.com');
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
    const phantom = (window as any).phantom?.solana;
    if (!phantom) throw new Error('Phantom wallet not installed');

    const senderPubKey = phantom.publicKey;
    if (!senderPubKey) throw new Error('Wallet not connected');

    const { blockhash } = await this.connection.getLatestBlockhash('finalized');
    console.log('Got new blockhash from mainnet:', blockhash);

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

    // Быстрая отправка транзакции без ожидания подтверждения
    const { signature } = await phantom.signAndSendTransaction(transaction);
    console.log('Transaction sent to mainnet with signature:', signature);
    
    return signature;
  }
}

export const phantomWallet = new PhantomWallet();