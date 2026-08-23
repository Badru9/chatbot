import {
  getAiSettingAction,
  updateAiSettingAction,
  testOllamaConnectionAction,
} from "@/lib/server/actions/aiSettings";
import type { AiSettingData } from "@/lib/server/services/llmEngine";

export type { AiSettingData };

export async function fetchAiSetting(): Promise<AiSettingData> {
  return getAiSettingAction();
}

export async function updateAiSetting(
  payload: Partial<AiSettingData>,
): Promise<AiSettingData> {
  return updateAiSettingAction(payload);
}

export async function testOllamaConnection(baseUrl: string): Promise<{
  online: boolean;
  models: string[];
  message: string;
}> {
  return testOllamaConnectionAction(baseUrl);
}
