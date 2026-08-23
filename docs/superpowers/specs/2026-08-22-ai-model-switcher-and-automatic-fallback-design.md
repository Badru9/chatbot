# Design Document: AI Model Switcher & Hybrid Automatic Fallback

## 1. Overview & Problem Statement
Saat ini sistem bergantung sepenuhnya pada model `gemini-2.5-flash`. Apabila kuota atau rate limit model tersebut habis (error `429: Resource Exhausted`), chatbot akan berhenti merespon. Selain itu, belum tersedia antarmuka bagi Admin untuk mengalihkan pemrosesan AI ke model lokal (Ollama) saat ingin menghemat kuota cloud atau saat server lokal tersedia.

### Tujuan Desain:
1. **Peralihan Dinamis (Admin Model Switcher)**: Admin dapat berganti antara mode **Cloud (Google Gemini)** dan mode **Local (Ollama)** langsung dari menu antarmuka Admin tanpa perlu mengubah kode atau me-restart server.
2. **Hybrid Automatic Fallback**:
   - Jika mode **Gemini** aktif dan terkena rate limit `429`, sistem otomatis mencoba model Gemini cadangan secara berantai (`gemini-2.5-flash` $\rightarrow$ `gemini-2.0-flash` $\rightarrow$ `gemini-1.5-flash`).
   - Jika seluruh model Gemini gagal, sistem otomatis beralih ke server Local Ollama (jika fallback lintas provider diaktifkan).
   - Jika mode **Local Ollama** aktif namun server lokal offline/unreachable, sistem otomatis mengalihkan permintaan ke Gemini Cloud.
3. **Dukungan Streaming Real-Time**: Kedua engine (Gemini & Ollama) mendukung streaming token bertahap ke frontend.

---

## 2. Architecture Decision Records (ADR)

### ADR-001: Penyimpanan Konfigurasi AI di Database PostgreSQL
- **Konteks**: Pengaturan provider AI (Gemini vs Ollama) dan fallback chain harus dapat diubah sewaktu-waktu oleh Admin dan langsung berdampak ke seluruh request chat.
- **Keputusan**: Membuat model Prisma `AiSetting` (tabel `ai_settings`) dengan satu baris konfigurasi global (`isSingleton: true` atau `id: "default"`), dilengkapi in-memory caching berdurasi singkat (30 detik) agar tidak membebani query database di setiap chat.
- **Konsekuensi**: Admin dapat mengubah model aktif kapan saja dari UI secara instan.

### ADR-002: Arsitektur Engine AI Terpadu (Unified LLM Client)
- **Konteks**: Endpoint `/api/chat` membutuhkan antarmuka streaming yang seragam dan tangguh, baik saat memanggil Gemini SDK maupun Ollama REST API (`/api/chat` atau `/api/generate`).
- **Keputusan**: Membuat layer abstraksi di [`lib/server/services/llmEngine.ts`](file:///d:/Badru/Projects/chatbot/lib/server/services/llmEngine.ts) yang mengimplementasikan metode `streamLlmResponse(parts, options)` dengan penanganan failover otomatis.

---

## 3. Data Model (`prisma/schema.prisma`)

```prisma
model AiSetting {
  id               String   @id @default("default")
  activeProvider   String   @default("gemini") @map("active_provider") // "gemini" | "ollama"
  geminiPrimary    String   @default("gemini-2.5-flash") @map("gemini_primary")
  geminiFallbacks  String[] @default(["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.0-flash-lite"]) @map("gemini_fallbacks")
  ollamaBaseUrl    String   @default("http://localhost:11434") @map("ollama_base_url")
  ollamaModel      String   @default("llama3.2") @map("ollama_model")
  enableAutoFallback Boolean @default(true) @map("enable_auto_fallback")
  enableCrossFallback Boolean @default(true) @map("enable_cross_fallback")
  updatedAt        DateTime @updatedAt @map("updated_at")

  @@map("ai_settings")
}
```

---

## 4. Failover Flowchart

```text
User Message Arrival
       │
       ▼
Fetch Active AI Configuration (DB / Cache)
       │
       ├─────────────────────────────────┬─────────────────────────────────┐
       ▼                                 ▼                                 ▼
[Active: GEMINI]                                                   [Active: OLLAMA]
       │                                                                   │
Try geminiPrimary (e.g. gemini-2.5-flash)                          Try ollamaModel via ollamaBaseUrl
       │                                                                   │
       ├─────────────── Success? ───> [STREAM TO USER]                    ├─────────────── Success? ───> [STREAM TO USER]
       │                                                                   │
  (Error 429/Limit)                                                  (Offline / Timeout)
       │                                                                   │
Iterate geminiFallbacks sequentially                                Cross-fallback enabled?
  (gemini-2.0-flash -> gemini-1.5-flash)                                   │
       │                                                                   ├─ Yes ──> Try Gemini Cloud (Primary)
       ├─────────────── Success? ───> [STREAM TO USER]                     │           └─ Success ──> [STREAM TO USER]
       │                                                                   └─ No ───> Return Friendly Error
  (All Cloud Failed)
       │
Cross-fallback enabled?
       │
       ├─ Yes ──> Try Local Ollama
       │           └─ Success ──> [STREAM TO USER]
       └─ No ───> Return Error Quota
```

---

## 5. Komponen & Halaman Admin

### 5.1 Server Actions (`lib/server/actions/aiSettings.ts`)
- `getAiSettingAction()`: Mengambil konfigurasi aktif AI.
- `updateAiSettingAction(input)`: Memperbarui provider, model utama, dan aturan fallback.
- `testOllamaConnectionAction(baseUrl)`: Melakukan ping ke server Ollama dan mengambil daftar model yang terpasang (`tags`).

### 5.2 Halaman Admin (`app/admin/settings/page.tsx`)
- **Card Pilihan Provider**: Switch / Radio visual antara **Google Gemini Cloud** dan **Local Ollama**.
- **Panel Gemini**: Dropdown model utama, daftar model cadangan yang dapat diatur.
- **Panel Ollama**: Input URL server Ollama, tombol *Test Koneksi*, dan dropdown pilihan model yang otomatis terisi dari model yang ada di mesin lokal.
- **Panel Aturan Fallback**: Toggle aktifkan *Automatic Fallback* dan *Cross-Provider Fallback*.

---

## 6. Integrasi Chat Endpoint (`app/api/chat/route.ts`)
- Menggantikan pemanggilan langsung `model.generateContentStream` dengan `streamLlmWithFallback(geminiParts)`.
- Respon yang dialirkan tetap berupa `ReadableStream` teks murni sehingga frontend React tidak memerlukan perubahan kode rendering Markdown.
