'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loginAction, logoutAction, getSessionAction } from "@/lib/server/actions/auth";
import { AuthSessionResponse, LoginInput } from "./schemas/auth";

export function useSession() {
  const { data, isLoading, isPending, refetch } = useQuery<AuthSessionResponse | null>({
    queryKey: ["auth-session"],
    queryFn: async () => {
      try {
        const response = await getSessionAction();
        return response as any;
      } catch (err: any) {
        return null;
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
      const response = await loginAction(credentials);
      if ('error' in response && response.error) {
        throw new Error(response.error);
      }
      return response;
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
      const response = await logoutAction();
      return response;
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth-session"], null);
      queryClient.invalidateQueries({ queryKey: ["auth-session"] });
    },
  });
}
