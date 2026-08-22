import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("=== VERIFYING DATASET ACCESS & USERS ===");

  const users = await prisma.user.findMany({
    select: { id: true, name: true, role: true, email: true },
  });
  console.log("Users:", users);

  const admin = users.find((u) => u.role === "admin");
  const dosen = users.find((u) => u.role === "dosen");

  console.log("Admin user:", admin?.name, admin?.id);
  console.log("Dosen user:", dosen?.name, dosen?.id);

  // Update existing manual or admin documents to isPublic: true
  const docs = await prisma.pdfChunk.findMany({
    select: { documentId: true, documentName: true, metadata: true },
    distinct: ["documentId"],
  });
  console.log("Existing documents count:", docs.length);

  for (const doc of docs) {
    const meta = (doc.metadata as Record<string, unknown>) || {};
    const isAdminOwner = admin && meta.userId === admin.id;
    const isManual = doc.documentId.startsWith("manual-");

    if ((isAdminOwner || isManual) && meta.isPublic !== true) {
      console.log(
        `Setting document ${doc.documentName} (${doc.documentId}) to isPublic = true`,
      );
      await prisma.$executeRawUnsafe(
        `UPDATE vectors SET metadata = jsonb_set(jsonb_set(metadata, '{isPublic}', 'true'::jsonb), '{uploadedByRole}', '"admin"'::jsonb) WHERE document_id = $1`,
        doc.documentId,
      );
    }
  }

  // Check what Dosen would see with the new fetch query
  if (dosen) {
    const dosenAccessibleDocs = await prisma.pdfChunk.findMany({
      where: {
        OR: [
          { metadata: { path: ["userId"], equals: dosen.id } },
          { metadata: { path: ["isPublic"], equals: true } },
          { metadata: { path: ["isPublic"], equals: "true" } },
        ],
      },
      distinct: ["documentId"],
      select: { documentId: true, documentName: true, metadata: true },
    });

    console.log(
      `Dosen (${dosen.name}) can see ${dosenAccessibleDocs.length} documents:`,
      dosenAccessibleDocs.map((d) => ({
        name: d.documentName,
        isPublic: (d.metadata as any)?.isPublic,
        userId: (d.metadata as any)?.userId,
      })),
    );
  }

  console.log("=== VERIFICATION COMPLETE ===");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
