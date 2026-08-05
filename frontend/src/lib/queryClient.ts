import { QueryClient, keepPreviousData } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: 1000,
      staleTime: 30000,
      placeholderData: keepPreviousData,
    },
    mutations: {
      retry: 0,
    },
  },
})
