export const dosenDataset = [
  {
    nama: 'Dr. Ahmad Fauzi, M.Kom.',
    nidn: '0312058901',
    prodi: 'Teknik Informatika',
    jabatan_fungsional: 'Lektor',
    status: 'Aktif',
    pendidikan_terakhir: 'S3 Ilmu Komputer - Universitas Indonesia',
    bidang_keahlian: [
      'Machine Learning',
      'Data Mining',
      'Artificial Intelligence',
    ],
    tridarma: {
      pendidikan: {
        mata_kuliah: ['Kecerdasan Buatan', 'Struktur Data', 'Algoritma'],
        jumlah_sks_semester_ini: 12,
        bimbingan_skripsi_aktif: 5,
        rata_rata_nilai_evaluasi_mahasiswa: 3.8,
      },
      penelitian: {
        publikasi: [
          {
            judul: 'Deep Learning untuk Deteksi Penyakit Padi',
            jurnal: 'Jurnal Informatika (SINTA 2)',
            tahun: 2025,
          },
          {
            judul: 'Optimasi CNN dengan Transfer Learning',
            jurnal: 'IEEE Access (Scopus Q1)',
            tahun: 2024,
          },
          {
            judul: 'Sentiment Analysis pada Media Sosial',
            jurnal: 'Jurnal Teknologi Informasi (SINTA 3)',
            tahun: 2024,
          },
        ],
        hibah_penelitian: [
          {
            judul: 'Pengembangan Sistem Deteksi Dini Hama',
            sumber: 'Kemendikbud',
            tahun: 2025,
            dana: 'Rp 85.000.000',
          },
        ],
        skor_sinta: 450,
        h_index: 6,
      },
      pengabdian: {
        kegiatan: [
          {
            judul: 'Pelatihan Coding untuk Siswa SMA',
            lokasi: 'SMAN 1 Surabaya',
            tahun: 2025,
          },
          {
            judul: 'Workshop IoT untuk UMKM',
            lokasi: 'Kecamatan Lowokwaru, Malang',
            tahun: 2024,
          },
        ],
      },
    },
  },
  {
    nama: 'Prof. Dr. Siti Rahayu, M.Pd.',
    nidn: '0205067502',
    prodi: 'Pendidikan Matematika',
    jabatan_fungsional: 'Guru Besar',
    status: 'Aktif',
    pendidikan_terakhir: 'S3 Pendidikan Matematika - Universitas Negeri Malang',
    bidang_keahlian: ['Pendidikan Matematika', 'Kurikulum', 'Etnomatematika'],
    tridarma: {
      pendidikan: {
        mata_kuliah: [
          'Metode Penelitian Pendidikan',
          'Statistika Pendidikan',
          'Kurikulum Matematika',
        ],
        jumlah_sks_semester_ini: 9,
        bimbingan_skripsi_aktif: 8,
        bimbingan_disertasi_aktif: 3,
        rata_rata_nilai_evaluasi_mahasiswa: 3.9,
      },
      penelitian: {
        publikasi: [
          {
            judul: 'Etnomatematika dalam Budaya Jawa Timur',
            jurnal: 'Journal of Mathematics Education (Scopus Q2)',
            tahun: 2025,
          },
          {
            judul: 'Efektivitas Problem-Based Learning',
            jurnal: 'Jurnal Pendidikan MIPA (SINTA 1)',
            tahun: 2025,
          },
          {
            judul: 'Analisis Miskonsepsi Aljabar',
            jurnal: 'Jurnal Pendidikan Matematika (SINTA 2)',
            tahun: 2024,
          },
          {
            judul: 'Pengembangan Media Pembelajaran Interaktif',
            jurnal: 'Education and Information Technologies (Scopus Q1)',
            tahun: 2023,
          },
        ],
        hibah_penelitian: [
          {
            judul: 'Penelitian Fundamental: Model Pembelajaran Inovatif',
            sumber: 'DRPM Kemendikbud',
            tahun: 2025,
            dana: 'Rp 150.000.000',
          },
          {
            judul: 'Penelitian Terapan: Etnomatematika Nusantara',
            sumber: 'LPDP',
            tahun: 2024,
            dana: 'Rp 200.000.000',
          },
        ],
        skor_sinta: 1250,
        h_index: 14,
      },
      pengabdian: {
        kegiatan: [
          {
            judul: 'Pendampingan Guru Matematika SMP se-Kota Malang',
            lokasi: 'Kota Malang',
            tahun: 2025,
          },
          {
            judul: 'Penyusunan Modul Matematika Kurikulum Merdeka',
            lokasi: 'Dinas Pendidikan Jatim',
            tahun: 2024,
          },
          {
            judul: 'Olimpiade Matematika untuk Siswa Daerah 3T',
            lokasi: 'Kabupaten Sumenep',
            tahun: 2024,
          },
        ],
      },
    },
  },
  {
    nama: 'Budi Santoso, S.T., M.T.',
    nidn: '0718099201',
    prodi: 'Teknik Informatika',
    jabatan_fungsional: 'Asisten Ahli',
    status: 'Aktif',
    pendidikan_terakhir: 'S2 Teknik Informatika - ITS Surabaya',
    bidang_keahlian: ['Web Development', 'Cloud Computing', 'Basis Data'],
    tridarma: {
      pendidikan: {
        mata_kuliah: ['Pemrograman Web', 'Basis Data', 'Cloud Computing'],
        jumlah_sks_semester_ini: 14,
        bimbingan_skripsi_aktif: 3,
        rata_rata_nilai_evaluasi_mahasiswa: 3.5,
      },
      penelitian: {
        publikasi: [
          {
            judul: 'Arsitektur Microservices untuk Sistem Akademik',
            jurnal: 'Jurnal Teknik Informatika (SINTA 4)',
            tahun: 2025,
          },
        ],
        hibah_penelitian: [],
        skor_sinta: 85,
        h_index: 1,
      },
      pengabdian: {
        kegiatan: [
          {
            judul: 'Pembuatan Website Desa Wisata',
            lokasi: 'Desa Pujon Kidul, Malang',
            tahun: 2025,
          },
        ],
      },
    },
  },
];

export const prodiDataset = [
  {
    nama: 'Teknik Informatika',
    fakultas: 'Fakultas Teknik',
    akreditasi: 'A (Unggul)',
    jumlah_dosen: 18,
    jumlah_mahasiswa_aktif: 520,
    target_publikasi_tahun_ini: 25,
    publikasi_tercapai: 12,
  },
  {
    nama: 'Pendidikan Matematika',
    fakultas: 'Fakultas Keguruan dan Ilmu Pendidikan',
    akreditasi: 'A (Unggul)',
    jumlah_dosen: 15,
    jumlah_mahasiswa_aktif: 380,
    target_publikasi_tahun_ini: 20,
    publikasi_tercapai: 15,
  },
];
