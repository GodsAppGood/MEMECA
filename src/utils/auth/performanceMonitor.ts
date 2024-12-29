interface ExtendedPerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

export const logAuthPerformance = (action: string, startTime: number) => {
  if (process.env.NODE_ENV === 'development') {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`Auth ${action} completed in ${duration.toFixed(2)}ms`);
    
    // Log memory usage in development
    const extendedPerformance = performance as ExtendedPerformance;
    if (extendedPerformance.memory) {
      console.log('Memory usage:', {
        usedJSHeapSize: Math.round(extendedPerformance.memory.usedJSHeapSize / 1048576) + 'MB',
        totalJSHeapSize: Math.round(extendedPerformance.memory.totalJSHeapSize / 1048576) + 'MB'
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