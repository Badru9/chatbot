"use client";

import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import type { DatasetItem } from "@/services/datasetService";
import {
  Button,
  Chip,
  Input,
  Label,
  Modal,
  Spinner,
  Switch,
  TextArea,
  TextField,
} from "@heroui/react";
import {
  FileTextIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import React from "react";

/* ------------------------------------------------------------------ */
/*  Dataset Form Modal (Create / Edit)                                 */
/* ------------------------------------------------------------------ */

interface DatasetFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  name: string;
  onNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  content: string;
  onContentChange: (value: string) => void;
  source: string;
  onSourceChange: (value: string) => void;
  isActive: boolean;
  onIsActiveChange: (value: boolean) => void;
  onApplyTemplate: (templateName: "pedoman" | "dosen") => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function DatasetFormModal({
  isOpen,
  onOpenChange,
  isEditing,
  name,
  onNameChange,
  description,
  onDescriptionChange,
  content,
  onContentChange,
  source,
  onSourceChange,
  isActive,
  onIsActiveChange,
  onApplyTemplate,
  onSubmit,
  isPending,
}: DatasetFormModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
        <Modal.Container size="lg">
          <Modal.Dialog className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 max-h-[90vh] overflow-y-auto w-full max-w-2xl outline-none">
            <Modal.Header>
              <Modal.Heading className="text-xl font-bold text-neutral-900 dark:text-white">
                {isEditing ? "Edit Dataset Sistem" : "Tambah Dataset Sistem Baru"}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="gap-4 mt-3 space-y-3">
              <p className="text-xs text-neutral-500">
                Dataset ini akan disimpan ke basis pengetahuan sistem dan otomatis dimasukkan ke dalam prompt AI untuk menjawab pertanyaan pengguna.
              </p>

              {/* Template Buttons */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-600 dark:text-neutral-300 flex flex-col gap-2">
                <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <SparkleIcon size={16} className="text-amber-500" />
                  Isi Cepat dari Template:
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onApplyTemplate("pedoman")}
                    className="cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:border-neutral-400"
                  >
                    <FileTextIcon size={14} className="text-blue-500" />
                    Template Pedoman Skripsi (Markdown)
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onApplyTemplate("dosen")}
                    className="cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:border-neutral-400"
                  >
                    <FileTextIcon size={14} className="text-emerald-500" />
                    Template Data Dosen (JSON)
                  </Button>
                </div>
              </div>

              <TextField
                value={name}
                onChange={onNameChange}
                isRequired
                className="w-full flex flex-col gap-1"
              >
                <Label className="text-xs text-neutral-500 font-semibold">
                  Nama Dataset
                </Label>
                <Input
                  placeholder="Contoh: Pedoman Penulisan Skripsi & Tugas Akhir 2026"
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-10 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
              </TextField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextField
                  value={source}
                  onChange={onSourceChange}
                  className="w-full flex flex-col gap-1"
                >
                  <Label className="text-xs text-neutral-500 font-semibold">
                    Sumber / Rujukan
                  </Label>
                  <Input
                    placeholder="Contoh: Buku Pedoman LPPM 2026"
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-10 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                  />
                </TextField>

                <TextField
                  value={description}
                  onChange={onDescriptionChange}
                  className="w-full flex flex-col gap-1"
                >
                  <Label className="text-xs text-neutral-500 font-semibold">
                    Deskripsi Ringkas
                  </Label>
                  <Input
                    placeholder="Contoh: Aturan bimbingan, syarat SKS, dan alur sidang"
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-10 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                  />
                </TextField>
              </div>

              <TextField
                value={content}
                onChange={onContentChange}
                isRequired
                className="w-full flex flex-col gap-1"
              >
                <Label className="text-xs text-neutral-500 font-semibold">
                  Konten Lengkap Dataset (Teks, Markdown, atau JSON)
                </Label>
                <TextArea
                  rows={8}
                  placeholder="Ketik atau tempel isi pedoman, aturan, atau data terstruktur di sini..."
                  className="w-full font-mono text-xs px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-36 outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
              </TextField>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Status Aktif (Digunakan dalam Prompt AI)
                </span>
                <Switch
                  size="sm"
                  isSelected={isActive}
                  onChange={onIsActiveChange}
                  aria-label="Status aktif dataset"
                />
              </div>
            </Modal.Body>
            <Modal.Footer className="flex justify-end gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                isDisabled={isPending}
                className="cursor-pointer px-4 py-2 text-sm rounded-xl"
              >
                Batal
              </Button>
              <Button
                onPress={onSubmit}
                isDisabled={!name.trim() || !content.trim() || isPending}
                className="cursor-pointer font-bold px-4 py-2 text-sm bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 rounded-xl flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <Spinner size={"sm"} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : isEditing ? (
                  "Perbarui Dataset"
                ) : (
                  "Simpan Dataset"
                )}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Dataset Preview Modal                                              */
