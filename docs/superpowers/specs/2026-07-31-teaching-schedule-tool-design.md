# Spesifikasi Desain: Fitur Asisten Virtual - Jadwal Mengajar Dosen (mb.ai)

Dokumen ini mendefinisikan desain teknis dan alur antarmuka untuk fitur asisten virtual dosen: **Membuat Jadwal Mengajar Berdasarkan File PDF**. Fitur ini diintegrasikan langsung ke dalam antarmuka chatbot (`Chatbot.tsx`) menggunakan tata letak layar terpisah (*split-screen*) dan kontrol filter berbasis **Chip**.

---

## 1. Alur Pengguna (User Flow)

1. **Mengaktifkan Tool**:
   * Di atas input bar chat, terdapat Chip modern berlabel **"Jadwal Mengajar"**.
   * Dosen mengklik Chip tersebut untuk mengaktifkannya. Status Chip berubah menjadi aktif (berwarna cerah) dan layar chatbot terbagi menjadi dua panel:
     * **Panel Kiri**: Obrolan Chatbot (lebar 60%).
     * **Panel Kanan**: Panel Jadwal Mengajar Visual (lebar 40%).
2. **Unggah & Parsing**:
   * Dosen mengunggah file PDF jadwal mengajar resmi dari kampus menggunakan tombol lampiran di chat.
   * Dosen mengirim pesan di chat (misalnya: *"Tolong parse jadwal saya dari file ini"*).
   * Backend mendeteksi file tersebut, mengekstrak teks PDF, meminta AI (Ollama) untuk menyusun datanya menjadi format JSON terstruktur, lalu menyimpannya ke tabel `Schedule` di database.
3. **Penyajian Visual**:
   * Setelah AI merespons sukses, panel kanan secara otomatis memuat ulang data jadwal menggunakan React Query.
   * Jadwal disajikan secara estetis dalam tata letak per-hari (*bento-grid style*) lengkap dengan jam, mata kuliah, kelas, ruangan, dan jumlah SKS.

---

## 2. Struktur Database (Prisma)

Kita akan membuat tabel baru bernama `schedules` untuk menyimpan jadwal mengajar terstruktur per dosen.

```prisma
model Schedule {
  id         String   @id @default(uuid())
  userId     String   @map("user_id")
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  day        String   // "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"
  startTime  String   // format "HH:MM" (misal "08:00")
  endTime    String   // format "HH:MM" (misal "09:40")
  courseName String   @map("course_name")
  courseCode String?  @map("course_code")
  className  String   @map("class_name") // misal "IF-A", "TIF-3B"
  room       String   // misal "Lab AI", "R.302"
  sks        Int      @default(2)
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  @@map("schedules")
}
```

---

## 3. Desain API (Backend Express)

### A. Endpoint Modifikasi Chat (`POST /api/chat`)
Kita akan menambahkan properti `activeTools` (array string) pada payload request chat. Jika `activeTools` berisi `"jadwal"` dan terdapat `documentIds` (PDF jadwal):
1. Menggabungkan isi teks dari seluruh `pdfChunk` yang cocok dengan `documentId`.
2. Mengirim teks tersebut ke Ollama dengan instruksi sistem terperinci untuk mengembalikan JSON jadwal terstruktur.
3. Mengosongkan jadwal lama milik user tersebut dan menyimpan data jadwal baru ke database.
4. Melanjutkan streaming respons obrolan AI yang mengonfirmasi keberhasilan parsing.

### B. Endpoint Jadwal Baru (`src/routes/schedules.ts`)
* **`GET /api/schedules`**: Mengambil daftar jadwal mengajar milik dosen yang sedang login (dikelompokkan/diurutkan berdasarkan hari dan jam mulai).
* **`DELETE /api/schedules`**: Menghapus seluruh jadwal mengajar milik dosen tersebut.

---

## 4. Desain UI (Frontend Next.js)

### A. Chip Selektor Tool
* Ditempatkan di atas `ChatInputBar` (sebelum kolom input).
* Menggunakan komponen `Chip` dari HeroUI dengan gaya minimalis, efek hover lembut, dan ikon penanda status aktif.

### B. Split Screen Layout
* Jika `activeTool === "jadwal"`, layout utama `Chatbot.tsx` akan dibagi menggunakan kelas CSS Grid:
  * Kolom Kiri (Chat): `col-span-7` (atau `lg:w-[60%]`).
  * Kolom Kanan (Visual Panel): `col-span-5` (atau `lg:w-[40%]`) dengan animasi *fade-in* yang halus.

### C. Komponen `SchedulePanel` (Baru)
* Panel kanan yang memiliki judul **"Jadwal Mengajar Anda"**.
* Menampilkan daftar hari (Senin s.d. Jumat/Sabtu) dalam format kartu bento.
* Jika data kosong, tampilkan *state* ilustrasi kosong yang interaktif (*"Belum ada jadwal. Silakan unggah PDF jadwal Anda di chat"*).
* Menyertakan tombol aksen merah tipis untuk *"Kosongkan Jadwal"* (menghapus data).

---

## 5. Rencana Pengujian & Verifikasi

1. **Integrasi Database**: Verifikasi migrasi database berhasil dan model `Schedule` dapat melakukan CRUD dengan sukses.
2. **Akurasi Ekstraksi AI**: Uji dengan beberapa variasi teks jadwal kuliah PDF untuk memastikan Ollama mengekstrak kolom `day`, `startTime`, `endTime`, `courseName`, `className`, `room`, dan `sks` dengan format JSON yang valid.
3. **Responsivitas Antarmuka**: Pastikan panel visual melakukan *refresh* otomatis setelah upload selesai, dan tombol hapus membersihkan visualisasi secara real-time.
