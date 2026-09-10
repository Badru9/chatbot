import { DayOfWeek, StudyProgram } from "@prisma/client";
import { v7 as uuid } from "uuid";

export interface ScheduleSeed {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  courseName: string;
  courseCode: string;
  className: string;
  room: string;
  sks: number;
}

export interface DosenSeed {
  name: string;
  email: string;
  nidn: string;
  nip: string;
  academicRank: string;
  highestEducation: string;
  studyProgramCode: string;
  role: "lecturer";
  schedules?: ScheduleSeed[];
  tridarmaDetail: {
    skorSinta: number;
    hIndex: number;
    bidangKeahlian: string[];
    publikasi: Array<{ judul: string; jurnal: string; tahun: number }>;
    hibahPenelitian: Array<{
      judul: string;
      sumber: string;
      tahun: number;
      dana: string;
    }>;
    pengabdian: Array<{ judul: string; lokasi: string; tahun: number }>;
  };
}

export const prodiDataset: StudyProgram[] = [
  {
    id: uuid(),
    code: "IF",
    name: "Teknik Informatika",
    degreeLevel: "S1",
    faculty: "Fakultas Teknik",
    accreditation: "A (Unggul)",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    code: "PMAT",
    name: "Pendidikan Matematika",
    degreeLevel: "S1",
    faculty: "Fakultas Keguruan dan Ilmu Pendidikan",
    accreditation: "A (Unggul)",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const dosenDataset: DosenSeed[] = [
  {
    name: "Dr. Ahmad Fauzi, M.Kom.",
    email: "ahmad.fauzi@mb.ai",
    nidn: "0312058901",
    nip: "198905122015041001",
    academicRank: "Lektor",
    highestEducation: "S3 Ilmu Komputer - Universitas Indonesia",
    studyProgramCode: "IF",
    role: "lecturer",
    schedules: [
      {
        day: "SENIN" as DayOfWeek,
        startTime: "08:00",
        endTime: "09:40",
        courseName: "Kecerdasan Buatan",
        courseCode: "IF301",
        className: "IF-3A",
        room: "Lab AI",
        sks: 3,
      },
      {
        day: "RABU" as DayOfWeek,
        startTime: "10:00",
        endTime: "11:40",
        courseName: "Struktur Data",
        courseCode: "IF202",
        className: "IF-2B",
        room: "R.302",
        sks: 3,
      },
    ],
    tridarmaDetail: {
      skorSinta: 450,
      hIndex: 6,
      bidangKeahlian: [
        "Machine Learning",
        "Data Mining",
        "Artificial Intelligence",
      ],
      publikasi: [
        {
          judul: "Deep Learning untuk Deteksi Penyakit Padi",
          jurnal: "Jurnal Informatika (SINTA 2)",
          tahun: 2025,
        },
        {
          judul: "Optimasi CNN dengan Transfer Learning",
          jurnal: "IEEE Access (Scopus Q1)",
          tahun: 2024,
        },
        {
          judul: "Sentiment Analysis pada Media Sosial",
          jurnal: "Jurnal Teknologi Informasi (SINTA 3)",
          tahun: 2024,
        },
      ],
      hibahPenelitian: [
        {
          judul: "Pengembangan Sistem Deteksi Dini Hama",
          sumber: "Kemendikbud",
          tahun: 2025,
          dana: "Rp 85.000.000",
        },
      ],
      pengabdian: [
        {
          judul: "Pelatihan Coding untuk Siswa SMA",
          lokasi: "SMAN 1 Surabaya",
          tahun: 2025,
        },
        {
          judul: "Workshop IoT untuk UMKM",
          lokasi: "Kecamatan Lowokwaru, Malang",
          tahun: 2024,
        },
      ],
    },
  },
  {
    name: "Prof. Dr. Siti Rahayu, M.Pd.",
    email: "siti.rahayu@mb.ai",
    nidn: "0205067502",
    nip: "197506052000032001",
    academicRank: "Guru Besar",
    highestEducation: "S3 Pendidikan Matematika - Universitas Negeri Malang",
    studyProgramCode: "PMAT",
    role: "lecturer",
    schedules: [
      {
        day: "SELASA" as DayOfWeek,
        startTime: "09:00",
        endTime: "11:30",
        courseName: "Metode Penelitian Pendidikan",
        courseCode: "PM401",
        className: "PM-4A",
        room: "R.201",
        sks: 3,
      },
    ],
    tridarmaDetail: {
      skorSinta: 1250,
      hIndex: 14,
      bidangKeahlian: ["Pendidikan Matematika", "Kurikulum", "Etnomatematika"],
      publikasi: [
        {
          judul: "Etnomatematika dalam Budaya Jawa Timur",
          jurnal: "Journal of Mathematics Education (Scopus Q2)",
          tahun: 2025,
        },
        {
          judul: "Efektivitas Problem-Based Learning",
          jurnal: "Jurnal Pendidikan MIPA (SINTA 1)",
          tahun: 2025,
        },
        {
          judul: "Analisis Miskonsepsi Aljabar",
          jurnal: "Jurnal Pendidikan Matematika (SINTA 2)",
          tahun: 2024,
        },
      ],
      hibahPenelitian: [
        {
          judul: "Penelitian Fundamental: Model Pembelajaran Inovatif",
          sumber: "DRPM Kemendikbud",
          tahun: 2025,
          dana: "Rp 150.000.000",
        },
        {
          judul: "Penelitian Terapan: Etnomatematika Nusantara",
          sumber: "LPDP",
          tahun: 2024,
          dana: "Rp 200.000.000",
        },
      ],
      pengabdian: [
        {
          judul: "Pendampingan Guru Matematika SMP se-Kota Malang",
          lokasi: "Kota Malang",
          tahun: 2025,
        },
        {
          judul: "Penyusunan Modul Matematika Kurikulum Merdeka",
          lokasi: "Dinas Pendidikan Jatim",
          tahun: 2024,
        },
      ],
    },
  },
  {
    name: "Budi Santoso, S.T., M.T.",
    email: "budi.santoso@mb.ai",
    nidn: "0718099201",
    nip: "199209182020121002",
    academicRank: "Asisten Ahli",
    highestEducation: "S2 Teknik Informatika - ITS Surabaya",
    studyProgramCode: "IF",
    role: "lecturer",
    schedules: [
      {
        day: "KAMIS" as DayOfWeek,
        startTime: "13:00",
        endTime: "15:30",
        courseName: "Pemrograman Web",
        courseCode: "IF204",
        className: "IF-2A",
        room: "Lab Komputer 1",
        sks: 3,
      },
    ],
    tridarmaDetail: {
      skorSinta: 85,
      hIndex: 1,
      bidangKeahlian: ["Web Development", "Cloud Computing", "Basis Data"],
      publikasi: [
        {
          judul: "Arsitektur Microservices untuk Sistem Akademik",
          jurnal: "Jurnal Teknik Informatika (SINTA 4)",
          tahun: 2025,
        },
      ],
      hibahPenelitian: [],
      pengabdian: [
        {
          judul: "Pembuatan Website Desa Wisata",
          lokasi: "Desa Pujon Kidul, Malang",
          tahun: 2025,
        },
      ],
    },
  },
];
