import { PublicKey } from '@solana/web3.js';

export type PhantomEvent = "disconnect" | "connect" | "accountChanged";

export interface PhantomProvider {
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: any) => Promise<any>;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  on: (event: PhantomEvent, callback: (args: any) => void) => void;
  isPhantom: boolean;
}

export type Status = 'connected' | 'disconnected' | 'connecting';

class PhantomWalletService {
  private provider: PhantomProvider | null = null;
  private publicKey: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.provider = (window as any)?.phantom?.solana;
    }
  }

  get isPhantomInstalled(): boolean {
    return this.provider?.isPhantom || false;
  }

  async connect(): Promise<string> {
    try {
      if (!this.provider) {
        window.open('https://phantom.app/', '_blank');
        throw new Error('Please install Phantom wallet');
      }

      const { publicKey } = await this.provider.connect();
      this.publicKey = publicKey.toString();
      return this.publicKey;
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (!this.provider) return;
      await this.provider.disconnect();
      this.publicKey = null;
    } catch (error) {
      console.error('Error disconnecting from Phantom wallet:', error);
      throw error;
    }
  }

  async getAddress(): Promise<string | null> {
    return this.publicKey;
  }

  onAccountChange(callback: (publicKey: string | null) => void): void {
    if (!this.provider) return;
    
    this.provider.on('accountChanged', (publicKey: PublicKey | null) => {
      callback(publicKey?.toString() || null);
    });
  }
}

export const phantomWallet = new PhantomWalletService();