"use client";

import { DatabaseIcon, FolderIcon } from "@phosphor-icons/react";

interface StatsProps {
  totalDocuments: number;
  totalChunks: number;
  isLoading: boolean;
}

export default function Stats({
  totalDocuments,
  totalChunks,
  isLoading,
}: StatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white border border-neutral-200/60 dark:border-neutral-700/60">
          <FolderIcon size={24} weight="duotone" />
        </div>
        <div>
          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-semibold tracking-wider uppercase">
            TOTAL DOKUMEN
          </p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {isLoading ? "-" : totalDocuments}
          </p>
        </div>
      </div>
      <div className="border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white border border-neutral-200/60 dark:border-neutral-700/60">
          <DatabaseIcon size={24} weight="duotone" />
        </div>
        <div>
          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-semibold tracking-wider uppercase">
            TOTAL VECTOR CHUNKS
          </p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {isLoading ? "-" : totalChunks}
          </p>
        </div>
      </div>
    </div>
  );
}
