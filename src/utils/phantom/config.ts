export const WALLET_CONFIG = {
  network: 'mainnet-beta',
  endpoint: `https://api.mainnet-beta.solana.com`,
  maxRetries: 3,
  retryDelay: 2000,
  confirmationTimeout: 30000,
  minimumSolBuffer: 0.01, // Additional SOL needed for fees
};

export const ERROR_MESSAGES = {
  NOT_INSTALLED: 'Phantom wallet is not installed. Please install it from phantom.app',
  NOT_CONNECTED: 'Failed to connect to Phantom wallet. Please try again.',
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  INVALID_NETWORK: 'Please switch to the correct Solana network.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for transaction.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  TIMEOUT: 'Transaction confirmation timed out. Please check your wallet for status.',
  USER_REJECTED: 'Transaction was cancelled by user.',
};