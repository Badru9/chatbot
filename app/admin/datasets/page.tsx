"use client";

import { toast } from "@heroui/react";
import { useDocumentServices } from "@/hooks/useDocumentServices";
import PortalLayout from "../../(portal)/layout";
import Header from "./components/Header";
import Stats from "./components/Stats";
import DatasetTable from "./components/DatasetTable";
import { UploadModal, ManualModal, DeleteModal } from "./components/Modals";
import { useDeleteConfirm } from "./hooks/useDeleteConfirm";
import { useState } from "react";

export default function DatasetsPage() {
  const {
    documentsQuery,
    uploadDocumentMutation,
    deleteDocumentMutation,
    createManualDocumentMutation,
  } = useDocumentServices();

  const { deleteTarget, openDeleteModal, closeDeleteModal } =
    useDeleteConfirm();

  // Modal visibility
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);

  // Upload form
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Manual form
  const [manualTitle, setManualTitle] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [manualSource, setManualSource] = useState("");

  const totalChunks =
    documentsQuery.data?.reduce((sum, doc) => sum + doc.chunkCount, 0) ?? 0;

  // -- Handlers --

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast("Format file tidak didukung. Mohon unggah file PDF.", {
        variant: "danger",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast("Ukuran file maksimal adalah 5 MB.", { variant: "danger" });
      return;
    }
    setSelectedFile(file);
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) return;
    uploadDocumentMutation.mutate(selectedFile, {
      onSuccess: () => {
        setIsUploadOpen(false);
        setSelectedFile(null);
        toast("PDF berhasil diunggah dan diproses.", { variant: "success" });
      },
      onError: (error: Error) => {
        toast(`Gagal mengunggah PDF: ${error.message}`, { variant: "danger" });
      },
    });
  };

  const handleManualSubmit = () => {
    if (!manualTitle.trim() || !manualDescription.trim()) {
      toast("Judul dan deskripsi wajib diisi.", { variant: "danger" });
      return;
    }
    createManualDocumentMutation.mutate(
      {
        name: manualTitle.trim(),
        description: manualDescription.trim(),
        source: manualSource.trim(),
      },
      {
        onSuccess: () => {
          setIsManualOpen(false);
          setManualTitle("");
          setManualDescription("");
          setManualSource("");
          toast("Dataset manual berhasil ditambahkan.", { variant: "success" });
        },
        onError: (error: Error) => {
          toast(`Gagal menambahkan dataset: ${error.message}`, {
            variant: "danger",
          });
        },
      },
    );
  };

  const handleDeleteSubmit = () => {
    if (!deleteTarget) return;
    deleteDocumentMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        closeDeleteModal();
        toast("Dokumen berhasil dihapus.", { variant: "success" });
      },
      onError: (error: Error) => {
        toast(`Gagal menghapus dokumen: ${error.message}`, {
          variant: "danger",
        });
      },
    });
  };

  return (
    <PortalLayout>
      <div className="w-full max-w-5xl flex flex-col gap-6 mt-8">
        <Header
          onOpenManualModal={() => setIsManualOpen(true)}
          onOpenUploadModal={() => setIsUploadOpen(true)}
        />

        <Stats
          totalDocuments={documentsQuery.data?.length ?? 0}
          totalChunks={totalChunks}
          isLoading={documentsQuery.isLoading}
        />

        <DatasetTable
          documents={documentsQuery.data}
          isLoading={documentsQuery.isLoading}
          onDelete={openDeleteModal}
        />

        <UploadModal
          isOpen={isUploadOpen}
          onOpenChange={setIsUploadOpen}
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
          onSubmit={handleUploadSubmit}
          isPending={uploadDocumentMutation.isPending}
        />

        <ManualModal
          isOpen={isManualOpen}
          onOpenChange={setIsManualOpen}
          title={manualTitle}
          onTitleChange={setManualTitle}
          description={manualDescription}
          onDescriptionChange={setManualDescription}
          source={manualSource}
          onSourceChange={setManualSource}
          onSubmit={handleManualSubmit}
          isPending={createManualDocumentMutation.isPending}
        />

        <DeleteModal
          deleteTarget={deleteTarget}
          onOpenChange={(open) => !open && closeDeleteModal()}
          onSubmit={handleDeleteSubmit}
          isPending={deleteDocumentMutation.isPending}
        />
      </div>
    </PortalLayout>
  );
}
