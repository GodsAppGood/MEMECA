interface WalletLogDetails {
  [key: string]: any;
}

export const logWalletAction = (action: string, details: WalletLogDetails) => {
  console.log(`Phantom Wallet - ${action}:`, {
    timestamp: new Date().toISOString(),
    ...details,
    environment: import.meta.env.MODE,
  });
};

export const logWalletError = (action: string, error: any) => {
  console.error(`Phantom Wallet Error - ${action}:`, {
    error: error?.message || error,
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE,
  });
};