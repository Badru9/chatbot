# Admin System Knowledge Datasets & Dosen Document Isolation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pisahkan dataset manual Admin ke dalam tabel database tersendiri (`Dataset`) yang otomatis diinjeksi ke dalam `systemPrompt` saat chat, dan isolasi library dokumen agar Dosen hanya melihat file PDF miliknya sendiri.

**Architecture:** Model Prisma `Dataset` menyimpan data teks/markdown/json sistem yang dikelola Admin. Di `/api/chat`, seluruh dataset aktif otomatis dimuat dan digabungkan ke `systemPrompt`. Library dokumen PDF dipertahankan murni per-user di tabel `vectors` tanpa mencemari library Dosen.

**Tech Stack:** Next.js 16 (App Router), Prisma ORM, PostgreSQL (pgvector), Tailwind CSS, HeroUI, TanStack Query, Gemini API.

## Global Constraints
- Admin dataset tersimpan di tabel `datasets` (bukan di `vectors`).
- Seluruh dataset yang `isActive === true` diinjeksi ke `systemPrompt` di `/api/chat`.
- Library dokumen di sisi Dosen hanya memuat file yang diunggah oleh `userId` Dosen tersebut.
- Gaya bahasa respon AI wajib menerapkan aturan Unslop (lugas, tanpa basa-basi robotik).

---

### Task 1: Prisma Schema & Database Migration for `Dataset` Model

**Files:**
- Modify: `prisma/schema.prisma:145-172`

**Interfaces:**
- Produces: `prisma.dataset` model dengan kolom:
  - `id: String @id @default(uuid())`
  - `name: String`
  - `description: String?`
  - `content: String @db.Text`
  - `source: String?`
  - `isActive: Boolean @default(true) @map("is_active")`
  - `createdBy: String @map("created_by")`
  - `createdAt: DateTime @default(now()) @map("created_at")`
  - `updatedAt: DateTime @updatedAt @map("updated_at")`

- [ ] **Step 1: Update schema.prisma**
Tambahkan model `Dataset` ke `prisma/schema.prisma`.

- [ ] **Step 2: Jalankan migration & generate Prisma Client**
Run: `bun run prisma db push && bun run prisma generate`

- [ ] **Step 3: Verifikasi model di database**
Run script verifikasi untuk memastikan tabel `datasets` dapat diakses oleh Prisma Client.

---

### Task 2: Dataset Backend Server Actions & Validation

**Files:**
- Modify: `lib/server/middleware/validators.ts`
- Create: `lib/server/actions/datasets.ts`

**Interfaces:**
- Produces:
  - `fetchDatasetsAction(options?: { activeOnly?: boolean })`
  - `createDatasetAction(input: { name: string; description?: string; content: string; source?: string })`
  - `updateDatasetAction(id: string, input: { name: string; description?: string; content: string; source?: string; isActive?: boolean })`
  - `toggleDatasetStatusAction(id: string, isActive: boolean)`
  - `deleteDatasetAction(id: string)`
  - `getActiveDatasetsContextAction(): Promise<string>`

- [ ] **Step 1: Tambahkan validator Zod di `validators.ts`**
Buat `datasetSchema` dan `datasetUpdateSchema`.

- [ ] **Step 2: Buat server actions di `lib/server/actions/datasets.ts`**
Implementasikan fungsi CRUD dan fungsi penyusun context string dataset aktif.

- [ ] **Step 3: Buat unit/integration test untuk dataset actions**
Uji pembuatan dataset baru, pembaruan status aktif, dan pengambilan konteks.

---

### Task 3: Chat Endpoint System Prompt Integration & Document Library Cleanup

**Files:**
- Modify: `app/api/chat/route.ts`
- Modify: `lib/server/actions/documents.ts`

**Interfaces:**
- Consumes: `prisma.dataset` aktif untuk `systemPrompt`.
- Modifies: `fetchDocumentsAction` agar hanya mengembalikan dokumen milik `user.id` (untuk dosen) tanpa mencampur manual dataset.

- [ ] **Step 1: Update `app/api/chat/route.ts`**
Ambil dataset berstatus `isActive: true` dari `prisma.dataset`, format ke dalam blok `<system_knowledge_datasets>`, lalu sisipkan ke `geminiParts`.

- [ ] **Step 2: Bersihkan `lib/server/actions/documents.ts`**
Pastikan `fetchDocumentsAction` hanya memfilter dokumen per user (`userId: user.id`), dan hapus dependensi ke legacy `manual-*` dataset.

- [ ] **Step 3: Migrasikan dataset manual legacy dan bersihkan chunk `manual-*` di tabel `vectors`**
Pindahkan teks dari `manual-*` ke tabel `datasets`, lalu hapus chunk `manual-*` dari `vectors`.

---

### Task 4: Admin Datasets Management Page Overhaul

**Files:**
- Create: `services/datasetService.ts`
- Create: `hooks/useDatasetServices.ts`
- Modify: `app/admin/datasets/page.tsx`
- Modify: `app/admin/datasets/components/Header.tsx`
- Modify: `app/admin/datasets/components/Stats.tsx`
- Modify: `app/admin/datasets/components/DatasetTable.tsx`
- Modify: `app/admin/datasets/components/Modals.tsx`

**Interfaces:**
- Produces: UI admin interaktif untuk mengelola Basis Pengetahuan Sistem:
  - Tabel dataset dengan badge status aktif/non-aktif dan toggle switch.
  - Modal tambah dan edit dataset dengan tombol cepat template (*Pedoman Skripsi* & *Data Dosen*).
  - Modal pratinjau konten dataset (Markdown/JSON).
  - Modal konfirmasi hapus dataset.

- [ ] **Step 1: Buat `services/datasetService.ts` dan `hooks/useDatasetServices.ts`**
Implementasikan react-query hooks untuk fetch, create, update, toggle, dan delete dataset.

- [ ] **Step 2: Perbarui komponen modal dan tabel di `app/admin/datasets/components/`**
Sesuaikan form input dan tampilan data agar menampilkan atribut dataset sistem.

- [ ] **Step 3: Perbarui `app/admin/datasets/page.tsx`**
Hubungkan semua hook dan handler state pada halaman utama Admin Datasets.

---

### Task 5: End-to-End Verification & Build Check

**Files:**
- Test: `scripts/test-dataset-integration.ts`

- [ ] **Step 1: Jalankan integration test script**
Verifikasi alur data:
1. Admin membuat dataset manual (*Pedoman Penulisan Skripsi*).
2. Dosen bertanya di chat tentang syarat/alur skripsi tanpa memilih/mention file.
3. AI memberikan jawaban yang tepat berdasarkan isi dataset manual dan gaya bahasa Unslop.
4. Library dokumen Dosen diverifikasi tidak tercampur file sistem admin.

- [ ] **Step 2: Jalankan full production build**
Run: `bun run build`
Pastikan tidak ada error TypeScript atau kompilasi halaman Next.js.
