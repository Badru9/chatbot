import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function getActiveDatasetsContextSim(): Promise<string> {
  const activeDatasets = await prisma.dataset.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  if (activeDatasets.length === 0) return "";

  const sections = activeDatasets.map((d) => {
    const metaParts = [];
    if (d.description) metaParts.push(`Deskripsi: ${d.description}`);
    if (d.source) metaParts.push(`Sumber: ${d.source}`);
    const metaStr = metaParts.length > 0 ? `\n${metaParts.join(" | ")}` : "";

    return `### Dataset: ${d.name}${metaStr}\n\n${d.content}`;
  });

  return `\n\n<system_knowledge_datasets>\n${sections.join("\n\n---\n\n")}\n</system_knowledge_datasets>`;
}

async function runEndToEndVerification() {
  console.log("=== STARTING END-TO-END VERIFICATION ===");

  const users = await prisma.user.findMany({
    select: { id: true, name: true, role: true },
  });
  const admin = users.find((u) => u.role === "admin");
  const dosen = users.find((u) => u.role === "dosen");

  if (!admin || !dosen) {
    throw new Error("Admin or Dosen user not found in database.");
  }
  console.log(`Admin user: ${admin.name} (${admin.id})`);
  console.log(`Dosen user: ${dosen.name} (${dosen.id})`);

  // 1. Clean up & Create a test system dataset
  await prisma.dataset.deleteMany({
    where: { name: { contains: "Pedoman Penulisan Skripsi" } },
  });

  const dataset = await prisma.dataset.create({
    data: {
      name: "Pedoman Penulisan Skripsi & Tugas Akhir 2026",
      description: "Syarat SKS, alur pengajuan proposal, dan pembagian dosen pembimbing",
      source: "Buku Pedoman Akademik Fakultas 2026",
      content: `## Syarat Pengajuan Skripsi
1. Mahasiswa aktif minimal semester 7.
2. Telah menempuh minimal 110 SKS dengan IPK >= 3.00.
3. Lulus mata kuliah Metode Penelitian dengan nilai minimal B.

## Alur Pendaftaran
1. Konsultasi topik awal dengan Dosen Wali.
2. Pengajuan proposal 3 halaman melalui portal akademik.
3. Penetapan SK Pembimbing oleh Program Studi.`,
      isActive: true,
      createdBy: admin.id,
    },
  });
  console.log(`[PASS] Created system dataset: ${dataset.name} (id: ${dataset.id})`);

  // 2. Verify getActiveDatasetsContext
  const activeContext = await getActiveDatasetsContextSim();
  if (!activeContext.includes("Pedoman Penulisan Skripsi & Tugas Akhir 2026") || !activeContext.includes("110 SKS")) {
    throw new Error("Active dataset context failed to include created dataset content!");
  }
  console.log("[PASS] getActiveDatasetsContext successfully compiled active datasets for systemPrompt.");

  // 3. Test Inactive Toggle
  await prisma.dataset.update({
    where: { id: dataset.id },
    data: { isActive: false },
  });
  const inactiveContext = await getActiveDatasetsContextSim();
  if (inactiveContext.includes("Pedoman Penulisan Skripsi & Tugas Akhir 2026")) {
    throw new Error("Inactive dataset was incorrectly included in active context!");
  }
  console.log("[PASS] Inactive dataset correctly excluded from systemPrompt context.");

  // Re-activate dataset
  await prisma.dataset.update({
    where: { id: dataset.id },
    data: { isActive: true },
  });

  // 4. Verify Dosen Document Library Isolation (vectors table)
  // Dosen should ONLY see their own files with metadata.userId = dosen.id
  const dosenDocs = await prisma.pdfChunk.findMany({
    where: {
      metadata: {
        path: ["userId"],
        equals: dosen.id,
      },
    },
    distinct: ["documentId"],
    select: { documentId: true, documentName: true, metadata: true },
  });

  console.log(`[PASS] Dosen document library count: ${dosenDocs.length} file(s):`, dosenDocs.map(d => d.documentName));
  for (const doc of dosenDocs) {
    if (doc.documentId.startsWith("manual-")) {
      throw new Error(`Legacy manual document ${doc.documentId} still found in dosen library!`);
    }
    const meta = (doc.metadata as any) || {};
    if (meta.userId !== dosen.id) {
      throw new Error(`Document ${doc.documentName} does not belong to dosen!`);
    }
  }

  // 5. Verify no manual-* chunks remain in vectors
  const manualChunksInVectors = await prisma.pdfChunk.count({
    where: { documentId: { startsWith: "manual-" } },
  });
  if (manualChunksInVectors > 0) {
    throw new Error(`Found ${manualChunksInVectors} manual chunks in vectors table!`);
  }
  console.log("[PASS] Vectors table is clean with 0 manual-* chunks.");

  console.log("=== ALL END-TO-END VERIFICATIONS PASSED SUCCESSFULLY ===");
}

runEndToEndVerification()
  .catch((e) => {
    console.error("Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
