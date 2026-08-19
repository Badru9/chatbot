"use client";

import { NavItem, NavSection } from "@/lib/types";
import { Link } from "@heroui/react";
import {
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
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
  XIcon,
  QuestionIcon,
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

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`flex flex-col overflow-hidden fixed top-0 bottom-0 left-0 bg-[#1e1e2d] z-50 transition-all duration-300 ease-in-out ${
          /* Mobile Slide Drawer */
          isMobileOpen
            ? "translate-x-0 w-[265px]"
            : "-translate-x-full md:translate-x-0"
        } ${
          /* Desktop Width */
          isCollapsed ? "md:w-[70px]" : "md:w-[265px]"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center h-[65px] bg-[#1a1a27] shrink-0 border-b border-[#2b2b40] transition-all duration-300 ${
            isCollapsed
              ? "md:justify-center md:px-2 px-6 justify-between"
              : "justify-between px-6"
          }`}
        >
          {/* Logo (Hidden on desktop collapsed, visible on mobile or desktop expanded) */}
          <Link
            href="/"
            className={`text-[#009ef7] no-underline ${
              isCollapsed ? "md:hidden block" : "block"
            }`}
          >
            <img
              alt="Logo"
              src="/aisnet.png"
              className="overflow-clip align-middle"
              width={100}
              height={100}
            />
          </Link>

          {/* Desktop Toggle Button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex items-center justify-center p-2 rounded-md text-[#9899ac] hover:text-white hover:bg-[#27273d] transition-colors"
            title={isCollapsed ? "Perluas Sidebar" : "Perkecil Sidebar"}
          >
            {isCollapsed ? (
              <CaretDoubleRightIcon size={18} />
            ) : (
              <CaretDoubleLeftIcon size={18} />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden flex items-center justify-center p-2 rounded-md text-[#9899ac] hover:text-white hover:bg-[#27273d] transition-colors"
            aria-label="Tutup Menu"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 w-full overflow-y-auto overflow-x-hidden py-4 scrollbar-thin scrollbar-thumb-[#2b2b40]">
          <div className="flex flex-col w-full md:items-center">
            {SIDEBAR_SECTIONS.map((section, sIdx) => (
              <div key={sIdx}>
                {section.heading !== undefined && (
                  <>
                    {!isCollapsed ? (
                      <div className="pt-5 px-6 pb-2">
                        <span className="uppercase text-[#dfe6e9] text-xs font-semibold tracking-wider opacity-60">
                          {section.heading}
                        </span>
                      </div>
                    ) : (
                      <div className="my-3 mx-4 border-t border-[#2b2b40] md:block hidden" />
                    )}
                  </>
                )}
                {section.items.map((item, iIdx) => (
                  <SidebarLink
                    key={iIdx}
                    item={item}
                    isCollapsed={isCollapsed}
                    onClick={onCloseMobile}
                  />
                ))}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div
          className={`p-3 shrink-0 border-t border-[#2b2b40] ${
            isCollapsed ? "md:p-2" : "p-4"
          }`}
        >
          <Link
            href="/guide"
            onClick={onCloseMobile}
            className={`flex items-center justify-center text-center font-medium w-full bg-[rgba(63,66,84,0.35)] text-[#9899ac] hover:text-white text-sm rounded-md no-underline transition-colors ${
              isCollapsed ? "md:py-2.5 md:px-0 py-2 px-4" : "py-2 px-4"
            }`}
          >
            {isCollapsed ? (
              <>
                <span className="md:hidden block overflow-hidden text-center whitespace-nowrap">
                  Panduan Penggunaan
                </span>
                <QuestionIcon size={20} className="hidden md:block" />
              </>
            ) : (
              <span className="block overflow-hidden text-center whitespace-nowrap">
                Panduan Penggunaan
              </span>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({
  item,
  isCollapsed,
  onClick,
}: {
  item: NavItem;
  isCollapsed?: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  const iconColor = item.active ? "#009ef7" : "#494b74";

  if (item.active) {
    return (
      <Link
        href={"/aisnet"}
        onClick={onClick}
        className={`flex items-center bg-[#1b1b28] text-white no-underline border-l-4 border-[#009ef7] transition-colors ${
          isCollapsed
            ? "md:justify-center md:px-0 md:py-3 py-2 px-6 border-none"
            : "py-2 px-6"
        }`}
      >
        <Icon size={ICON_SIZE} color={iconColor} weight="fill" />
        <span
          className={`ml-3 text-sm font-medium ${
            isCollapsed
              ? "md:hidden flex items-center flex-1"
              : "flex items-center flex-1"
          }`}
        >
          {item.label}
        </span>
      </Link>
    );
  }

  if (item.hasChevron) {
    return (
      <span
        title={item.label}
        onClick={onClick}
        className={`flex items-center text-[#9899ac] cursor-pointer hover:bg-[#1b1b28] hover:text-white transition-colors ${
          isCollapsed
            ? "md:justify-center md:px-0 md:py-3 py-2 px-6"
            : "py-2 px-6"
        }`}
      >
        <Icon size={ICON_SIZE} color={iconColor} />
        <span
          className={`ml-3 text-sm font-medium ${
            isCollapsed
              ? "md:hidden flex items-center flex-1"
              : "flex items-center flex-1"
          }`}
        >
          {item.label}
        </span>
        <CaretDoubleLeftIcon
          size={10}
          color="#9899ac"
          className={`rotate-[-90deg] ml-2 shrink-0 ${
            isCollapsed ? "md:hidden block" : "block"
          }`}
        />
      </span>
    );
  }

  return (
    <Link
      href={"/aisnet"}
      onClick={onClick}
      className={`flex items-center text-[#9899ac] no-underline hover:bg-[#1b1b28] hover:text-white transition-colors ${
        isCollapsed
          ? "md:justify-center md:px-0 md:py-3 py-2 px-6"
          : "py-2 px-6"
      }`}
    >
      <Icon size={ICON_SIZE} color={iconColor} />
      <span
        className={`ml-3 text-sm font-medium ${
          isCollapsed
            ? "md:hidden flex items-center flex-1"
            : "flex items-center flex-1"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}
