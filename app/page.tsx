"use client";

import { Alert, Link } from "@heroui/react";
import PortalLayout from "./(portal)/layout";
import PortalGrid from "./components/portal/PortalGrid";

export default function App() {
  return (
    <PortalLayout>
      <div className="text-center max-w-3xl mt-6 mb-12 flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold tracking-wider text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/60 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          PORTAL LAYANAN AKADEMIK
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
          Selesaikan Administrasi Akademik Lebih Cepat
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 text-base sm:text-lg max-w-xl leading-relaxed font-normal">
          Kelola perwalian, upload dokumen BKD, dan tanya jawab regulasi kampus.
          Semua dalam satu portal cerdas.
        </p>
        <Alert status="warning" className="animate-pulse">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Pemberitahuan</Alert.Title>
            <Alert.Description>
              <p className="text-left">
                Portal masih dalam tahap pengembangan. Saat ini fitur yang dapat
                digunakan adalah <strong>Asisten Virtual (Chatbot)</strong> dan
                tools <strong>Pembuatan Jadwal Mengajar</strong>. Untuk membuat
                jadwal, buka Asisten AI lalu aktifkan tool &quot;Jadwal
                Mengajar&quot; dan unggah PDF jadwal Anda.{" "}
                <Link
                  href="/guide"
                  className="font-semibold text-sm underline underline-offset-2"
                >
                  Lihat Panduan Lengkap →
                </Link>
              </p>
            </Alert.Description>
          </Alert.Content>
        </Alert>
      </div>
      <PortalGrid />
    </PortalLayout>
  );
}
