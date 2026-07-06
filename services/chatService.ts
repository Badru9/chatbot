import { axiosInstance } from "./axiosInstance";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequestParams {
  prompt: string;
  documentIds: string[];
  messages: Message[];
  onChunk: (text: string) => void;
}

export async function sendChatMessage({
  prompt,
  documentIds,
  messages,
  onChunk,
}: ChatRequestParams): Promise<string> {
  const response = await axiosInstance.post(
    "/api/chat",
    { prompt, documentIds, messages },
    {
      onDownloadProgress: (progressEvent) => {
        const xhr = progressEvent.event?.target as XMLHttpRequest;
        if (xhr && xhr.responseText) {
          onChunk(xhr.responseText);
        }
      },
    },
  );
  return response.data;
}
