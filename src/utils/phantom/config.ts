import { ConnectionConfig } from './types';

export const WALLET_CONFIG: ConnectionConfig = {
  network: 'mainnet-beta',
  endpoint: `https://api.mainnet-beta.solana.com`,
  maxRetries: 3,
  retryDelay: 2000,
};

export const ERROR_MESSAGES = {
  NOT_INSTALLED: 'Phantom wallet is not installed. Please install it from phantom.app',
  NOT_CONNECTED: 'Failed to connect to Phantom wallet. Please try again.',
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  INVALID_NETWORK: 'Please switch to the correct Solana network.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for transaction.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
};