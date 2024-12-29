export const logAuthPerformance = (action: string, startTime: number) => {
  if (process.env.NODE_ENV === 'development') {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`Auth ${action} completed in ${duration.toFixed(2)}ms`);
    
    // Log memory usage in development
    if (performance.memory) {
      console.log('Memory usage:', {
        usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB',
        totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576) + 'MB'
      });
    }
  }
};

export const logAuthError = (error: Error, context: Record<string, any> = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Auth Error:', {
      message: error.message,
      stack: error.stack,
      context: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ...context
      }
    });
  }
};