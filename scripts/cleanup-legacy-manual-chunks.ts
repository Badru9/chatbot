import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function cleanupLegacyManualChunks() {
  console.log("=== MIGRATING LEGACY MANUAL CHUNKS TO DATASETS TABLE ===");

  // Find all distinct manual documents in vectors
  const manualChunks = await prisma.pdfChunk.findMany({
    where: {
      documentId: { startsWith: "manual-" },
    },
    orderBy: { chunkIndex: "asc" },
  });

  console.log(`Found ${manualChunks.length} legacy manual chunks in vectors.`);

  const docMap = new Map<string, typeof manualChunks>();
  for (const chunk of manualChunks) {
    const list = docMap.get(chunk.documentId) || [];
    list.push(chunk);
    docMap.set(chunk.documentId, list);
  }

  for (const [docId, chunks] of docMap.entries()) {
    const docName = chunks[0].documentName;
    const fullText = chunks.map((c) => c.chunkText).join("\n\n");
    const meta = (chunks[0].metadata as any) || {};

    console.log(`Migrating manual doc "${docName}" (${docId}) to datasets table...`);

    const existing = await prisma.dataset.findFirst({
      where: { name: docName },
    });

    if (!existing) {
      await prisma.dataset.create({
        data: {
          name: docName,
          description: meta.source || "Dataset sistem",
          content: fullText,
          source: meta.source || null,
          isActive: true,
          createdBy: meta.userId || "system",
        },
      });
      console.log(`Created dataset record for "${docName}".`);
    } else {
      console.log(`Dataset record "${docName}" already exists.`);
    }
  }

  // Delete all manual-* chunks from vectors
  if (manualChunks.length > 0) {
    const deleteRes = await prisma.pdfChunk.deleteMany({
      where: {
        documentId: { startsWith: "manual-" },
      },
    });
    console.log(`Deleted ${deleteRes.count} legacy manual chunks from vectors table.`);
  }

  console.log("=== CLEANUP & MIGRATION COMPLETE ===");
}

cleanupLegacyManualChunks()
  .catch((e) => {
    console.error("Cleanup error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
