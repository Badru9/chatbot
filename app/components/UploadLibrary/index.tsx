"use client";

import { Button } from "@heroui/react";
import { FilePdfIcon, PlusIcon, SpinnerIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { useDocumentServices } from "@/hooks/useDocumentServices";
import { type DocumentData } from "@/services/documentService";
import UploadFileModal from "../UploadFileModal";

export default function UploadLibrary() {
  const {
    uploadDocumentMutation: uploadMutation,
    deleteDocumentMutation: deleteMutation,
    documentsQuery: { data: documents = [], isLoading },
  } = useDocumentServices();

  // const { data: documents = [], isLoading } = useQuery<DocumentData[]>({
  //   queryKey: QUERY_KEYS.documents,
  //   queryFn: fetchDocuments,
  // });

  // const uploadMutation = useMutation({
  //   mutationFn: (file: File) => uploadDocument(file),
  //   onSuccess: () =>
  //     queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents }),
  //   onError: (error) => {
  //     console.log("error ketika upload", error);
  //   },
  // });

  // const deleteMutation = useMutation({
  //   mutationFn: (id: string) => deleteDocument(id),
  //   onSuccess: () =>
  //     queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents }),
  // });

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<DocumentData | null>(null);

  const handleUploadFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUploadFile(event.target.files?.[0] ?? null);
  };

  const handleUploadCancel = () => {
    setUploadFile(null);
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile || uploadMutation.isPending) return;

    try {
      await uploadMutation.mutateAsync(uploadFile);
      setUploadFile(null);
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <section className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-hairline px-6 py-4 sm:px-8 lg:px-10">
        <div>
          <h1 className="text-[20px] font-bold tracking-[-0.3px] text-ink">
            Library
          </h1>
          <p className="mt-0.5 text-[13px] leading-[1.4] text-muted-soft">
            {isLoading
              ? "Memuat..."
              : documents.length === 0
                ? "Belum ada file"
                : `${documents.length} file PDF`}
          </p>
        </div>
        <Button
          onPress={() => setIsUploadModalOpen(true)}
          className="mt-6 h-10 rounded-xl bg-primary px-5 text-[13px] font-semibold text-white hover:bg-primary-active active:scale-[0.97]"
        >
          <PlusIcon size={16} weight="bold" />
          Upload PDF
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-surface-soft px-6 py-6 sm:px-8 lg:px-10">
        {isLoading ? (
          <div className="mx-auto mt-24 flex flex-col items-center gap-3">
            <SpinnerIcon className="animate-spin text-muted" size={24} />
            <p className="text-[14px] text-muted-soft">Memuat library...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="mx-auto mt-24 max-w-sm text-center">
            <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-canvas text-muted-soft shadow-sm ring-1 ring-hairline">
              <FilePdfIcon size={26} weight="fill" />
            </div>
            <p className="text-[18px] font-semibold tracking-[-0.2px] text-ink">
              Library kosong
            </p>
            <p className="mt-2 text-[14px] leading-[1.6] text-muted-soft">
              Upload file PDF untuk membuat knowledge base yang bisa digunakan
              sebagai konteks RAG di chat.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* {documents.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDelete={() => deleteMutation.mutate(file.id)}
                onPreview={() => setPreviewFile(file)}
                isDeleting={
                  deleteMutation.isPending &&
                  deleteMutation.variables === file.id
                }
              />
            ))} */}
            list file cards
          </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      {/* <PDFViewerModal
        fileId={previewFile?.id ?? null}
        fileName={previewFile?.name ?? ""}
        isOpen={previewFile !== null}
        onClose={() => setPreviewFile(null)}
      /> */}

      {/* Upload Modal */}
      <UploadFileModal
        file={uploadFile}
        isOpen={isUploadModalOpen}
        isUploading={uploadMutation.isPending}
        onCancel={handleUploadCancel}
        onFileChange={handleUploadFileChange}
        onOpenChange={setIsUploadModalOpen}
        onSubmit={handleUploadSubmit}
      />
    </section>
  );
}
