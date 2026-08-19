# Activity Diagram — Portal Dosen & Asisten Virtual (ITG)

Dokumen ini memuat tepat 3 Activity Diagram untuk proses-proses inti yang memiliki percabangan logika bisnis nyata (validasi, penanganan kegagalan, dan multi-jalur keputusan).

---

## 1. Activity Diagram: Login

### Penjelasan Diagram

Memodelkan validasi kredensial pengguna dan percabangan _routing_ ke antarmuka Dashboard Dosen atau Dashboard Admin berdasarkan _role_ yang terverifikasi.

```plantuml
@startuml
title Activity Diagram - Login Pengguna

start
:Pengguna memasukkan NIDN/Email dan Password;
:Sistem memvalidasi kredensial pengguna;

if (Kredensial Valid?) then (Ya)
  if (Role Pengguna?) then (Dosen)
    :Arahkan ke Portal Dosen;
  else (Admin)
    :Arahkan ke Panel Admin;
  endif
  :Tampilkan antarmuka sesuai hak akses;
  stop
else (Tidak)
  :Tampilkan pesan kesalahan "Kredensial Tidak Valid";
  :Kembali ke form login;
  stop
endif
@enduml
```

---

## 2. Activity Diagram: Ekstrak Jadwal Mengajar dari PDF

### Penjelasan Diagram

Memodelkan alur validasi berkas PDF, proses ekstraksi data berbasis AI, penanganan kegagalan parsing, serta mekanisme penimpaan (_overwrite_) jika data jadwal dosen sebelumnya telah tersimpan.

```plantuml
@startuml
title Activity Diagram - Ekstrak Jadwal Mengajar dari PDF

start
:Dosen mengaktifkan tool "Jadwal Mengajar" di antarmuka;
:Dosen memilih dan mengunggah berkas PDF jadwal;
:Sistem memverifikasi format (.pdf) dan ukuran berkas;

if (Berkas Valid?) then (Ya)
  :AI Service memproses dan mengekstrak entitas jadwal;
  if (Ekstraksi AI Berhasil?) then (Ya)
    :Sistem memeriksa ketersediaan data jadwal lama di database;
    if (Jadwal Lama Ditemukan?) then (Ya)
      :Hapus / Timpa data jadwal lama;
    else (Tidak)
      :Buat data jadwal baru;
    endif
    :Simpan jadwal hasil ekstraksi ke Database;
    :Tampilkan jadwal terstruktur pada Panel Jadwal Mengajar;
    stop
  else (Tidak)
    :Tampilkan pesan kesalahan "Format konten PDF tidak dikenali AI";
    stop
  endif
else (Tidak)
  :Tampilkan pesan kesalahan "Berkas tidak valid atau melebihi batas ukuran";
  stop
endif
@enduml
```

---

## 3. Activity Diagram: Chat dengan Asisten Virtual (dengan Konteks Dokumen)

### Penjelasan Diagram

Memodelkan logika pemilihan konteks dokumen dari library dan status aktifnya tool khusus yang menentukan bagaimana AI Service menyusun prompt dan menghasilkan respons untuk dosen.

```plantuml
@startuml
title Activity Diagram - Chat dengan Asisten Virtual (dengan Konteks Dokumen)

start
:Dosen mengetik pesan pada antarmuka chat;

if (Menggunakan Referensi Dokumen dari Library?) then (Ya)
  :Sistem mengambil teks/embedding dokumen dari library;
  :Sematkan isi dokumen ke dalam konteks percakapan;
else (Tidak)
  :Gunakan konteks percakapan standar;
endif

if (Tool Khusus Aktif (misal: Ekstraksi Jadwal)?) then (Ya)
  :AI Service mengeksekusi parameter handler tool khusus;
else (Tidak)
  :AI Service memproses inferensi percakapan umum (LLM);
endif

:Sistem menerima respons yang dihasilkan AI Service;
:Simpan pesan pengguna dan respons asisten ke Database;
:Tampilkan respons jawaban pada antarmuka chat;
stop
@enduml
```
