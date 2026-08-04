"use client";

import React from "react";
import Link from "next/link";
import * as Icons from "@phosphor-icons/react";
import { ArrowUpRight } from "@phosphor-icons/react";

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
  icon,
}: PortalCardProps) {
  // Dynamically resolve Phosphor Icon if available
  const IconComponent =
    icon && (Icons as any)[icon] ? (Icons as any)[icon] : null;

  // ponytail: external links only get target="_blank"
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      className="group block focus:outline-none"
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {/* Outer Shell (Double Bezel Architecture) */}
      <div className="h-full p-1.5 rounded-3xl bg-neutral-200/60 dark:bg-neutral-800/40 border border-neutral-200/90 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 shadow-xs hover:shadow-md">
        {/* Inner Core */}
        <div className="h-full p-6 bg-white dark:bg-neutral-900 rounded-[calc(1.5rem-0.375rem)] flex flex-col justify-between gap-5 transition-all duration-300 group-hover:bg-neutral-50/90 dark:group-hover:bg-neutral-850 group-active:scale-[0.99]">
          <div className="flex items-start justify-between gap-4">
            {IconComponent ? (
              <div className="w-11 h-11 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700/60 transition-transform duration-300 group-hover:scale-105">
                <IconComponent size={22} weight="duotone" />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700/60">
                <Icons.Square size={22} weight="duotone" />
              </div>
            )}

            {/* Trailing Action Icon */}
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center text-neutral-500 dark:text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-900 transition-all duration-300">
              <ArrowUpRight
                size={16}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-lg tracking-tight mb-1.5 transition-colors group-hover:text-neutral-950 dark:group-hover:text-white">
              {title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed font-normal">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
