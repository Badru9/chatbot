export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequestParams {
  prompt: string;
  documentIds: string[];
  messages: Message[];
  activeTools?: string[];
  tableData?: any[];
  onChunk: (text: string) => void;
}

export async function sendChatMessage({
  prompt,
  documentIds,
  messages,
  activeTools,
  tableData = [],
  onChunk,
}: ChatRequestParams): Promise<string> {
  // Build system prompt with table JSON and total only if tableData is supplied
  let systemPrompt: string | undefined = undefined;
  if (Array.isArray(tableData) && tableData.length > 0) {
    const total = (tableData as any[]).reduce((sum, row) => {
      const val = Number((row as any).biaya);
      return Number.isNaN(val) ? sum : sum + val;
    }, 0);
    systemPrompt = `Data tabel halaman aktif: ${JSON.stringify(tableData)}. Total pencairan: Rp ${total.toLocaleString("id-ID")} (${total}).`;
  }

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      documentIds,
      messages,
      activeTools,
      systemPrompt,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  if (!response.body) {
    throw new Error("Response body is null");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk;
    onChunk(fullText);
  }

  return fullText;
}
