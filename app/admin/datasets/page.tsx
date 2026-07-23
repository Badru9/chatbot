"use client";

import React, { useState } from "react";
import PortalLayout from "../../(portal)/layout";
import {
  Button,
  Table,
  Modal,
  Chip,
  Input,
  Label,
  TextField,
  TextArea,
  toast,
} from "@heroui/react";
import {
  ArrowLeft,
  Trash,
  Plus,
  FilePdf,
  Spinner,
  Database,
  Calendar,
  Folder,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDocuments,
  uploadDocument,
  deleteDocument,
  type DocumentData,
} from "@/services/documentService";
import { axiosInstance } from "@/services/axiosInstance";
import { QUERY_KEYS } from "@/constants";

export default function AdminDatasetsPage() {
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery<DocumentData[]>({
    queryKey: QUERY_KEYS.documents,
    queryFn: fetchDocuments,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadDocument(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents }),
  });

  const manualCreateMutation = useMutation({
    mutationFn: (payload: { name: string; description: string; source: string }) =>
      axiosInstance.post("/api/documents/manual", payload).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents }),
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manualTitle, setManualTitle] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [manualSource, setManualSource] = useState("");

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DocumentData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast("Format file tidak didukung. Mohon unggah file PDF.", { variant: "danger" });
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast("Ukuran file maksimal adalah 15 MB.", { variant: "danger" });
      return;
    }
    setSelectedFile(file);
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) return;
    uploadMutation.mutate(selectedFile, {
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
    manualCreateMutation.mutate(
      { name: manualTitle.trim(), description: manualDescription.trim(), source: manualSource.trim() },
      {
        onSuccess: () => {
          setIsManualOpen(false);
          setManualTitle("");
          setManualDescription("");
          setManualSource("");
          toast("Dataset manual berhasil ditambahkan.", { variant: "success" });
        },
        onError: (error: Error) => {
          toast(`Gagal menambahkan dataset: ${error.message}`, { variant: "danger" });
        },
      },
    );
  };

  const handleDeleteSubmit = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        toast("Dokumen berhasil dihapus.", { variant: "success" });
      },
      onError: (error: Error) => {
        toast(`Gagal menghapus dokumen: ${error.message}`, { variant: "danger" });
      },
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const totalChunks = documents.reduce((sum, doc) => sum + doc.chunkCount, 0);

  return (
    <PortalLayout>
      <div className="w-full max-w-5xl flex flex-col gap-6 mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button isIconOnly variant="ghost" className="rounded-full cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div>
              <p className="text-xs text-neutral-400">Portal / Admin</p>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Kelola Dataset AI</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsManualOpen(true)}
              variant="ghost"
              className="flex items-center gap-2 cursor-pointer px-4 py-2 text-sm rounded-xl"
            >
              <Plus size={18} weight="bold" />
              Input Manual
            </Button>
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-bold flex items-center gap-2 cursor-pointer shadow-md rounded-xl px-4 py-2 text-sm"
            >
              <Plus size={18} weight="bold" />
              Unggah PDF
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white border border-neutral-200/50 dark:border-neutral-700/50">
              <Folder size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-medium">TOTAL DOKUMEN</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">
                {isLoading ? "-" : documents.length}
              </p>
            </div>
          </div>
          <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white border border-neutral-200/50 dark:border-neutral-700/50">
              <Database size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-medium">TOTAL VECTOR CHUNKS</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">
                {isLoading ? "-" : totalChunks}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm">
          <Table className="w-full">
            <Table.ScrollContainer>
              <Table.Content aria-label="Tabel pengelolaan dataset RAG">
                <Table.Header>
                  <Table.Column isRowHeader className="w-16 text-center">TIPE</Table.Column>
                  <Table.Column>NAMA DOKUMEN</Table.Column>
                  <Table.Column className="w-36 text-center">TOTAL CHUNKS</Table.Column>
                  <Table.Column className="w-56">TANGGAL UNGGAH</Table.Column>
                  <Table.Column className="w-32 text-center">AKSI</Table.Column>
                </Table.Header>
                <Table.Body>
                  {isLoading ? (
                    <Table.Row>
                      <Table.Cell colSpan={5}>
                        <div className="flex items-center justify-center gap-2 py-8 text-neutral-500">
                          <Spinner size={18} className="animate-spin" />
                          <span className="text-sm">Memuat dokumen...</span>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ) : documents.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={5}>
                        <span className="text-sm text-neutral-500">Belum ada dokumen PDF terindeks.</span>
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    documents.map((doc) => (
                      <Table.Row key={doc.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                        <Table.Cell>
                          <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/20 flex items-center justify-center border border-red-100/30 dark:border-red-900/30">
                              <FilePdf size={22} weight="duotone" className="text-red-500 dark:text-red-400" />
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div>
                            <div className="font-semibold text-neutral-800 dark:text-neutral-100 break-all">
                              {doc.name}
                            </div>
                            {doc.description && (
                              <div className="text-xs text-neutral-400 mt-0.5 max-w-sm truncate">
                                {doc.description}
                              </div>
                            )}
                            <div className="text-xs text-neutral-400 font-mono mt-0.5 max-w-sm truncate">
                              {doc.id}
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell className="text-center">
                          <Chip size="sm" variant="soft" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold">
                            {doc.chunkCount} chunks
                          </Chip>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                            <Calendar size={16} />
                            {formatDate(doc.uploadedAt)}
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center justify-center">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="ghost"
                              className="cursor-pointer text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50"
                              onPress={() => { setDeleteTarget(doc); setIsDeleteOpen(true); }}
                              aria-label="Hapus berkas"
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </div>
      </div>

      {/* Upload PDF Modal */}
      <Modal isOpen={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <Modal.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
          <Modal.Container>
            <Modal.Dialog className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl max-w-md w-full outline-none">
              <Modal.Header>
                <Modal.Heading className="text-xl font-bold text-neutral-900 dark:text-white">
                  Unggah Berkas PDF
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="gap-4 mt-4">
                <p className="text-sm text-neutral-500">
                  Pilih file PDF pendukung RAG. Sistem akan membaca, membuat potongan teks (chunking), menghitung representasi vektor (embedding 384 dimensi), dan menyimpannya di database PostgreSQL.
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  <label
                    htmlFor="admin-pdf-upload"
                    className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition"
                  >
                    <FilePdf size={36} weight="duotone" className="text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                      Klik untuk memilih file PDF
                    </span>
                    <span className="text-xs text-neutral-400">
                      Format: .pdf (Maksimal 15 MB)
                    </span>
                    <input
                      id="admin-pdf-upload"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={uploadMutation.isPending}
                    />
                  </label>
                  {selectedFile && (
                    <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-lg border border-neutral-200/50 dark:border-neutral-700/50 flex items-center justify-between text-xs">
                      <span className="text-neutral-700 dark:text-neutral-300 font-semibold truncate max-w-xs">
                        {selectedFile.name}
                      </span>
                      <span className="text-neutral-400 font-mono">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setIsUploadOpen(false)} isDisabled={uploadMutation.isPending} className="cursor-pointer px-4 py-2 text-sm rounded-xl">
                  Batal
                </Button>
                <Button
                  onPress={handleUploadSubmit}
                  isDisabled={!selectedFile || uploadMutation.isPending}
                  className="cursor-pointer font-bold px-4 py-2 text-sm bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 rounded-xl flex items-center gap-2"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Spinner size={18} className="animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Unggah"
                  )}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Manual Input Modal */}
      <Modal isOpen={isManualOpen} onOpenChange={setIsManualOpen}>
        <Modal.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
          <Modal.Container>
            <Modal.Dialog className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl max-w-md w-full outline-none">
              <Modal.Header>
                <Modal.Heading className="text-xl font-bold text-neutral-900 dark:text-white">
                  Tambah Dataset Manual
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="gap-4 mt-4">
                <p className="text-sm text-neutral-500">
                  Masukkan informasi dataset secara manual tanpa mengunggah file. Berguna untuk metadata atau catatan referensi.
                </p>
                <TextField value={manualTitle} onChange={setManualTitle} isRequired className="w-full flex flex-col gap-1.5">
                  <Label className="text-xs text-neutral-500 font-medium">Judul Dataset</Label>
                  <Input placeholder="Contoh: Pedoman Penulisan Skripsi 2025" className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-10 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors" />
                </TextField>
                <TextField value={manualDescription} onChange={setManualDescription} isRequired className="w-full flex flex-col gap-1.5">
                  <Label className="text-xs text-neutral-500 font-medium">Deskripsi</Label>
                  <TextArea placeholder="Jelaskan isi dataset, tujuan penggunaan, atau ringkasan konten..." className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-20 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors" />
                </TextField>
                <TextField value={manualSource} onChange={setManualSource} className="w-full flex flex-col gap-1.5">
                  <Label className="text-xs text-neutral-500 font-medium">Sumber / Catatan</Label>
                  <Input placeholder="Contoh: Website kampus, dokumen internal..." className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-10 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors" />
                </TextField>
              </Modal.Body>
              <Modal.Footer className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setIsManualOpen(false)} isDisabled={manualCreateMutation.isPending} className="cursor-pointer px-4 py-2 text-sm rounded-xl">
                  Batal
                </Button>
                <Button
                  onPress={handleManualSubmit}
                  isDisabled={!manualTitle.trim() || !manualDescription.trim() || manualCreateMutation.isPending}
                  className="cursor-pointer font-bold px-4 py-2 text-sm bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 rounded-xl flex items-center gap-2"
                >
                  {manualCreateMutation.isPending ? (
                    <>
                      <Spinner size={18} className="animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Dataset"
                  )}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <Modal.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
          <Modal.Container>
            <Modal.Dialog className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full outline-none">
              <Modal.Header>
                <Modal.Heading className="text-lg font-bold text-red-600 dark:text-red-400">Konfirmasi Hapus</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="mt-2 text-sm text-neutral-500">
                Apakah Anda yakin ingin menghapus berkas <strong>{deleteTarget?.name}</strong>? Seluruh chunk teks dan representasi vektor RAG dari file ini akan dihapus permanen.
              </Modal.Body>
              <Modal.Footer className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="cursor-pointer px-4 py-2 text-sm rounded-xl">
                  Batal
                </Button>
                <Button
                  onPress={handleDeleteSubmit}
                  isDisabled={deleteMutation.isPending}
                  className="cursor-pointer font-bold px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-xl flex items-center gap-2"
                >
                  {deleteMutation.isPending && <Spinner size={18} className="animate-spin" />}
                  Hapus
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </PortalLayout>
  );
}
