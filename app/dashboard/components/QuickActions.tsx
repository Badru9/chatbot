"use client";

import {
  Books,
  ListPlus,
  Sliders,
  Sparkle,
  UserPlus,
} from "@phosphor-icons/react";
import Link from "next/link";

export default function QuickActions() {
  const actions = [
    {
      title: "Tambah Menu Portal",
      description: "Buat shortcut layanan akademik baru untuk dosen",
      icon: ListPlus,
      href: "/dashboard/menus",
      badge: "Menu",
      badgeStyle: "bg-[#E1F3FE] text-[#1F6C9F] dark:bg-sky-950/50 dark:text-sky-300",
    },
    {
      title: "Unggah Dataset AI",
      description: "Tambahkan dokumen pedoman SK / data referensi baru",
      icon: Books,
      href: "/dashboard/datasets",
      badge: "Knowledge",
      badgeStyle: "bg-[#EDF3EC] text-[#346538] dark:bg-emerald-950/50 dark:text-emerald-300",
    },
    {
      title: "Tambah Akun Dosen",
      description: "Daftarkan akun dosen atau admin baru ke sistem",
      icon: UserPlus,
      href: "/dashboard/users",
      badge: "Auth",
      badgeStyle: "bg-[#F7F0FA] text-[#6B3BA6] dark:bg-purple-950/50 dark:text-purple-300",
    },
    {
      title: "Pengaturan Model AI",
      description: "Ganti provider Gemini / Ollama dan kelola fallback",
      icon: Sliders,
      href: "/dashboard/settings",
      badge: "Config",
      badgeStyle: "bg-[#FBF3DB] text-[#956400] dark:bg-amber-950/50 dark:text-amber-300",
    },
  ];

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
            <Sparkle size={16} weight="fill" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Pintasan Aksi Cepat
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
              Akses langsung ke formulir dan konfigurasi utama
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <Link
              key={i}
              href={act.href}
              className="group p-3.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-850/50 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-800 dark:text-neutral-200 shrink-0 group-hover:scale-95 transition-transform">
                <Icon size={16} weight="bold" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-semibold text-neutral-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-colors truncate">
                    {act.title}
                  </h3>
                  <span
                    className={`text-[9px] font-mono font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${act.badgeStyle} shrink-0`}
                  >
                    {act.badge}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1 font-normal">
                  {act.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
