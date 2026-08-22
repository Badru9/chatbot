import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function searchPdfChunksSim({
  embedding,
  documentIds = [],
  limit = 8,
  userId,
}: {
  embedding: number[];
  documentIds?: string[];
  limit?: number;
  userId?: string;
}) {
  const vectorStr = `[${embedding.join(",")}]`;

  const conditions: string[] = [];
  const queryParams: any[] = [vectorStr];

  if (documentIds.length > 0) {
    const placeholders = documentIds
      .map((_, i) => `$${queryParams.length + 1 + i}`)
      .join(", ");
    conditions.push(`document_id IN (${placeholders})`);
    queryParams.push(...documentIds);
  }

  if (userId) {
    const userParamIndex = queryParams.length + 1;
    conditions.push(
      `(metadata->>'isPublic' = 'true' OR (metadata->'isPublic')::boolean = true OR metadata->>'userId' = $${userParamIndex})`,
    );
    queryParams.push(userId);
  }

  const whereClause = conditions.length > 0 ? conditions.join(" AND ") : "1=1";

  const query = `
    SELECT
      document_id,
      document_name,
      metadata->>'isPublic' as is_public,
      metadata->>'userId' as user_id,
      1 - (embedding <=> $1::vector) AS score
    FROM vectors
    WHERE ${whereClause}
    ORDER BY score DESC
    LIMIT ${Number(limit)}
  `;

  return prisma.$queryRawUnsafe<any[]>(query, ...queryParams);
}

async function testAccessControl() {
  console.log("=== TESTING ACCESS CONTROL ON VECTOR SEARCH ===");

  // Get a sample embedding from an existing chunk
  const sampleChunk = await prisma.$queryRawUnsafe<any[]>(
    "SELECT embedding::text FROM vectors LIMIT 1"
  );
  if (!sampleChunk.length) {
    console.log("No vector chunks found in DB.");
    return;
  }

  const sampleEmbedding: number[] = JSON.parse(sampleChunk[0].embedding);

  const adminUserId = "4814c4ea-edfa-4d60-a243-3c33821a2112";
  const dosenUserId = "314d86b5-f2cc-443a-bbdd-09e79e8ce26b";
  const otherDosenUserId = "99999999-9999-9999-9999-999999999999";

  // Test 1: Admin searching without document filter (all docs accessible)
  const adminResults = await searchPdfChunksSim({
    embedding: sampleEmbedding,
    limit: 10,
    userId: undefined, // Admin
  });
  console.log(`[PASS] Admin query returned ${adminResults.length} chunks.`);

  // Test 2: Dosen 1 searching without document filter (public docs + Dosen 1 docs)
  const dosen1Results = await searchPdfChunksSim({
    embedding: sampleEmbedding,
    limit: 10,
    userId: dosenUserId,
  });
  console.log(`[PASS] Dosen 1 query returned ${dosen1Results.length} chunks.`);
  for (const r of dosen1Results) {
    const isPublic = r.is_public === "true" || r.is_public === true;
    const isOwner = r.user_id === dosenUserId;
    if (!isPublic && !isOwner) {
      throw new Error(`SECURITY LEAK: Dosen 1 saw private chunk of user ${r.user_id}!`);
    }
  }

  // Test 3: Other Dosen searching without document filter (only public docs, no Dosen 1 docs)
  const otherDosenResults = await searchPdfChunksSim({
    embedding: sampleEmbedding,
    limit: 10,
    userId: otherDosenUserId,
  });
  console.log(`[PASS] Other Dosen query returned ${otherDosenResults.length} chunks.`);
  for (const r of otherDosenResults) {
    const isPublic = r.is_public === "true" || r.is_public === true;
    const isOwner = r.user_id === otherDosenUserId;
    if (!isPublic && !isOwner) {
      throw new Error(`SECURITY LEAK: Other Dosen saw private chunk of user ${r.user_id}!`);
    }
  }

  console.log("=== ALL ACCESS CONTROL TESTS PASSED SUCCESSFULLY! ===");
}

testAccessControl()
  .catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
