"use client";

import {
  Books,
  CaretRight,
  CircleNotch,
  Cpu,
  ListPlus,
  Users,
} from "@phosphor-icons/react";
import Link from "next/link";

interface StatCardsProps {
  totalMenus: number;
  totalDatasets: number;
  activeDatasets: number;
  totalUsers: number;
  totalDosen: number;
  aiProvider: string;
  aiPrimaryModel: string;
  isLoading?: boolean;
}

export default function StatCards({
  totalMenus,
  totalDatasets,
  activeDatasets,
  totalUsers,
  totalDosen,
  aiProvider,
  aiPrimaryModel,
  isLoading,
}: StatCardsProps) {
  const stats = [
    {
      title: "Menu Portal",
      value: totalMenus,
      subtext: "Layanan aktif di portal",
      icon: ListPlus,
      href: "/dashboard/menus",
      accent: "bg-[#E1F3FE] text-[#1F6C9F] dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/40",
    },
    {
      title: "Dataset AI & RAG",
      value: `${activeDatasets} / ${totalDatasets}`,
      subtext: "Dokumen referensi aktif",
      icon: Books,
      href: "/dashboard/datasets",
      accent: "bg-[#EDF3EC] text-[#346538] dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40",
    },
    {
      title: "Pengguna Terdaftar",
      value: totalUsers,
      subtext: `${totalDosen} Akun Dosen`,
      icon: Users,
      href: "/dashboard/users",
      accent: "bg-[#F7F0FA] text-[#6B3BA6] dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40",
    },
    {
      title: "AI Engine Aktif",
      value: aiProvider.toUpperCase(),
      subtext: aiPrimaryModel || "Gemini Flash",
      icon: Cpu,
      href: "/dashboard/settings",
      accent: "bg-[#FBF3DB] text-[#956400] dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;

        return (
          <Link
            key={idx}
            href={stat.href}
            className="group relative p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {stat.title}
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.accent}`}
              >
                <Icon size={18} weight="bold" />
              </div>
            </div>

            <div className="mt-4 mb-2">
              {isLoading ? (
                <div className="flex items-center gap-2 text-neutral-400">
                  <CircleNotch size={18} className="animate-spin" />
                  <span className="text-xs font-medium">Memuat...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                  {stat.value}
                </p>
              )}
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-normal">
                {stat.subtext}
              </p>
            </div>

            <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] font-medium text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
              <span>Buka modul</span>
              <CaretRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
