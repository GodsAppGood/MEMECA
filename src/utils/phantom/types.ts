import { Connection, Transaction } from '@solana/web3.js';

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

export interface ConnectionConfig {
  network: string;
  endpoint: string;
  maxRetries: number;
  retryDelay: number;
}