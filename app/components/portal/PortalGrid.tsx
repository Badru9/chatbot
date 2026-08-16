"use client";

import { MenuData } from "@/lib/types";
import { getMenus } from "@/services/menuApi";
import { Skeleton } from "@heroui/react";
import { useEffect, useState } from "react";
import { useSession } from "../../../lib/auth-client";
import PortalCard from "./PortalCard";

export default function PortalGrid() {
  const { isPending: isSessionPending } = useSession();
  const [menus, setMenus] = useState<MenuData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await getMenus();
        setMenus(data);
      } catch (error) {
        console.error("Failed to fetch dynamic menus, using fallback:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const isDataLoading = isLoading || isSessionPending;

  if (isDataLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="p-1.5 rounded-3xl bg-neutral-200/50 dark:bg-neutral-800/40 border border-neutral-200/90 dark:border-neutral-800/80"
          >
            <div className="p-6 bg-white dark:bg-neutral-900 rounded-[calc(1.5rem-0.375rem)] flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <Skeleton className="w-11 h-11 rounded-2xl" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
              <div className="space-y-2.5">
                <Skeleton className="h-5 w-2/3 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-4/5 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
      {menus.map((menu, idx) => (
        <PortalCard
          key={menu.id || menu.href || idx}
          title={menu.title}
          description={menu.description}
          icon={menu.icon}
          href={menu.href}
        />
      ))}
    </div>
  );
}
