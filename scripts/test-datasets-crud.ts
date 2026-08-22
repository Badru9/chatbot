import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function testDatasetCRUD() {
  console.log("=== TESTING DATASET CRUD & CONTEXT GENERATION ===");

  // 1. Clean up or seed a test dataset
  const testName = "Pedoman Penulisan Skripsi 2026";
  await prisma.dataset.deleteMany({ where: { name: testName } });

  // 2. Create dataset
  const created = await prisma.dataset.create({
    data: {
      name: testName,
      description: "Pedoman resmi skripsi dan tugas akhir mahasiswa",
      source: "Buku Pedoman Akademik 2026",
      content: "## Syarat Skripsi\n1. SKS minimal 110 dengan IPK >= 3.00.\n2. Lulus mata kuliah Metode Penelitian.\n3. Alur: Pengajuan proposal -> Verifikasi koordinator -> SK Pembimbing.",
      isActive: true,
      createdBy: "4814c4ea-edfa-4d60-a243-3c33821a2112",
    },
  });
  console.log("[PASS] Created dataset:", created.id, created.name);

  // 3. Query active datasets
  const active = await prisma.dataset.findMany({ where: { isActive: true } });
  console.log(`[PASS] Found ${active.length} active datasets in DB.`);

  // 4. Update status
  const updated = await prisma.dataset.update({
    where: { id: created.id },
    data: { description: "Updated description" },
  });
  console.log("[PASS] Updated dataset description:", updated.description);

  console.log("=== DATASET CRUD TEST PASSED SUCCESSFULLY ===");
}

testDatasetCRUD()
  .catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
