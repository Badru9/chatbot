"use client";

import { NavItem, NavSection } from "@/lib/types";
import { Link, Button } from "@heroui/react";
import {
  CaretDoubleLeftIcon,
  HouseIcon,
  UsersIcon,
  NoteIcon,
  ChalkboardTeacherIcon,
  ClipboardTextIcon,
  ChartBarIcon,
  FileTextIcon,
  PaperPlaneTiltIcon,
  EnvelopeSimpleIcon,
  FolderOpenIcon,
  CalendarCheckIcon,
  SealCheckIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
} from "@phosphor-icons/react";

const SIDEBAR_SECTIONS: NavSection[] = [
  {
    items: [
      { label: "Dasbor", href: "https://aisnet.itg.ac.id/", icon: HouseIcon },
    ],
  },
  {
    heading: "Perkuliahan",
    items: [
      {
        label: "Perwalian",
        href: "https://aisnet.itg.ac.id/perwalian",
        icon: UsersIcon,
      },
      {
        label: "Kontrak Perkuliahan",
        href: "https://aisnet.itg.ac.id/kontrak-perkuliahan-new",
        icon: NoteIcon,
      },
      {
        label: "Pembelajaran Daring",
        href: "https://aisnet.itg.ac.id/laporan-pembelajaran/dosen/mata-kuliah",
        icon: ChalkboardTeacherIcon,
      },
      {
        label: "Rekap Absen",
        href: "https://aisnet.itg.ac.id/rekap-absen",
        icon: ClipboardTextIcon,
      },
      {
        label: "Survei Kepuasan",
        href: "#",
        icon: ChartBarIcon,
        hasChevron: true,
      },
    ],
  },
  {
    heading: "Penilaian Hasil Belajar",
    items: [
      {
        label: "UTS",
        href: "https://aisnet.itg.ac.id/phb/uts/jadwal",
        icon: FileTextIcon,
      },
      {
        label: "UTS Susulan",
        href: "https://aisnet.itg.ac.id/phb/uts-susulan/jadwal",
        icon: FileTextIcon,
      },
      {
        label: "UAS",
        href: "https://aisnet.itg.ac.id/phb/uas/jadwal",
        icon: FileTextIcon,
      },
      {
        label: "UAS Susulan",
        href: "https://aisnet.itg.ac.id/phb/uas-susulan/jadwal",
        icon: FileTextIcon,
      },
    ],
  },
  {
    heading: "Penelitian dan PKM",
    items: [
      {
        label: "Pengusulan",
        href: "https://aisnet.itg.ac.id/penelitian-usul",
        icon: PaperPlaneTiltIcon,
      },
      {
        label: "Undangan PPM",
        href: "https://aisnet.itg.ac.id/undangan-penelitian",
        icon: EnvelopeSimpleIcon,
      },
      {
        label: "Luaran Tambahan",
        href: "https://aisnet.itg.ac.id/penelitian-luaran-tambahan",
        icon: FolderOpenIcon,
      },
      {
        label: "Kewajiban Tahunan",
        href: "https://aisnet.itg.ac.id/insentif-bulanan",
        icon: CalendarCheckIcon,
      },
    ],
  },
  {
    heading: "Hak Kekayaan Intelektual",
    items: [
      {
        label: "Hak Cipta",
        href: "https://aisnet.itg.ac.id/hki/hakCipta",
        icon: SealCheckIcon,
      },
    ],
  },
  {
    heading: "Keuangan",
    items: [
      {
        label: "Gaji Pegawai",
        href: "https://aisnet.itg.ac.id/gaji",
        icon: CurrencyDollarIcon,
      },
      {
        label: "Penelitian dan PkM",
        href: "https://aisnet.itg.ac.id/pencairan-pkm",
        icon: MagnifyingGlassIcon,
        active: true,
      },
      {
        label: "Honorarium UTS",
        href: "https://aisnet.itg.ac.id/honor-uts",
        icon: CurrencyDollarIcon,
      },
      {
        label: "Honorarium UAS",
        href: "https://aisnet.itg.ac.id/honor-uas",
        icon: CurrencyDollarIcon,
      },
      {
        label: "Honorarium Kerja Praktik",
        href: "https://aisnet.itg.ac.id/honor-kp",
        icon: CurrencyDollarIcon,
      },
      {
        label: "Honorarium SUP Skripsi",
        href: "https://aisnet.itg.ac.id/honor-ta-sup",
        icon: CurrencyDollarIcon,
      },
      {
        label: "Honorarium Sidang Skripsi",
        href: "https://aisnet.itg.ac.id/honor-ta-sidang",
        icon: CurrencyDollarIcon,
      },
    ],
  },
  {
    items: [
      {
        label: "",
        href: "https://aisnet.itg.ac.id/pengumuman",
        icon: MegaphoneIcon,
      },
    ],
  },
];

