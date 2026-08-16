import { API_BASE_URL } from "@/constants";

export interface AisnetMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AisnetChatRequestParams {
  prompt: string;
  messages: AisnetMessage[];
  pageContext: string;
  tableData?: any[];
  onChunk: (text: string) => void;
}

export async function sendAisnetChatMessage({
  prompt,
  messages,
  pageContext,
  tableData = [],
  onChunk,
}: AisnetChatRequestParams): Promise<string> {
  // Compute total of 'biaya' if present
  const total = (tableData as any[]).reduce((sum, row) => {
    const val = Number((row as any).biaya);
    return Number.isNaN(val) ? sum : sum + val;
  }, 0);

  // Build system prompt embedding table JSON (truncated if huge) and total
  const tableJson = JSON.stringify(tableData);
  const systemPrompt = `Data tabel (JSON): ${tableJson}. Total pencairan: ${total}.`;

  const response = await fetch(`${API_BASE_URL}/api/aisnet-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, messages, pageContext, tableData, systemPrompt }),
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
    fullText += decoder.decode(value, { stream: true });
    onChunk(fullText);
  }

  return fullText;
}
