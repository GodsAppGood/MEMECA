import { PublicKey, Transaction, SystemProgram, Connection } from '@solana/web3.js';

class PhantomWallet {
  private connection: Connection;

  constructor() {
    // Используем публичную конечную точку Solana для тестовой сети
    this.connection = new Connection('https://api.devnet.solana.com');
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

    // Получаем последний блокхеш
    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();

    // Создаем транзакцию с блокхешем
    const transaction = new Transaction({
      feePayer: senderPubKey,
      blockhash,
      lastValidBlockHeight
    }).add(
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
      
      // Ждем подтверждения транзакции
      const confirmation = await this.connection.confirmTransaction({
        signature,
        blockhash: transaction.blockhash,
        lastValidBlockHeight: transaction.lastValidBlockHeight
      });

      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      return signature;
    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    }
  }
}

export const phantomWallet = new PhantomWallet();