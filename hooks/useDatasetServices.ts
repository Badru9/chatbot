import { QUERY_KEYS } from "@/constants";
import {
  fetchDatasets,
  createDataset,
  updateDataset,
  toggleDatasetStatus,
  deleteDataset,
  type DatasetItem,
} from "@/services/datasetService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDatasetServices = () => {
  const queryClient = useQueryClient();

  const invalidateDatasets = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.datasets });
  };

  const datasetsQuery = useQuery<DatasetItem[]>({
    queryKey: QUERY_KEYS.datasets,
    queryFn: fetchDatasets,
  });

  const createDatasetMutation = useMutation({
    mutationFn: (payload: {
      name: string;
      description?: string;
      content: string;
      source?: string;
      isActive?: boolean;
    }) => createDataset(payload),
    onSuccess: () => invalidateDatasets(),
  });

  const updateDatasetMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        name?: string;
        description?: string;
        content?: string;
        source?: string;
        isActive?: boolean;
      };
    }) => updateDataset(id, payload),
    onSuccess: () => invalidateDatasets(),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleDatasetStatus(id, isActive),
    onSuccess: () => invalidateDatasets(),
  });

  const deleteDatasetMutation = useMutation({
    mutationFn: (id: string) => deleteDataset(id),
    onSuccess: () => invalidateDatasets(),
  });

  return {
    datasetsQuery,
    createDatasetMutation,
    updateDatasetMutation,
    toggleStatusMutation,
    deleteDatasetMutation,
    invalidateDatasets,
  };
};
