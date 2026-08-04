import { MenuData } from "./lib/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export const fallbackMenus: MenuData[] = [
  {
    title: "Monitoring Kinerja",
    description:
      "Cek presensi, laporan harian, dan evaluasi mahasiswa dalam satu dashboard.",
    icon: "Monitor",
    href: "/monitoring",
    visibleToRoles: ["admin", "dosen"],
  },
  {
    title: "Pusat Dokumen",
    description:
      "Simpan PDF SK Mengajar, pedoman BKD, dan cari isi dokumen dengan AI.",
    icon: "Folder",
    href: "/documents",
    visibleToRoles: ["admin", "dosen"],
  },
  {
    title: "Bimbingan Mahasiswa",
    description:
      "Data mahasiswa bimbingan, konsultasi skripsi, persetujuan KRS, dan laporan magang.",
    icon: "Student",
    href: "/students",
    visibleToRoles: ["admin", "dosen"],
  },
  {
    title: "Katalog Penelitian",
    description:
      "Publikasi jurnal, prosiding konferensi, dan pengajuan hibah riset.",
    icon: "BookOpen",
    href: "/research",
    visibleToRoles: ["admin", "dosen"],
  },
  {
    title: "Profil Riset & SINTA",
    description:
      "Cek skor H-Index, publikasi Scopus, dan lacak portofolio penelitian Anda.",
    icon: "TrendUp",
    href: "/sinta",
    visibleToRoles: ["admin", "dosen"],
  },
];

/* ------------------------------------------------------------------ */
/*  React Query — Centralized Query Keys                               */
/* ------------------------------------------------------------------ */

export const QUERY_KEYS = {
  documents: ["documents"] as const,
} as const;

export const SESSIONS_STORAGE_KEY = "mbai.chat.sessions.v1" as const;

export const CONTENT_TYPE = {
  multipart: "multipart/form-data",
  application: "application/json",
} as const;
