import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/db";
import { downloadPdf } from "@/lib/server/services/storage";
import { getTokenFromCookies } from "@/lib/server/middleware/auth";
import { getSession } from "@/lib/server/services/auth";

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id: documentId } = await ctx.params;

  // Auth check
  const token = await getTokenFromCookies();
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await getSession(token);
  if (!result) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = result.user;

  if (!documentId || !documentId.trim()) {
    return Response.json(
      { error: "Parameter id wajib diisi." },
      { status: 400 },
    );
  }

  try {
    // Ownership check for non-admin: allow if user's own document or public document
    if (user.role !== "admin") {
      const chunkCount = await prisma.pdfChunk.count({
        where: {
          documentId,
          OR: [
            {
              metadata: {
                path: ["userId"],
                equals: user.id,
              },
            },
            {
              metadata: {
                path: ["isPublic"],
                equals: true,
              },
            },
            {
              metadata: {
                path: ["isPublic"],
                equals: "true",
              },
            },
          ],
        },
      });
      if (chunkCount === 0) {
        return Response.json(
          {
            error: "Forbidden: Dokumen tidak ditemukan atau bukan milik Anda.",
          },
          { status: 403 },
        );
      }
    }

    const stream = await downloadPdf(documentId);

    // Convert Node.js ReadableStream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk));
        });
        stream.on("end", () => {
          controller.close();
        });
        stream.on("error", (err: Error) => {
          controller.error(err);
        });
      },
    });

    return new Response(webStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${documentId}.pdf"`,
      },
    });
  } catch (error: any) {
    if (error?.code === "NoSuchKey" || error?.code === "NotFound") {
      return Response.json(
        { error: "File PDF tidak ditemukan di storage." },
        { status: 404 },
      );
    }
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Gagal mengunduh PDF.",
      },
      { status: 500 },
    );
  }
}
