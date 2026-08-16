"use client";

import { type DocumentData } from "@/services/documentService";
import {
  Button,
  Input,
  Label,
  Modal,
  Spinner,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import {
  DownloadSimpleIcon,
  FilePdfIcon,
  FileTextIcon,
} from "@phosphor-icons/react";
import React from "react";
import { downloadTemplate } from "../utils/format";

/* ------------------------------------------------------------------ */
/*  Upload PDF Modal                                                   */
/* ------------------------------------------------------------------ */

interface UploadModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function UploadModal({
  isOpen,
  onOpenChange,
  selectedFile,
  onFileChange,
  onSubmit,
  isPending,
}: UploadModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
                Pilih file PDF pendukung RAG. Sistem akan membaca, membuat
                potongan teks (chunking), menghitung representasi vektor
                (embedding 384 dimensi), dan menyimpannya di database
                PostgreSQL.
              </p>
              <div className="flex flex-col gap-2 mt-2">
                <label
                  htmlFor="admin-pdf-upload"
                  className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition"
                >
                  <FilePdfIcon
                    size={36}
                    weight="duotone"
                    className="text-neutral-400"
                  />
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                    Klik untuk memilih file PDF
                  </span>
                  <span className="text-xs text-neutral-400">
                    Format: .pdf (Maksimal 5 MB)
                  </span>
                  <input
                    id="admin-pdf-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={onFileChange}
                    className="hidden"
                    disabled={isPending}
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
                isDisabled={!selectedFile || isPending}
                className="cursor-pointer font-bold px-4 py-2 text-sm bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 rounded-xl flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <Spinner size={"sm"} className="animate-spin" />
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
  );
}

/* ------------------------------------------------------------------ */
/*  Manual Input Modal                                                 */
/* ------------------------------------------------------------------ */

interface ManualModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  source: string;
  onSourceChange: (value: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function ManualModal({
  isOpen,
  onOpenChange,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  source,
  onSourceChange,
  onSubmit,
  isPending,
}: ManualModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
        <Modal.Container size="lg">
          <Modal.Dialog className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 outline-none">
            <Modal.Header>
              <Modal.Heading className="text-xl font-bold text-neutral-900 dark:text-white">
                Tambah Dataset Manual
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="gap-4 mt-4 space-y-3">
              <p className="text-sm text-neutral-500">
                Masukkan informasi dataset secara manual tanpa mengunggah file.
                Dataset ini akan menjadi pengetahuan umum AI dan selalu
                digunakan.
              </p>
              <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3.5 text-xs text-neutral-600 dark:text-neutral-300 flex flex-col gap-2.5">
                <div>
                  <span className="font-bold block mb-0.5 text-neutral-900 dark:text-white">
                    💡 Unduh Template Dataset & Tips Format:
                  </span>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Anda dapat mengunduh berkas template, menyesuaikan isinya di
                    komputer Anda, lalu menempelkan isinya ke dalam kotak{" "}
                    <strong>Deskripsi</strong> di bawah.
                  </p>
                </div>
                <div className="pt-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      downloadTemplate(
                        "template-dataset.txt",
                        "/templates/template-dataset.txt",
                      )
                    }
                    className="cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-2 hover:border-neutral-400 dark:hover:border-neutral-500 transition shadow-xs"
                  >
                    <FileTextIcon size={16} className="text-emerald-500" />
                    Unduh Template Dataset (.txt)
                    <DownloadSimpleIcon
                      size={14}
                      className="ml-1 text-neutral-400"
                    />
                  </Button>
                </div>
                <details className="mt-1 cursor-pointer">
                  <summary className="font-semibold text-neutral-900 dark:text-white hover:underline focus:outline-none">
                    Contoh Format JSON Dosen (Pratinjau)
                  </summary>
                  <pre className="mt-1 p-2 bg-neutral-100 dark:bg-neutral-900 rounded overflow-x-auto text-[10px] leading-tight font-mono select-all border border-neutral-200/60 dark:border-neutral-800">
                    {`[
  {
    "nama": "Dr. Eko Prasetyo, M.T.",
    "nidn": "0415088201",
    "prodi": "Teknik Informatika",
    "status": "Aktif",
    "bidang_keahlian": ["Cyber Security", "Network"],
    "tujuan_penggunaan": "Referensi bimbingan dan keahlian dosen.",
    "kontak": "eko.prasetyo@univ.ac.id"
  }
]`}
                  </pre>
                </details>
              </div>
              <TextField
                value={title}
                onChange={onTitleChange}
                isRequired
                className="w-full flex flex-col gap-1.5"
              >
                <Label className="text-xs text-neutral-500 font-medium">
                  Judul Dataset
                </Label>
                <Input
                  placeholder="Contoh: Pedoman Penulisan Skripsi 2025"
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-10 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
              </TextField>
              <TextField
                value={description}
                onChange={onDescriptionChange}
                isRequired
                className="w-full flex flex-col gap-1.5"
              >
                <Label className="text-xs text-neutral-500 font-medium">
                  Deskripsi
                </Label>
                <TextArea
                  placeholder="Jelaskan isi dataset, tujuan penggunaan, atau ringkasan konten..."
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-20 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
              </TextField>
              <TextField
                value={source}
                onChange={onSourceChange}
                className="w-full flex flex-col gap-1.5"
              >
                <Label className="text-xs text-neutral-500 font-medium">
                  Sumber / Catatan
                </Label>
                <Input
                  placeholder="Contoh: Website kampus, dokumen internal..."
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-10 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
              </TextField>
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
                isDisabled={!title.trim() || !description.trim() || isPending}
                className="cursor-pointer font-bold px-4 py-2 text-sm bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 rounded-xl flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <Spinner size={"sm"} className="animate-spin" />
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
  );
}

/* ------------------------------------------------------------------ */
/*  Delete Confirmation Modal                                          */
/* ------------------------------------------------------------------ */

interface DeleteModalProps {
  deleteTarget: DocumentData | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function DeleteModal({
  deleteTarget,
  onOpenChange,
  onSubmit,
  isPending,
}: DeleteModalProps) {
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
              Apakah Anda yakin ingin menghapus berkas{" "}
              <strong>{deleteTarget?.name}</strong>? Seluruh chunk teks dan
              representasi vektor RAG dari file ini akan dihapus permanen.
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
