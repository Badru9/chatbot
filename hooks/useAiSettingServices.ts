import { QUERY_KEYS } from "@/constants";
import {
  fetchAiSetting,
  updateAiSetting,
  testOllamaConnection,
  type AiSettingData,
} from "@/services/aiSettingService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAiSettingServices = () => {
  const queryClient = useQueryClient();

  const invalidateAiSettings = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.aiSettings });
  };

  const aiSettingQuery = useQuery<AiSettingData>({
    queryKey: QUERY_KEYS.aiSettings,
    queryFn: fetchAiSetting,
  });

  const updateAiSettingMutation = useMutation({
    mutationFn: (payload: Partial<AiSettingData>) => updateAiSetting(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.aiSettings, data);
      invalidateAiSettings();
    },
  });

  const testOllamaMutation = useMutation({
    mutationFn: (baseUrl: string) => testOllamaConnection(baseUrl),
  });

  return {
    aiSettingQuery,
    updateAiSettingMutation,
    testOllamaMutation,
    invalidateAiSettings,
  };
};
