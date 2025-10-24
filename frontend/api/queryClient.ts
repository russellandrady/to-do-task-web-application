"use client";

import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, any>;
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
  };
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      onError: (error: unknown) => {
        const apiError = error as ApiError;
        const errorMessage =
          apiError?.response?.data?.message ||
          apiError?.message ||
          "An unexpected error occurred";

        toast.error(errorMessage);
      },
    },
  },
});

export default queryClient;