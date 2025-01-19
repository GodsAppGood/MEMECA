import { PublicKey } from '@solana/web3.js';

class PhantomWalletService {
  private provider: any = null;
  private publicKey: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.provider = (window as any)?.phantom?.solana;
    }
  }

  get isPhantomInstalled(): boolean {
    return this.provider?.isPhantom || false;
  }

  async connect(): Promise<string | null> {
    try {
      if (!this.provider) {
        console.error('Phantom wallet not found');
        return null;
      }

      const { publicKey } = await this.provider.connect();
      this.publicKey = publicKey.toString();
      return this.publicKey;
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
      return null;
    }
  }

  async getAddress(): Promise<string | null> {
    return this.publicKey;
  }

  async disconnect(): Promise<void> {
    try {
      if (this.provider) {
        await this.provider.disconnect();
        this.publicKey = null;
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }
}

export const phantomWallet = new PhantomWalletService();