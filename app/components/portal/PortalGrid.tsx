'use client';

import React from 'react';
import PortalCard from './PortalCard';

const defaultMenus = [
  {
    title: 'Monitoring Kinerja',
    description: 'Pantau kinerja dosen, presensi kehadiran, laporan kerja harian, serta evaluasi mahasiswa.',
    icon: 'Monitor',
    href: '/monitoring',
  },
  {
    title: 'Manajemen Dokumen',
    description: 'Unggah, kelola, serta verifikasi berbagai berkas administrasi dan dokumen PDF pendukung.',
    icon: 'Folder',
    href: '/documents',
  },
  {
    title: 'Bimbingan Mahasiswa',
    description: 'Akses data mahasiswa bimbingan akademik, laporan magang, konsultasi skripsi, dan KRS.',
    icon: 'Student',
    href: '/students',
  },
  {
    title: 'Katalog Penelitian',
    description: 'Manajemen publikasi jurnal ilmiah, prosiding konferensi, hibah penelitian internal & eksternal.',
    icon: 'BookOpen',
    href: '/research',
  },
  {
    title: 'Portal SINTA',
    description: 'Integrasi dan sinkronisasi otomatis skor SINTA, Scopus, Google Scholar, dan H-index.',
    icon: 'TrendUp',
    href: '/sinta',
  },
];

export default function PortalGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
      {defaultMenus.map((menu) => (
        <PortalCard
          key={menu.href}
          title={menu.title}
          description={menu.description}
          icon={menu.icon}
          href={menu.href}
        />
      ))}
    </div>
  );
}
