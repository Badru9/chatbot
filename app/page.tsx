'use client';

import React from 'react';
import PortalLayout from './(portal)/layout';
import PortalGrid from './components/portal/PortalGrid';

export default function App() {
  return (
    <PortalLayout>
      <div className="text-center max-w-2xl mt-8 mb-12 flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Selamat datang di mb.ai 👋
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">
          Portal Layanan Akademik & Asisten Personal AI Dosen Universitas.
        </p>
      </div>
      <PortalGrid />
    </PortalLayout>
  );
}
