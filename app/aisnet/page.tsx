"use client";

import { useState } from "react";
import { Table, Button } from "@heroui/react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DetailModal from "./components/DetailModal";
import AisnetChatbot from "./AisnetChatbot";
import { dateFormatter } from "@/lib/dateFormatter";

// ─── Types & Interfaces ────────────────────────────────────────
interface TableRowDetail {
  ketuaPeneliti: string;
  anggota: string[];
  skema: string;
  tahunPelaksanaan: string;
  sumberDana: string;
  totalDana: string;
  statusPenelitian: string;
  abstrak: string;
  luaran: string[];
}

interface TableRow {
  no: number;
  jenis: string;
  judul: string;
  jenisPencairan: string;
  nominal: string;
  tanggal: string;
  details: TableRowDetail;
}

const COLUMNS = [
  { key: "no", label: "No" },
  { key: "jenis", label: "Jenis" },
  { key: "judul", label: "Judul" },
  { key: "jenisPencairan", label: "Jenis Pencairan" },
  { key: "nominal", label: "Nominal" },
  { key: "tanggal", label: "Tanggal" },
  { key: "aksi", label: "Aksi" },
];

const TABLE_DATA: TableRow[] = [
  {
    no: 1,
    jenis: "PENELITIAN",
    judul:
      "Generative Intelligence Chatbot Untuk Perguruan Tinggi Berbasis Model Transformer",
    jenisPencairan: "Dana Awal",
    nominal: "Rp 2.500.000",
    tanggal: "2026-07-04 10:06:00",
    details: {
      ketuaPeneliti: "Leni Fitriani, M.Kom.",
      anggota: ["Dr. Rina Marlina, S.Kom., M.T.", "Andi Fajar, S.Kom., M.Cs."],
      skema: "Penelitian Dosen Pemula (PDP)",
      tahunPelaksanaan: "2026/2027",
      sumberDana: "Internal ITG",
      totalDana: "Rp 5.000.000",
      statusPenelitian: "Sedang Berjalan",
      abstrak:
        "Penelitian ini bertujuan untuk mengembangkan chatbot berbasis Generative AI menggunakan arsitektur model Transformer yang dioptimalkan untuk kebutuhan perguruan tinggi. Chatbot ini dirancang agar mampu menjawab pertanyaan akademik, memberikan informasi seputar perkuliahan, serta mendukung layanan administrasi kampus secara otomatis dan efisien.",
      luaran: [
        "Publikasi Jurnal Nasional Terakreditasi SINTA 3",
        "Prototipe Aplikasi Chatbot",
        "HKI (Hak Cipta Perangkat Lunak)",
      ],
    },
  },
  {
    no: 2,
    jenis: "PENELITIAN",
    judul:
      "A Bilingual Academic Chatbot Based on Semantic Retrieval Using m-BERT",
    jenisPencairan: "Dana Awal",
    nominal: "Rp 2.500.000",
    tanggal: "2026-06-22 16:04:00",
    details: {
      ketuaPeneliti: "Leni Fitriani, M.Kom.",
      anggota: [
        "Dian Nursantika, S.Kom., M.Kom.",
        "Rizki Pratama, S.T., M.Cs.",
      ],
      skema: "Penelitian Terapan Unggulan Perguruan Tinggi",
      tahunPelaksanaan: "2026/2027",
      sumberDana: "Internal ITG",
      totalDana: "Rp 5.000.000",
      statusPenelitian: "Sedang Berjalan",
      abstrak:
        "Penelitian ini mengembangkan chatbot akademik bilingual (Bahasa Indonesia dan Inggris) yang memanfaatkan teknik semantic retrieval dengan model m-BERT untuk memahami konteks pertanyaan pengguna secara lebih akurat dalam dua bahasa. Chatbot ini diharapkan mampu memberikan respons yang relevan terhadap pertanyaan seputar informasi akademik perguruan tinggi.",
      luaran: [
        "Publikasi Jurnal Internasional Terindeks Scopus",
        "Prototipe Sistem Chatbot Bilingual",
        "Poster Ilmiah",
      ],
    },
  },
  {
    no: 3,
    jenis: "PENELITIAN",
    judul:
      "Plant Disease Detection Using Digital Image Processing : Opportunities and challenges",
    jenisPencairan: "Dana Awal",
    nominal: "Rp 2.500.000",
    tanggal: "2026-01-30 10:56:00",
    details: {
      ketuaPeneliti: "Leni Fitriani, M.Kom.",
      anggota: ["Siti Nurhasanah, S.Kom., M.T."],
      skema: "Penelitian Dasar",
      tahunPelaksanaan: "2025/2026",
      sumberDana: "Internal ITG",
      totalDana: "Rp 5.000.000",
      statusPenelitian: "Selesai",
      abstrak:
        "Penelitian ini mengkaji peluang dan tantangan dalam penerapan pengolahan citra digital untuk mendeteksi penyakit tanaman. Metode yang digunakan meliputi segmentasi citra, ekstraksi fitur warna dan tekstur, serta klasifikasi menggunakan algoritma machine learning. Studi ini bertujuan untuk memberikan tinjauan komprehensif terhadap pendekatan terkini di bidang deteksi penyakit tanaman.",
      luaran: [
        "Publikasi Prosiding Konferensi Internasional",
        "Review Article",
      ],
    },
  },
  {
    no: 4,
    jenis: "PENELITIAN",
    judul:
      "Plant Disease Detection Using Digital Image Processing : Opportunities and challenges",
    jenisPencairan: "Sisa Dana",
    nominal: "Rp 2.500.000",
    tanggal: "2026-01-30 10:56:00",
    details: {
      ketuaPeneliti: "Leni Fitriani, M.Kom.",
      anggota: ["Siti Nurhasanah, S.Kom., M.T."],
      skema: "Penelitian Dasar",
      tahunPelaksanaan: "2025/2026",
      sumberDana: "Internal ITG",
      totalDana: "Rp 5.000.000",
      statusPenelitian: "Selesai",
      abstrak:
        "Penelitian ini mengkaji peluang dan tantangan dalam penerapan pengolahan citra digital untuk mendeteksi penyakit tanaman. Metode yang digunakan meliputi segmentasi citra, ekstraksi fitur warna dan tekstur, serta klasifikasi menggunakan algoritma machine learning. Studi ini bertujuan untuk memberikan tinjauan komprehensif terhadap pendekatan terkini di bidang deteksi penyakit tanaman.",
      luaran: [
        "Publikasi Prosiding Konferensi Internasional",
        "Review Article",
      ],
    },
  },
  {
    no: 5,
    jenis: "PENELITIAN",
    judul: "Object Detection on Analog Water Meters Using Region-Based CNN",
    jenisPencairan: "Dana Awal",
    nominal: "Rp 1.750.000",
    tanggal: "2026-01-30 10:48:00",
    details: {
      ketuaPeneliti: "Leni Fitriani, M.Kom.",
      anggota: ["Agung Wahyudi, S.T., M.Kom.", "Nadia Putri, S.Kom."],
      skema: "Penelitian Terapan",
      tahunPelaksanaan: "2025/2026",
      sumberDana: "Internal ITG",
      totalDana: "Rp 3.500.000",
      statusPenelitian: "Selesai",
      abstrak:
        "Penelitian ini mengimplementasikan deteksi objek pada meteran air analog menggunakan Region-Based Convolutional Neural Network (R-CNN). Sistem ini dirancang untuk membaca angka pada meteran air secara otomatis melalui citra digital, sehingga dapat digunakan untuk otomatisasi pencatatan pemakaian air oleh perusahaan penyedia layanan air bersih.",
      luaran: [
        "Publikasi Jurnal Nasional Terakreditasi SINTA 4",
        "Prototipe Sistem Deteksi",
        "HKI (Hak Cipta Perangkat Lunak)",
      ],
    },
  },
  {
    no: 6,
    jenis: "PENELITIAN",
    judul: "Object Detection on Analog Water Meters Using Region-Based CNN",
    jenisPencairan: "Sisa Dana",
    nominal: "Rp 1.750.000",
    tanggal: "2026-01-30 10:39:00",
    details: {
      ketuaPeneliti: "Leni Fitriani, M.Kom.",
      anggota: ["Agung Wahyudi, S.T., M.Kom.", "Nadia Putri, S.Kom."],
      skema: "Penelitian Terapan",
      tahunPelaksanaan: "2025/2026",
      sumberDana: "Internal ITG",
      totalDana: "Rp 3.500.000",
      statusPenelitian: "Selesai",
      abstrak:
        "Penelitian ini mengimplementasikan deteksi objek pada meteran air analog menggunakan Region-Based Convolutional Neural Network (R-CNN). Sistem ini dirancang untuk membaca angka pada meteran air secara otomatis melalui citra digital, sehingga dapat digunakan untuk otomatisasi pencatatan pemakaian air oleh perusahaan penyedia layanan air bersih.",
      luaran: [
        "Publikasi Jurnal Nasional Terakreditasi SINTA 4",
        "Prototipe Sistem Deteksi",
        "HKI (Hak Cipta Perangkat Lunak)",
      ],
    },
  },
];

