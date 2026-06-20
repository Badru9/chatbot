'use client';

import React from 'react';
import PortalLayout from '../../(portal)/layout';
import { Button } from '@heroui/react';
import { ArrowLeft, Shield } from '@phosphor-icons/react';
import Link from 'next/link';

export default function AdminDatasetsPage() {
  return (
    <PortalLayout>
      <div className="w-full max-w-3xl flex flex-col gap-6 mt-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button isIconOnly variant="ghost" className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <p className="text-xs text-neutral-400">Portal / Admin</p>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Kelola Dataset AI</h1>
          </div>
        </div>
        <div className="p-12 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl flex flex-col items-center justify-center gap-4 text-center">
          <Shield size={48} className="text-neutral-900 dark:text-white" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Panel Admin: Pengelolaan Dataset</h2>
          <p className="text-neutral-400 max-w-sm text-sm">
            Halaman khusus admin untuk memantau data vektor RAG, mengindeks ulang basis pengetahuan, dan melatih model.
          </p>
        </div>
      </div>
    </PortalLayout>
  );
}
