'use client';

import React from 'react';
import Link from 'next/link';
import * as Icons from '@phosphor-icons/react';

interface PortalCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
}

export default function PortalCard({ title, description, icon, href }: PortalCardProps) {
  // Resolve icon dynamically
  const IconComponent = (Icons as any)[icon] || Icons.Square;

  return (
    <Link href={href} className="group">
      <div className="h-full p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:border-neutral-950 dark:hover:border-white shadow-sm hover:shadow-md transition duration-200 flex flex-col gap-4">
        <div className="w-12 h-12 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl flex items-center justify-center group-hover:scale-105 transition">
          <IconComponent size={24} weight="duotone" />
        </div>
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
