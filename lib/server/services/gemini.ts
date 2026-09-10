import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_CHAT_MODEL || "gemini-3.8-flash";
const embeddingModelName =
  process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-2";

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export function getGeminiModel() {
  return genAI.getGenerativeModel({ model: modelName });
}

export function getGeminiChatModel() {
  const model = genAI.getGenerativeModel({ model: embeddingModelName });

  return model;
}
