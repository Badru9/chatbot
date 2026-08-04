# Spesifikasi Desain: Kategori Jadwal & Modal Konfirmasi Hapus (SchedulePanel & DeleteModal)

Dokumen ini menjelaskan rancangan pembaruan untuk antarmuka **SchedulePanel** dan **DeleteModal** pada aplikasi chatbot.

---

## 1. Latar Belakang & Tujuan

Saat ini, saat panel jadwal dibuka, daftar jadwal mengajar langsung ditampilkan secara keseluruhan. Pengguna menginginkan antarmuka yang lebih terorganisir di mana pengguna melihat daftar/kategori jadwal terlebih dahulu (misalnya: _Jadwal Mengajar_, _Jadwal Penelitian_, _Jadwal Lainnya_), lalu memilih kategori untuk melihat detailnya. Selain itu, proses penghapusan/mengosongkan jadwal yang sebelumnya menggunakan `toast` akan diperbarui agar menggunakan modal konfirmasi standar (`DeleteModal.tsx`).

---

## 2. Alur Pengguna (User Flow)

1. **Halaman Utama Panel Jadwal (List Kategori)**:
   - Saat `SchedulePanel` dibuka, antarmuka menampilkan daftar pilihan kategori:
     - **Jadwal Mengajar**: Menampilkan badge jumlah mata kuliah/jadwal aktif dari backend.
     - **Jadwal Penelitian**: Menampilkan deskripsi kegiatan penelitian.
     - **Jadwal Lainnya**: Menampilkan deskripsi kegiatan pengabdian/rapat/agenda lainnya.
2. **Navigasi Detail Kategori**:
   - Pengguna mengklik salah satu kartu kategori.
   - Tampilan berganti ke halaman detail kategori tersebut dilengkapi tombol **Kembali** (`← Kembali`) di bagian header.
   - **Jadwal Mengajar**: Menampilkan jadwal harian (_bento grid_) dari backend API (`/api/schedules`).
   - **Jadwal Penelitian & Lainnya**: Menampilkan tampilan _empty state_ yang informatif.
3. **Konfirmasi Penghapusan (Kosongkan Jadwal)**:
   - Pada detail _Jadwal Mengajar_, tombol **Kosongkan** memicu pembukaan `DeleteModal`.
   - `DeleteModal` menampilkan dialog konfirmasi dengan judul _"Kosongkan Jadwal"_ dan pesan konfirmasi.
   - Menekan tombol **Hapus** mengeksekusi `deleteMutation` ke backend `/api/schedules`, memperbarui tampilan secara _real-time_, dan menutup modal.

---

## 3. Perubahan Komponen

### A. `app/components/modal/DeleteModal.tsx`

- Menambahkan prop `onConfirm?: () => void | Promise<void>` dan `isLoading?: boolean`.
- Menyambungkan fungsi `onConfirm` ke tombol **Hapus** dengan status _loading_ ketika proses hapus berjalan.

### B. `app/components/portal/SchedulePanel.tsx`

- Menambahkan state `selectedCategory: "mengajar" | "penelitian" | "lainnya" | null` (default `null`).
- Menambahkan state `isDeleteModalOpen: boolean` (default `false`).
- Menampilkan tampilan kategori jika `selectedCategory === null`.
- Menampilkan tampilan detail + tombol kembali jika `selectedCategory` terpilih.
- Mengintegrasikan `DeleteModal` untuk penanganan aksi mengosongkan jadwal.

---

## 4. Rencana Verifikasi

1. **Navigasi Kategori**: Memastikan alur dari list kategori -> detail -> kembali berjalan dengan mulus.
2. **Kesesuaian Data**: Memastikan data real `/api/schedules` muncul di kategori Jadwal Mengajar, dan empty state muncul di kategori lainnya.
3. **Modal Hapus**: Memastikan `DeleteModal` muncul saat tombol Kosongkan diklik, dan data terhapus sempurna saat dikonfirmasi.
