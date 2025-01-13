export const logWalletAction = (action: string, details: Record<string, any>) => {
  console.log(`Phantom Wallet - ${action}:`, {
    timestamp: new Date().toISOString(),
    ...details,
    environment: import.meta.env.MODE,
  });
};

export const logWalletError = (action: string, error: any, details?: Record<string, any>) => {
  console.error(`Phantom Wallet Error - ${action}:`, {
    error: error?.message || error,
    stack: error?.stack,
    details,
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE,
  });
};