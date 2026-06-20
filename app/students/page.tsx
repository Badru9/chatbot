'use client';

import React from 'react';
import PortalLayout from '../(portal)/layout';
import { Button } from '@heroui/react';
import { ArrowLeft, Student } from '@phosphor-icons/react';
import Link from 'next/link';

export default function StudentsPage() {
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
            <p className="text-xs text-neutral-400">Portal / Fitur</p>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Bimbingan Mahasiswa</h1>
          </div>
        </div>
        <div className="p-12 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl flex flex-col items-center justify-center gap-4 text-center">
          <Student size={48} className="text-neutral-300 dark:text-neutral-700" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Fitur Bimbingan Mahasiswa Sedang Dikembangkan</h2>
          <p className="text-neutral-400 max-w-sm text-sm">
            Halaman ini nantinya akan memuat daftar mahasiswa bimbingan akademik, konsultasi skripsi/KP, serta persetujuan KRS.
          </p>
        </div>
      </div>
    </PortalLayout>
  );
}
