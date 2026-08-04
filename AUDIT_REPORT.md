# Laporan Audit Website mb.ai (Portal Layanan Akademik & Asisten Personal AI Dosen)

> **Tanggal Audit:** 4 Agustus 2026  
> **Target Pengguna:** Dosen Perguruan Tinggi (Universitas / Institut)  
> **Scope Audit:** Copywriting & AI Detection, Technical & AI SEO (Search Engine Visibility), dan User Experience (UX / Usability).

---

## 📋 Ringkasan Eksekutif (Executive Summary)

Audit ini dilakukan untuk mengevaluasi kesiapan website **mb.ai (Portal Layanan Akademik & Asisten Virtual Dosen)** dari tiga sudut pandang utama:
1. **Kualitas Copywriting & Deteksi Teks AI:** Menilai apakah bahasa yang digunakan terasa seperti luaran generik AI atau sudah disesuaikan dengan kebutuhan dosen.
2. **Keterlihatan di Search Engine (SEO & AI SEO):** Menilai kesiapan indeksasi teknis Google/Bing serta keterbacaan oleh AI Search Engine (ChatGPT, Perplexity, Claude, Google AI Overviews).
3. **Kenyamanan & Pengalaman Pengguna (UX Dosen):** Menilai tingkat efisiensi, kemudahan navigasi, kejelasan informasi, dan aksesibilitas bagi dosen.

### Skor Kesiapan Sistem

| Area Audit | Skor (1-10) | Status | Ringkasan Temuan Utama |
| :--- | :---: | :---: | :--- |
| **1. Copywriting & AI Text Audit** | **5.5 / 10** | ⚠️ Butuh Perbaikan | Banyak teks terkesan generik buatan AI, kalimat kaku, dan minim kalimat persuasif/berorientasi manfaat dosen. |
| **2. Search Engine Visibility (SEO)** | **4.0 / 10** | 🔴 Kritis | `robots.txt` & `sitemap.xml` hilang, `lang="en"` padahal konten Indonesia, rendering penuh Client-Side (CSR) tanpa SSR payload. |
| **3. AI Search Visibility (AEO/GEO)** | **3.5 / 10** | 🔴 Kritis | Tidak ada `llms.txt`, tidak ada Schema.org (JSON-LD), tidak ada aturan bot AI, dan belum ada file mesin (`pricing.md`). |
| **4. UX / Usability Dosen** | **6.5 / 10** | ⚠️ Cukup Baik | Tampilan visual modern & bersih, tetapi ada bug navigasi (`target="_blank"` di semua link), aset gambar eksternal di-hardcode, & tumpang tindih tombol FAB. |

---

## 1. ✍️ Audit Copywriting & Deteksi Konten Beraroma AI

### 1.1 Temuan Teks yang Terlihat Sangat Ditulis oleh AI (AI Clichés & Generic Tone)

