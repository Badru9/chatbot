'use client';

import { Skeleton } from '@heroui/react';

export default function MenusLoading() {
  return (
    <div className="w-full max-w-5xl flex flex-col gap-6 mt-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="w-20 h-3 rounded-lg" />
            <Skeleton className="w-40 h-6 rounded-lg" />
          </div>
        </div>
        <Skeleton className="w-32 h-10 rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm">
        {/* Header row */}
        <div className="grid grid-cols-6 gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <Skeleton className="h-4 w-16 rounded-lg" />
          <Skeleton className="h-4 w-12 rounded-lg" />
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded-lg" />
          <Skeleton className="h-4 w-16 rounded-lg mx-auto" />
        </div>

        {/* Data rows */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="grid grid-cols-6 gap-4 py-4 border-b border-neutral-50 dark:border-neutral-800/50 last:border-0"
          >
            <div className="flex items-center gap-1">
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="w-6 h-6 rounded" />
            </div>
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-32 rounded-lg" />
              <Skeleton className="h-3 w-20 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-28 rounded-lg" />
            <div className="flex gap-1">
              <Skeleton className="w-12 h-5 rounded-full" />
              <Skeleton className="w-12 h-5 rounded-full" />
            </div>
            <div className="flex justify-center gap-2">
              <Skeleton className="w-8 h-8 rounded" />
              <Skeleton className="w-8 h-8 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
