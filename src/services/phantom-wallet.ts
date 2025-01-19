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
      console.log('Phantom wallet initialized:', !!this.provider);
    }
  }

  get isPhantomInstalled(): boolean {
    const isInstalled = this.provider?.isPhantom || false;
    console.log('Phantom wallet installed:', isInstalled);
    return isInstalled;
  }

  async connect(): Promise<string> {
    try {
      console.log('Attempting to connect to Phantom wallet...');
      
      if (!this.provider) {
        console.error('Phantom wallet not found');
        window.open('https://phantom.app/', '_blank');
        throw new Error('Please install Phantom wallet');
      }

      const { publicKey } = await this.provider.connect();
      this.publicKey = publicKey.toString();
      console.log('Successfully connected to wallet:', this.publicKey);
      return this.publicKey;
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      console.log('Attempting to disconnect from Phantom wallet...');
      if (!this.provider) return;
      await this.provider.disconnect();
      this.publicKey = null;
      console.log('Successfully disconnected from wallet');
    } catch (error) {
      console.error('Error disconnecting from Phantom wallet:', error);
      throw error;
    }
  }

  async getAddress(): Promise<string | null> {
    console.log('Getting wallet address:', this.publicKey);
    return this.publicKey;
  }

  onAccountChange(callback: (publicKey: string | null) => void): void {
    if (!this.provider) {
      console.warn('Provider not available for account change listener');
      return;
    }
    
    this.provider.on('accountChanged', (publicKey: PublicKey | null) => {
      const address = publicKey?.toString() || null;
      console.log('Account changed:', address);
      callback(address);
    });
  }
}

export const phantomWallet = new PhantomWalletService();