/* ------------------------------------------------------------------ */

interface DatasetPreviewModalProps {
  previewTarget: DatasetItem | null;
  onOpenChange: (open: boolean) => void;
}

export function DatasetPreviewModal({
  previewTarget,
  onOpenChange,
}: DatasetPreviewModalProps) {
  return (
    <Modal isOpen={previewTarget !== null} onOpenChange={onOpenChange}>
      <Modal.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
        <Modal.Container size="lg">
          <Modal.Dialog className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 max-h-[85vh] overflow-y-auto w-full max-w-2xl outline-none">
            <Modal.Header>
              <div className="flex items-center justify-between w-full">
                <Modal.Heading className="text-xl font-bold text-neutral-900 dark:text-white">
                  {previewTarget?.name}
                </Modal.Heading>
                <Chip
                  size="sm"
                  variant="soft"
                  className={
                    previewTarget?.isActive
                      ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-semibold"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-semibold"
                  }
                >
                  {previewTarget?.isActive ? "Status: Aktif" : "Status: Nonaktif"}
                </Chip>
              </div>
            </Modal.Header>
            <Modal.Body className="mt-3 space-y-4">
              {previewTarget?.source && (
                <div className="text-xs text-neutral-500 font-medium">
                  <strong>Sumber:</strong> {previewTarget.source}
                </div>
              )}
              {previewTarget?.description && (
                <div className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/40 p-2.5 rounded-lg border border-neutral-200/50 dark:border-neutral-700/50">
                  {previewTarget.description}
                </div>
              )}
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Konten Dataset:
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert bg-neutral-50 dark:bg-neutral-850 p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-800 overflow-x-auto">
                  <MarkdownRenderer content={previewTarget?.content || ""} />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="flex justify-end mt-6">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="cursor-pointer px-4 py-2 text-sm rounded-xl"
              >
                Tutup
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Delete Dataset Confirmation Modal                                  */
/* ------------------------------------------------------------------ */

interface DeleteDatasetModalProps {
  deleteTarget: DatasetItem | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function DeleteDatasetModal({
  deleteTarget,
  onOpenChange,
  onSubmit,
  isPending,
}: DeleteDatasetModalProps) {
  return (
    <Modal isOpen={deleteTarget !== null} onOpenChange={onOpenChange}>
      <Modal.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
        <Modal.Container>
          <Modal.Dialog className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full outline-none">
            <Modal.Header>
              <Modal.Heading className="text-lg font-bold text-red-600 dark:text-red-400">
                Konfirmasi Hapus
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="mt-2 text-sm text-neutral-500">
              Apakah Anda yakin ingin menghapus dataset{" "}
              <strong>{deleteTarget?.name}</strong>? Dataset ini tidak akan lagi digunakan oleh AI saat merespon pengguna.
            </Modal.Body>
            <Modal.Footer className="flex justify-end gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="cursor-pointer px-4 py-2 text-sm rounded-xl"
              >
                Batal
              </Button>
              <Button
                onPress={onSubmit}
                isDisabled={isPending}
                className="cursor-pointer font-bold px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-xl flex items-center gap-2"
              >
                {isPending && <Spinner size={"sm"} className="animate-spin" />}
                Hapus
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
