// queryClient.js
import { QueryClient } from 'react-query';

// Create the global query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Retry 3 times on failure
      retryDelay: (attempt) => Math.pow(2, attempt) * 1000, // Exponential backoff (1s, 2s, 4s)
    },
    mutations: {
      retry: 3, // Retry mutations 3 times
      retryDelay: (attempt) => Math.pow(2, attempt) * 1000, // Exponential backoff
    },
  },
});

export default queryClient;
