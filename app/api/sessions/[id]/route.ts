import { prisma } from "@/lib/server/db";
import { getTokenFromCookies } from "@/lib/server/middleware/auth";
import { getSession } from "@/lib/server/services/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = await getTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionResult = await getSession(token);
    if (!sessionResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = sessionResult.user.id;

    const chatSession = await prisma.chatSession.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chatSession) {
      return NextResponse.json(
        { error: "Percakapan tidak ditemukan" },
        { status: 404 },
      );
    }

    if (chatSession.userId !== userId && sessionResult.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      data: {
        id: chatSession.id,
        title: chatSession.title,
        createdAt: chatSession.createdAt.getTime(),
        updatedAt: chatSession.updatedAt.getTime(),
        messages: chatSession.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to fetch chat session:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data percakapan" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = await getTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionResult = await getSession(token);
    if (!sessionResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = sessionResult.user.id;
    const body = await request.json().catch(() => ({}));
    const { title, messages, appendMessages } = body;

    // Check if session exists or upsert
    const existing = await prisma.chatSession.findUnique({
      where: { id },
    });

    if (existing) {
      if (existing.userId !== userId && sessionResult.user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // If appendMessages is provided, only create the new messages
      if (Array.isArray(appendMessages) && appendMessages.length > 0) {
        await prisma.chatMessage.createMany({
          data: appendMessages.map((msg: any) => ({
            sessionId: id,
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content || "",
          })),
        });

        await prisma.chatSession.update({
          where: { id },
          data: {
            title: title || undefined,
            updatedAt: new Date(),
          },
        });
      } else if (Array.isArray(messages)) {
        // Replace all messages in session
        await prisma.chatMessage.deleteMany({
          where: { sessionId: id },
        });

        if (messages.length > 0) {
          await prisma.chatMessage.createMany({
            data: messages.map((msg: any) => ({
              sessionId: id,
              role: msg.role === "assistant" ? "assistant" : "user",
              content: msg.content || "",
            })),
          });
        }

        await prisma.chatSession.update({
          where: { id },
          data: {
            title: title || undefined,
            updatedAt: new Date(),
          },
        });
      } else if (title) {
        await prisma.chatSession.update({
          where: { id },
          data: {
            title,
            updatedAt: new Date(),
          },
        });
      }
    } else {
      // Upsert: Create new session if it doesn't exist
      const messagesToCreate = Array.isArray(appendMessages)
        ? appendMessages
        : Array.isArray(messages)
          ? messages
          : [];

      await prisma.chatSession.create({
        data: {
          id,
          userId,
          title: title || "Chat baru",
          messages: messagesToCreate.length > 0
            ? {
                create: messagesToCreate.map((msg: any) => ({
                  role: msg.role === "assistant" ? "assistant" : "user",
                  content: msg.content || "",
                })),
              }
            : undefined,
        },
      });
    }

    const updated = await prisma.chatSession.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Percakapan tidak ditemukan setelah pembaruan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: {
        id: updated.id,
        title: updated.title,
        createdAt: updated.createdAt.getTime(),
        updatedAt: updated.updatedAt.getTime(),
        messages: updated.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to update chat session:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui percakapan" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = await getTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionResult = await getSession(token);
    if (!sessionResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = sessionResult.user.id;

    const chatSession = await prisma.chatSession.findUnique({
      where: { id },
    });

    if (!chatSession) {
      return NextResponse.json(
        { error: "Percakapan tidak ditemukan" },
        { status: 404 },
      );
    }

    if (chatSession.userId !== userId && sessionResult.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.chatSession.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete chat session:", error);
    return NextResponse.json(
      { error: "Gagal menghapus percakapan" },
      { status: 500 },
    );
  }
}
