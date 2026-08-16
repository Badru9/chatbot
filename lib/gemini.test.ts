import test from "node:test";
import assert from "node:assert";
import {
  getGeminiChatModel,
  getGeminiModel,
  getGeminiEmbeddingModel,
  DEFAULT_GEMINI_CHAT_MODEL,
  DEFAULT_GEMINI_EMBED_MODEL,
} from "./server/services/gemini.js";

test("Gemini Service: throws error when GEMINI_API_KEY is missing", () => {
  const originalKey = process.env.GEMINI_API_KEY;
  try {
    delete process.env.GEMINI_API_KEY;
    assert.throws(() => getGeminiChatModel(), {
      message: "GEMINI_API_KEY is not set in environment variables",
    });
  } finally {
    process.env.GEMINI_API_KEY = originalKey;
  }
});

test("Gemini Service: getGeminiChatModel uses default model", () => {
  const originalKey = process.env.GEMINI_API_KEY;
  const originalModel = process.env.GEMINI_CHAT_MODEL;
  try {
    process.env.GEMINI_API_KEY = "test-api-key";
    delete process.env.GEMINI_CHAT_MODEL;

    const model = getGeminiChatModel();
    assert.strictEqual(model.model, `models/${DEFAULT_GEMINI_CHAT_MODEL}`);
    assert.strictEqual(model.model, "models/gemini-2.5-flash");
  } finally {
    process.env.GEMINI_API_KEY = originalKey;
    process.env.GEMINI_CHAT_MODEL = originalModel;
  }
});

test("Gemini Service: getGeminiChatModel respects GEMINI_CHAT_MODEL env var", () => {
  const originalKey = process.env.GEMINI_API_KEY;
  const originalModel = process.env.GEMINI_CHAT_MODEL;
  try {
    process.env.GEMINI_API_KEY = "test-api-key";
    process.env.GEMINI_CHAT_MODEL = "gemini-2.5-pro";

    const model = getGeminiChatModel();
    assert.strictEqual(model.model, "models/gemini-2.5-pro");
  } finally {
    process.env.GEMINI_API_KEY = originalKey;
    process.env.GEMINI_CHAT_MODEL = originalModel;
  }
});

test("Gemini Service: getGeminiModel works as an alias for getGeminiChatModel", () => {
  const originalKey = process.env.GEMINI_API_KEY;
  try {
    process.env.GEMINI_API_KEY = "test-api-key";
    delete process.env.GEMINI_CHAT_MODEL;

    const model = getGeminiModel();
    assert.strictEqual(model.model, `models/${DEFAULT_GEMINI_CHAT_MODEL}`);
  } finally {
    process.env.GEMINI_API_KEY = originalKey;
  }
});

test("Gemini Service: getGeminiEmbeddingModel uses default model", () => {
  const originalKey = process.env.GEMINI_API_KEY;
  const originalEmbedModel = process.env.GEMINI_EMBED_MODEL;
  try {
    process.env.GEMINI_API_KEY = "test-api-key";
    delete process.env.GEMINI_EMBED_MODEL;

    const model = getGeminiEmbeddingModel();
    assert.strictEqual(model.model, `models/${DEFAULT_GEMINI_EMBED_MODEL}`);
    assert.strictEqual(model.model, "models/gemini-embedding-001");
  } finally {
    process.env.GEMINI_API_KEY = originalKey;
    process.env.GEMINI_EMBED_MODEL = originalEmbedModel;
  }
});

test("Gemini Service: getGeminiEmbeddingModel respects GEMINI_EMBED_MODEL env var", () => {
  const originalKey = process.env.GEMINI_API_KEY;
  const originalEmbedModel = process.env.GEMINI_EMBED_MODEL;
  try {
    process.env.GEMINI_API_KEY = "test-api-key";
    process.env.GEMINI_EMBED_MODEL = "text-embedding-004";

    const model = getGeminiEmbeddingModel();
    assert.strictEqual(model.model, "models/text-embedding-004");
  } finally {
    process.env.GEMINI_API_KEY = originalKey;
    process.env.GEMINI_EMBED_MODEL = originalEmbedModel;
  }
});

test("Gemini Service: supports custom model override parameter", () => {
  const originalKey = process.env.GEMINI_API_KEY;
  try {
    process.env.GEMINI_API_KEY = "test-api-key";

    const chatModel = getGeminiChatModel("gemini-1.5-flash");
    assert.strictEqual(chatModel.model, "models/gemini-1.5-flash");

    const embedModel = getGeminiEmbeddingModel("gemini-embedding-2");
    assert.strictEqual(embedModel.model, "models/gemini-embedding-2");
  } finally {
    process.env.GEMINI_API_KEY = originalKey;
  }
});
