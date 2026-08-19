import { prisma } from "@/lib/server/db";
import { NextResponse } from "next/server";

export async function fetchResearchData() {
  if (typeof (prisma as any).research?.findMany === "function") {
    const research = await (prisma as any).research.findMany({
      orderBy: { id: "desc" },
    });

    return research.map((r: any) => ({
      id: r.id,
      tr_pengusulan_id: r.trPengusulanId,
      tahap: r.tahap,
      dokumen_pengajuan: r.dokumenPengajuan,
      biaya: r.biaya,
      validasi_staf_lppm: r.validasiStafLppm,
      validasi_lppm: r.validasiLppm,
      validasi_rektor: r.validasiRektor,
      status: r.status,
      tanggal: r.tanggal,
      catatan: r.catatan,
      slip: r.slip,
      jenis: r.jenis,
      judul: r.judul,
      rencana_luaran: r.rencanaLuaran,
      dana_internal: r.danaInternal,
      nama_dosen: r.namaDosen,
      jenis_pencairan: r.jenisPencairan,
      created_at:
        typeof r.createdAt === "string"
          ? r.createdAt
          : (r.createdAt?.toISOString?.() ?? new Date().toISOString()),
      updated_at:
        typeof r.updatedAt === "string"
          ? r.updatedAt
          : (r.updatedAt?.toISOString?.() ?? new Date().toISOString()),
    }));
  }

  // Robust fallback using SQL directly against the PostgreSQL table
  const rawList: any[] = await prisma.$queryRaw`
    SELECT * FROM research ORDER BY id DESC
  `;

  return rawList.map((r: any) => ({
    id: r.id,
    tr_pengusulan_id: r.tr_pengusulan_id,
    tahap: r.tahap,
    dokumen_pengajuan: r.dokumen_pengajuan,
    biaya: r.biaya,
    validasi_staf_lppm: r.validasi_staf_lppm,
    validasi_lppm: r.validasi_lppm,
    validasi_rektor: r.validasi_rektor,
    status: r.status,
    tanggal: r.tanggal,
    catatan: r.catatan,
    slip: r.slip,
    jenis: r.jenis,
    judul: r.judul,
    rencana_luaran: r.rencana_luaran,
    dana_internal: r.dana_internal,
    nama_dosen: r.nama_dosen,
    jenis_pencairan: r.jenis_pencairan,
    created_at:
      typeof r.created_at === "string"
        ? r.created_at
        : (r.created_at?.toISOString?.() ?? new Date().toISOString()),
    updated_at:
      typeof r.updated_at === "string"
        ? r.updated_at
        : (r.updated_at?.toISOString?.() ?? new Date().toISOString()),
  }));
}

export async function GET() {
  try {
    const formatted = await fetchResearchData();
    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error("Failed to fetch research from DB:", error);
    return NextResponse.json(
      {
        error: "Gagal mengambil data penelitian dari database",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
