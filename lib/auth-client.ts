'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import { AuthSessionResponse, LoginInput } from "./schemas/auth";

export function useSession() {
  const { data, isLoading, isPending, refetch } = useQuery<AuthSessionResponse | null>({
    queryKey: ["auth-session"],
    queryFn: async () => {
      try {
        const response = await api.get<AuthSessionResponse>("/api/auth/me");
        return response.data;
      } catch (err: any) {
        if (err.response?.status === 401) {
          return null;
        }
        throw err;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: data || null,
    session: data?.session || null,
    user: data?.user || null,
    isLoading,
    isPending: isPending || isLoading,
    refetch,
  };
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const response = await api.post("/api/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth-session"], data);
      queryClient.invalidateQueries({ queryKey: ["auth-session"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/api/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth-session"], null);
      queryClient.invalidateQueries({ queryKey: ["auth-session"] });
    },
  });
}
