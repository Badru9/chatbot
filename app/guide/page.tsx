"use client";

import { Link, Tabs } from "@heroui/react";
import {
  CalendarCheckIcon,
  CalendarIcon,
  ChartBarIcon,
  ChatCircleDotsIcon,
  CloudArrowUpIcon,
  FileTextIcon,
  FolderIcon,
  GraduationCapIcon,
  type Icon,
  ListIcon,
  MagnifyingGlassIcon,
  MonitorIcon,
  PaperPlaneRightIcon,
  RobotIcon,
  RocketLaunchIcon,
  RowsIcon,
  SignInIcon,
  SparkleIcon,
  ToggleRightIcon,
  TrashIcon,
  TrendUpIcon,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";
import PortalLayout from "../(portal)/layout";

/* ------------------------------------------------------------------ */
/*  Reusable step card component                                      */
/* ------------------------------------------------------------------ */

interface StepProps {
  number: number;
  icon: Icon;
  title: string;
  children: ReactNode;
}

function Step({ number, icon: Icon, title, children }: StepProps) {
  return (
    <div className="flex gap-4 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
      {/* Number badge */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <span className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-bold flex items-center justify-center">
          {number}
        </span>
        <Icon
          size={20}
          weight="duotone"
          className="text-neutral-500 dark:text-neutral-400"
        />
      </div>
      {/* Content */}
      <div className="min-w-0">
        <h3 className="font-bold text-neutral-900 dark:text-white text-[15px] leading-snug mb-1">
          {title}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {children}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable roadmap card component                                   */
/* ------------------------------------------------------------------ */

interface RoadmapItemProps {
  icon: Icon;
  title: string;
  description: string;
  status: "development" | "planned";
}

function RoadmapItem({
  icon: Icon,
  title,
  description,
  status,
}: RoadmapItemProps) {
  const statusConfig = {
    development: {
      label: "Dalam Pengembangan",
      className:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    },
    planned: {
      label: "Direncanakan",
      className:
        "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700",
    },
  };

  const { label, className } = statusConfig[status];

  return (
    <div className="flex gap-4 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
        <Icon
          size={20}
          weight="duotone"
          className="text-neutral-700 dark:text-neutral-300"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 className="font-bold text-neutral-900 dark:text-white text-[15px] leading-snug">
            {title}
          </h3>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${className}`}
          >
            {label}
          </span>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                         */
/* ------------------------------------------------------------------ */

export default function PanduanPage() {
  return (
    <PortalLayout>
      {/* Header */}
      <div className="text-center max-w-2xl mb-10">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold tracking-wider text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/60 shadow-xs mb-4">
          <SparkleIcon size={14} weight="fill" className="text-amber-500" />
          PANDUAN PENGGUNAAN
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight mb-3">
          Cara Menggunakan Portal
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 text-base sm:text-lg leading-relaxed">
          Pelajari cara menggunakan Asisten Virtual, fitur Jadwal Mengajar, dan
          layanan AISnet yang tersedia di portal ini.
        </p>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-3xl">
        <Tabs className="w-full">
          <Tabs.ListContainer className="mb-6">
            <Tabs.List aria-label="Panduan Penggunaan">
              <Tabs.Tab id="chatbot">
                <RobotIcon size={16} weight="duotone" className="mr-1.5" />
                Asisten Virtual
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="jadwal">
                <CalendarIcon size={16} weight="duotone" className="mr-1.5" />
                Jadwal Mengajar
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="aisnet">
                <MonitorIcon size={16} weight="duotone" className="mr-1.5" />
                AISnet
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="roadmap">
                <RocketLaunchIcon
                  size={16}
                  weight="duotone"
                  className="mr-1.5"
                />
                Roadmap
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>

          {/* ── Tab: Asisten Virtual ────────────────────────────── */}
          <Tabs.Panel id="chatbot">
            <div className="flex flex-col gap-3">
              <Step number={1} icon={RobotIcon} title="Buka Asisten Virtual">
                Klik ikon robot di pojok kanan bawah layar. Ikon ini tersedia di
                semua halaman portal.
              </Step>
              <Step number={2} icon={SignInIcon} title="Login terlebih dahulu">
                Jika belum login, Anda akan diminta login menggunakan akun
                dosen. Masukkan username dan password Anda.
              </Step>
              <Step
                number={3}
                icon={ChatCircleDotsIcon}
                title="Mulai percakapan"
              >
                Ketik pertanyaan di kolom input dan tekan Enter atau klik tombol
                kirim. Asisten AI akan menjawab pertanyaan Anda seputar
                regulasi, administrasi, dan layanan kampus.
              </Step>
              <Step
                number={4}
                icon={CloudArrowUpIcon}
                title="Upload dokumen PDF"
              >
                Klik tombol <strong>(+)</strong> di sebelah kiri kolom input,
                pilih <strong>&quot;PDF&quot;</strong>, lalu pilih file dari
                komputer Anda. Dokumen akan masuk ke library untuk digunakan
                dalam percakapan.
              </Step>
              <Step
                number={5}
                icon={FolderIcon}
                title="Gunakan file dari library"
              >
                Ketik <strong>@</strong> di kolom input untuk memilih file yang
                sudah di-upload sebelumnya. File yang dipilih akan menjadi
                konteks tambahan bagi Asisten AI.
              </Step>
              <Step number={6} icon={ListIcon} title="Riwayat chat">
                Klik menu <strong>&quot;History&quot;</strong> di sidebar kiri
                chatbot untuk melihat dan melanjutkan percakapan sebelumnya.
              </Step>
              <Step
                number={7}
                icon={PaperPlaneRightIcon}
                title="Buat percakapan baru"
              >
                Klik <strong>&quot;New Chat&quot;</strong> di sidebar kiri untuk
                memulai sesi percakapan baru dari awal.
              </Step>
            </div>
          </Tabs.Panel>

          {/* ── Tab: Jadwal Mengajar ───────────────────────────── */}
          <Tabs.Panel id="jadwal">
            <div className="flex flex-col gap-3">
              <Step number={1} icon={RobotIcon} title="Buka Asisten Virtual">
                Klik ikon robot di pojok kanan bawah layar untuk membuka Asisten
                Virtual.
              </Step>
              <Step
                number={2}
                icon={ToggleRightIcon}
                title="Aktifkan tool Jadwal Mengajar"
              >
                Di bagian bawah chatbot, temukan bar{" "}
                <strong>&quot;Tools:&quot;</strong> lalu klik tombol{" "}
                <strong>&quot;Jadwal Mengajar&quot;</strong> hingga berubah
                warna gelap (aktif).
              </Step>
              <Step
                number={3}
                icon={CloudArrowUpIcon}
                title="Upload PDF jadwal"
              >
                Klik tombol <strong>(+)</strong> → pilih{" "}
                <strong>&quot;PDF&quot;</strong> → upload file jadwal mengajar
                Anda dalam format PDF.
              </Step>
              <Step number={4} icon={PaperPlaneRightIcon} title="Kirim pesan">
                Setelah file ter-upload, kirim pesan apapun (misalnya{" "}
                <em>&quot;Ekstrak jadwal saya&quot;</em>). Asisten AI akan
                otomatis membaca PDF dan mengekstrak jadwal mengajar Anda.
              </Step>
              <Step
                number={5}
                icon={CalendarCheckIcon}
                title="Lihat hasil jadwal"
              >
                Jadwal yang berhasil diekstrak akan muncul di panel{" "}
                <strong>&quot;Jadwal Dosen&quot;</strong> di sebelah kanan area
                chat. Jadwal dikelompokkan per hari (Senin–Minggu).
              </Step>
              <Step number={6} icon={TrashIcon} title="Kelola jadwal">
                Anda dapat melihat detail jadwal per hari dan menghapus seluruh
                jadwal jika ingin mengulang proses ekstraksi dengan file baru.
              </Step>
            </div>
          </Tabs.Panel>

          {/* ── Tab: AISnet ────────────────────────────────────── */}
          <Tabs.Panel id="aisnet">
            <div className="flex flex-col gap-3">
              <Step number={1} icon={MonitorIcon} title="Akses halaman AISnet">
                Dari portal utama, klik menu{" "}
                <strong>&quot;AISNET ITG&quot;</strong> pada grid layanan, atau
                akses langsung melalui navigasi.
              </Step>
              <Step number={2} icon={RowsIcon} title="Navigasi sidebar">
                Di sisi kiri terdapat menu navigasi lengkap AISnet yang
                mencakup: Perkuliahan, Penilaian Hasil Belajar, Penelitian dan
                PKM, Hak Kekayaan Intelektual, dan Keuangan.
              </Step>
              <Step
                number={3}
                icon={MagnifyingGlassIcon}
                title="Fitur Penelitian dan PkM"
              >
                Saat ini fitur yang aktif adalah halaman{" "}
                <strong>Keuangan → Penelitian dan PkM</strong> yang menampilkan
                tabel data keuangan penelitian beserta jenis, judul, nominal,
                dan tanggal pencairan.
              </Step>
              <Step number={4} icon={FileTextIcon} title="Lihat detail">
                Klik tombol <strong>&quot;Detail&quot;</strong> pada setiap
                baris tabel untuk melihat informasi lengkap penelitian dalam
                modal popup.
              </Step>
              <Step number={5} icon={RobotIcon} title="Asisten AI di AISnet">
                Ikon robot juga tersedia di halaman AISnet. Chatbot di sini
                dapat menganalisis data tabel penelitian yang sedang
                ditampilkan, sehingga Anda bisa bertanya langsung tentang data
                tersebut.
              </Step>
            </div>
          </Tabs.Panel>

          {/* ── Tab: Roadmap ───────────────────────────────────── */}
          <Tabs.Panel id="roadmap">
            <div className="mb-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Berikut adalah fitur-fitur yang sedang dan akan dikembangkan di
                portal ini. Pantau halaman ini untuk update terbaru.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <RoadmapItem
                icon={GraduationCapIcon}
                title="Perwalian Mahasiswa"
                description="Kelola data mahasiswa bimbingan akademik, konsultasi, dan perwalian langsung dari portal."
                status="planned"
              />
              <RoadmapItem
                icon={CloudArrowUpIcon}
                title="Upload BKD"
                description="Upload dan kelola dokumen Beban Kerja Dosen (BKD) secara digital."
                status="planned"
              />
              <RoadmapItem
                icon={ChartBarIcon}
                title="Monitoring Kinerja"
                description="Dashboard analitik untuk evaluasi kinerja akademik dosen secara real-time."
                status="planned"
              />
              <RoadmapItem
                icon={FolderIcon}
                title="Integrasi E-Learning"
                description="Sinkronisasi data tugas, materi, dan penilaian dari platform E-Learning ITG."
                status="planned"
              />
              <RoadmapItem
                icon={TrendUpIcon}
                title="Portal SINTA"
                description="Integrasi otomatis skor SINTA, Scopus, Google Scholar, dan H-index."
                status="planned"
              />
            </div>
          </Tabs.Panel>
        </Tabs>

        {/* Back to portal link */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            ← Kembali ke Portal
          </Link>
        </div>
      </div>
    </PortalLayout>
  );
}
