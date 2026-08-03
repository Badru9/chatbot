# Panduan Format Deskripsi Dataset Manual

Untuk memastikan AI dapat memahami dan mencari informasi dalam dataset manual dengan akurat, Anda disarankan menggunakan format yang terstruktur sesuai dengan bidang input pada form admin.

---

## Struktur File Template yang Tersedia untuk Diunduh

Anda dapat mengunduh berkas template berikut langsung dari modal **Tambah Dataset Manual**:

1. **Format JSON (`template-dataset-dosen.json`)**:
   Sangat direkomendasikan untuk data terstruktur/entitas (seperti data dosen, mata kuliah, atau program studi).

2. **Format Markdown (`template-dataset-pedoman.md`)**:
   Sangat cocok untuk pedoman, peraturan akademik, alur prosedur, dan FAQ.

3. **Format Text (`template-dataset-ringkasan.txt`)**:
   Format teks ringkas untuk catatan kebijakan, pengumuman, atau informasi kontak layanan.

---

## Contoh Format Isi Dataset:

### 1. Format JSON Dosen (Entitas Terstruktur)
```json
[
  {
    "nama": "Dr. Eko Prasetyo, M.T.",
    "nidn": "0415088201",
    "prodi": "Teknik Informatika",
    "status": "Aktif",
    "bidang_keahlian": ["Cyber Security", "Network Engineering"],
    "tujuan_penggunaan": "Referensi data dosen untuk bimbingan skripsi.",
    "kontak": "eko.prasetyo@univ.ac.id"
  }
]
```

### 2. Format Markdown Pedoman (Narasi & Dokumen)
```markdown
# Pedoman Penulisan dan Pengajuan Skripsi 2026

## 1. Tujuan Penggunaan & Ringkasan Konten
- **Tujuan AI**: Rujukan resmi untuk alur dan syarat skripsi.

## 2. Syarat Pengajuan Judul Skripsi
1. Mahasiswa aktif semester 7.
2. SKS lulus minimal 110 SKS dengan IPK >= 3.00.
```

---

> [!TIP]
> **Petunjuk Penggunaan**:
> 1. Unduh file template sesuai kebutuhan (.json / .md / .txt).
> 2. Buka dan sesuaikan isinya di komputer Anda.
> 3. Salin (*copy*) seluruh teks yang sudah disesuaikan dan tempel (*paste*) ke dalam kotak **Deskripsi** pada portal Admin.
