"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@heroui/react";
import {
  FilePdfIcon,
  TrashIcon,
  EyeIcon,
  CaretLeftIcon,
  CaretRightIcon,
  PlusIcon,
  ArrowsOutIcon,
  ArrowsInIcon,
  XIcon,
  SpinnerIcon,
} from "@phosphor-icons/react";

// Lazy-load PDF components with SSR disabled to avoid DOMMatrix issue
const PdfDocument = dynamic(
  () =>
    import("react-pdf").then((mod) => {
      // Configure PDF.js worker using CDN (avoids bundler issues)
      mod.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`;
      return mod.Document;
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-150 w-153 items-center justify-center rounded bg-[#1a1a1a]">
        <SpinnerIcon className="animate-spin text-white/40" size={24} />
      </div>
    ),
  },
);
const PdfPage = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import type { SidebarLibraryFile } from "./ChatSidebar";
import UploadFileModal from "./UploadFileModal";

/* ------------------------------------------------------------------ */
/*  Storage Constants                                                  */
/* ------------------------------------------------------------------ */

const LIBRARY_STORAGE_KEY = "mbai.library.files.v2";
const BLOBS_DB_NAME = "mbai.pdfBlobs";
const BLOBS_STORE_NAME = "blobs";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface LibraryFile extends SidebarLibraryFile {
  chunksCount?: number;
}

/* ------------------------------------------------------------------ */
/*  IndexedDB for PDF Blobs                                            */
/* ------------------------------------------------------------------ */

function openBlobsDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(BLOBS_DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(BLOBS_STORE_NAME)) {
        db.createObjectStore(BLOBS_STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

async function saveBlob(file: LibraryFile, blob: Blob): Promise<void> {
  const db = await openBlobsDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BLOBS_STORE_NAME, "readwrite");
    const store = tx.objectStore(BLOBS_STORE_NAME);
    const request = store.put({ id: file.id, blob });
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

async function getBlob(fileId: string): Promise<Blob | null> {
  const db = await openBlobsDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BLOBS_STORE_NAME, "readonly");
    const store = tx.objectStore(BLOBS_STORE_NAME);
    const request = store.get(fileId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result?.blob ?? null);
  });
}

async function deleteBlob(fileId: string): Promise<void> {
  const db = await openBlobsDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BLOBS_STORE_NAME, "readwrite");
    const store = tx.objectStore(BLOBS_STORE_NAME);
    const request = store.delete(fileId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/* ------------------------------------------------------------------ */
/*  LocalStorage Helpers (same as Chatbot)                             */
/* ------------------------------------------------------------------ */

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

function saveLibraryFiles(files: LibraryFile[]): void {
  localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(files));
}

function loadLibraryFiles(): LibraryFile[] {
  return safeParse<LibraryFile[]>(
    localStorage.getItem(LIBRARY_STORAGE_KEY),
    [],
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(timestamp);

const PDF_ZOOM_STEPS = [400, 520, 640, 760, 880] as const;

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

/* ------------------------------------------------------------------ */
/*  PDF Viewer Modal                                                   */
/* ------------------------------------------------------------------ */

function PDFViewerModal({
  fileId,
  fileName,
  isOpen,
  onClose,
}: {
  fileId: string | null;
  fileName: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomIndex, setZoomIndex] = useState(1);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !fileId) {
      // Valid cleanup for modal - fileId changed, reset state
      setBlob(null);
      setLoading(true);
      return;
    }

    setLoading(true);
    setError(null);
    getBlob(fileId)
      .then((b) => {
        if (b) {
          setBlob(b);
        } else {
          setError("File PDF tidak ditemukan di storage lokal.");
        }
      })
      .catch(() => {
        setError("Gagal memuat file PDF.");
      })
      .finally(() => setLoading(false));
  }, [isOpen, fileId]);

  if (!isOpen) return null;

  const pdfWidth = PDF_ZOOM_STEPS[zoomIndex];

  const goNext = () => setCurrentPage((p) => Math.min(p + 1, numPages));
  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const zoomIn = () =>
    setZoomIndex((i) => Math.min(i + 1, PDF_ZOOM_STEPS.length - 1));
  const zoomOut = () => setZoomIndex((i) => Math.max(i - 1, 0));

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#1a1a1a]"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${fileName}`}
    >
      {/* Toolbar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#1a1a1a] px-4">
        <p className="min-w-0 truncate text-[14px] font-medium text-white/90">
          {fileName}
        </p>

        <div className="flex items-center gap-1">
          {/* Zoom */}
          <Button
            isIconOnly
            variant="ghost"
            onPress={zoomOut}
            isDisabled={zoomIndex === 0 || !!error || !!loading}
            className="size-9 rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Perkecil"
          >
            <ArrowsInIcon size={16} weight="bold" />
          </Button>
          <span className="min-w-12 text-center text-[12px] font-medium tabular-nums text-white/50">
            {loading ? "..." : `${Math.round((pdfWidth / 612) * 100)}%`}
          </span>
          <Button
            isIconOnly
            variant="ghost"
            onPress={zoomIn}
            isDisabled={
              zoomIndex === PDF_ZOOM_STEPS.length - 1 || !!error || !!loading
            }
            className="size-9 rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Perbesar"
          >
            <ArrowsOutIcon size={16} weight="bold" />
          </Button>

          <div className="mx-2 h-5 w-px bg-white/10" />

          {/* Navigation */}
          <Button
            isIconOnly
            variant="ghost"
            onPress={goPrev}
            isDisabled={currentPage <= 1 || !!error || !!loading}
            className="size-9 rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Halaman sebelumnya"
          >
            <CaretLeftIcon size={16} weight="bold" />
          </Button>
          <span className="min-w-20 text-center text-[13px] font-medium tabular-nums text-white/70">
            {loading ? "..." : `${currentPage} / ${numPages || "—"}`}
          </span>
          <Button
            isIconOnly
            variant="ghost"
            onPress={goNext}
            isDisabled={currentPage >= numPages || !!error || !!loading}
            className="size-9 rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Halaman berikutnya"
          >
            <CaretRightIcon size={16} weight="bold" />
          </Button>

          <div className="mx-2 h-5 w-px bg-white/10" />

          {/* Close */}
          <Button
            isIconOnly
            variant="ghost"
            onPress={onClose}
            className="size-9 rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Tutup preview"
          >
            <XIcon size={18} weight="bold" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto bg-[#2a2a2a]">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <SpinnerIcon className="animate-spin text-white/40" size={24} />
            <span className="ml-3 text-[14px] text-white/40">
              Memuat PDF...
            </span>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <span className="text-[14px] text-red-400">{error}</span>
          </div>
        ) : blob ? (
          <div className="mx-auto flex justify-center py-6">
            <PdfDocument
              file={blob}
              onLoadSuccess={({ numPages: n }: { numPages: number }) => {
                setNumPages(n);
                setCurrentPage(1);
              }}
              loading={
                <div className="flex h-150 w-153 items-center justify-center rounded bg-[#1a1a1a]">
                  <SpinnerIcon
                    className="animate-spin text-white/40"
                    size={24}
                  />
                </div>
              }
              error={
                <div className="flex h-100 w-153 items-center justify-center rounded bg-[#1a1a1a]">
                  <span className="text-[14px] text-red-400">
                    Gagal memuat PDF
                  </span>
                </div>
              }
            >
              <PdfPage
                pageNumber={currentPage}
                width={pdfWidth}
                className="shadow-2xl"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </PdfDocument>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  File Card                                                          */
/* ------------------------------------------------------------------ */

function FileCard({
  file,
  onDelete,
  onPreview,
}: {
  file: LibraryFile;
  onDelete: () => void;
  onPreview: () => void;
}) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-hairline bg-canvas shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md">
      {/* Preview area */}
      <button
        type="button"
        onClick={onPreview}
        className="flex h-40 items-center justify-center rounded-t-xl bg-surface-soft transition-colors duration-150 hover:bg-primary/5"
        aria-label={`Pratinjau ${file.name}`}
      >
        <div className="grid size-14 place-items-center rounded-2xl bg-red-50 text-red-500 transition-transform duration-200 group-hover:scale-105">
          <FilePdfIcon size={28} weight="fill" />
        </div>
      </button>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="min-h-10">
          <p
            className="line-clamp-2 text-[14px] font-semibold leading-[1.35] tracking-[-0.1px] text-ink"
            title={file.name}
          >
            {file.name}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[12px] leading-[1.35] text-muted-soft">
          <span>{formatBytes(file.size)}</span>
          <span className="text-muted-soft/40">&middot;</span>
          <span>{formatDate(file.uploadedAt)}</span>
          {typeof file.chunksCount === "number" && (
            <>
              <span className="text-muted-soft/40">&middot;</span>
              <span>{file.chunksCount} chunks</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-hairline px-4 py-2.5">
        {typeof file.chunksCount === "number" && file.chunksCount > 0 ? (
          <span className="inline-flex items-center rounded-full bg-success-badge-bg px-2 py-0.5 text-[11px] font-semibold text-success-badge-text">
            Ter-indexed
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-hairline-soft px-2 py-0.5 text-[11px] font-medium text-muted">
            RAG source
          </span>
        )}

        <div className="flex items-center gap-0.5">
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            onPress={onPreview}
            className="size-8 rounded-lg text-muted hover:bg-hairline-soft hover:text-ink active:scale-95"
            aria-label={`Pratinjau ${file.name}`}
          >
            <EyeIcon size={15} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            onPress={onDelete}
            className="size-8 rounded-lg text-muted hover:bg-red-50 hover:text-danger active:scale-95"
            aria-label={`Hapus ${file.name}`}
          >
            <TrashIcon size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function UploadLibrary() {
  const [libraryFiles, setLibraryFiles] = useState<LibraryFile[]>(() =>
    loadLibraryFiles(),
  );

  // Upload modal state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Preview state
  const [previewFile, setPreviewFile] = useState<LibraryFile | null>(null);

  // Sync to localStorage on changes
  useEffect(() => {
    saveLibraryFiles(libraryFiles);
  }, [libraryFiles]);

  // Handlers
  const handleUploadFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUploadFile(event.target.files?.[0] ?? null);
  };

  const handleUploadCancel = () => {
    setUploadFile(null);
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile || isUploading) return;

    setIsUploading(true);

    try {
      // Create file metadata (same as Chatbot)
      const newFile: LibraryFile = {
        id: createId(),
        name: uploadFile.name,
        size: uploadFile.size,
        type: uploadFile.type,
        uploadedAt: Date.now(),
      };

      // Save blob to IndexedDB
      await saveBlob(newFile, uploadFile);

      // Update localStorage
      setLibraryFiles((prev) => [newFile, ...prev]);

      setUploadFile(null);
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    // Remove from localStorage
    setLibraryFiles((prev) => prev.filter((file) => file.id !== fileId));

    // Remove blob from IndexedDB
    try {
      await deleteBlob(fileId);
    } catch (error) {
      console.error("Failed to delete blob:", error);
    }
  };

  return (
    <section className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-hairline bg-canvas px-6 py-4 sm:px-8 lg:px-10">
        <div>
          <h1 className="text-[20px] font-bold tracking-[-0.3px] text-ink">
            Library
          </h1>
          <p className="mt-0.5 text-[13px] leading-[1.4] text-muted-soft">
            {libraryFiles.length === 0
              ? "Belum ada file"
              : `${libraryFiles.length} file PDF`}
          </p>
        </div>
        {/* <Button
          onPress={() => setIsUploadModalOpen(true)}
          className="h-10 rounded-xl bg-[#111111] px-4 text-[13px] font-semibold text-white hover:bg-[#222] active:scale-[0.97]"
        >
          <PlusIcon size={16} weight="bold" />
          Upload PDF
        </Button> */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-surface-soft px-6 py-6 sm:px-8 lg:px-10">
        {libraryFiles.length === 0 ? (
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
            <Button
              onPress={() => setIsUploadModalOpen(true)}
              className="mt-6 h-10 rounded-xl bg-[#111111] px-5 text-[13px] font-semibold text-white hover:bg-[#222] active:scale-[0.97]"
            >
              <PlusIcon size={16} weight="bold" />
              Upload PDF
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {libraryFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDelete={() => handleDeleteFile(file.id)}
                onPreview={() => setPreviewFile(file)}
              />
            ))}
          </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      <PDFViewerModal
        fileId={previewFile?.id ?? null}
        fileName={previewFile?.name ?? ""}
        isOpen={previewFile !== null}
        onClose={() => setPreviewFile(null)}
      />

      {/* Upload Modal */}
      <UploadFileModal
        file={uploadFile}
        isOpen={isUploadModalOpen}
        isUploading={isUploading}
        onCancel={handleUploadCancel}
        onFileChange={handleUploadFileChange}
        onOpenChange={setIsUploadModalOpen}
        onSubmit={handleUploadSubmit}
      />
    </section>
  );
}
