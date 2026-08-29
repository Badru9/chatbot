"use client";

import { useSession } from "@/lib/auth-client";
import {
  ArrowLeft,
  CaretRight,
  List,
  ShieldCheck,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardTopbarProps {
  onOpenMobile: () => void;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Overview",
    subtitle: "Ringkasan sistem, statistik layanan, dan status AI",
  },
  "/dashboard/menus": {
    title: "Menu Portal Akademik",
    subtitle: "Atur daftar menu layanan portal dosen dan visibilitas role",
  },
  "/dashboard/datasets": {
    title: "Dataset AI & Regulasi",
    subtitle: "Kelola dokumen pedoman, SK, dan pengetahuan RAG asisten AI",
  },
  "/dashboard/users": {
    title: "Kelola Akun Pengguna",
    subtitle: "Daftar akun dosen dan administrator sistem",
  },
  "/dashboard/settings": {
    title: "Pengaturan Model AI",
    subtitle: "Konfigurasi provider Gemini & Ollama serta aturan fallback",
  },
};

export default function DashboardTopbar({ onOpenMobile }: DashboardTopbarProps) {
  const pathname = usePathname();
  const { user } = useSession();

  const currentPage = PAGE_TITLES[pathname] || {
    title: "Dashboard",
    subtitle: "Area administrasi portal",
  };

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          aria-label="Buka Menu"
        >
          <List size={22} />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
            <span>Admin</span>
            <CaretRight size={12} />
          </div>
          <h1 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white truncate">
            {currentPage.title}
          </h1>
        </div>
      </div>

      {/* Right: Quick back to portal & user status */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors shadow-xs"
        >
          <ArrowLeft size={15} weight="bold" />
          <span className="hidden sm:inline">Kembali ke Portal</span>
          <span className="sm:hidden">Portal</span>
        </Link>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#EDF3EC] text-[#346538] dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
          <ShieldCheck size={13} weight="fill" />
          <span>{user?.role === "admin" ? "Admin Access" : "Authorized"}</span>
        </div>
      </div>
    </header>
  );
}
