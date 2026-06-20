import {
  buildContents,
  buildRagUserPrompt,
  buildSystemInstruction,
  type ChatMessage,
} from "@/lib/chatUtils";

export const runtime = "nodejs";

type ChatRequestBody = {
  prompt?: unknown;
  documentIds?: unknown;
  messages?: Array<{
    role?: unknown;
    content?: unknown;
  }>;
};

function sanitizeMessages(
  messages: ChatRequestBody["messages"],
): ChatMessage[] {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter(
      (message) =>
        typeof message.content === "string" && message.content.trim(),
    )
    .map((message) => ({
      role:
        message.role === "assistant" || message.role === "system"
          ? message.role
          : "user",
      content: String(message.content).trim(),
    }));
}

function readPrompt(body: ChatRequestBody, messages: ChatMessage[]) {
  if (typeof body.prompt === "string" && body.prompt.trim()) {
    return body.prompt.trim();
  }

  return (
    [...messages].reverse().find((message) => message.role === "user")
      ?.content ?? null
  );
}

function readDocumentIds(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is string =>
      typeof item === "string" && item.trim().length > 0,
  );
}

export async function POST(request: Request) {
  let body: ChatRequestBody;

  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return Response.json(
      { error: "Request body harus berupa JSON." },
      { status: 400 },
    );
  }

  const messages = sanitizeMessages(body.messages);
  const prompt = readPrompt(body, messages);

  if (!prompt) {
    return Response.json(
      { error: "Field prompt wajib diisi." },
      { status: 400 },
    );
  }

  const documentIds = readDocumentIds(body.documentIds);
  
  let pdfContext = "";
  if (documentIds.length > 0) {
    try {
      const cookie = request.headers.get('cookie') || '';
      const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
      const res = await fetch(`${backendUrl}/api/chat/context`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          cookie: cookie,
        },
        body: JSON.stringify({ prompt, documentIds }),
      });
      if (res.ok) {
        const data = await res.json() as { context?: string };
        pdfContext = data.context || "";
      } else {
        console.error("Backend error retrieving context:", await res.text());
      }
    } catch (err) {
      console.error("Failed to connect to backend for retrieval:", err);
    }
  }

  const finalUserPrompt = buildRagUserPrompt(prompt, pdfContext);
  const finalMessages =
    messages.length > 0
      ? [...messages]
      : [{ role: "user" as const, content: prompt }];

  for (let index = finalMessages.length - 1; index >= 0; index--) {
    if (finalMessages[index].role === "user") {
      finalMessages[index] = {
        ...finalMessages[index],
        content: finalUserPrompt,
      };
      break;
    }
  }

  const ollamaHost = process.env.OLLAMA_HOST || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "qwen3.5";

  const ollamaMessages = [
    { role: "system", content: buildSystemInstruction() },
    ...finalMessages
  ];

  let replyText = "";
  try {
    const res = await fetch(`${ollamaHost}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel,
        messages: ollamaMessages,
        stream: false,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return Response.json({ error: `Ollama error: ${errorText}` }, { status: 500 });
    }

    const data = await res.json() as { message?: { content?: string } };
    replyText = data.message?.content || "";
  } catch (error) {
    console.error("Failed to connect to Ollama:", error);
    return Response.json({ error: "Gagal menghubungi local AI model (Ollama)." }, { status: 500 });
  }

  return new Response(replyText, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
