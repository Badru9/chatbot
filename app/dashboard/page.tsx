"use client";

import { useAiSettingServices } from "@/hooks/useAiSettingServices";
import { useDatasetServices } from "@/hooks/useDatasetServices";
import { useSession } from "@/lib/auth-client";
import { Sparkle } from "@phosphor-icons/react";
import QuickActions from "./components/QuickActions";
import StatCards from "./components/StatCards";
import SystemAiStatus from "./components/SystemAiStatus";
import { useMenuServices } from "./menus/hooks/useMenuServices";
import { useUserServices } from "./users/hooks/useUserServices";

export default function DashboardPage() {
  const { user } = useSession();
  const { menus, isLoading: isMenusLoading } = useMenuServices();
  const { datasetsQuery } = useDatasetServices();
  const { users, isLoading: isUsersLoading } = useUserServices();
  const { aiSettingQuery } = useAiSettingServices();

  const totalMenus = menus?.length ?? 0;
  const totalDatasets = datasetsQuery.data?.length ?? 0;
  const activeDatasets =
    datasetsQuery.data?.filter((d) => d.isActive).length ?? 0;
  const totalUsers = users?.length ?? 0;
  const totalDosen = users?.filter((u) => u.role === "dosen").length ?? 0;

  const aiData = aiSettingQuery.data;
  const isStatsLoading =
    isMenusLoading ||
    datasetsQuery.isLoading ||
    isUsersLoading ||
    aiSettingQuery.isLoading;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900 dark:bg-neutral-900 text-white border border-neutral-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-800 text-[11px] font-medium tracking-wide uppercase text-neutral-300 mb-3 border border-neutral-700">
            <Sparkle size={13} weight="fill" className="text-amber-400" />
            <span>Portal Administrator</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Selamat Datang, {user?.name || "Admin"}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed font-normal">
            Kelola pintasan layanan dosen, dokumen pedoman dan dataset
            pengetahuan untuk RAG Chatbot, serta konfigurasi engine AI dalam
            satu kontrol terpadu.
          </p>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <StatCards
        totalMenus={totalMenus}
        totalDatasets={totalDatasets}
        activeDatasets={activeDatasets}
        totalUsers={totalUsers}
        totalDosen={totalDosen}
        aiProvider={aiData?.activeProvider || "gemini"}
        aiPrimaryModel={aiData?.geminiPrimary || "gemini-3.8-flash"}
        isLoading={isStatsLoading}
      />

      {/* Main Grid: Quick Actions + AI Status Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />

        <SystemAiStatus
          activeProvider={aiData?.activeProvider || "gemini"}
          primaryModel={
            aiData?.activeProvider === "ollama"
              ? aiData?.ollamaModel || "llama3.2"
              : aiData?.geminiPrimary || "gemini-3.8-flash"
          }
          fallbacks={aiData?.geminiFallbacks || []}
          enableAutoFallback={aiData?.enableAutoFallback ?? true}
          enableCrossFallback={aiData?.enableCrossFallback ?? true}
          ollamaBaseUrl={aiData?.ollamaBaseUrl}
          ollamaModel={aiData?.ollamaModel}
        />
      </div>
    </div>
  );
}
