'use client';

import { Button, Chip, Label } from '@heroui/react';
import {
  ChatCircleIcon,
  ClockCounterClockwiseIcon,
  FilePdfIcon,
  FilesIcon,
  PlusIcon,
  TrashIcon,
} from '@phosphor-icons/react';

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
}

interface ChatSidebarProps {
  activeMenu: 'new' | 'history' | 'library';
  sessions: SidebarSession[];
  libraryFiles: SidebarLibraryFile[];
  selectedFileIds: string[];
  onMenuChange: (menu: 'new' | 'history' | 'library') => void;
  onNewChat: () => void;
  onLoadSession: (sessionId: string) => void;
  onDeleteFile: (fileId: string) => void;
  onToggleFile: (fileId: string) => void;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);

export default function ChatSidebar({
  activeMenu,
  sessions,
  libraryFiles,
  selectedFileIds,
  onMenuChange,
  onNewChat,
  onLoadSession,
  onDeleteFile,
  onToggleFile,
}: ChatSidebarProps) {
  const navItems = [
    { key: 'new' as const, label: 'Chat baru', icon: ChatCircleIcon },
    {
      key: 'history' as const,
      label: 'History chats',
      icon: ClockCounterClockwiseIcon,
    },
    { key: 'library' as const, label: 'Library', icon: FilesIcon },
  ];

  return (
    <aside className="absolute inset-y-0 left-0 z-20 hidden w-[292px] flex-col border-r border-hairline bg-canvas text-ink lg:flex font-sans">
      {/* <div className='flex h-16 items-center justify-between border-b border-hairline px-5'>
        <div>
          <p className='text-[18px] font-semibold leading-[1.4] tracking-[-0.3px]'>
            mb.ai
          </p>
          <p className='text-[12px] leading-[1.35] text-muted-soft'>
            context workspace
          </p>
        </div>
      </div> */}

      <nav className='grid gap-1 border-b border-hairline p-3'>
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = activeMenu === key;

          return (
            <Button
              key={key}
              variant='ghost'
              className={`w-full h-10 justify-start rounded-lg px-3 text-[14px] font-medium transition duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] ${isActive
                ? 'bg-primary text-white hover:bg-primary shadow-sm'
                : 'text-body hover:bg-hairline-soft'
                }`}
              onPress={() => {
                onMenuChange(key);
                if (key === 'new') onNewChat();
              }}
            >
              <Icon size={17} weight={isActive ? 'fill' : 'regular'} />
              {label}
            </Button>
          );
        })}
      </nav>

      <div className='min-h-0 flex-1 overflow-y-auto bg-surface-soft p-3'>
        {activeMenu === 'new' ? (
          <div className='rounded-lg border border-hairline bg-canvas p-4 shadow-sm'>
            <div className='mb-4 grid size-10 place-items-center rounded-lg bg-primary text-white'>
              <PlusIcon size={20} weight='bold' />
            </div>
            <p className='text-[15px] font-semibold leading-[1.4] text-ink'>
              Chat kosong siap.
            </p>
            <p className='mt-1 text-[13px] leading-[1.5] text-muted'>
              Upload PDF, ketik @, pilih konteks.
            </p>
          </div>
        ) : null}

        {activeMenu === 'history' ? (
          <div className='grid gap-2'>
            {sessions.length === 0 ? (
              <p className='rounded-lg border border-hairline bg-canvas p-4 text-[13px] leading-[1.5] text-muted shadow-sm'>
                Belum ada history.
              </p>
            ) : (
              sessions.map((session) => (
                <button
                  key={session.id}
                  className='rounded-lg border border-hairline bg-canvas p-3 text-left transition duration-150 hover:border-primary hover:shadow-sm active:scale-[0.99] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
                  onClick={() => onLoadSession(session.id)}
                  type='button'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <p className='line-clamp-2 text-[13px] font-semibold leading-[1.4] text-ink'>
                      {session.title}
                    </p>
                    <span className='rounded-full bg-hairline-soft px-2 py-0.5 text-[11px] font-medium text-body border border-hairline'>
                      {session.messagesCount}
                    </span>
                  </div>
                  <p className='mt-2.5 text-[11px] leading-[1.35] text-muted-soft'>
                    {formatDate(session.updatedAt)}
                  </p>
                </button>
              ))
            )}
          </div>
        ) : null}

        {activeMenu === 'library' ? (
          <div className='grid gap-2'>
            <div className='rounded-lg border border-hairline bg-canvas p-3 shadow-sm'>
              <p className='text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-soft'>
                Uploaded files
              </p>
              <p className='mt-1 text-[20px] font-bold tracking-[-0.3px] text-ink'>
                {libraryFiles.length}
              </p>
            </div>

            {libraryFiles.length === 0 ? (
              <p className='rounded-lg border border-hairline bg-canvas p-4 text-[13px] leading-[1.5] text-muted shadow-sm'>
                Library kosong. Upload PDF dari tombol +.
              </p>
            ) : (
              libraryFiles.map((file) => {
                const isSelected = selectedFileIds.includes(file.id);

                return (
                  <div
                    key={file.id}
                    className={`rounded-lg border bg-canvas p-3 transition duration-150 ${isSelected ? 'border-primary shadow-sm' : 'border-hairline'
                      }`}
                  >
                    <button
                      className='flex w-full items-start gap-3 text-left outline-none'
                      onClick={() => onToggleFile(file.id)}
                      type='button'
                    >
                      <span className='grid size-9 shrink-0 place-items-center rounded-lg bg-surface-card text-ink border border-hairline'>
                        <FilePdfIcon size={18} weight='fill' />
                      </span>
                      <span className='min-w-0 flex-1'>
                        <Label className='line-clamp-2 text-[13px] font-semibold leading-[1.4] text-ink cursor-pointer'>
                          {file.name}
                        </Label>
                        <span className='mt-1 block text-[11px] leading-[1.35] text-muted'>
                          {formatBytes(file.size)} ·{' '}
                          {formatDate(file.uploadedAt)}
                          {typeof file.chunksCount === 'number' ? ` · ${file.chunksCount} chk` : ''}
                        </span>
                      </span>
                    </button>
                    <div className='mt-3 flex items-center justify-between'>
                      {isSelected ? (
                        <span className='inline-flex items-center rounded-full bg-success-badge-bg border border-success-badge-border px-2.5 py-0.5 text-[11px] font-semibold text-success-badge-text'>
                          aktif
                        </span>
                      ) : (
                        <span className='inline-flex items-center rounded-full bg-hairline-soft border border-hairline px-2.5 py-0.5 text-[11px] font-medium text-[#4b5563]'>
                          rag source
                        </span>
                      )}
                      <Button
                        isIconOnly
                        aria-label={`Hapus ${file.name}`}
                        className='size-8 rounded-lg text-muted hover:bg-hairline-soft hover:text-danger active:scale-95 transition-colors duration-150'
                        size='sm'
                        variant='ghost'
                        onPress={() => onDeleteFile(file.id)}
                      >
                        <TrashIcon size={14} />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
