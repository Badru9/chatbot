import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { researchData } from "../constants";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding research data...");
  for (const item of researchData) {
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
        namaDosen: item.nama_dosen,
        jenisPencairan: item.jenis_pencairan,
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
        namaDosen: item.nama_dosen,
        jenisPencairan: item.jenis_pencairan,
      },
    });
  }
  console.log(`Seeded ${researchData.length} research records successfully.`);
}

main()
  .catch((e) => {
    console.error("Error seeding research data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
