import { Research } from "@/lib/types";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ValidationStatus } from "@prisma/client";
import { v7 as uuid } from "uuid";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const researchData: Research[] = [
  {
    id: uuid(),
    tr_pengusulan_id: uuid(),
    tahap: "1",
    dokumen_pengajuan: null,
    biaya: "2500000",
    validasi_staf_lppm: "APPROVED" as ValidationStatus,
    validasi_lppm: "APPROVED" as ValidationStatus,
    validasi_rektor: "APPROVED" as ValidationStatus,
    status: 1,
    tanggal: "2026-07-01T00:00:00.000Z",
    catatan: null,
    slip: "2026-07-04T10:06:00.000Z",
    created_at: "2026-06-21T04:59:44.000Z",
    updated_at: "2026-07-06T09:06:25.000Z",
    jenis: "PENELITIAN",
    judul:
      "Generative Intelligence Chatbot Untuk Perguruan Tinggi Berbasis Model Transformer",
    rencana_luaran:
      "Penelitian yang hasilnnya disajikan dalam diterbitkan pada artikel pada Jurnal Nasional terakreditasi peringkat 2",
    dana_internal: 5000000,
    nama_dosen: "Dummy User",
    jenis_pencairan: "Dana Awal",
  },
  {
    id: uuid(),
    tr_pengusulan_id: uuid(),
    tahap: "1",
    dokumen_pengajuan: null,
    biaya: "2500000",
    validasi_staf_lppm: "APPROVED" as ValidationStatus,
    validasi_lppm: "APPROVED" as ValidationStatus,
    validasi_rektor: "APPROVED" as ValidationStatus,
    status: 1,
    tanggal: "2026-06-19T00:00:00.000Z",
    catatan: null,
    slip: "2026-06-22T16:04:00.000Z",
    created_at: "2026-06-09T12:38:53.000Z",
    updated_at: "2026-06-23T08:58:54.000Z",
    jenis: "PENELITIAN",
    judul:
      "A Bilingual Academic Chatbot Based on Semantic Retrieval Using m-BERT",
    rencana_luaran:
      "Penelitian yang hasilnnya disajikan dalam diterbitkan pada artikel pada Jurnal Nasional terakreditasi peringkat 2",
    dana_internal: 5000000,
    nama_dosen: "Dummy User",
    jenis_pencairan: "Dana Awal",
  },
  {
    id: uuid(),
    tr_pengusulan_id: uuid(),
    tahap: "1",
    dokumen_pengajuan: null,
    biaya: "2500000",
    validasi_staf_lppm: "APPROVED" as ValidationStatus,
    validasi_lppm: "APPROVED" as ValidationStatus,
    validasi_rektor: "APPROVED" as ValidationStatus,
    status: 1,
    tanggal: "2024-12-23T00:00:00.000Z",
    catatan: null,
    slip: "2026-01-30T10:56:00.000Z",
    created_at: "2024-12-12T06:43:44.000Z",
    updated_at: "2026-01-30T03:56:13.000Z",
    jenis: "PENELITIAN",
    judul:
      "Plant Disease Detection Using Digital Image Processing : \nOpportunities and challenges",
    rencana_luaran:
      "Penelitian yang hasilnnya disajikan dalam diterbitkan pada artikel pada Jurnal Nasional terakreditasi peringkat 2",
    dana_internal: 5000000,
    nama_dosen: "Dummy User",
    jenis_pencairan: "Dana Awal",
  },
  {
    id: uuid(),
    tr_pengusulan_id: uuid(),
    tahap: "2",
    dokumen_pengajuan: null,
    biaya: "2500000",
    validasi_staf_lppm: "APPROVED" as ValidationStatus,
    validasi_lppm: "APPROVED" as ValidationStatus,
    validasi_rektor: "APPROVED" as ValidationStatus,
    status: 1,
    tanggal: "2025-11-21T00:00:00.000Z",
    catatan: null,
    slip: "2026-01-30T10:56:00.000Z",
    created_at: "2025-11-11T14:38:17.000Z",
    updated_at: "2026-01-30T03:56:25.000Z",
    jenis: "PENELITIAN",
    judul:
      "Plant Disease Detection Using Digital Image Processing : \nOpportunities and challenges",
    rencana_luaran:
      "Penelitian yang hasilnnya disajikan dalam diterbitkan pada artikel pada Jurnal Nasional terakreditasi peringkat 2",
    dana_internal: 5000000,
    nama_dosen: "Dummy User",
    jenis_pencairan: "Sisa Dana",
  },
  {
    id: uuid(),
    tr_pengusulan_id: uuid(),
    tahap: "1",
    dokumen_pengajuan: null,
    biaya: "1750000",
    validasi_staf_lppm: "APPROVED" as ValidationStatus,
    validasi_lppm: "APPROVED" as ValidationStatus,
    validasi_rektor: "APPROVED" as ValidationStatus,
    status: 1,
    tanggal: "2026-01-19T00:00:00.000Z",
    catatan: null,
    slip: "2026-01-30T10:48:00.000Z",
    created_at: "2026-01-12T04:03:11.000Z",
    updated_at: "2026-01-30T03:48:23.000Z",
    jenis: "PENELITIAN",
    judul: "Object Detection on Analog Water Meters Using Region-Based CNN",
    rencana_luaran:
      "Penelitian yang hasilnnya disajikan dalam Temu Ilmiah Internasional dengan luaran minimal prosiding bereputasi",
    dana_internal: 3500000,
    nama_dosen: "Dummy User",
    jenis_pencairan: "Dana Awal",
  },
  {
    id: uuid(),
    tr_pengusulan_id: uuid(),
    tahap: "2",
    dokumen_pengajuan: null,
    biaya: "1750000",
    validasi_staf_lppm: "APPROVED" as ValidationStatus,
    validasi_lppm: "APPROVED" as ValidationStatus,
    validasi_rektor: "APPROVED" as ValidationStatus,
    status: 1,
    tanggal: "2026-01-30T00:00:00.000Z",
    catatan: null,
    slip: "2026-01-30T10:39:00.000Z",
    created_at: "2026-01-13T06:16:54.000Z",
    updated_at: "2026-01-30T03:39:55.000Z",
    jenis: "PENELITIAN",
    judul: "Object Detection on Analog Water Meters Using Region-Based CNN",
    rencana_luaran:
      "Penelitian yang hasilnnya disajikan dalam Temu Ilmiah Internasional dengan luaran minimal prosiding bereputasi",
    dana_internal: 3500000,
    nama_dosen: "Dummy User",
    jenis_pencairan: "Sisa Dana",
  },
];

