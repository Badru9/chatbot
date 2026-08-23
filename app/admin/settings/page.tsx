"use client";

import { useState, useEffect } from "react";
import { Button, toast } from "@heroui/react";
import {
  ArrowLeftIcon,
  FloppyDiskIcon,
  ArrowsClockwiseIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import PortalLayout from "../../(portal)/layout";
import { useAiSettingServices } from "@/hooks/useAiSettingServices";
import ProviderCard from "./components/ProviderCard";
import GeminiSettings from "./components/GeminiSettings";
import OllamaSettings from "./components/OllamaSettings";
import FallbackSettings from "./components/FallbackSettings";

export default function AiSettingsPage() {
  const { aiSettingQuery, updateAiSettingMutation, testOllamaMutation } =
    useAiSettingServices();

  const [activeProvider, setActiveProvider] = useState<"gemini" | "ollama">(
    "gemini",
  );
  const [geminiPrimary, setGeminiPrimary] = useState("gemini-2.5-flash");
  const [geminiFallbacks, setGeminiFallbacks] = useState<string[]>([
    "gemini-2.5-flash-lite",
    "gemini-flash-latest",
    "gemini-3.5-flash",
  ]);
  const [ollamaBaseUrl, setOllamaBaseUrl] = useState("http://localhost:11434");
  const [ollamaModel, setOllamaModel] = useState("llama3.2");
  const [enableAutoFallback, setEnableAutoFallback] = useState(true);
  const [enableCrossFallback, setEnableCrossFallback] = useState(true);

  const [testResult, setTestResult] = useState<{
    online: boolean;
    models: string[];
    message: string;
  } | null>(null);

  // Sync state when query data is loaded
  useEffect(() => {
    if (aiSettingQuery.data) {
      const data = aiSettingQuery.data;
      setActiveProvider(
        (data.activeProvider as "gemini" | "ollama") || "gemini",
      );
      setGeminiPrimary(data.geminiPrimary || "gemini-2.5-flash");
      setGeminiFallbacks(data.geminiFallbacks || []);
      setOllamaBaseUrl(data.ollamaBaseUrl || "http://localhost:11434");
      setOllamaModel(data.ollamaModel || "llama3.2");
      setEnableAutoFallback(data.enableAutoFallback ?? true);
      setEnableCrossFallback(data.enableCrossFallback ?? true);
    }
  }, [aiSettingQuery.data]);

  const handleTestOllamaConnection = () => {
    testOllamaMutation.mutate(ollamaBaseUrl, {
      onSuccess: (res) => {
        setTestResult(res);
        if (res.online) {
          toast(res.message, { variant: "success" });
        } else {
          toast(res.message, { variant: "warning" });
        }
      },
      onError: (err: any) => {
        const message = err.message || "Gagal menguji koneksi Ollama";
        setTestResult({
          online: false,
          models: [],
          message,
        });
        toast(message, { variant: "danger" });
      },
    });
  };

  const handleSaveSettings = () => {
    updateAiSettingMutation.mutate(
      {
        activeProvider,
        geminiPrimary,
        geminiFallbacks,
        ollamaBaseUrl: ollamaBaseUrl.trim(),
        ollamaModel: ollamaModel.trim(),
        enableAutoFallback,
        enableCrossFallback,
      },
      {
        onSuccess: () => {
          toast("Pengaturan model AI berhasil disimpan.", {
            variant: "success",
          });
        },
        onError: (err: any) => {
          toast(`Gagal menyimpan pengaturan: ${err.message}`, {
            variant: "danger",
          });
        },
      },
    );
  };

  return (
    <PortalLayout>
      <div className="w-full max-w-5xl flex flex-col gap-6 mt-8 mb-16">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                isIconOnly
                variant="ghost"
                className="rounded-full cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                <ArrowLeftIcon size={20} />
              </Button>
            </Link>
            <div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                Portal / Admin
              </p>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Pengaturan Model AI
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSaveSettings}
              isDisabled={
                updateAiSettingMutation.isPending || aiSettingQuery.isLoading
              }
              className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-bold flex items-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] transition-transform rounded-xl px-5 py-2 text-sm"
            >
              {updateAiSettingMutation.isPending ? (
                <>
                  <ArrowsClockwiseIcon size={18} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <FloppyDiskIcon size={18} weight="bold" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Provider Selection */}
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Pilih Provider AI Aktif
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Pilih provider utama yang akan memproses seluruh pesan dan chat
              pengguna secara default.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProviderCard
              provider="gemini"
              activeProvider={activeProvider}
              onSelect={setActiveProvider}
            />
            <ProviderCard
              provider="ollama"
              activeProvider={activeProvider}
              onSelect={setActiveProvider}
              isOllamaOnline={testResult?.online}
            />
          </div>
        </div>

        {/* Gemini Settings */}
        <GeminiSettings
          primaryModel={geminiPrimary}
          onPrimaryModelChange={setGeminiPrimary}
          fallbacks={geminiFallbacks}
          onFallbacksChange={setGeminiFallbacks}
        />

        {/* Ollama Settings */}
        <OllamaSettings
          baseUrl={ollamaBaseUrl}
          onBaseUrlChange={setOllamaBaseUrl}
          model={ollamaModel}
          onModelChange={setOllamaModel}
          onTestConnection={handleTestOllamaConnection}
          isTesting={testOllamaMutation.isPending}
          testResult={testResult}
        />

        {/* Fallback Rules Settings */}
        <FallbackSettings
          enableAutoFallback={enableAutoFallback}
          onEnableAutoFallbackChange={setEnableAutoFallback}
          enableCrossFallback={enableCrossFallback}
          onEnableCrossFallbackChange={setEnableCrossFallback}
        />

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Perubahan pengaturan langsung diterapkan pada permintaan chat
            berikutnya tanpa restart server.
          </p>
          <Button
            onClick={handleSaveSettings}
            isDisabled={
              updateAiSettingMutation.isPending || aiSettingQuery.isLoading
            }
            className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-bold flex items-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] transition-transform rounded-xl px-5 py-2 text-sm"
          >
            {updateAiSettingMutation.isPending ? (
              <>
                <ArrowsClockwiseIcon size={18} className="animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <FloppyDiskIcon size={18} weight="bold" />
                Simpan Konfigurasi AI
              </>
            )}
          </Button>
        </div>
      </div>
    </PortalLayout>
  );
}
