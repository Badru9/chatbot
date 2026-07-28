# Daftar Fitur mb.ai (Portal Layanan Akademik & Asisten Virtual Dosen)

Berikut adalah daftar fitur yang telah berhasil diimplementasikan dan tersedia dalam sistem saat ini:

## 1. Asisten Virtual AI (Chatbot Personal)
* **Floating Action Button (FAB) AI**: Tombol asisten AI terapung (`AiFab`) di pojok kanan bawah portal utama memudahkan dosen mengakses asisten kapan saja.
* **AiAssistantModal**: Modal asisten virtual yang menampilkan antarmuka chatbot interaktif setelah dosen berhasil masuk (login).
* **Streaming Response**: Jawaban dari chatbot di-stream secara real-time dari model Ollama (default: `qwen3.5`).
* **Sesi Percakapan (History Chats)**: Chatbot menyimpan hingga 30 riwayat percakapan secara lokal di browser (`localStorage`), lengkap dengan pembuatan judul otomatis berdasarkan pesan pertama pengguna.
* **Tema UI Modern & Responsif**: Antarmuka berbasis desain modern SaaS (Cal.com style) dengan transisi mulus dan dukungan Dark Mode.

## 2. Fitur RAG & Library Dokumen (Knowledge Base)
* **Upload PDF ke PostgreSQL**: Dokumen PDF diunggah ke backend, dipotong-potong (`chunking`), dihitung representasi vektornya (`embedding`), dan disimpan ke database PostgreSQL menggunakan extension `pgvector`.
* **Privasi Dokumen per User**: Setiap dokumen dikaitkan dengan `userId` pengunggah. Dosen hanya dapat melihat, menghapus, dan mencari konteks dokumen miliknya sendiri (terisolasi penuh secara aman).
* **Fitur Mention Dokumen (`@`)**: Pengguna dapat mengetik `@` di kolom input chat untuk memilih dokumen tertentu sebagai konteks pencarian RAG (Retrieval-Augmented Generation).
* **Penyimpanan Blob Lokal (IndexedDB)**: File PDF asli disimpan secara lokal di IndexedDB browser pengunggah untuk mendukung pratinjau (preview).
* **Pratinjau PDF Interaktif (PDF Preview)**: Modal khusus menggunakan `react-pdf` dengan navigasi halaman, zoom (perbesar/perkecil), dan penanganan dinamis jika file PDF asli tidak ada di perangkat lokal (misal diakses dari perangkat berbeda).
* **Sinkronisasi State dengan React Query**: Semua operasi (list, upload, dan delete dokumen) disinkronkan secara real-time di seluruh komponen (Chatbot utama dan halaman Library) menggunakan cache React Query.

## 3. Portal Dashboard & Integrasi Layanan
* **Portal Layanan Akademik**: Grid menu utama (`PortalGrid`) yang menyediakan akses cepat ke layanan eksternal kampus:
  * **AISNET ITG**: Sistem akademik berbasis AI, kehadiran, laporan kerja harian, dan evaluasi.
  * **E-Learning ITG**: Pengumpulan tugas, materi kuliah, ujian online, dan penilaian otomatis.
  * **Bimbingan Mahasiswa**: Manajemen data bimbingan akademik, konsultasi skripsi, dan persetujuan KRS.
  * **Portal SINTA**: Integrasi otomatis skor publikasi ilmiah SINTA, Scopus, dan Google Scholar.
* **Autentikasi & Profil**: Kontrol akses terpadu (`LoginForm` & `ProfileFab`) berbasis session token yang terhubung dengan database PostgreSQL backend.

## 4. Dashboard Pengelolaan Dataset Admin (`/admin/datasets`)
* **Kelola Dataset AI**: Khusus untuk pengguna dengan peran `admin`, dapat melihat ringkasan statistik (Total Dokumen & Total Vector Chunks) dari seluruh sistem.
* **Administrasi Dokumen**: Mengunggah PDF global dan menghapus dokumen apa pun dari database.
