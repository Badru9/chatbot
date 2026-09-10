"use client";

import {
  CheckCircle,
  Cpu,
  Gear,
  Lightning,
  Sparkle,
} from "@phosphor-icons/react";
import Link from "next/link";

interface SystemAiStatusProps {
  activeProvider: string;
  primaryModel: string;
  fallbacks: string[];
  enableAutoFallback: boolean;
  enableCrossFallback: boolean;
  ollamaBaseUrl?: string;
  ollamaModel?: string;
}

export default function SystemAiStatus({
  activeProvider = "gemini",
  primaryModel = "gemini-3.8-flash",
  fallbacks = [],
  enableAutoFallback = true,
  enableCrossFallback = true,
  ollamaBaseUrl,
  ollamaModel,
}: SystemAiStatusProps) {
  const isGemini = activeProvider === "gemini";

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <Cpu size={16} weight="fill" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                Status Model AI & RAG
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                Konfigurasi engine cerdas asisten portal
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/settings"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            title="Kelola Pengaturan AI"
          >
            <Gear size={16} />
          </Link>
        </div>

        {/* Active Provider Badge Banner */}
        <div className="p-3.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-850/50 border border-neutral-200 dark:border-neutral-800 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isGemini ? "bg-blue-600" : "bg-emerald-600"
                }`}
              />
              <span className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                {isGemini ? "Google Gemini AI" : "Ollama Local AI"}
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#EDF3EC] text-[#346538] dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
              Active Provider
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block font-normal">
                Model Utama:
              </span>
              <span className="font-mono font-medium text-neutral-900 dark:text-white">
                {isGemini ? primaryModel : ollamaModel || "llama3.2"}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block font-normal">
                Mode Fallback:
              </span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                {enableAutoFallback ? "Otomatis Aktif" : "Nonaktif"}
              </span>
            </div>
          </div>
        </div>

        {/* Fallback list & rules */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 dark:text-neutral-400 text-[11px] font-medium">
              Model Cadangan Terpasang:
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              {fallbacks.length} Model
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {fallbacks.length > 0 ? (
              fallbacks.map((fb, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                >
                  {fb}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-400 italic font-normal">
                Tidak ada model fallback
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-1.5 text-[11px]">
          <CheckCircle
            size={14}
            weight="fill"
            className="text-emerald-600 dark:text-emerald-400"
          />
          <span>
            Cross-provider fallback: {enableCrossFallback ? "Siap" : "Off"}
          </span>
        </div>
        <Link
          href="/dashboard/settings"
          className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline"
        >
          Sesuaikan →
        </Link>
      </div>
    </div>
  );
}
