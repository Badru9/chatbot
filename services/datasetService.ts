import {
  fetchDatasetsAction,
  createDatasetAction,
  updateDatasetAction,
  toggleDatasetStatusAction,
  deleteDatasetAction,
  type DatasetItem,
} from "@/lib/server/actions/datasets";

export type { DatasetItem };

export async function fetchDatasets(): Promise<DatasetItem[]> {
  return fetchDatasetsAction();
}

export async function createDataset(payload: {
  name: string;
  description?: string;
  content: string;
  source?: string;
  isActive?: boolean;
}): Promise<DatasetItem> {
  return createDatasetAction(payload);
}

export async function updateDataset(
  id: string,
  payload: {
    name?: string;
    description?: string;
    content?: string;
    source?: string;
    isActive?: boolean;
  },
): Promise<DatasetItem> {
  return updateDatasetAction(id, payload);
}

export async function toggleDatasetStatus(
  id: string,
  isActive: boolean,
): Promise<DatasetItem> {
  return toggleDatasetStatusAction(id, isActive);
}

export async function deleteDataset(id: string): Promise<{ success: boolean }> {
  return deleteDatasetAction(id);
}
