# Design Document: Admin System Knowledge Datasets & Dosen Document Isolation

## 1. Overview & Problem Statement
Sebelumnya, dataset manual yang dimasukkan Admin disimpan ke tabel `vectors` (sebagai potongan dokumen PDF/RAG). Hal ini menimbulkan beberapa masalah:
1. Dataset manual Admin muncul di library file Dosen, membingungkan Dosen karena ada file yang tidak pernah mereka unggah.
2. Dosen harus menyebutkan `@NamaDokumen` atau memilih file secara manual agar AI dapat membaca dataset tersebut.
3. Dataset pedoman kampus dan data dosen seharusnya berfungsi sebagai **pengetahuan dasar sistem (System Prompt)** yang selalu aktif dan dapat langsung dijawab oleh AI tanpa intervensi manual dari pengguna.

Solusi yang dirancang:
1. Memisahkan **Dataset Sistem** ke model database tersendiri (`Dataset`), terpisah dari dokumen PDF (`PdfChunk`/`vectors`).
2. Halaman `/admin/datasets` difokuskan untuk mengelola dataset pengetahuan sistem (CRUD, aktifkan/nonaktifkan, pratinjau).
3. Saat percakapan chat berlangsung, seluruh dataset aktif dari tabel `Dataset` otomatis dimuat ke dalam `systemPrompt` (bersama `lib/dataset.ts`).
4. Library dokumen pada Dosen dan Admin menjadi murni untuk file PDF pribadi pengguna masing-masing.

---

## 2. Architecture & Data Model

### 2.1 Prisma Schema Model (`prisma/schema.prisma`)
Menambahkan model `Dataset`:
```prisma
model Dataset {
  id          String   @id @default(uuid())
  name        String
  description String?  // Ringkasan atau sumber data
  content     String   @db.Text
  source      String?
  isActive    Boolean  @default(true) @map("is_active")
  createdBy   String   @map("created_by")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([isActive])
  @@map("datasets")
}
```

### 2.2 Relasi & Isolasi Data
| Tipe Data | Model Database | Pengelola | Aksesibilitas | Cara Kerja di AI |
|---|---|---|---|---|
| **System Dataset** | `Dataset` (`datasets`) | Admin | Dikelola Admin, berlaku global | Otomatis di-inject ke `systemPrompt` setiap panggilan chat |
| **User PDF Document** | `PdfChunk` (`vectors`) | Masing-masing User | Hanya pemilik file (`userId`) & Admin | RAG Search saat user memilih file / upload |
| **Base Dataset** | `lib/dataset.ts` | Kode Program | Static / Default fallback | Diinjeksi bersama dataset aktif |

---

## 3. Component & Service Architecture

### 3.1 Backend Actions & API
1. **Server Actions (`lib/server/actions/datasets.ts`)**:
   - `fetchDatasetsAction()`: Mengambil daftar dataset (dengan opsi filter `isActive`).
   - `createDatasetAction(input)`: Membuat record dataset baru (hanya role `admin`).
   - `updateDatasetAction(id, input)`: Memperbarui nama, deskripsi, konten, sumber (hanya role `admin`).
   - `toggleDatasetStatusAction(id, isActive)`: Mengaktifkan/menonaktifkan dataset.
   - `deleteDatasetAction(id)`: Menghapus dataset (hanya role `admin`).
   - `getActiveDatasetsContextAction()`: Mengambil dan menyusun seluruh konten dataset aktif menjadi format string untuk system prompt.

2. **Clean-up Document Server Actions (`lib/server/actions/documents.ts`)**:
   - Menghapus method legacy `createManualDatasetAction` yang dulu memasukkan teks ke tabel `vectors`.
   - Mengembalikan fungsi `fetchDocumentsAction` murni untuk file PDF per pengguna.

3. **Chat Endpoint (`app/api/chat/route.ts`)**:
   - Mengambil seluruh dataset aktif dari database:
     ```typescript
     const activeDatasets = await prisma.dataset.findMany({
       where: { isActive: true },
       orderBy: { createdAt: "asc" },
     });
     ```
   - Menyusunnya ke dalam blok prompt:
     ```typescript
     const systemDatasetsContext = activeDatasets.map(d => 
       `## Dataset: ${d.name}\n${d.source ? `Sumber: ${d.source}\n` : ''}\n${d.content}`
     ).join("\n\n---\n\n");
     ```
   - Menyuntikkannya ke `geminiParts` bersama `buildSystemInstruction()` dan `buildDatasetContext()`.

### 3.2 Frontend Admin UI (`app/admin/datasets`)
1. **Halaman Pengelolaan Dataset**:
   - **Header**: Judul "Manajemen Dataset Sistem", tombol "Tambah Dataset Manual".
   - **Stats**: Total dataset, dataset aktif, tanggal update terakhir.
   - **Tabel Dataset**:
     - Kolom: Nama Dataset, Deskripsi/Sumber, Karakter/Ukuran, Status Aktif (Switch/Chip), Tanggal, Aksi (Lihat Detail, Edit, Hapus).
   - **Modal Tambah/Edit Dataset**:
     - Input: Nama Dataset, Sumber/Kategori, Konten (Textarea format Markdown / JSON).
     - Tombol template untuk mengisi contoh cepat (Pedoman Skripsi / Data Dosen).
   - **Modal Pratinjau**:
     - Melihat isi penuh dataset yang terformat rapi.

### 3.3 Frontend Chatbot & Library (`app/components/Chatbot.tsx` & `UploadLibrary.tsx`)
- Library hanya menampilkan PDF yang diunggah oleh pengguna aktif.
- Dosen tidak melihat file asing dari admin di list library mereka.
- AI langsung dapat menjawab pertanyaan terkait pedoman skripsi dan akademik secara otomatis tanpa perlu mention `@`.

---

## 4. Gaya Bahasa & Penerapan Unslop
- System prompt tetap mengusung prinsip **Unslop**:
  - Respon langsung ke inti, tanpa basa-basi pembuka robotik (*"Tentu!"*, *"Baik..."*).
  - Tanpa kalimat penutup klise (*"Semoga membantu..."*).
  - Gaya bahasa profesional, mengalir alami, dan lugas.

---

## 5. Migration & Verifikasi
1. Jalankan migrasi Prisma untuk membuat tabel `datasets`.
2. Migrasikan dataset manual yang sudah ada (misal `Pedoman Penulisan Skripsi`) dari `vectors` ke tabel `datasets`.
3. Bersihkan chunk berawalan `manual-` dari tabel `vectors`.
4. Uji alur chat:
   - Login sebagai Dosen -> ajukan pertanyaan *"Bagaimana syarat dan alur pengajuan skripsi?"*
   - Verifikasi AI menjawab akurat berdasarkan dataset pedoman tanpa perlu mention file.
   - Verifikasi Library Dosen hanya menampilkan PDF yang mereka upload sendiri.
