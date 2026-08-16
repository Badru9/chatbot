import { QUERY_KEYS } from "@/constants";
import { createManualDatasetAction } from "@/lib/server/actions/documents";
import {
  deleteDocument,
  fetchDocuments,
  uploadDocument,
  type DocumentData,
} from "@/services/documentService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDocumentServices = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents });
  };

  const documentsQuery = useQuery<DocumentData[]>({
    queryKey: QUERY_KEYS.documents,
    queryFn: fetchDocuments,
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: (file: File) => uploadDocument(file),
    onSuccess: () => invalidateQueries(),
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => invalidateQueries(),
  });

  const createManualDocumentMutation = useMutation({
    mutationFn: (payload: {
      name: string;
      description: string;
      source: string;
    }) => createManualDatasetAction(payload),
    onSuccess: () => invalidateQueries(),
  });

  return {
    documentsQuery,
    uploadDocumentMutation,
    deleteDocumentMutation,
    createManualDocumentMutation,
  };
};
