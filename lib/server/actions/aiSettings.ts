"use server";

import { geminiFallbacks } from "@/constants";
import { prisma } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/middleware/auth";
import { aiSettingUpdateSchema } from "@/lib/server/middleware/validators";
import {
  invalidateAiSettingCache,
  type AiSettingData,
} from "@/lib/server/services/llmEngine";
import { fetchOllamaModels } from "@/lib/server/services/ollama";

const DEFAULT_SETTINGS = {
  activeProvider: "gemini",
  geminiPrimary: "gemini-3.8-flash",
  geminiFallbacks,
  ollamaBaseUrl: "http://localhost:11434",
  ollamaModel: "llama3.2",
  enableAutoFallback: true,
  enableCrossFallback: true,
};

/**
 * Retrieves the global AI settings configuration (Admin only).
 */
export async function getAiSettingAction(): Promise<AiSettingData> {
  await requireAdmin();

  let setting = await prisma.aiSetting.findUnique({
    where: { id: "default" },
  });

  if (!setting) {
    setting = await prisma.aiSetting.create({
      data: {
        id: "default",
        ...DEFAULT_SETTINGS,
      },
    });
  }

  return setting as AiSettingData;
}

/**
 * Updates the global AI settings configuration (Admin only).
 */
export async function updateAiSettingAction(
  input: Partial<{
    activeProvider: string;
    geminiPrimary: string;
    geminiFallbacks: string[];
    ollamaBaseUrl: string;
    ollamaModel: string;
    enableAutoFallback: boolean;
    enableCrossFallback: boolean;
  }>,
): Promise<AiSettingData> {
  await requireAdmin();

  const validated = aiSettingUpdateSchema.parse(input);

  const updated = await prisma.aiSetting.upsert({
    where: { id: "default" },
    update: {
      ...(validated.activeProvider !== undefined && {
        activeProvider: validated.activeProvider,
      }),
      ...(validated.geminiPrimary !== undefined && {
        geminiPrimary: validated.geminiPrimary.trim(),
      }),
      ...(validated.geminiFallbacks !== undefined && {
        geminiFallbacks: validated.geminiFallbacks,
      }),
      ...(validated.ollamaBaseUrl !== undefined && {
        ollamaBaseUrl: validated.ollamaBaseUrl.trim(),
      }),
      ...(validated.ollamaModel !== undefined && {
        ollamaModel: validated.ollamaModel.trim(),
      }),
      ...(validated.enableAutoFallback !== undefined && {
        enableAutoFallback: validated.enableAutoFallback,
      }),
      ...(validated.enableCrossFallback !== undefined && {
        enableCrossFallback: validated.enableCrossFallback,
      }),
    },
    create: {
      id: "default",
      activeProvider:
        validated.activeProvider ?? DEFAULT_SETTINGS.activeProvider,
      geminiPrimary: validated.geminiPrimary ?? DEFAULT_SETTINGS.geminiPrimary,
      geminiFallbacks:
        validated.geminiFallbacks ?? DEFAULT_SETTINGS.geminiFallbacks,
      ollamaBaseUrl: validated.ollamaBaseUrl ?? DEFAULT_SETTINGS.ollamaBaseUrl,
      ollamaModel: validated.ollamaModel ?? DEFAULT_SETTINGS.ollamaModel,
      enableAutoFallback:
        validated.enableAutoFallback ?? DEFAULT_SETTINGS.enableAutoFallback,
      enableCrossFallback:
        validated.enableCrossFallback ?? DEFAULT_SETTINGS.enableCrossFallback,
    },
  });

  invalidateAiSettingCache();

  return updated as AiSettingData;
}

/**
 * Tests connection to an Ollama server and lists installed models (Admin only).
 */
export async function testOllamaConnectionAction(baseUrl: string): Promise<{
  online: boolean;
  models: string[];
  message: string;
}> {
  await requireAdmin();

  const result = await fetchOllamaModels(baseUrl);

  return {
    online: result.isOnline,
    models: result.models,
    message: result.isOnline
      ? `Terhubung ke Ollama (${result.models.length} model ditemukan)`
      : result.error || "Gagal terhubung ke Ollama",
  };
}
