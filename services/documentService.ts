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
  isPublic?: boolean;
  uploadedByRole?: string;
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

// export async function downloadDocumentBlob(documentId: string): Promise<Blob> {
//   const response = await axiosInstance.get(
//     `/api/documents/${documentId}/download`,
//     {
//       responseType: "blob",
//     },
//   );

//   return response.data;
// }

export async function downloadDocumentBlob(
  documentId: string,
  filename?: string,
): Promise<void> {
  const response = await axiosInstance.get(
    `/api/documents/${documentId}/download`,
    { responseType: "blob" },
  );

  const blob = response.data as Blob;

  // Prefer filename from Content-Disposition header if the server sends one
  const disposition = response.headers["content-disposition"];
  const headerFilename = disposition?.match(/filename="?([^"]+)"?/)?.[1];

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename ?? headerFilename ?? `${documentId}.pdf`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  // Free the memory held by the object URL
  window.URL.revokeObjectURL(url);
}

export async function createManualDataset(payload: {
  name: string;
  description: string;
  source: string;
}) {
  return axiosInstance.post("/api/documents/manual", payload);
}
