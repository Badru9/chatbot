import { useState } from "react";
import type { DocumentData } from "@/services/documentService";

interface UseDeleteConfirmReturn {
  deleteTarget: DocumentData | null;
  openDeleteModal: (doc: DocumentData) => void;
  closeDeleteModal: () => void;
}

export function useDeleteConfirm(): UseDeleteConfirmReturn {
  const [deleteTarget, setDeleteTarget] = useState<DocumentData | null>(null);

  const openDeleteModal = (doc: DocumentData) => setDeleteTarget(doc);
  const closeDeleteModal = () => setDeleteTarget(null);

  return { deleteTarget, openDeleteModal, closeDeleteModal };
}
