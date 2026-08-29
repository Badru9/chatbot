"use client";

import { useLogout, useSession } from "@/lib/auth-client";
import {
  ArrowSquareOut,
  Books,
  Gear,
  House,
  ListPlus,
  SignOut,
  Sparkle,
  Users,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  onCloseMobile?: () => void;
}

export const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: House,
    exact: true,
  },
  {
    label: "Menu Portal",
    href: "/dashboard/menus",
    icon: ListPlus,
    exact: false,
  },
  {
    label: "Dataset AI",
    href: "/dashboard/datasets",
    icon: Books,
    exact: false,
  },
  {
    label: "Kelola Pengguna",
    href: "/dashboard/users",
    icon: Users,
    exact: false,
  },
  {
    label: "Pengaturan AI",
    href: "/dashboard/settings",
    icon: Gear,
    exact: false,
  },
];

export default function DashboardSidebar({
  onCloseMobile,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user } = useSession();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        window.location.href = "/";
      },
    });
  };

  const isActive = (item: (typeof navItems)[number]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <aside className="w-64 h-full flex flex-col justify-between bg-white dark:bg-neutral-900 border-r border-neutral-200/80 dark:border-neutral-800 select-none">
      {/* Top Header & Navigation */}
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800 shrink-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
            onClick={onCloseMobile}
          >
            <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center shadow-xs">
              <Sparkle size={20} weight="fill" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-white leading-none">
                mb.ai
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-neutral-500 uppercase mt-0.5">
                Admin Panel
              </span>
            </div>
          </Link>

          {/* Close button for Mobile Drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              aria-label="Tutup Menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Menu Utama
          </p>
          {navItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs font-semibold"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  size={19}
                  weight={active ? "fill" : "regular"}
                  className="shrink-0"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Quick Links Section */}
        <div className="p-3 mt-auto">
          <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-white transition group"
            >
              <span className="flex items-center gap-2">
                <ArrowSquareOut
                  size={16}
                  className="text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white"
                />
                Portal Dosen (Tab Baru)
              </span>
              <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-500 font-mono">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* User Profile & Logout Bottom Bar */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 shrink-0">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold text-xs shrink-0">
              {initial}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                {user?.name || "Admin"}
              </span>
              <span className="text-[10px] font-mono text-[#346538] dark:text-emerald-400 font-medium capitalize">
                {user?.role || "admin"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Keluar"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition cursor-pointer shrink-0"
            aria-label="Logout"
          >
            <SignOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
