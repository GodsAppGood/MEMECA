export interface WalletConnectionResult {
  success: boolean;
  publicKey?: string;
  error?: string;
}

export interface TransactionResult {
  success: boolean;
  signature?: string;
  error?: string;
}