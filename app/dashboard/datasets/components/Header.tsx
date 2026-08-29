"use client";

import { Button } from "@heroui/react";
import { PlusIcon } from "@phosphor-icons/react";

interface HeaderProps {
  onOpenCreateModal: () => void;
}

export default function Header({ onOpenCreateModal }: HeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
          Basis Pengetahuan & Dataset AI
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Kelola dokumen pedoman, data dosen, dan basis aturan yang digunakan sebagai konteks RAG
        </p>
      </div>

      <Button
        onClick={onOpenCreateModal}
        className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-bold flex items-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] transition-transform rounded-xl px-4 py-2 text-sm self-start sm:self-auto"
      >
        <PlusIcon size={18} weight="bold" />
        Tambah Dataset Sistem
      </Button>
    </div>
  );
}
