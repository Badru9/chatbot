export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequestParams {
  prompt: string;
  documentIds: string[];
  messages: Message[];
  activeTools?: string[];
  onChunk: (text: string) => void;
}

export async function sendChatMessage({
  prompt,
  documentIds,
  messages,
  activeTools,
  onChunk,
}: ChatRequestParams): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, documentIds, messages, activeTools }),
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
