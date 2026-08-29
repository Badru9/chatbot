"use client";

import { CheckCircleIcon, CloudIcon, CpuIcon } from "@phosphor-icons/react";

interface ProviderCardProps {
  provider: "gemini" | "ollama";
  activeProvider: "gemini" | "ollama";
  onSelect: (provider: "gemini" | "ollama") => void;
  isOllamaOnline?: boolean;
}

export default function ProviderCard({
  provider,
  activeProvider,
  onSelect,
  isOllamaOnline,
}: ProviderCardProps) {
  const isGemini = provider === "gemini";
  const isSelected = activeProvider === provider;

  return (
    <button
      type="button"
      onClick={() => onSelect(provider)}
      className={`relative w-full text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 ${
        isSelected
          ? "border-neutral-900 dark:border-white bg-neutral-50/70 dark:bg-neutral-800/60 shadow-sm ring-1 ring-neutral-900/10 dark:ring-white/20"
          : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700"
      }`}
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
              isGemini
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/60"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60"
            }`}
          >
            {isGemini ? (
              <CloudIcon size={22} weight="duotone" />
            ) : (
              <CpuIcon size={22} weight="duotone" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-neutral-900 dark:text-white text-base">
                {isGemini ? "Google Gemini" : "Local Ollama"}
              </h3>
              {isSelected && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                  Aktif
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isGemini ? "Cloud Server (Google AI API)" : "Self-Hosted / Local Instance"}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          {isSelected ? (
            <div className="w-5 h-5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center">
              <CheckCircleIcon size={16} weight="fill" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border border-neutral-300 dark:border-neutral-700" />
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span>
          {isGemini
            ? "Memerlukan API Key di server"
            : isOllamaOnline !== undefined
              ? isOllamaOnline
                ? "Server lokal terhubung"
                : "Server lokal tidak terdeteksi"
              : "Koneksi via REST API"}
        </span>
        <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
          {isGemini ? "Cloud" : "Local"}
        </span>
      </div>
    </button>
  );
}
