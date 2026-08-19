"use client";

import React from "react";
import PortalLayout from "../../(portal)/layout";
import { Button } from "@heroui/react";
import { ArrowLeft, Shield } from "@phosphor-icons/react";
import Link from "next/link";

export default function AdminUsersPage() {
  return (
    <PortalLayout>
      <div className="w-full max-w-3xl flex flex-col gap-6 mt-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              isIconOnly
              variant="ghost"
              className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              Portal / Admin
            </p>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Kelola Akun User
            </h1>
          </div>
        </div>
        <div className="p-12 border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl flex flex-col items-center justify-center gap-4 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200/60 dark:border-neutral-700/60 text-neutral-900 dark:text-white">
            <Shield size={32} weight="duotone" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Panel Admin: Pengelolaan User
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md text-sm leading-relaxed font-normal">
            Halaman khusus admin untuk menambahkan, mengedit, atau menghapus
            data Kacung Napitupulu dan hak akses.
          </p>
        </div>
      </div>
    </PortalLayout>
  );
}
