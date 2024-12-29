import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
          if (process.env.NODE_ENV === 'development') {
            const timing = performance.now();
            console.log(`Query execution time: ${timing}ms`);
          }
        }
      }
    },
    mutations: {
      retry: 1,
      meta: {
        onError: (error: Error) => {
          console.error('Mutation error:', error);
          if (process.env.NODE_ENV === 'development') {
            const timing = performance.now();
            console.log(`Mutation execution time: ${timing}ms`);
          }
        }
      }
    }
  }
});