// ─── Main Page Component ───────────────────────────────────────
export default function AisnetPage() {
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f8fa] font-sans antialiased text-[#181c32] flex">
      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Main Area ── */}
      <div className="flex flex-col flex-1 pl-[265px] min-h-screen">
        {/* Top Header */}
        <Header />

        {/* Content Table Container */}
        <main className="w-full max-w-6xl mx-auto px-8 py-10 mt-[65px] flex-1">
          <div className="bg-white border border-[#eff2f5] rounded-xl overflow-hidden shadow-xs">
            <Table className="w-full border-collapse">
              <Table.ScrollContainer>
                <Table.Content aria-label="Tabel Penelitian dan PkM">
                  <Table.Header columns={COLUMNS}>
                    {(column) => (
                      <Table.Column
                        key={column.key}
                        isRowHeader
                        className="text-left font-bold text-xs tracking-wider text-[#a1a5b7] bg-[#f5f8fa] border-b border-[#eff2f5] py-4 px-6 uppercase"
                      >
                        {column.label}
                      </Table.Column>
                    )}
                  </Table.Header>
                  <Table.Body>
                    {TABLE_DATA.map((row) => (
                      <Table.Row
                        key={row.no}
                        className="hover:bg-[#f9fafb] transition-colors border-b border-[#eff2f5] last:border-none"
                      >
                        <Table.Cell className="font-mono text-center text-sm text-[#a1a5b7] w-12 py-4 px-6">
                          {row.no}
                        </Table.Cell>
                        <Table.Cell className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-[#e1f3fe] text-[#1f6c9f] font-mono">
                            {row.jenis}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="font-medium text-[#181c32] max-w-md truncate py-4 px-6 text-sm">
                          {row.judul}
                        </Table.Cell>
                        <Table.Cell className="py-4 px-6">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#f7f6f3] text-[#555555] font-mono">
                            {row.jenisPencairan}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="font-mono text-right font-semibold text-[#181c32] py-4 px-6 text-sm whitespace-nowrap">
                          {row.nominal}
                        </Table.Cell>
                        <Table.Cell className="text-[#a1a5b7] text-xs py-4 px-6 whitespace-nowrap">
                          {dateFormatter(row.tanggal)}
                        </Table.Cell>
                        <Table.Cell className="text-center py-4 px-6">
                          <Button
                            variant="secondary"
                            className="rounded-md text-xs font-semibold px-3 py-1.5 border border-neutral-200 hover:bg-neutral-50 cursor-pointer"
                            onClick={() => {
                              setSelectedRow(row);
                              setIsDetailOpen(true);
                            }}
                          >
                            Detail
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full max-w-6xl mx-auto px-8 py-6 border-t border-[#eff2f5] text-xs text-[#a1a5b7] flex flex-col sm:flex-row justify-between gap-2 bg-transparent">
          <span>© 2022 AISnet Web Institut Teknologi Garut (ITG)</span>
          <span>Lembaga Sistem Informasi dan Pangkalan Data (LSIPD)</span>
        </footer>
      </div>

      {/* ── Detail Modal ── */}
      <DetailModal
        row={selectedRow}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      {/* ── AI Chatbot ── */}
      <AisnetChatbot tableData={TABLE_DATA} />
    </div>
  );
}
