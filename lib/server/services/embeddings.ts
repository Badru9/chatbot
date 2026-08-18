import "server-only";
import { TaskType } from "@google/generative-ai";
import { getGeminiEmbeddingModel } from "./gemini";

/**
 * Embeddings service — Google Gemini (text-embedding-004, 768 dimensions).
 * Uses free tier API from Google AI Studio.
 */

/**
 * Generate embedding for a single text query (e.g. search / RAG retrieval).
 */
export async function embedText(text: string): Promise<number[]> {
  try {
    const model = getGeminiEmbeddingModel();
    const result = await model.embedContent({
      content: { role: "user", parts: [{ text }] },
      taskType: TaskType.RETRIEVAL_QUERY,
      outputDimensionality: 768,
    } as any);
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating Gemini embedding:", error);
    throw new Error("Gagal membuat embedding dokumen.");
  }
}

/**
 * Generate embeddings for multiple texts in batch (e.g. PDF document chunks).
 */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  try {
    const model = getGeminiEmbeddingModel();
    const BATCH_SIZE = 50; // Ukuran batch aman untuk request Gemini batchEmbedContents
    const results: number[][] = [];

    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE);
      const res = await model.batchEmbedContents({
        requests: batch.map((text) => ({
          content: { role: "user", parts: [{ text }] },
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          outputDimensionality: 768,
        } as any)),
      });

      const batchVectors = res.embeddings.map((e) => e.values);
      results.push(...batchVectors);
    }

    return results;
  } catch (error) {
    console.error("Error generating batch Gemini embeddings:", error);
    throw new Error("Gagal membuat embedding dokumen dalam batch.");
  }
}

/* =========================================================================
 * LEGACY / BACKUP: OpenAI Embedding Implementation
 * Simpan untuk referensi jika ingin beralih kembali ke OpenAI di masa mendatang.
 * =========================================================================
 *
 * const OPENAI_MODEL = "text-embedding-3-small";
 *
 * const baseUrl = (
 *   process.env.OPENAI_API_KEY
 *     ? process.env.OPENAI_URL || "https://api.openai.com/v1"
 *     : process.env.LOCAL_MODEL_URL || "http://localhost:11434/v1"
 * ).replace(/\/embeddings\/?$/, "");
 *
 * const model = process.env.OPENAI_API_KEY
 *   ? OPENAI_MODEL
 *   : process.env.LOCAL_EMBEDDING_MODEL || "mxbai-embed-large";
 *
 * interface EmbeddingResponse {
 *   data: { embedding: number[]; index: number }[];
 * }
 *
 * async function fetchOpenAIEmbeddings(input: string[]): Promise<number[][]> {
 *   const res = await fetch(`${baseUrl}/embeddings`, {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *       ...(process.env.OPENAI_API_KEY && {
 *         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
 *       }),
 *     },
 *     body: JSON.stringify({ model, input }),
 *   });
 *
 *   if (!res.ok) {
 *     const text = await res.text();
 *     throw new Error(`Embedding API error ${res.status}: ${text}`);
 *   }
 *
 *   const json: EmbeddingResponse = await res.json();
 *   return json.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
 * }
 */
