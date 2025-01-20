import { PublicKey, Transaction, SystemProgram, Connection } from '@solana/web3.js';

class PhantomWallet {
  private connection: Connection;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  constructor() {
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

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async createTransferTransaction(
    recipientPubKey: PublicKey,
    amount: number
  ): Promise<Transaction> {
    const phantom = (window as any).phantom?.solana;
    if (!phantom) throw new Error('Phantom wallet not installed');

    const senderPubKey = phantom.publicKey;
    if (!senderPubKey) throw new Error('Wallet not connected');

    // Get the latest blockhash right before creating transaction
    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
    console.log('Got new blockhash:', blockhash, 'lastValidBlockHeight:', lastValidBlockHeight);

    // Create transaction with transfer instruction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderPubKey,
        toPubkey: recipientPubKey,
        lamports: amount,
      })
    );

    // Set the blockhash and feePayer
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderPubKey;
    
    return transaction;
  }

  async signAndSendTransaction(transaction: Transaction): Promise<string> {
    const phantom = (window as any).phantom?.solana;
    if (!phantom) throw new Error('Phantom wallet not installed');

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        console.log(`Attempt ${attempt + 1} of ${this.MAX_RETRIES}`);

        // Get fresh blockhash for each attempt
        const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
        console.log('Using blockhash:', blockhash, 'lastValidBlockHeight:', lastValidBlockHeight);

        // Update transaction with new blockhash
        transaction.recentBlockhash = blockhash;

        // Sign and send the transaction
        const { signature } = await phantom.signAndSendTransaction(transaction);
        console.log('Transaction sent with signature:', signature);

        // Wait for confirmation
        const confirmation = await this.connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight
        });

        if (confirmation.value.err) {
          throw new Error(`Transaction confirmation error: ${JSON.stringify(confirmation.value.err)}`);
        }

        console.log('Transaction confirmed:', signature);
        return signature;
      } catch (error: any) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        lastError = error;

        // If this is not the last attempt, wait before retrying
        if (attempt < this.MAX_RETRIES - 1) {
          console.log(`Waiting ${this.RETRY_DELAY}ms before next attempt...`);
          await this.sleep(this.RETRY_DELAY);
        }
      }
    }

    // If we've exhausted all retries, throw the last error
    throw new Error(`Transaction failed after ${this.MAX_RETRIES} attempts. Last error: ${lastError?.message}`);
  }
}

export const phantomWallet = new PhantomWallet();