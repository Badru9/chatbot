"use client";

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
          Selamat datang di mb.ai
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg max-w-xl leading-relaxed font-normal">
          Portal Layanan Akademik & Asisten Personal AI Dosen Universitas.
        </p>
      </div>
      <PortalGrid />
    </PortalLayout>
  );
}
