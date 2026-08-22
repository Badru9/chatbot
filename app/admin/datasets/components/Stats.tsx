"use client";

import { CheckCircleIcon, DatabaseIcon } from "@phosphor-icons/react";

interface StatsProps {
  totalDatasets: number;
  activeDatasets: number;
  isLoading: boolean;
}

export default function Stats({
  totalDatasets,
  activeDatasets,
  isLoading,
}: StatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white border border-neutral-200/60 dark:border-neutral-700/60">
          <DatabaseIcon size={24} weight="duotone" />
        </div>
        <div>
          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-semibold tracking-wider uppercase">
            TOTAL DATASET SISTEM
          </p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {isLoading ? "-" : totalDatasets}
          </p>
        </div>
      </div>
      <div className="border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
          <CheckCircleIcon size={24} weight="duotone" />
        </div>
        <div>
          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-semibold tracking-wider uppercase">
            DATASET AKTIF (SYSTEM PROMPT)
          </p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {isLoading ? "-" : activeDatasets}
          </p>
        </div>
      </div>
    </div>
  );
}
