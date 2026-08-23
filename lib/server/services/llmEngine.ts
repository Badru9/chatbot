import "server-only";

import { prisma } from "@/lib/server/db";
import { getGeminiChatModel } from "@/lib/server/services/gemini";
import { streamOllamaResponse } from "@/lib/server/services/ollama";

export interface AiSettingData {
  id: string;
  activeProvider: string; // "gemini" | "ollama"
  geminiPrimary: string;
  geminiFallbacks: string[];
  ollamaBaseUrl: string;
  ollamaModel: string;
  enableAutoFallback: boolean;
  enableCrossFallback: boolean;
  updatedAt: Date;
}

const DEFAULT_AI_SETTING: AiSettingData = {
  id: "default",
  activeProvider: "gemini",
  geminiPrimary: "gemini-2.5-flash",
  geminiFallbacks: ["gemini-2.5-flash-lite", "gemini-flash-latest", "gemini-3.5-flash"],
  ollamaBaseUrl: "http://localhost:11434",
  ollamaModel: "llama3.2",
  enableAutoFallback: true,
  enableCrossFallback: true,
  updatedAt: new Date(),
};

// In-memory cache for settings (TTL: 30 seconds)
let cachedSetting: AiSettingData | null = null;
let cacheExpiresAt = 0;

export function invalidateAiSettingCache(): void {
  cachedSetting = null;
  cacheExpiresAt = 0;
}

export async function getAiSetting(): Promise<AiSettingData> {
  const now = Date.now();
  if (cachedSetting && now < cacheExpiresAt) {
    return cachedSetting;
  }

  try {
    let setting = await prisma.aiSetting.findUnique({
      where: { id: "default" },
    });

    if (!setting) {
      setting = await prisma.aiSetting.create({
        data: {
          id: "default",
          activeProvider: DEFAULT_AI_SETTING.activeProvider,
          geminiPrimary: DEFAULT_AI_SETTING.geminiPrimary,
          geminiFallbacks: DEFAULT_AI_SETTING.geminiFallbacks,
          ollamaBaseUrl: DEFAULT_AI_SETTING.ollamaBaseUrl,
          ollamaModel: DEFAULT_AI_SETTING.ollamaModel,
          enableAutoFallback: DEFAULT_AI_SETTING.enableAutoFallback,
          enableCrossFallback: DEFAULT_AI_SETTING.enableCrossFallback,
        },
      });
    }

    cachedSetting = setting as AiSettingData;
    cacheExpiresAt = now + 30000;
    return cachedSetting;
  } catch (err) {
    console.error("Failed to query ai_settings from database, using defaults:", err);
    return DEFAULT_AI_SETTING;
  }
}

/**
 * Converts array of Gemini parts/messages into a unified prompt string for Ollama.
 */
export function partsToPromptText(parts: (string | any)[]): string {
  return parts
    .map((p) => {
      if (typeof p === "string") return p;
      if (p && typeof p === "object" && typeof p.text === "string") return p.text;
      return JSON.stringify(p);
    })
    .join("\n\n");
}

/**
 * Creates a ReadableStream from Gemini streamGenerateContent.
 */
export async function streamGeminiModel(
  modelName: string,
  parts: (string | any)[],
): Promise<ReadableStream<string>> {
  const model = getGeminiChatModel(modelName);
  const result = await model.generateContentStream(parts);

  return new ReadableStream<string>({
    async pull(controller) {
      try {
        for await (const chunk of result.stream) {
          if (chunk && typeof chunk.text === "function") {
            const text = chunk.text();
            if (text) {
              controller.enqueue(text);
            }
          }
        }
        controller.close();
      } catch (err) {
        console.error(`Error during Gemini (${modelName}) streaming:`, err);
        controller.error(err);
      }
    },
  });
}

/**
 * Executes LLM streaming request with intelligent multi-tier automatic failover.
 * - Primary provider (Gemini or Ollama)
 * - Sequential Gemini fallback models
 * - Cross-provider failover
 */
