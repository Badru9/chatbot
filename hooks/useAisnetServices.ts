import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { axiosInstance } from "@/services/axiosInstance";

export const useAisnetServices = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.research });
  };

  const researches = useQuery({
    queryKey: QUERY_KEYS.research,
    queryFn: () =>
      axiosInstance.get("/api/research").then((res) => {
        return res.data;
      }),
  });

  const researchMutation = useMutation({
    mutationFn: (data: any) => axiosInstance.post("/api/research", data),
    onSuccess: () => invalidateQueries(),
  });

  return { researches, researchMutation };
};
