import { QUERY_KEYS } from "@/constants";
import { CreateUserInput } from "@/lib/types";
import { createUser, deleteUser, getUsers } from "@/services/userApi";
import { User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUserServices() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery<User[]>({
    queryKey: QUERY_KEYS.users,
    queryFn: getUsers,
  });

  const createMutation = useMutation({
    mutationFn: (values: CreateUserInput) => createUser(values),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users }),
  });

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    createMutation,
    deleteMutation,
  };
}
