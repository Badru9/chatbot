# Gemini Embeddings Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate document embeddings from OpenAI to Google Gemini `text-embedding-004` (768 dimensions), updating Prisma schema, modifying embedding services, keeping legacy OpenAI code commented, and verifying end-to-end RAG ingestion & retrieval.

**Architecture:** We use Google's `@google/generative-ai` SDK with `text-embedding-004` model. Search queries use `TaskType.RETRIEVAL_QUERY` and document chunks use `TaskType.RETRIEVAL_DOCUMENT`. Database vector dimension in PostgreSQL pgvector is updated from 1024 to 768.

**Tech Stack:** Next.js 16 (App Router), Prisma 7, PostgreSQL + pgvector, `@google/generative-ai`, TypeScript.

## Global Constraints

- Preserve legacy OpenAI embedding code in comments inside `lib/server/services/embeddings.ts`.
- Use `text-embedding-004` (768 dimensions) for Google Gemini embeddings.
- Keep the public signature of `embedText(text: string): Promise<number[]>` and `embedTexts(texts: string[]): Promise<number[][]>` intact.
- Truncate / clean up old incompatible 1024-dimension records from `vectors` table prior to altering column type.

---

### Task 1: Database Schema & Migration Update

**Files:**
- Modify: `prisma/schema.prisma:20`

**Interfaces:**
- Produces: `PdfChunk` model with `vector(768)` embedding field.

- [ ] **Step 1: Update `prisma/schema.prisma`**
Change `embedding Unsupported("vector(1024)")` to `embedding Unsupported("vector(768)")`.

- [ ] **Step 2: Apply database migration and regenerate Prisma Client**
Truncate `vectors` table if necessary, apply schema changes, and run `npx prisma generate`.

- [ ] **Step 3: Verify Prisma generation**
Ensure Prisma client generates cleanly without TypeScript or schema errors.

---

### Task 2: Update Gemini Helper & Embeddings Service

**Files:**
- Modify: `lib/server/services/gemini.ts:3-45`
- Modify: `lib/server/services/embeddings.ts:1-80`

**Interfaces:**
- Consumes: `@google/generative-ai`, `process.env.GEMINI_API_KEY`
- Produces:
  - `embedText(text: string): Promise<number[]>` (768 dimensions)
  - `embedTexts(texts: string[]): Promise<number[][]>` (768 dimensions per text)

- [ ] **Step 1: Update default model in `lib/server/services/gemini.ts`**
Set `DEFAULT_GEMINI_EMBED_MODEL = "text-embedding-004"`.

- [ ] **Step 2: Update `lib/server/services/embeddings.ts`**
Comment out legacy OpenAI code and implement `embedText` and `embedTexts` using `@google/generative-ai` with `TaskType.RETRIEVAL_QUERY` and `TaskType.RETRIEVAL_DOCUMENT`.

- [ ] **Step 3: Test Gemini embedding generation with automated script**
Run a test script with `npx tsx` to ensure 768-dimension vectors are returned from both single and batch methods.

---

### Task 3: Ingestion & Retrieval Pipeline Verification

**Files:**
- Test: `lib/server/services/ingestion.ts`
- Test: `lib/server/services/retriever.ts`

**Interfaces:**
- Consumes: `embedText`, `embedTexts`, `searchPdfChunks`, `replacePdfChunks`

- [ ] **Step 1: Verify ingestion flow**
Test `ingestPdfBuffer` with a sample PDF or text chunks to ensure vectors are inserted into PostgreSQL with 768 dimensions.

- [ ] **Step 2: Verify retrieval flow**
Test `retrievePdfChunks` to ensure cosine similarity search returns valid scored chunks.

- [ ] **Step 3: Verification complete**
Confirm full pipeline operation.
