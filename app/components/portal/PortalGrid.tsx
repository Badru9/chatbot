"use client";

import { getMenus } from "@/services/menuApi";
import { Skeleton } from "@heroui/react";
import { useEffect, useState } from "react";
import { useSession } from "../../../lib/auth-client";
import PortalCard from "./PortalCard";
import { MenuData } from "@/lib/types";

export default function PortalGrid() {
  const { isPending: isSessionPending } = useSession();
  const [menus, setMenus] = useState<MenuData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await getMenus();

        console.log("response", data);

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
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col gap-4"
          >
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-2/3 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-5/6 rounded-lg" />
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
