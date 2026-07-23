import axios from "axios";
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
  try {
    const { data } = await axiosInstance.get<DocumentData[]>("/api/documents");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
}

export async function uploadDocument(
  file: File,
): Promise<UploadDocumentResponse> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post<UploadDocumentResponse>(
      "/api/documents",
      formData,
    );
    return response.data;
  } catch (error) {
    console.log("error", error);

    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
}

export async function deleteDocument(
  documentId: string,
): Promise<{ ok: boolean }> {
  try {
    const response = await axiosInstance.delete<{ ok: boolean }>(
      `/api/documents/${documentId}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
}

export async function downloadDocumentBlob(documentId: string): Promise<Blob> {
  try {
    const response = await axiosInstance.get(
      `/api/documents/${documentId}/download`,
      { responseType: "blob" },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
}
