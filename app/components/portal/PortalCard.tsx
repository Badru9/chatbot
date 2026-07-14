"use client";

import React from "react";
import Link from "next/link";
import * as Icons from "@phosphor-icons/react";

interface PortalCardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
}

export default function PortalCard({
  title,
  description,
  href,
}: PortalCardProps) {
  return (
    <Link href={href} target="_blank" className="group">
      <div className="h-full p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:border-neutral-950 dark:hover:border-white shadow-sm hover:shadow-md transition duration-200 flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-neutral-950 dark:group-hover:text-white text-lg transition mb-1">
            {title}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
