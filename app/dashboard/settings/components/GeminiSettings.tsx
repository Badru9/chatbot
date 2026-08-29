"use client";

import { ShieldCheckIcon, SparkleIcon } from "@phosphor-icons/react";

interface GeminiSettingsProps {
  primaryModel: string;
  onPrimaryModelChange: (model: string) => void;
  fallbacks: string[];
  onFallbacksChange: (fallbacks: string[]) => void;
}

const AVAILABLE_GEMINI_MODELS = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", tag: "Cepat & Stabil (Default)" },
  { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", tag: "Ringan & Hemat Kuota" },
  { id: "gemini-flash-latest", name: "Gemini Flash Latest", tag: "Model Flash Terbaru" },
  { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash", tag: "Generasi 3.5" },
  { id: "gemini-3.7-flash", name: "Gemini 3.7 Flash", tag: "Performa Tertinggi" },
  { id: "gemini-pro-latest", name: "Gemini Pro Latest", tag: "Model Pro Terbaru" },
];

export default function GeminiSettings({
  primaryModel,
  onPrimaryModelChange,
  fallbacks,
  onFallbacksChange,
}: GeminiSettingsProps) {
  const toggleFallback = (modelId: string) => {
    if (fallbacks.includes(modelId)) {
      onFallbacksChange(fallbacks.filter((m) => m !== modelId));
    } else {
      onFallbacksChange([...fallbacks, modelId]);
    }
  };

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/60 dark:border-blue-800/60">
          <SparkleIcon size={20} weight="duotone" />
        </div>
        <div>
          <h2 className="font-semibold text-neutral-900 dark:text-white text-base">
            Konfigurasi Google Gemini Cloud
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Tentukan model utama dan urutan model cadangan saat terjadi pembatasan kuota API.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
          Model Utama (Primary Model)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {AVAILABLE_GEMINI_MODELS.map((item) => {
            const isSelected = primaryModel === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onPrimaryModelChange(item.id)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex items-center justify-between ${
                  isSelected
                    ? "border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800/70 font-semibold text-neutral-900 dark:text-white"
                    : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {item.tag}
                  </p>
                </div>
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheckIcon size={16} className="text-neutral-500" />
              Daftar Model Cadangan (Gemini Failover Chain)
            </label>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Jika model utama terkena error 429 (kuota habis), sistem otomatis mencoba model yang dicentang di bawah ini secara berurutan.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {AVAILABLE_GEMINI_MODELS.map((item) => {
            if (item.id === primaryModel) return null;
            const isChecked = fallbacks.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleFallback(item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border cursor-pointer transition flex items-center gap-2 ${
                  isChecked
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                    : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300"
                }`}
              >
                <span>{item.name}</span>
                <span className="text-[10px] opacity-75">
                  {isChecked ? "(Aktif)" : "(Nonaktif)"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
