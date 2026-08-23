# AI Model Switcher & Hybrid Automatic Fallback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan menu pengelolaan model AI di Admin untuk beralih antara Google Gemini (Cloud) dan Ollama (Lokal), serta menerapkan automatic failover cerdas saat kuota Gemini habis atau server lokal offline.

**Architecture:** Model Prisma `AiSetting` (tabel `ai_settings`) menyimpan konfigurasi aktif global. Service terpadu `llmEngine.ts` menangani streaming token dan failover berantai (Gemini 2.5 Flash $\rightarrow$ 2.0 Flash $\rightarrow$ 1.5 Flash $\rightarrow$ Ollama Lokal). Halaman `/admin/settings` menyediakan UI intuitif untuk memilih provider, menguji koneksi Ollama, dan mengatur fallback.

**Tech Stack:** Next.js 16 (App Router), Prisma ORM, PostgreSQL, Google Generative AI SDK, Ollama REST API, HeroUI, TanStack Query.

## Global Constraints
- Konfigurasi model tersimpan di tabel `ai_settings` dengan ID `default`.
- Chatbot `/api/chat` harus mendukung streaming real-time untuk Gemini maupun Ollama.
- Automatic failover berjalan transparan tanpa error ke user saat terjadi rate limit (429).
- Endpoint yang sudah dihapus (`/api/aisnet-chat`) tidak boleh dipanggil lagi.

---

### Task 1: Prisma Schema & Database Table for `AiSetting`

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `scripts/setup-ai-settings-table.ts`

**Interfaces:**
- Produces model `AiSetting`:
  - `id: String @id @default("default")`
  - `activeProvider: String @default("gemini")` ("gemini" | "ollama")
  - `geminiPrimary: String @default("gemini-2.5-flash")`
  - `geminiFallbacks: String[] @default(["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.0-flash-lite"])`
  - `ollamaBaseUrl: String @default("http://localhost:11434")`
  - `ollamaModel: String @default("llama3.2")`
  - `enableAutoFallback: Boolean @default(true)`
  - `enableCrossFallback: Boolean @default(true)`
  - `updatedAt: DateTime @updatedAt`

- [x] **Step 1: Update `prisma/schema.prisma`**
Tambahkan model `AiSetting` ke skema Prisma.

- [x] **Step 2: Jalankan setup tabel dan generate Prisma Client**
Eksekusi script pembuatan tabel di PostgreSQL dan jalankan `bun run prisma generate`.

- [x] **Step 3: Verifikasi baris default `AiSetting`**
Pastikan terdapat baris record default dengan nilai awal yang valid.

---

### Task 2: Unified LLM Engine & Ollama Service

**Files:**
- Create: `lib/server/services/ollama.ts`
- Create: `lib/server/services/llmEngine.ts`
- Create: `lib/server/actions/aiSettings.ts`

**Interfaces:**
- Produces:
  - `fetchOllamaModels(baseUrl: string): Promise<{ models: string[]; isOnline: boolean; error?: string }>`
  - `streamLlmWithFallback(geminiParts: (string | any)[], promptText: string): Promise<ReadableStream<string>>`
  - `getAiSettingAction(): Promise<AiSetting>`
  - `updateAiSettingAction(input: Partial<AiSetting>): Promise<AiSetting>`
  - `testOllamaConnectionAction(baseUrl: string): Promise<{ online: boolean; models: string[]; message: string }>`

- [x] **Step 1: Buat `lib/server/services/ollama.ts`**
Implementasikan fungsi komunikasi dengan Ollama API (`/api/tags` untuk list model dan `/api/generate` atau `/api/chat` untuk streaming).

- [x] **Step 2: Buat `lib/server/services/llmEngine.ts`**
Implementasikan logika failover berantai:
1. Baca setting aktif dari DB / cache.
2. Jika provider = Gemini: coba Gemini Primary $\rightarrow$ jika 429/quota error, coba Gemini Fallbacks $\rightarrow$ jika gagal semua dan cross-fallback aktif, coba Ollama.
3. Jika provider = Ollama: coba Ollama $\rightarrow$ jika offline/error dan cross-fallback aktif, coba Gemini.

- [x] **Step 3: Buat Server Actions di `lib/server/actions/aiSettings.ts`**
Implementasikan query dan mutasi konfigurasi AI dengan proteksi role `admin`.

---

### Task 3: Integrasi Chat Route (`app/api/chat/route.ts`)

**Files:**
- Modify: `app/api/chat/route.ts`

**Interfaces:**
- Menggantikan pemanggilan langsung `model.generateContentStream` dengan `streamLlmWithFallback`.

- [x] **Step 1: Update `app/api/chat/route.ts`**
Panggil `streamLlmWithFallback(geminiParts, prompt)` untuk menghasilkan `ReadableStream` respon chat.

- [x] **Step 2: Uji alur chat via server action / API**
Pastikan respon streaming mengalir lancar dan token terbaca utuh.

---

### Task 4: Halaman Pengaturan Model AI Admin (`app/admin/settings`)

**Files:**
- Create: `services/aiSettingService.ts`
- Create: `hooks/useAiSettingServices.ts`
- Create: `app/admin/settings/page.tsx`
- Create: `app/admin/settings/components/ProviderCard.tsx`
- Create: `app/admin/settings/components/GeminiSettings.tsx`
- Create: `app/admin/settings/components/OllamaSettings.tsx`
- Create: `app/admin/settings/components/FallbackSettings.tsx`

**Interfaces:**
- Produces: Antarmuka modern untuk Admin:
  - Kartu pemilih provider aktif (Google Gemini vs Local Ollama).
  - Pilihan model utama Gemini & daftar fallback.
  - Input URL Ollama dengan tombol "Test Koneksi" & dropdown model otomatis.
  - Pengaturan toggle Hybrid Fallback.

- [x] **Step 1: Buat client service dan React Query hook**
Implementasikan `aiSettingService.ts` dan `useAiSettingServices.ts`.

- [x] **Step 2: Buat komponen UI pengaturan AI**
Buat kartu visual dan form konfigurasi dengan feedback status koneksi real-time.

- [x] **Step 3: Buat `app/admin/settings/page.tsx`**
Susun halaman pengaturan lengkap dalam layout portal admin.

---

### Task 5: End-to-End Verification & Build Check

**Files:**
- Create: `scripts/test-ai-settings-failover.ts`

- [x] **Step 1: Jalankan integration test script**
Verifikasi:
1. Pengambilan dan pembaruan `AiSetting` di database.
2. Eksekusi fallback berantai saat Gemini simulasi rate limit.
3. Deteksi status server Ollama.
4. Verifikasi isolasi dan integritas chat.

- [x] **Step 2: Jalankan full production build**
Run: `bun run build`
Pastikan kompilasi TypeScript dan static pages berhasil tanpa error.
