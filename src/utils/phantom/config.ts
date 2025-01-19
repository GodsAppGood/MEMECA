export const WALLET_CONFIG = {
  network: 'mainnet-beta',
  endpoint: 'https://api.mainnet-beta.solana.com',
  maxRetries: 3,
  retryDelay: 1000, // 1 second
};

export const ERROR_MESSAGES = {
  NOT_INSTALLED: 'Phantom wallet is not installed. Please install it from phantom.app',
  NOT_CONNECTED: 'Failed to connect to Phantom wallet. Please try again.',
  USER_REJECTED: 'Transaction was cancelled by user.',
  TRANSACTION_FAILED: 'Transaction failed to complete. Please try again.',
};