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
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[292px] flex-col border-r border-[#e5e7eb] bg-white text-[#111111] lg:flex [font-family:'Cal_Sans','Inter',ui-sans-serif,system-ui,sans-serif]">
      <div className='flex h-16 items-center justify-between border-b border-[#e5e7eb] px-5'>
        <div>
          <p className='text-[18px] font-semibold leading-[1.4] tracking-[-0.3px]'>
            mb.ai
          </p>
          <p className='text-[12px] leading-[1.35] text-[#898989]'>
            context workspace
          </p>
        </div>
        <span className='rounded-full border border-[#e5e7eb] bg-[#f8f9fa] px-2.5 py-1 text-[12px] text-[#6b7280]'>
          rag
        </span>
      </div>

      <nav className='grid gap-1.5 border-b border-[#e5e7eb] p-3'>
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = activeMenu === key;

          return (
            <Button
              key={key}
              variant='ghost'
              className={`h-10 justify-start rounded-xl px-3 text-[14px] font-medium transition active:scale-[0.98] ${
                isActive
                  ? 'bg-[#111111] text-white hover:bg-[#111111]'
                  : 'text-[#374151] hover:bg-[#f8f9fa]'
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

      <div className='min-h-0 flex-1 overflow-y-auto bg-[#f8f9fa] p-3'>
        {activeMenu === 'new' ? (
          <div className='rounded-xl border border-[#e5e7eb] bg-white p-4'>
            <div className='mb-4 grid size-10 place-items-center rounded-lg bg-[#111111] text-white'>
              <PlusIcon size={20} weight='bold' />
            </div>
            <p className='text-[16px] font-semibold leading-[1.4]'>
              Chat kosong siap.
            </p>
            <p className='mt-1.5 text-[14px] leading-[1.5] text-[#6b7280]'>
              Upload PDF, ketik @, pilih konteks.
            </p>
          </div>
        ) : null}

        {activeMenu === 'history' ? (
          <div className='grid gap-2'>
            {sessions.length === 0 ? (
              <p className='rounded-xl border border-[#e5e7eb] bg-white p-4 text-[14px] leading-[1.5] text-[#6b7280]'>
                Belum ada history.
              </p>
            ) : (
              sessions.map((session) => (
                <button
                  key={session.id}
                  className='rounded-xl border border-[#e5e7eb] bg-white p-3 text-left transition hover:border-[#111111] active:scale-[0.99]'
                  onClick={() => onLoadSession(session.id)}
                  type='button'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <p className='line-clamp-2 text-[14px] font-semibold leading-[1.4] text-[#111111]'>
                      {session.title}
                    </p>
                    <span className='rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[11px] text-[#6b7280]'>
                      {session.messagesCount}
                    </span>
                  </div>
                  <p className='mt-3 text-[12px] leading-[1.35] text-[#898989]'>
                    {formatDate(session.updatedAt)}
                  </p>
                </button>
              ))
            )}
          </div>
        ) : null}

        {activeMenu === 'library' ? (
          <div className='grid gap-2'>
            <div className='rounded-xl border border-[#e5e7eb] bg-white p-3'>
              <p className='text-[12px] font-medium uppercase tracking-[0.08em] text-[#898989]'>
                Uploaded files
              </p>
              <p className='mt-1 text-[22px] font-semibold tracking-[-0.3px]'>
                {libraryFiles.length}
              </p>
            </div>

            {libraryFiles.length === 0 ? (
              <p className='rounded-xl border border-[#e5e7eb] bg-white p-4 text-[14px] leading-[1.5] text-[#6b7280]'>
                Library kosong. Upload PDF dari tombol +.
              </p>
            ) : (
              libraryFiles.map((file) => {
                const isSelected = selectedFileIds.includes(file.id);

                return (
                  <div
                    key={file.id}
                    className={`rounded-xl border bg-white p-3 transition ${
                      isSelected ? 'border-[#111111]' : 'border-[#e5e7eb]'
                    }`}
                  >
                    <button
                      className='flex w-full items-start gap-3 text-left'
                      onClick={() => onToggleFile(file.id)}
                      type='button'
                    >
                      <span className='grid size-10 shrink-0 place-items-center rounded-lg bg-[#f5f5f5] text-[#111111]'>
                        <FilePdfIcon size={19} weight='fill' />
                      </span>
                      <span className='min-w-0 flex-1'>
                        <Label className='line-clamp-2 text-[14px] font-semibold leading-[1.4] text-[#111111]'>
                          {file.name}
                        </Label>
                        <span className='mt-1 block text-[12px] leading-[1.35] text-[#6b7280]'>
                          {formatBytes(file.size)} ·{' '}
                          {formatDate(file.uploadedAt)}
                          {typeof file.chunksCount === 'number' ? ` · ${file.chunksCount} chunks` : ''}
                        </span>
                      </span>
                    </button>
                    <div className='mt-3 flex items-center justify-between'>
                      <Chip
                        color={isSelected ? 'default' : 'default'}
                        size='sm'
                        variant='soft'
                      >
                        {isSelected ? 'aktif' : 'rag source'}
                      </Chip>
                      <Button
                        isIconOnly
                        aria-label={`Hapus ${file.name}`}
                        className='size-9 rounded-lg text-[#6b7280] hover:bg-[#f5f5f5] active:scale-95'
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
