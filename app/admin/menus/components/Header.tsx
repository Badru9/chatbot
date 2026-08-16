"use client";

import { Button } from "@heroui/react";
import { ArrowLeft, Plus } from "@phosphor-icons/react";
import Link from "next/link";

interface HeaderProps {
  onAdd: () => void;
}

export default function Header({ onAdd }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button
            isIconOnly
            variant="ghost"
            className="rounded-full cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            Portal / Admin
          </p>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Kelola Menu Portal
          </h1>
        </div>
      </div>
      <Button
        onClick={onAdd}
        className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-bold flex items-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] transition-transform rounded-xl px-4 py-2 text-sm"
      >
        <Plus size={18} weight="bold" />
        Tambah Menu
      </Button>
    </div>
  );
}
