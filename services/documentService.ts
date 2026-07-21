import { axiosInstance } from "./axiosInstance";

export interface SidebarLibraryFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: number;
}

export interface UploadDocumentResponse {
  document?: SidebarLibraryFile;
  error?: string;
}

export async function uploadDocument(
  file: File,
): Promise<UploadDocumentResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post<UploadDocumentResponse>(
    "/api/documents",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
}

export async function deleteDocument(
  documentId: string,
): Promise<{ ok: boolean }> {
  const response = await axiosInstance.delete<{ ok: boolean }>(
    `/api/documents/${documentId}`,
  );
  return response.data;
}
