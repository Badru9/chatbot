import {
  fetchDocumentsAction,
  uploadDocumentAction,
  deleteDocumentAction,
} from "@/lib/server/actions/documents";
import { axiosInstance } from "./axiosInstance";

export interface SidebarLibraryFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: number;
  chunksCount?: number;
}

export interface DocumentData {
  id: string;
  name: string;
  description?: string;
  chunkCount: number;
  uploadedAt: string | null;
}

export interface UploadDocumentResponse {
  document?: SidebarLibraryFile;
  error?: string;
}

export async function fetchDocuments(): Promise<DocumentData[]> {
  return fetchDocumentsAction();
}

export async function uploadDocument(
  file: File,
): Promise<UploadDocumentResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await uploadDocumentAction(formData);
  if (res.error) {
    throw new Error(res.error);
  }

  return res as UploadDocumentResponse;
}

export async function deleteDocument(
  documentId: string,
): Promise<{ ok: boolean }> {
  const res = await deleteDocumentAction(documentId);
  if ("error" in res && res.error) {
    throw new Error(res.error);
  }
  return { ok: true };
}

export async function downloadDocumentBlob(documentId: string): Promise<Blob> {
  const response = await axiosInstance.get(
    `/api/documents/${documentId}/download`,
    {
      responseType: "blob",
    },
  );
  return response.data;
}

export async function createManualDataset(payload: {
  name: string;
  description: string;
  source: string;
}) {
  return axiosInstance.post("/api/documents/manual", payload);
}
