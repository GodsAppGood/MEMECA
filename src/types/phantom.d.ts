interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: { toString: () => string };
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  signMessage: (message: Uint8Array, encoding: string) => Promise<{ signature: Uint8Array }>;
  signTransaction: (transaction: any) => Promise<any>;
  signAllTransactions?: (transactions: any[]) => Promise<any[]>;
  request?: (method: string, params: any) => Promise<any>;
}

interface Window {
  solana?: PhantomProvider;
}