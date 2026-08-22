"use client";

import { Button } from "@heroui/react";
import { ArrowLeftIcon, PlusIcon } from "@phosphor-icons/react";
import Link from "next/link";

interface HeaderProps {
  onOpenCreateModal: () => void;
}

export default function Header({ onOpenCreateModal }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button
            isIconOnly
            variant="ghost"
            className="rounded-full cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <ArrowLeftIcon size={20} />
          </Button>
        </Link>
        <div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            Portal / Admin
          </p>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Basis Pengetahuan & Dataset AI
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={onOpenCreateModal}
          className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-bold flex items-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] transition-transform rounded-xl px-4 py-2 text-sm"
        >
          <PlusIcon size={18} weight="bold" />
          Tambah Dataset Sistem
        </Button>
      </div>
    </div>
  );
}
