# Design Specification: Migrasi Embedding ke Google Gemini

**Tanggal:** 2026-08-18  
**Status:** Approved  
**Topik:** Migrasi Document Embeddings dari OpenAI ke Google Gemini (`text-embedding-004`)

---

## 1. Latar Belakang & Tujuan
Saat ini aplikasi chatbot menggunakan endpoint embedding dari OpenAI (`text-embedding-3-small` / OpenAI-compatible API). Karena adanya batasan kuota/biaya API pada OpenAI untuk tahap development, sistem embedding akan dimigrasikan ke **Google Gemini (`text-embedding-004`)** yang menyediakan Free Tier via Google AI Studio tanpa biaya tambahan.

Kode lama yang menggunakan OpenAI akan tetap dipertahankan dalam bentuk komentar agar dapat diaktifkan kembali sewaktu-waktu jika diperlukan.

---

## 2. Arsitektur & Perubahan

### 2.1 Database & Schema (Prisma / PostgreSQL pgvector)
- **Tabel:** `vectors` (Model: `PdfChunk`)
- **Perubahan Dimensi Kolom:**
  - Sebelumnya: `embedding Unsupported("vector(1024)")`
  - Menjadi: `embedding Unsupported("vector(768)")`
- **Penanganan Data Eksisting:**
  - Data pada tabel `vectors` akan direset/dikosongkan (`TRUNCATE TABLE vectors;` / migration reset) karena data vektor 1024-dim tidak kompatibel dengan 768-dim.
  - Dokumen PDF dapat di-upload ulang setelah migrasi selesai.

### 2.2 Service Helper Gemini (`lib/server/services/gemini.ts`)
- Memastikan konfigurasi default model embedding mengarah ke `text-embedding-004`:
  - `DEFAULT_GEMINI_EMBED_MODEL = "text-embedding-004"`
  - Helper `getGeminiEmbeddingModel()` mengekstrak model dari environment variable `GEMINI_EMBED_MODEL` atau default.

### 2.3 Service Embeddings (`lib/server/services/embeddings.ts`)
- Mengganti implementasi aktif `embedText` dan `embedTexts` dengan SDK `@google/generative-ai`:
  - **`embedText(text: string)`**:
    - Menggunakan `model.embedContent({ content: { role: "user", parts: [{ text }] }, taskType: TaskType.RETRIEVAL_QUERY })`.
    - Mengembalikan `number[]` (768 dimensi).
  - **`embedTexts(texts: string[])`**:
    - Menggunakan `model.batchEmbedContents({ requests: [...] })` dengan `TaskType.RETRIEVAL_DOCUMENT`.
    - Menggunakan batching (misal ukuran batch 50-100) untuk stabilitas request.
    - Mengembalikan `number[][]`.
- **Kode OpenAI Lama:**
  - Fungsi `fetchEmbeddings` dan konfigurasi OpenAI lama dipertahankan dalam blok komentar dengan dokumentasi yang jelas.

### 2.4 Integrasi Pipeline Ingest & Retrieve
- **`lib/server/services/ingestion.ts`**:
  - Tetap memanggil `embedTexts(chunks.map(c => c.chunkText))` dan menyimpan ke database via `replacePdfChunks`.
- **`lib/server/services/retriever.ts`**:
  - Tetap memanggil `embedText(prompt)` untuk mencari kemiripan chunk via `searchPdfChunks`.

---

## 3. Rencana Verifikasi
1. **Verifikasi Skema Database**: Pastikan Prisma Client ter-generate dengan tipe `vector(768)` dan tabel `vectors` berhasil dimigrasi.
2. **Verifikasi Service Embedding**: Menjalankan test/script untuk memastikan `embedText` dan `embedTexts` menghasilkan vektor 768 dimensi menggunakan `GEMINI_API_KEY`.
3. **Verifikasi Upload PDF**: Menguji upload dokumen PDF baru dan memverifikasi chunk serta embedding tersimpan di tabel `vectors`.
4. **Verifikasi Chat/Search**: Menguji retrieval RAG dengan query dokumen untuk memastikan kalkulasi similarity bekerja dengan akurat.