Berdasarkan analisis file [app/page.tsx](file:///d:/Badru/Projects/chatbot/app/page.tsx), [constants.ts](file:///d:/Badru/Projects/chatbot/constants.ts), dan file dokumentasi pendukung, ditemukan beberapa pola teks yang mengindikasikan luaran AI tanpa penyuntingan manusia:

#### A. Headline & Subheadline Utama ([app/page.tsx:L14-19](file:///d:/Badru/Projects/chatbot/app/page.tsx#L14-L19))
* **Teks Saat Ini:**
  * Headline: *"Selamat datang di mb.ai"*
  * Subheadline: *"Portal Layanan Akademik & Asisten Personal AI Dosen Universitas."*
* **Analisis Masalah:** 
  * "Selamat datang di..." adalah template pembuka paling standar dan tidak memberikan proposisi nilai (value proposition) langsung bagi dosen.
  * Deskripsi subheadline bersifat pasif dan kaku, mirip dengan deskripsi prompt AI bawaan (*"Personal Assistant Dosen Universitas"*).

#### B. Deskripsi Kartu Menu Fallback ([constants.ts:L8-46](file:///d:/Badru/Projects/chatbot/constants.ts#L8-L46))
* **Teks Saat Ini:**
  * *"Pantau kinerja dosen, presensi kehadiran, laporan kerja harian, serta evaluasi mahasiswa."*
  * *"Unggah, kelola, serta verifikasi berbagai berkas administrasi dan dokumen PDF pendukung."*
  * *"Akses data mahasiswa bimbingan akademik, laporan magang, konsultasi skripsi, dan KRS."*
* **Analisis Masalah (Pola Khas AI):**
  * **Deretan Kata Kerja Berulang:** Pola `[Verb], [Verb], serta [Verb]` (*Pantau, presensi, laporan... / Unggah, kelola, serta verifikasi...*) adalah ciri khas sintaksis LLM saat membangkitkan deskripsi fitur.
  * **Penggunaan Kata Keterangan Generik:** Kata *"berbagai berkas"* dan *"pendukung"* adalah kata pengisi (filler words) khas AI yang tidak memberi nilai spesifik.

#### C. Dokumentasi & Teks Sistem ([feature.md:L1-10](file:///d:/Badru/Projects/chatbot/feature.md#L1-L10))
* **Teks Saat Ini:** *"Berikut adalah daftar fitur yang telah berhasil diimplementasikan dan tersedia dalam sistem saat ini:"*
* **Analisis Masalah:** Frasa pengantar ini adalah pola klasik awal respon ChatGPT/LLM.

---

### 1.2 Daftar Kata Kunci / Buzzword AI yang Perlu Dikurangi

* ❌ *"solusi terintegrasi"*
* ❌ *"memudahkan dosen dalam..."*
* ❌ *"berbagai berkas administrasi"*
* ❌ *"asisten personal AI"*
* ❌ *"sinkronisasi otomatis"*

---

### 1.3 Rekomendasi Perbaikan Copywriting (Human-Centric & Action-Oriented)

Dosen tidak mencari "AI" sebagai jargon, melainkan mencari **kemudahan menyelesaikan beban kerja Tridharma & BKD dengan cepat**.

| Elemen | Teks Lama (Berbau AI) | Rekomendasi Teks Baru (Human & Benefit-Driven) | Alasan Perubahan |
| :--- | :--- | :--- | :--- |
| **Hero Title** | Selamat datang di mb.ai | **Selesaikan Administrasi BKD & Akademik Lebih Cepat.** | Fokus pada hasil akhir yang paling dicari dosen (BKD). |
| **Hero Subtitle** | Portal Layanan Akademik & Asisten Personal AI Dosen Universitas. | Kelola perwalian, upload dokumen BKD, dan tanya jawab regulasi kampus dalam satu portal cerdas. | Lebih spesifik menyebutkan aktivitas harian dosen. |
| **Kartu Dokumen** | Unggah, kelola, serta verifikasi berbagai berkas administrasi dan dokumen PDF pendukung. | **Pusat Berkas BKD & Surat Keputusan.** Simpan PDF, cari isi dokumen dengan AI, dan verifikasi SK perkuliahan. | Menghilangkan kata pengisi, langsung sebut nama berkas asli (SK, BKD). |
| **Kartu SINTA** | Integrasi dan sinkronisasi otomatis skor SINTA, Scopus, Google Scholar, dan H-index. | **Profil Riset & Integrasi SINTA.** Cek skor H-Index, publikasi Scopus, dan lacak portofolio penelitian Anda. | Bahasa langsung menyapa pengisian profil dosen. |
| **CTA Chatbot** | Mulai Chat | **Tanya Asisten Akademik** | Menjelaskan aksi spesifik daripada tombol generik. |

---

## 2. 🔍 Audit Search Engine Visibility (SEO & AI SEO Audit)

Audit ini mengevaluasi apakah website dapat ditemukan oleh mesin pencari konvensional (Google/Bing) dan diindeks/dikutip oleh AI Search Engine (Perplexity, ChatGPT Search, Google AI Overviews).

### 2.1 Technical & On-Page SEO (Pencarian Konvensional)

#### 🔴 1. Berkas Kritis `robots.txt` dan `sitemap.xml` Hilang
* **Temuan:** Berkas `public/robots.txt` dan `public/sitemap.xml` (atau `app/sitemap.ts`) **tidak ditemukan** di dalam repositori.
* **Dampak:** Googlebot dan Bingbot tidak mendapatkan petunjuk tentang struktur halaman yang boleh/dilarang diindeks.
* **Rekomendasi:** Buat `app/robots.ts` dan `app/sitemap.ts` bawaan Next.js.

#### 🔴 2. Rendering Utama Menggunakan Client-Side Rendering (CSR)
* **Temuan:** Di [app/page.tsx:L1](file:///d:/Badru/Projects/chatbot/app/page.tsx#L1), terdapat directive `"use client"`. Komponen `PortalGrid` mengambil data menu dinamis menggunakan `useEffect` setelah komponen di-render di browser.
* **Dampak:** Crawler mesin pencari yang mengambil HTML awal akan menerima halaman kosong pada bagian daftar menu.
* **Rekomendasi:** Ubah halaman utama menjadi Server Component (SSR / Static Generation) atau sertakan fallback HTML statis yang lengkap.

#### 🔴 3. Kesalahan Atribut Bahasa Dokumen (`lang="en"`)
* **Temuan:** Di [app/layout.tsx:L23](file:///d:/Badru/Projects/chatbot/app/layout.tsx#L23), atribut HTML tertulis `<html lang="en">`, padahal seluruh konten aplikasi menggunakan Bahasa Indonesia.
* **Dampak:** Mesin pencari dapat mengklasifikasikan situs ini sebagai situs berbahasa Inggris dengan kualitas teks buruk (karena isinya kata-kata bahasa Indonesia).
* **Rekomendasi:** Ubah menjadi `<html lang="id">`.

#### ⚠️ 4. Metadata Sangat Minim ([app/layout.tsx:L11-14](file:///d:/Badru/Projects/chatbot/app/layout.tsx#L11-L14))
* **Temuan:** Metadata hanya berisi `title` dasar (*"mb.ai - Portal Dosen"*) dan `description`.
* **Kekurangan Metadata:**
  * Tidak ada OpenGraph (`og:title`, `og:description`, `og:image`, `og:type`) untuk tampilan saat link dibagikan di WhatsApp/Telegram/LinkedIn.
  * Tidak ada Twitter Card (`twitter:card`, `twitter:title`).
  * Tidak ada `canonical` URL.
  * Tidak ada tag `keywords` atau `robots`.

---

### 2.2 AI Search Optimization (AEO / GEO / LLMO Audit)

AI Search Engine seperti Perplexity, ChatGPT, dan Claude memiliki cara kerja berbeda dari Google konvensional: mereka mengekstrak informasi terstruktur dan mencari berkas kontekstual.

#### 🔴 1. Tidak Ada Berkas Mesin (`llms.txt` & `pricing.md`)
* **Temuan:** Tidak terdapat berkas `/llms.txt` di root publik situs.
* **Dampak:** AI Agent tidak memiliki ringkasan cepat untuk memahami fungsi portal mb.ai saat merespons pertanyaan pengguna mengenai layanan dosen ini.
* **Rekomendasi:** Buat berkas `public/llms.txt` yang menjelaskan struktur portal dan tautan utama.

#### 🔴 2. Tidak Ada Markup Schema.org (JSON-LD)
* **Temuan:** Aplikasi tidak mengimplementasikan tag `<script type="application/ld+json">`.
* **Dampak:** Mesin pencari AI tidak dapat membaca metadata terstruktur mengenai aplikasi ini.
* **Rekomendasi Implementasi Schema:**
  * `SoftwareApplication` / `WebApplication`: Untuk mengidentifikasi mb.ai sebagai portal aplikasi asisten virtual dosen.
  * `EducationalOrganization`: Untuk menghubungkan aplikasi dengan institusi perguruan tinggi.
  * `FAQPage`: Pada bagian panduan administratif dosen.

#### ⚠️ 3. Belum Ada Aturan AI Crawlers di `robots.txt`
* **Temuan:** Tidak ada pengaturan hak akses untuk crawler AI spesifik.
* **Bot AI Utama yang Perlu Dikontrol:**
  * `GPTBot` & `ChatGPT-User` (OpenAI)
  * `PerplexityBot` (Perplexity AI)
  * `ClaudeBot` & `anthropic-ai` (Anthropic)
  * `Google-Extended` (Google AI Overviews / Gemini)

---

## 3. 🎯 Audit Pengalaman Pengguna (UX & Usability Audit untuk Dosen)

### 3.1 Profil & Karakteristik Pengguna (Persona Dosen)
Dosen adalah pengguna berketerampilan tinggi dengan tingkat kesibukan padat. Mereka membutuhkan:
* Akses cepat tanpa hambatan (efisiensi klik).
* Navigasi intuitif yang tidak membingungkan antar-sistem.
* Kejelasan status aksi (misal: sukses unggah PDF BKD, status sinkronisasi SINTA).
* Tampilan yang nyaman diakses dari laptop kerja maupun tablet/smartphone.

---

### 3.2 Temuan Isu UX & Usability di Aplikasi

#### 🔴 1. Bug Navigasi: Semua Link Membuka Tab Baru (`target="_blank"`)
* **Temuan:** Pada komponen [app/components/portal/PortalCard.tsx:L29](file:///d:/Badru/Projects/chatbot/app/components/portal/PortalCard.tsx#L29), tag `<Link>` dipaksa menggunakan atribut `target="_blank"`.
* **Dampak UX:** Ketika dosen mengklik menu internal (seperti `/documents` atau `/monitoring`), aplikasi secara tidak perlu membuka tab baru di browser. Ini menyebabkan penumpukan tab (*tab overload*) yang mengganggu alur kerja dosen.
* **Solusi:** Hanya gunakan `target="_blank"` untuk link eksternal (seperti `aisnet.itg.ac.id`), sedangkan link internal harus terbuka di tab yang sama.

#### 🔴 2. Ketergantungan URL Aset Eksternal (Hardcoded Image URLs)
* **Temuan:** Pada [app/aisnet/page.tsx:L11-19](file:///d:/Badru/Projects/chatbot/app/aisnet/page.tsx#L11-L19), ikon dan gambar menggunakan URL dari Google Cloud Storage eksternal dan API luar (`https://storage.googleapis.com/...`, `https://api-aisnet.itg.ac.id/uploads/...`).
* **Dampak UX:** Jika koneksi ke server eksternal tersebut lambat atau terputus, ikon dan gambar profil dosen akan menjadi rusak (*broken image icon*), membuat tampilan terlihat tidak profesional.
* **Solusi:** Simpan aset ikon secara lokal di folder `public/assets/` atau gunakan SVG inline / `@phosphor-icons/react`.

#### ⚠️ 3. Potensi Tumpang Tindih Tombol Floating (FAB Competition)
* **Temuan:** Tombol `AiFab` (Floating Action Button Asisten AI) dan tombol profil (`ProfileFab`) ditempatkan di posisi mengambang pojok layar.
* **Dampak UX:** Pada layar HP/tablet dengan orientasi vertikal, tombol AI mengambang dapat menutupi elemen navigasi lain di bagian bawah layar.
* **Solusi:** Berikan jarak margin aman (*safe area bottom*) dan pastikan z-index serta tata letak responsif tidak menutupi area konten penting.

#### ⚠️ 4. Kurangnya Label Aksesibilitas (ARIA Labels)
* **Temuan:** Beberapa tombol berbentuk ikon saja (seperti tombol hapus di `SchedulePanel.tsx`, ikon penutup modal, atau tombol toggle sidebar di AISNet) tidak memiliki atribut `aria-label`.
* **Dampak UX:** Dosen yang mengandalkan pembaca layar (screen reader) atau navigasi keyboard tidak mendapatkan deskripsi fungsi dari tombol tersebut.
* **Solusi:** Tambahkan `aria-label="Hapus jadwal"` atau `aria-label="Buka Asisten AI"` pada semua tombol ikonik.

#### ⚠️ 5. Kontras Warna Dark Mode pada Teks Sekunder
* **Temuan:** Terdapat beberapa elemen teks deskripsi yang menggunakan warna `text-neutral-400` di atas latar belakang `bg-neutral-900`.
* **Dampak UX:** Pada kondisi pencahayaan rendah, dosen dengan gangguan penglihatan ringan akan kesulitan membaca deskripsi menu yang terlalu redup.
* **Solusi:** Tingkatkan kontras teks sekunder minimal ke `text-neutral-300` di mode gelap (memenuhi WCAG AA rasio 4.5:1).

---

## 🛠️ Rencana Aksi Perbaikan Terprioritas (Actionable Improvement Plan)

Berikut adalah daftar prioritas perbaikan yang disarankan untuk dikerjakan secara berurutan:

### Prioritas 1: Kritis & Mendesak (Urgent Fixes)

1. **Perbaiki Navigasi `PortalCard.tsx`**
   * Edit [app/components/portal/PortalCard.tsx](file:///d:/Badru/Projects/chatbot/app/components/portal/PortalCard.tsx): Deteksi apakah `href` diawali dengan `http` (eksternal) atau `/` (internal). Pasang `target="_blank"` hanya jika link eksternal.
2. **Perbaiki Atribut Bahasa & Metadata Dasar**
   * Edit [app/layout.tsx](file:///d:/Badru/Projects/chatbot/app/layout.tsx): Ubah `<html lang="en">` menjadi `<html lang="id">`. Tambahkan OpenGraph & Twitter Card metadata.
3. **Tambahkan Berkas `robots.ts` & `sitemap.ts`**
   * Buat `app/robots.ts` untuk mengizinkan crawler utama dan bot AI (`GPTBot`, `PerplexityBot`).
   * Buat `app/sitemap.ts` yang mencantumkan rute `/`, `/documents`, `/aisnet`, `/admin`.

---

### Prioritas 2: Perbaikan Copywriting & AI SEO (High Impact)

1. **Revisi Copywriting Halaman Utama**
   * Edit [app/page.tsx](file:///d:/Badru/Projects/chatbot/app/page.tsx) dan [constants.ts](file:///d:/Badru/Projects/chatbot/constants.ts): Ganti teks berbau AI dengan bahasa berorientasi manfaat dosen ( BK D, Perwalian, Riset).
2. **Buat Berkas Machine-Readable `public/llms.txt`**
   * Buat `public/llms.txt` di root public folder dengan ringkasan fitur mb.ai agar siap di-index oleh Perplexity dan ChatGPT Search.
3. **Tambahkan Schema Markup JSON-LD**
   * Tambahkan `<script type="application/ld+json">` untuk `SoftwareApplication` di `app/layout.tsx`.

---

### Prioritas 3: Pengoptimalan UX Dosen & Aksesibilitas (Polish & Delight)

1. **Lokalisasi Aset Gambar Eksternal**
   * Unduh gambar & ikon dari Google Storage eksternal di `app/aisnet/page.tsx` ke dalam folder `public/assets/`.
2. **Perbaiki Aksesibilitas & ARIA Labels**
   * Tambahkan `aria-label` pada seluruh tombol bernavigasi ikon di `ChatInputBar.tsx`, `SchedulePanel.tsx`, dan `AiFab.tsx`.
3. **Sempurnakan Kontras Warna Dark Mode**
   * Sesuaikan palet warna teks sekunder di `globals.css` / Tailwind class agar memenuhi standar WCAG AA.

---

## 📌 Contoh Berkas Implementasi Siap Pakai

### A. Berkas `public/llms.txt`
```markdown
# mb.ai — Portal Layanan Akademik & Asisten Digital Dosen

> Portal terpadu dan asisten virtual cerdas berbasis AI untuk membantu dosen perguruan tinggi mengelola beban kerja Tridharma, BKD, perwalian mahasiswa, dan penelitian.

## Fitur Utama
- **Asisten AI Akademik**: Melayani tanya jawab regulasi BKD, panduan akademik, dan konsultasi administratif.
- **RAG Library Dokumen**: Unggah dan cari isi berkas PDF (SK Mengajar, Pedoman BKD, Jurnal) menggunakan konteks pencarian vektor.
- **Integrasi AISNET & SINTA**: Akses cepat ke jadwal mengajar, rekap presensi, dan profil riset SINTA/Scopus.

## Halaman Utama
- Portal Utama: https://mb.ai/
- Pengelolaan Dokumen: https://mb.ai/documents
- Dashboard AISNET: https://mb.ai/aisnet
```

### B. Berkas `app/robots.ts`
```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/'],
      },
      {
        userAgent: ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended'],
        allow: '/',
      },
    ],
    sitemap: 'https://mb.ai/sitemap.xml',
  };
}
```

---
*Laporan audit ini disusun secara otomatis untuk membantu tim pengembang dalam melakukan perbaikan berkelanjutan pada project mb.ai.*
