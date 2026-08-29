"use client";

import { useSession } from "@/lib/auth-client";
import { toast } from "@heroui/react";
import { CircleNotch, WarningCircle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user, isLoading } = useSession();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast(
          "Silakan login terlebih dahulu untuk mengakses Dashboard Admin.",
          {
            variant: "danger",
          },
        );
        router.replace("/");
      } else if (user.role !== "admin") {
        toast(
          "Akses Ditolak: Hanya administrator yang dapat mengakses Dashboard.",
          {
            variant: "danger",
          },
        );
        router.replace("/");
      }
    }
  }, [user, isLoading, router]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <CircleNotch
          size={36}
          className="animate-spin text-neutral-600 dark:text-neutral-400"
        />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Memuat Dashboard Admin...
        </p>
      </div>
    );
  }

  // Unauthorized State (while redirecting)
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
        <div className="max-w-md w-full p-6 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-[#FBF3DB] text-[#956400] dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center mb-3">
            <WarningCircle size={24} weight="fill" />
          </div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Akses Dibatasi
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed font-normal">
            Halaman ini hanya dapat diakses oleh Administrator sistem. Anda akan
            dialihkan ke halaman utama...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex antialiased">
      {/* Desktop Sidebar (Permanent) */}
      <div className="hidden lg:block lg:w-64 shrink-0 h-screen sticky top-0 left-0">
        <DashboardSidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative z-10 w-64 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <DashboardSidebar
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <DashboardTopbar onOpenMobile={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
