"use client";

import { Button } from "@heroui/react";
import {
  ChatCircleIcon,
  FilesIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";

export interface SidebarSession {
  id: string;
  title: string;
  updatedAt: number;
  messagesCount: number;
}

export interface SidebarLibraryFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: number;
  chunksCount?: number;
  isPublic?: boolean;
  uploadedByRole?: string;
}

interface ChatSidebarProps {
  activeMenu: "new" | "history" | "library";
  sessions: SidebarSession[];
  libraryFiles: SidebarLibraryFile[];
  selectedFileIds: string[];
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onMenuChange: (menu: "new" | "history" | "library") => void;
  onNewChat: () => void;
  onLoadSession: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  onDeleteFile: (fileId: string) => void;
  onToggleFile: (fileId: string) => void;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);

export default function ChatSidebar({
  activeMenu,
  sessions,
  libraryFiles,
  selectedFileIds,
  isMobileOpen = false,
  onMobileClose,
  onMenuChange,
  onNewChat,
  onLoadSession,
  onDeleteSession,
  onDeleteFile,
  onToggleFile,
}: ChatSidebarProps) {
  const navItems = [
    { key: "new" as const, label: "Chat baru", icon: ChatCircleIcon },
    { key: "library" as const, label: "Library", icon: FilesIcon },
  ];

  const sidebarContent = (
    <div className="flex h-full w-full flex-col font-sans">
      {/* Mobile Top Close Header */}
      <div className="flex items-center justify-between border-b border-hairline p-4 lg:hidden">
        <span className="text-sm font-bold text-ink">Menu Navigation</span>
        <button
          onClick={onMobileClose}
          className="p-1 text-muted hover:text-ink rounded-lg cursor-pointer"
          type="button"
          aria-label="Tutup Menu"
        >
          <XIcon size={20} />
        </button>
      </div>

      <nav className="grid gap-1 border-b border-hairline p-3">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = activeMenu === key;

          return (
            <Button
              key={key}
              variant="ghost"
              className={`w-full h-10 justify-start rounded-lg px-3 text-[14px] font-medium transition duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] ${
                isActive
                  ? "bg-primary text-white hover:bg-primary shadow-sm"
                  : "text-body hover:bg-hairline-soft"
              }`}
              onPress={() => {
                onMenuChange(key);
                if (key === "new") onNewChat();
                if (onMobileClose) onMobileClose();
              }}
            >
              <Icon size={17} weight={isActive ? "fill" : "regular"} />
              {label}
            </Button>
          );
        })}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto bg-surface-soft p-3">
        {activeMenu === "new" ? (
          <div className="grid gap-2">
            {sessions.length === 0 ? (
              <p className="rounded-lg border border-hairline bg-canvas p-4 text-[13px] leading-[1.5] text-muted shadow-sm">
                Belum ada history.
              </p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="group relative rounded-lg border border-hairline bg-canvas p-3 transition duration-150 hover:border-primary hover:shadow-sm"
                >
                  <button
                    className="w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
                    onClick={() => {
                      onLoadSession(session.id);
                      if (onMobileClose) onMobileClose();
                    }}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3 pr-6">
                      <p className="line-clamp-2 text-[13px] font-semibold leading-[1.4] text-ink">
                        {session.title}
                      </p>
                      <span className="rounded-full bg-hairline-soft px-2 py-0.5 text-[11px] font-medium text-body border border-hairline shrink-0">
                        {session.messagesCount}
                      </span>
                    </div>
                    <p className="mt-2.5 text-[11px] leading-[1.35] text-muted-soft">
                      {formatDate(session.updatedAt)}
                    </p>
                  </button>

                  {onDeleteSession && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="absolute bottom-2.5 right-2.5 p-1 rounded text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
                      type="button"
                      title="Hapus percakapan"
                      aria-label="Hapus percakapan"
                    >
                      <TrashIcon size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop & Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          <aside className="relative z-50 flex w-[280px] max-w-[80vw] flex-col border-r border-hairline bg-canvas text-ink shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="absolute inset-y-0 left-0 z-20 hidden w-[292px] flex-col border-r border-hairline bg-canvas text-ink lg:flex font-sans">
        {sidebarContent}
      </aside>
    </>
  );
}