export async function streamLlmWithFallback(
  geminiParts: (string | any)[],
  promptText?: string,
): Promise<ReadableStream<string>> {
  const setting = await getAiSetting();
  const fullPrompt = promptText || partsToPromptText(geminiParts);

  const errors: string[] = [];

  // Branch 1: Active Provider is Gemini
  if (setting.activeProvider === "gemini") {
    // 1. Try Gemini Primary
    try {
      return await streamGeminiModel(setting.geminiPrimary, geminiParts);
    } catch (err: any) {
      const msg = `Gemini primary (${setting.geminiPrimary}) failed: ${err.message || err}`;
      console.warn(`[llmEngine] ${msg}`);
      errors.push(msg);
    }

    // 2. Try Gemini Fallbacks
    if (setting.enableAutoFallback && Array.isArray(setting.geminiFallbacks)) {
      for (const fallbackModel of setting.geminiFallbacks) {
        if (!fallbackModel || fallbackModel === setting.geminiPrimary) continue;
        try {
          console.info(`[llmEngine] Switching to Gemini fallback model: ${fallbackModel}`);
          return await streamGeminiModel(fallbackModel, geminiParts);
        } catch (err: any) {
          const msg = `Gemini fallback (${fallbackModel}) failed: ${err.message || err}`;
          console.warn(`[llmEngine] ${msg}`);
          errors.push(msg);
        }
      }
    }

    // 3. Try Cross-Provider Fallback to Ollama
    if (setting.enableCrossFallback) {
      try {
        console.info(
          `[llmEngine] Cloud models exhausted. Attempting cross-provider fallback to Ollama (${setting.ollamaModel}) at ${setting.ollamaBaseUrl}`,
        );
        return await streamOllamaResponse(
          setting.ollamaBaseUrl,
          setting.ollamaModel,
          fullPrompt,
        );
      } catch (err: any) {
        const msg = `Ollama cross-fallback (${setting.ollamaModel}) failed: ${err.message || err}`;
        console.warn(`[llmEngine] ${msg}`);
        errors.push(msg);
      }
    }

    throw new Error(
      `Semua model AI gagal merespon:\n${errors.join("\n")}`,
    );
  }

  // Branch 2: Active Provider is Ollama
  if (setting.activeProvider === "ollama") {
    // 1. Try Ollama Primary
    try {
      return await streamOllamaResponse(
        setting.ollamaBaseUrl,
        setting.ollamaModel,
        fullPrompt,
      );
    } catch (err: any) {
      const msg = `Ollama primary (${setting.ollamaModel}) failed: ${err.message || err}`;
      console.warn(`[llmEngine] ${msg}`);
      errors.push(msg);
    }

    // 2. Try Cross-Provider Fallback to Gemini
    if (setting.enableCrossFallback) {
      // 2a. Try Gemini Primary
      try {
        console.info(
          `[llmEngine] Local Ollama unreachable. Switching to Gemini Cloud primary (${setting.geminiPrimary})`,
        );
        return await streamGeminiModel(setting.geminiPrimary, geminiParts);
      } catch (err: any) {
        const msg = `Gemini primary fallback (${setting.geminiPrimary}) failed: ${err.message || err}`;
        console.warn(`[llmEngine] ${msg}`);
        errors.push(msg);
      }

      // 2b. Try Gemini Fallbacks
      if (setting.enableAutoFallback && Array.isArray(setting.geminiFallbacks)) {
        for (const fallbackModel of setting.geminiFallbacks) {
          if (!fallbackModel || fallbackModel === setting.geminiPrimary) continue;
          try {
            console.info(`[llmEngine] Switching to Gemini fallback model: ${fallbackModel}`);
            return await streamGeminiModel(fallbackModel, geminiParts);
          } catch (err: any) {
            const msg = `Gemini fallback (${fallbackModel}) failed: ${err.message || err}`;
            console.warn(`[llmEngine] ${msg}`);
            errors.push(msg);
          }
        }
      }
    }

    throw new Error(
      `Semua model AI gagal merespon:\n${errors.join("\n")}`,
    );
  }

  throw new Error(`Provider AI tidak dikenal: ${setting.activeProvider}`);
}
