import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

export const DEFAULT_GEMINI_CHAT_MODEL = "gemini-2.5-flash";
export const DEFAULT_GEMINI_EMBED_MODEL = "gemini-embedding-001";

function getGenAI(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Get Gemini model for chat / text generation (generateContent, streamGenerateContent)
 * Reads GEMINI_CHAT_MODEL from environment variables, defaulting to "gemini-2.5-flash".
 */
export function getGeminiChatModel(customModel?: string): GenerativeModel {
  const genAI = getGenAI();
  const modelName =
    customModel ||
    process.env.GEMINI_CHAT_MODEL ||
    DEFAULT_GEMINI_CHAT_MODEL;
  return genAI.getGenerativeModel({ model: modelName });
}

/**
 * Alias for getGeminiChatModel for backward compatibility.
 */
export function getGeminiModel(customModel?: string): GenerativeModel {
  return getGeminiChatModel(customModel);
}

/**
 * Get Gemini model for embeddings (embedContent, batchEmbedContents)
 * Reads GEMINI_EMBED_MODEL from environment variables, defaulting to "gemini-embedding-001".
 */
export function getGeminiEmbeddingModel(customModel?: string): GenerativeModel {
  const genAI = getGenAI();
  const modelName =
    customModel ||
    process.env.GEMINI_EMBED_MODEL ||
    DEFAULT_GEMINI_EMBED_MODEL;
  return genAI.getGenerativeModel({ model: modelName });
}
