import "server-only";

export interface OllamaModelTag {
  name: string;
  model: string;
  size?: number;
  digest?: string;
  details?: Record<string, any>;
}

export interface OllamaTagsResponse {
  models?: OllamaModelTag[];
}

export function normalizeOllamaUrl(baseUrl?: string): string {
  if (!baseUrl || !baseUrl.trim()) {
    return "http://localhost:11434";
  }
  return baseUrl.trim().replace(/\/+$/, "");
}

/**
 * Pings Ollama server and retrieves list of installed model tags.
 */
export async function fetchOllamaModels(baseUrl: string): Promise<{
  models: string[];
  isOnline: boolean;
  error?: string;
}> {
  const url = normalizeOllamaUrl(baseUrl);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${url}/api/tags`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        models: [],
        isOnline: false,
        error: `Server responded with status ${res.status} ${res.statusText}`,
      };
    }

    const data = (await res.json()) as OllamaTagsResponse;
    const models = (data.models || [])
      .map((m) => m.name || m.model)
      .filter(Boolean);

    return {
      models,
      isOnline: true,
    };
  } catch (err: any) {
    const message =
      err.name === "AbortError"
        ? "Koneksi ke Ollama timeout (4s)"
        : err.message || "Gagal menghubungi server Ollama";

    return {
      models: [],
      isOnline: false,
      error: message,
    };
  }
}

/**
 * Streams prompt response from Ollama REST API.
 */
export async function streamOllamaResponse(
  baseUrl: string,
  model: string,
  prompt: string,
  signal?: AbortSignal,
): Promise<ReadableStream<string>> {
  const url = normalizeOllamaUrl(baseUrl);

  const res = await fetch(`${url}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: true,
    }),
    signal,
  });

  if (!res.ok || !res.body) {
    const errorText = await res.text().catch(() => "");
    throw new Error(
      `Ollama error (${res.status} ${res.statusText}): ${errorText || "Gagal streaming respon"}`,
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  return new ReadableStream<string>({
    async pull(controller) {
      try {
        const { value, done } = await reader.read();

        if (done) {
          if (buffer.trim()) {
            try {
              const parsed = JSON.parse(buffer.trim());
              if (parsed.response) {
                controller.enqueue(parsed.response);
              }
            } catch {
              // Ignore incomplete trailing chunk on finish
            }
          }
          controller.close();
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          try {
            const parsed = JSON.parse(trimmed);
            if (parsed.response) {
              controller.enqueue(parsed.response);
            }
          } catch {
            // Non-fatal parse error on malformed line
          }
        }
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });
}
