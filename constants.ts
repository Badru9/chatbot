import { Research, Role } from "./lib/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const researchData: Research[] = [
  {
    id: 396,
    tr_pengusulan_id: 308,
    tahap: "1",
    dokumen_pengajuan: null,
    biaya: "2500000",
    validasi_staf_lppm: 1,
    validasi_lppm: 1,
    validasi_rektor: 1,
    status: 1,
    tanggal: "2026-07-01",
    catatan: null,
    slip: "2026-07-04 10:06:00",
    created_at: "2026-06-21T04:59:44.000000Z",
    updated_at: "2026-07-06T09:06:25.000000Z",
    jenis: "PENELITIAN",
    judul:
      "Generative Intelligence Chatbot Untuk Perguruan Tinggi Berbasis Model Transformer",
    rencana_luaran:
      "Penelitian yang hasilnnya disajikan dalam diterbitkan pada artikel pada Jurnal Nasional terakreditasi peringkat 2",
    dana_internal: 5000000,
    nama_dosen: "Kacung Napitupulu",
    jenis_pencairan: "Dana Awal",
  },
  {
    id: 393,
    tr_pengusulan_id: 337,
    tahap: "1",
    dokumen_pengajuan: null,
    biaya: "2500000",
    validasi_staf_lppm: 1,
    validasi_lppm: 1,
    validasi_rektor: 1,
    status: 1,
    tanggal: "2026-06-19",
    catatan: null,
    slip: "2026-06-22 16:04:00",
    created_at: "2026-06-09T12:38:53.000000Z",
    updated_at: "2026-06-23T08:58:54.000000Z",
    jenis: "PENELITIAN",
    judul:
      "A Bilingual Academic Chatbot Based on Semantic Retrieval Using m-BERT",
    rencana_luaran:
      "Penelitian yang hasilnnya disajikan dalam diterbitkan pada artikel pada Jurnal Nasional terakreditasi peringkat 2",
    dana_internal: 5000000,
    nama_dosen: "Kacung Napitupulu",
    jenis_pencairan: "Dana Awal",
  },
  {
    id: 211,
    tr_pengusulan_id: 211,
    tahap: "1",
    dokumen_pengajuan: null,
    biaya: "2500000",
    validasi_staf_lppm: 1,
    validasi_lppm: 1,
    validasi_rektor: 1,
    status: 1,
    tanggal: "2024-12-23",
    catatan: null,
    slip: "2026-01-30 10:56:00",
    created_at: "2024-12-12T06:43:44.000000Z",
    updated_at: "2026-01-30T03:56:13.000000Z",
    jenis: "PENELITIAN",
    judul:
      "Plant Disease Detection Using Digital Image Processing : \nOpportunities and challenges",
    rencana_luaran:
      "Penelitian yang hasilnnya disajikan dalam diterbitkan pada artikel pada Jurnal Nasional terakreditasi peringkat 2",
    dana_internal: 5000000,
    nama_dosen: "Kacung Napitupulu",
    jenis_pencairan: "Dana Awal",
  },
  {
    id: 307,
    tr_pengusulan_id: 211,
    tahap: "2",
    dokumen_pengajuan: null,
    biaya: "2500000",
    validasi_staf_lppm: 1,
    validasi_lppm: 1,
    validasi_rektor: 1,
    status: 1,
    tanggal: "2025-11-21",
    catatan: null,
    slip: "2026-01-30 10:56:00",
    created_at: "2025-11-11T14:38:17.000000Z",
    updated_at: "2026-01-30T03:56:25.000000Z",
    jenis: "PENELITIAN",
    judul:
      "Plant Disease Detection Using Digital Image Processing : \nOpportunities and challenges",
    rencana_luaran:
      "Penelitian yang hasilnnya disajikan dalam diterbitkan pada artikel pada Jurnal Nasional terakreditasi peringkat 2",
    dana_internal: 5000000,
    nama_dosen: "Kacung Napitupulu",
    jenis_pencairan: "Sisa Dana",
  },
  {
    id: 318,
    tr_pengusulan_id: 292,
    tahap: "1",
    dokumen_pengajuan: null,
    biaya: "1750000",
    validasi_staf_lppm: 1,
    validasi_lppm: 1,
    validasi_rektor: 1,
    status: 1,
    tanggal: "2026-01-19",
    catatan: null,
    slip: "2026-01-30 10:48:00",
    created_at: "2026-01-12T04:03:11.000000Z",
    updated_at: "2026-01-30T03:48:23.000000Z",
    jenis: "PENELITIAN",
    judul: "Object Detection on Analog Water Meters Using Region-Based CNN",
    rencana_luaran:
      "Penelitian yang hasilnnya disajikan dalam Temu Ilmiah Internasional dengan luaran minimal prosiding bereputasi",
    dana_internal: 3500000,
    nama_dosen: "Kacung Napitupulu",
    jenis_pencairan: "Dana Awal",
  },
  {
    id: 321,
    tr_pengusulan_id: 292,
    tahap: "2",
    dokumen_pengajuan: null,
    biaya: "1750000",
    validasi_staf_lppm: 1,
    validasi_lppm: 1,
    validasi_rektor: 1,
    status: 1,
    tanggal: "2026-01-30",
    catatan: null,
    slip: "2026-01-30 10:39:00",
    created_at: "2026-01-13T06:16:54.000000Z",
    updated_at: "2026-01-30T03:39:55.000000Z",
    jenis: "PENELITIAN",
    judul: "Object Detection on Analog Water Meters Using Region-Based CNN",
    rencana_luaran:
      "Penelitian yang hasilnnya disajikan dalam Temu Ilmiah Internasional dengan luaran minimal prosiding bereputasi",
    dana_internal: 3500000,
    nama_dosen: "Kacung Napitupulu",
    jenis_pencairan: "Sisa Dana",
  },
];

export const QUERY_KEYS = {
  documents: ["documents"] as const,
  auth: ["auth"] as const,
  research: ["research-data"] as const,
  users: ["users"] as const,
  sessions: ["sessions"] as const,
} as const;

export const SESSIONS_STORAGE_KEY = "mbai.chat.sessions.v1" as const;

export const CONTENT_TYPE = {
  multipart: "multipart/form-data",
  application: "application/json",
} as const;

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const fallbackUser = {
  name: "Kacung Napitupulu",
  role: "dosen" as Role,
  image: "/avatar.jpg",
};
