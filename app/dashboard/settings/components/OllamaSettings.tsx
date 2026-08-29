"use client";

import { Button, Input } from "@heroui/react";
import {
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  CpuIcon,
  PlugsConnectedIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

interface OllamaSettingsProps {
  baseUrl: string;
  onBaseUrlChange: (url: string) => void;
  model: string;
  onModelChange: (model: string) => void;
  onTestConnection: () => void;
  isTesting: boolean;
  testResult: { online: boolean; models: string[]; message: string } | null;
}

export default function OllamaSettings({
  baseUrl,
  onBaseUrlChange,
  model,
  onModelChange,
  onTestConnection,
  isTesting,
  testResult,
}: OllamaSettingsProps) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
          <CpuIcon size={20} weight="duotone" />
        </div>
        <div>
          <h2 className="font-semibold text-neutral-900 dark:text-white text-base">
            Konfigurasi Local Ollama Instance
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Jalankan model open-source langsung di server atau mesin lokal tanpa kuota internet.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
            Ollama Server URL
          </label>
          <Input
            value={baseUrl}
            onChange={(e) => onBaseUrlChange(e.target.value)}
            placeholder="http://localhost:11434"
            className="w-full"
          />
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Port default Ollama adalah 11434. Pastikan firewall mengizinkan koneksi jika di server terpisah.
          </p>
        </div>

        <div>
          <Button
            onClick={onTestConnection}
            isDisabled={isTesting || !baseUrl.trim()}
            className="w-full h-10 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition"
          >
            {isTesting ? (
              <>
                <ArrowsClockwiseIcon size={16} className="animate-spin" />
                Menguji Koneksi...
              </>
            ) : (
              <>
                <PlugsConnectedIcon size={16} weight="bold" />
                Uji Koneksi Server
              </>
            )}
          </Button>
        </div>
      </div>

      {testResult && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
            testResult.online
              ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300"
              : "bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300"
          }`}
        >
          {testResult.online ? (
            <CheckCircleIcon size={18} weight="fill" className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
          ) : (
            <WarningCircleIcon size={18} weight="fill" className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          )}
          <div className="flex-1">
            <p className="font-semibold">{testResult.message}</p>
            {testResult.online && testResult.models.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {testResult.models.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onModelChange(m)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border cursor-pointer transition ${
                      model === m
                        ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                        : "bg-white/80 dark:bg-neutral-800/80 border-neutral-300 dark:border-neutral-700 hover:border-emerald-500"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
          Nama Model Aktif Ollama
        </label>
        <Input
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          placeholder="llama3.2, mistral, deepseek-r1:8b, dll."
          className="w-full font-mono text-sm"
        />
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
          Model harus sudah di-pull terlebih dahulu pada server Ollama (`ollama pull {model || "nama-model"}`).
        </p>
      </div>
    </div>
  );
}
