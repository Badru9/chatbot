import { prisma } from "@/lib/server/db";
import { getTokenFromCookies } from "@/lib/server/middleware/auth";
import { getSession } from "@/lib/server/services/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionResult = await getSession(token);
    if (!sessionResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = sessionResult.user.id;

    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { messages: true },
        },
      },
    });

    const formattedSessions = sessions.map((s) => ({
      id: s.id,
      title: s.title,
      createdAt: s.createdAt.getTime(),
      updatedAt: s.updatedAt.getTime(),
      messagesCount: s._count.messages,
    }));

    return NextResponse.json({ data: formattedSessions });
  } catch (error) {
    console.error("Failed to fetch chat sessions:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar percakapan" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Handle batch migration from localStorage
    if (Array.isArray(body.sessions)) {
      for (const item of body.sessions) {
        if (!item.messages || item.messages.length === 0) continue;

        const existing = await prisma.chatSession.findUnique({
          where: { id: item.id },
        });

        if (!existing) {
          await prisma.chatSession.create({
            data: {
              id: item.id || undefined,
              userId,
              title: item.title || "Chat baru",
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
              updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
              messages: {
                create: (item.messages || []).map((msg: any) => ({
                  role: msg.role === "assistant" ? "assistant" : "user",
                  content: msg.content || "",
                })),
              },
            },
          });
        }
      }
      return NextResponse.json({ success: true, message: "Migrasi berhasil" });
    }

    // Handle single session creation/upsert
    const { id, title, messages } = body;

    const session = await prisma.chatSession.create({
      data: {
        id: id || undefined,
        userId,
        title: title || "Chat baru",
        messages: Array.isArray(messages) && messages.length > 0
          ? {
              create: messages.map((msg: any) => ({
                role: msg.role === "assistant" ? "assistant" : "user",
                content: msg.content || "",
              })),
            }
          : undefined,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json({
      data: {
        id: session.id,
        title: session.title,
        createdAt: session.createdAt.getTime(),
        updatedAt: session.updatedAt.getTime(),
        messages: session.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to create chat session:", error);
    return NextResponse.json(
      { error: "Gagal membuat percakapan baru" },
      { status: 500 },
    );
  }
}