async function main() {
  const users = await prisma.user.findMany({});

  if (users.length === 0) {
    console.log(
      "Tidak ada user di database. Buat user terlebih dahulu sebelum menjalankan seeder research.",
    );
    return;
  }

  console.log(
    `Ditemukan ${users.length} user. Memulai proses seeding research...`,
  );

  for (let i = 0; i < researchData.length; i++) {
    const item = researchData[i];

    // Memilih user secara bergiliran (round-robin) untuk setiap data penelitian
    const assignedUser = users[i % users.length];

    await prisma.research.upsert({
      where: { id: item.id },
      update: {
        trPengusulanId: item.tr_pengusulan_id,
        tahap: item.tahap,
        dokumenPengajuan: item.dokumen_pengajuan,
        biaya: item.biaya,
        validasiStafLppm: item.validasi_staf_lppm,
        validasiLppm: item.validasi_lppm,
        validasiRektor: item.validasi_rektor,
        status: item.status,
        tanggal: item.tanggal as string,
        catatan: item.catatan,
        slip: item.slip as string,
        jenis: item.jenis,
        judul: item.judul,
        rencanaLuaran: item.rencana_luaran,
        danaInternal: item.dana_internal,
        jenisPencairan: item.jenis_pencairan,

        // Sesuaikan dengan data user asli dari database
        namaDosen: assignedUser.name,
        userId: assignedUser.id,
      },
      create: {
        id: item.id,
        trPengusulanId: item.tr_pengusulan_id,
        tahap: item.tahap,
        dokumenPengajuan: item.dokumen_pengajuan,
        biaya: item.biaya,
        validasiStafLppm: item.validasi_staf_lppm,
        validasiLppm: item.validasi_lppm,
        validasiRektor: item.validasi_rektor,
        status: item.status,
        tanggal: item.tanggal as string,
        catatan: item.catatan,
        slip: item.slip as string,
        jenis: item.jenis,
        judul: item.judul,
        rencanaLuaran: item.rencana_luaran,
        danaInternal: item.dana_internal,
        jenisPencairan: item.jenis_pencairan,

        // Sesuaikan dengan data user asli dari database
        namaDosen: assignedUser.name,
        userId: assignedUser.id,
      },
    });
  }

  console.log(
    `Berhasil melakukan seeding ${researchData.length} data penelitian dan menautkannya ke user.`,
  );
}
main()
  .catch((e) => {
    console.error("Error seeding research data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
