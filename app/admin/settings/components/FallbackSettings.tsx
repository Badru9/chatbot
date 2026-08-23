"use client";

import { Switch } from "@heroui/react";
import { GitForkIcon } from "@phosphor-icons/react";

interface FallbackSettingsProps {
  enableAutoFallback: boolean;
  onEnableAutoFallbackChange: (enabled: boolean) => void;
  enableCrossFallback: boolean;
  onEnableCrossFallbackChange: (enabled: boolean) => void;
}

export default function FallbackSettings({
  enableAutoFallback,
  onEnableAutoFallbackChange,
  enableCrossFallback,
  onEnableCrossFallbackChange,
}: FallbackSettingsProps) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200/60 dark:border-purple-800/60">
          <GitForkIcon size={20} weight="duotone" />
        </div>
        <div>
          <h2 className="font-semibold text-neutral-900 dark:text-white text-base">
            Aturan Failover Otomatis (Hybrid Fallback)
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Cegah chatbot berhenti merespon saat batas kuota API tercapai atau server mengalami gangguan.
          </p>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800">
        <div className="py-4 flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              Failover Model Internal Provider
            </span>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Otomatis mencoba model alternatif dalam provider yang sama saat model utama terkena error 429 atau kuota habis (contoh: Gemini 2.5 Flash $\rightarrow$ 2.0 Flash $\rightarrow$ 1.5 Flash).
            </p>
          </div>
          <Switch
            isSelected={enableAutoFallback}
            onChange={onEnableAutoFallbackChange}
            aria-label="Failover Model Internal"
          />
        </div>

        <div className="py-4 flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              Failover Lintas Provider (Cloud $\leftrightarrow$ Local)
            </span>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Jika seluruh model Google Gemini gagal merespon, sistem otomatis mengalihkan permintaan ke server Local Ollama, atau sebaliknya jika Ollama offline maka beralih ke Gemini Cloud.
            </p>
          </div>
          <Switch
            isSelected={enableCrossFallback}
            onChange={onEnableCrossFallbackChange}
            aria-label="Failover Lintas Provider"
          />
        </div>
      </div>
    </div>
  );
}
