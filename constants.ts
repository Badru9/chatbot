import { MenuData } from "./lib/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export const fallbackMenus: MenuData[] = [
  {
    title: "Monitoring Kinerja",
    description:
      "Pantau kinerja dosen, presensi kehadiran, laporan kerja harian, serta evaluasi mahasiswa.",
    icon: "Monitor",
    href: "/monitoring",
    visibleToRoles: ["admin", "dosen"],
  },
  {
    title: "Manajemen Dokumen",
    description:
      "Unggah, kelola, serta verifikasi berbagai berkas administrasi dan dokumen PDF pendukung.",
    icon: "Folder",
    href: "/documents",
    visibleToRoles: ["admin", "dosen"],
  },
  {
    title: "Bimbingan Mahasiswa",
    description:
      "Akses data mahasiswa bimbingan akademik, laporan magang, konsultasi skripsi, dan KRS.",
    icon: "Student",
    href: "/students",
    visibleToRoles: ["admin", "dosen"],
  },
  {
    title: "Katalog Penelitian",
    description:
      "Manajemen publikasi jurnal ilmiah, prosiding konferensi, hibah penelitian internal & eksternal.",
    icon: "BookOpen",
    href: "/research",
    visibleToRoles: ["admin", "dosen"],
  },
  {
    title: "Portal SINTA",
    description:
      "Integrasi dan sinkronisasi otomatis skor SINTA, Scopus, Google Scholar, dan H-index.",
    icon: "TrendUp",
    href: "/sinta",
    visibleToRoles: ["admin", "dosen"],
  },
];
