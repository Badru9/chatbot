"use server";

import crypto from "node:crypto";
import { v4 as uuid } from "uuid";
import { prisma } from "@/lib/server/db";
import { requireAuth, requireAdmin } from "@/lib/server/middleware/auth";
import { ingestPdfBuffer } from "@/lib/server/services/ingestion";
import {
  deleteDocumentChunks,
  replacePdfChunks,
} from "@/lib/server/services/database";
import { deletePdf } from "@/lib/server/services/storage";
import { chunkPdfDocument } from "@/lib/server/services/chunker";
import { embedTexts } from "@/lib/server/services/embeddings";
import { manualDatasetSchema } from "@/lib/server/middleware/validators";

export async function fetchDocumentsAction() {
  const { user } = await requireAuth();
  const isUserAdmin = user.role === "admin";
  const userId = user.id;

  const whereClause = isUserAdmin
    ? {}
    : {
        metadata: {
          path: ["userId"],
          equals: userId,
        },
      };

  const rawDocs = await prisma.pdfChunk.groupBy({
    by: ["documentId", "documentName"],
    where: whereClause,
    _count: {
      id: true,
    },
    _max: {
      createdAt: true,
    },
  });

  const documents = rawDocs.map((doc: any) => ({
    id: doc.documentId,
    name: doc.documentName,
    chunkCount: doc._count.id,
    uploadedAt: doc._max.createdAt,
  }));

  documents.sort((a: any, b: any) => {
    const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
    const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
    return dateB - dateA;
  });

  return documents;
}

export async function uploadDocumentAction(formData: FormData) {
  const { user } = await requireAuth();
  const userId = user.id;

  const file = formData.get("file") as File | null;

  console.log("file uploaded", file);

  if (!file) {
    return { error: "Field file wajib diisi." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  console.log("buffer", buffer);

  // Validate PDF magic bytes (%PDF-)
  if (
    buffer.length < 5 ||
    buffer[0] !== 0x25 ||
    buffer[1] !== 0x50 ||
    buffer[2] !== 0x44 ||
    buffer[3] !== 0x46 ||
    buffer[4] !== 0x2d
  ) {
    return { error: "File yang diunggah bukan PDF yang valid." };
  }

  try {
    const document = await ingestPdfBuffer(
      buffer,
      file.name,
      file.size,
      file.type,
      userId,
    );

    console.log(document);

    return { document };
  } catch (error) {
    console.log("Error uploading document:", error);
    return {
      error: error instanceof Error ? error.message : "Gagal memproses PDF.",
    };
  }
}

export async function createManualDatasetAction(input: {
  name: string;
  description: string;
  source?: string;
}) {
  const { user } = await requireAdmin();
  const userId = user.id;

  const parsed = manualDatasetSchema.safeParse(input);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return { error: "Validasi gagal", details: errors };
  }

  const { name, description, source } = parsed.data;
  console.log("input", parsed.data);

  const documentHash = crypto
    .createHash("sha256")
    .update(description)
    .digest("hex");
  const documentId = `manual-${uuid()}`;

  const pages = [{ pageNumber: 1, text: description }];
  const chunks = chunkPdfDocument({
    documentId,
    documentName: name,
    documentHash,
    pages,
    userId,
  });

  if (chunks.length === 0) {
    return { error: "Deskripsi dataset tidak memiliki teks yang valid." };
  }

  const processedChunks = chunks.map((chunk) => ({
    ...chunk,
    metadata: {
      ...chunk.metadata,
      isPublic: true,
      source: source || "",
    },
  }));

  try {
    const embeddings = await embedTexts(
      processedChunks.map((c) => c.chunkText),
    );
    await replacePdfChunks(processedChunks, embeddings);

    return {
      document: {
        id: documentId,
        name,
        size: Buffer.byteLength(description, "utf-8"),
        type: "manual",
        uploadedAt: new Date().toISOString(),
        chunksCount: chunks.length,
      },
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal menyimpan dataset manual.",
    };
  }
}

export async function deleteDocumentAction(documentId: string) {
  const { user } = await requireAuth();

  if (!documentId || !documentId.trim()) {
    return { error: "Parameter id wajib diisi." };
  }

  if (user.role !== "admin") {
    const chunkCount = await prisma.pdfChunk.count({
      where: {
        documentId,
        metadata: {
          path: ["userId"],
          equals: user.id,
        },
      },
    });
    if (chunkCount === 0) {
      return {
        error: "Forbidden: Dokumen tidak ditemukan atau bukan milik Anda.",
      };
    }
  }

  try {
    await deleteDocumentChunks(documentId);
    await deletePdf(documentId);
    return { ok: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Gagal menghapus dokumen.",
    };
  }
}
