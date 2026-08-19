# Design Spec: AISnet Research Data DB & Chatbot System Prompt Integration

**Date**: 2026-08-16  
**Status**: Approved  
**Author**: Antigravity & User

---

## 1. Objective

Integrate the research funding data (`Research`) from a static constant into the PostgreSQL database via Prisma, synchronize the AISnet page (`app/aisnet/page.tsx`) with dynamic database data, and enable `/api/chat` to accurately answer user questions regarding research data, statistics, and financial disbursements (such as "berapa total pencairan?") using dynamic database context and injected `systemPrompt`.

---

## 2. Architecture & Data Flow

```
+-------------------------------------------------------------+
| PostgreSQL Database                                         |
|  - Table: `research` (All proposals, stages, funding, etc.)  |
+-------------------------------------------------------------+
               ^                                  ^
               | (1) Fetch for UI                 | (3) Query for LLM context
               v                                  v
+-----------------------------+       +------------------------------------+
| AISnet Page                 |       | Chatbot Backend Route              |
|  - `app/aisnet/page.tsx`    |       |  - `app/api/chat/route.ts`         |
|  - Fetches from `/api/research`      |  - Reads Research table from DB    |
|  - Renders Table & Chat modal|       |  - Injects `systemPrompt` / context|
+-----------------------------+       |  - Streams Gemini response         |
               |                      +------------------------------------+
               | (2) Opens Chat & sends prompt
               v
+-----------------------------+
| Chatbot Component           |
|  - `app/components/Chatbot` |
+-----------------------------+
```

---

## 3. Detailed Specifications

### 3.1 Database Layer (Prisma)

- **Model `Research`** in `prisma/schema.prisma`:
  - `id`: `Int @id @default(autoincrement())` (or preserves external ID)
  - `trPengusulanId`: `Int @map("tr_pengusulan_id")`
  - `tahap`: `String`
  - `dokumenPengajuan`: `String? @map("dokumen_pengajuan")`
  - `biaya`: `String`
  - `validasiStafLppm`: `Int @default(0) @map("validasi_staf_lppm")`
  - `validasiLppm`: `Int @default(0) @map("validasi_lppm")`
  - `validasiRektor`: `Int @default(0) @map("validasi_rektor")`
  - `status`: `Int @default(0)`
  - `tanggal`: `String`
  - `catatan`: `String?`
  - `slip`: `String?`
  - `jenis`: `String` (e.g., "PENELITIAN", "PKM")
  - `judul`: `String` @db.Text
  - `rencanaLuaran`: `String? @map("rencana_luaran") @db.Text`
  - `danaInternal`: `Float? @map("dana_internal")`
  - `namaDosen`: `String @map("nama_dosen")`
  - `jenisPencairan`: `String @map("jenis_pencairan")`
  - `createdAt`: `DateTime @default(now()) @map("created_at")`
  - `updatedAt`: `DateTime @updatedAt @map("updated_at")`
  - `@@map("research")`

- **Seed Script (`prisma/seed-research.ts` or `prisma/seed.ts`)**:
  - Populates initial records from existing `researchData` in `constants.ts` so no sample data is lost.

### 3.2 API Layer (`/api/research`)

- **Route**: `GET /api/research`
- **Output**: Array of `Research` items ordered by `id` descending or `tanggal` descending.
- **Cache / Query**: Fast retrieval for frontend React Query / Server fetch.

### 3.3 Frontend AISnet Synchronization

- Modify `app/aisnet/page.tsx`:
  - Fetch data from `/api/research` with fallback to `researchData`.
  - Pass the dynamic research list to `AiAssistantModal` and table renderers.

### 3.4 Chat Route & LLM Context (`/api/chat`)

- In `lib/server/middleware/validators.ts`:
  - Expand `systemPrompt` max length in `chatSchema` from 10,000 to 50,000 characters to prevent validation failures on large context.
- In `app/api/chat/route.ts`:
  - Read research records from `prisma.research.findMany()`.
  - Build formatted summary of research data (including total pencairan, status breakdown, list of research with titles, researchers, and amounts).
  - If `systemPrompt` is passed in request body, append it directly into `geminiParts` as structured context.
  - Update `geminiParts` context block to include research database context so queries like _"berapa total pencairan?"_ or _"tampilkan penelitian oleh Kacung Napitupulu"_ are answered precisely with real database numbers.
  - Fix any parsing errors so `systemPrompt` does not throw 400.

---

## 4. Error Handling & Edge Cases

1. **Database Empty**: If `Research` table has 0 rows, fallback gracefully to empty context without breaking the chat stream.
2. **Very Large Context**: Format research summary cleanly (ID, Judul, Dosen, Biaya, Jenis, Status) rather than dumping raw unparsed JSON metadata to optimize token usage.
3. **Prompt Injection / Safety**: Treat page context as raw data in `<page_context>` and enforce system instructions so user cannot override safety guidelines.

---

## 5. Verification & Testing Plan

1. **Migration & Seed**: Run Prisma migration and seed script; verify records exist in PostgreSQL database.
2. **API Verification**: Check `GET /api/research` returns seeded research records.
3. **AISnet Page**: Verify `http://localhost:3000/aisnet` loads data from DB.
4. **Chatbot Prompt Test**: Open Chatbot modal on AISnet page, ask _"berapa total pencairan?"_ and verify the AI computes and responds with the exact total (`13.500.000` / sum of all records in DB).