const ICON_SIZE = 20;

export default function Sidebar() {
  return (
    <aside className="flex flex-col overflow-hidden fixed w-[265px] left-0 top-0 bottom-0 bg-[#1e1e2d]">
      {/* Header */}
      <div className="flex items-center justify-between h-[65px] bg-[#1a1a27] px-6 shrink-0 border-b border-[#2b2b40]">
        <Link href="/" className="block text-[#009ef7] no-underline">
          <img
            alt="Logo"
            src="/aisnet.png"
            className="overflow-clip align-middle"
            width={100}
            height={100}
          />
        </Link>

        <CaretDoubleLeftIcon
          size={20}
          className="flex items-center justify-center text-center font-medium text-[#9899ac]"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full overflow-y-auto py-4">
        <div className="flex flex-col w-full">
          {SIDEBAR_SECTIONS.map((section, sIdx) => (
            <div key={sIdx}>
              {section.heading !== undefined && (
                <div className="pt-5 px-6 pb-2">
                  <span className="uppercase text-[#dfe6e9] text-xs font-semibold tracking-wider opacity-60">
                    {section.heading}
                  </span>
                </div>
              )}
              {section.items.map((item, iIdx) => (
                <SidebarLink key={iIdx} item={item} />
              ))}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 shrink-0 border-t border-[#2b2b40]">
        <Link
          href="/guide"
          className="flex items-center justify-center text-center font-medium w-full bg-[rgba(63,66,84,0.35)] text-[#9899ac] hover:text-white text-sm py-2 px-4 rounded-sm no-underline"
        >
          <span className="block overflow-hidden text-center whitespace-nowrap">
            Panduan Penggunaan
          </span>
        </Link>
      </div>
    </aside>
  );
}

function SidebarLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  const iconColor = item.active ? "#009ef7" : "#494b74";

  if (item.active) {
    return (
      <Link
        // href={item.href}
        href={"/aisnet"}
        className="flex items-center bg-[#1b1b28] text-white py-2 px-6 no-underline border-l-4 border-[#009ef7]"
      >
        <Icon size={ICON_SIZE} color={iconColor} weight="fill" />
        <span className="flex items-center flex-1 ml-3 text-sm font-medium">
          {item.label}
        </span>
      </Link>
    );
  }

  if (item.hasChevron) {
    return (
      <span className="flex items-center text-[#9899ac] py-2 px-6 cursor-pointer hover:bg-[#1b1b28] hover:text-white transition-colors">
        <Icon size={ICON_SIZE} color={iconColor} />
        <span className="flex items-center flex-1 ml-3 text-sm font-medium">
          {item.label}
        </span>
        <CaretDoubleLeftIcon
          size={10}
          color="#9899ac"
          className="rotate-[-90deg] ml-2 shrink-0"
        />
      </span>
    );
  }

  return (
    <Link
      href={"/aisnet"}
      // href={item.href}
      className="flex items-center text-[#9899ac] py-2 px-6 no-underline hover:bg-[#1b1b28] hover:text-white transition-colors"
    >
      <Icon size={ICON_SIZE} color={iconColor} />
      <span className="flex items-center flex-1 ml-3 text-sm font-medium">
        {item.label}
      </span>
    </Link>
  );
}
