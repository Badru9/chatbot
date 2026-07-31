'use client';

import { Button, Chip, Dropdown, Input, Label } from '@heroui/react';
import { FilePdfIcon, PaperPlaneRightIcon, PlusIcon, XIcon } from '@phosphor-icons/react';
import type { KeyboardEvent, RefObject } from 'react';

import type { SidebarLibraryFile } from './ChatSidebar';

interface ChatInputBarProps {
  input: string;
  isLoading: boolean;
  mentionMatches: SidebarLibraryFile[];
  selectedFiles: SidebarLibraryFile[];
  inputRef: RefObject<HTMLInputElement | null>;
  activeTool: "jadwal" | null;
  onChooseMentionFile: (file: SidebarLibraryFile) => void;
  onInputChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onOpenUploadModal: () => void;
  onSubmit: () => void;
  onToggleFile: (fileId: string) => void;
  onToggleTool: (tool: "jadwal" | null) => void;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);

  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

export default function ChatInputBar({
  input,
  inputRef,
  isLoading,
  mentionMatches,
  selectedFiles,
  activeTool,
  onChooseMentionFile,
  onInputChange,
  onKeyDown,
  onOpenUploadModal,
  onSubmit,
  onToggleFile,
  onToggleTool,
}: ChatInputBarProps) {
  return (
    <div className={`absolute bottom-0 left-0 right-0 z-30 flex flex-col gap-3 border-t border-[#e5e7eb] bg-white/95 px-4 py-3 backdrop-blur-xl backdrop-saturate-150 sm:px-6 lg:left-[292px] lg:px-10 ${
      activeTool === "jadwal" ? "lg:right-[400px]" : ""
    }`}>
      {/* Selector Tools */}
      <div className="flex items-center gap-2 px-1 border-b border-neutral-100 dark:border-neutral-800 pb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Tools:</span>
        <button
          onClick={() => onToggleTool(activeTool === "jadwal" ? null : "jadwal")}
          className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 flex items-center gap-1.5 font-medium cursor-pointer ${
            activeTool === "jadwal"
              ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950 dark:border-white shadow-xs"
              : "bg-neutral-50 text-neutral-600 border-[#e5e7eb] hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700"
          }`}
          type="button"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${activeTool === "jadwal" ? "bg-emerald-400" : "bg-neutral-300 dark:bg-neutral-600"}`}></span>
          Jadwal Mengajar
        </button>
      </div>
      {selectedFiles.length > 0 ? (
        <div className='flex flex-wrap gap-2 px-1'>
          {selectedFiles.map((file) => (
            <Chip key={file.id} color='accent' size='sm' variant='soft'>
              <FilePdfIcon size={12} weight='fill' />
              <Chip.Label>{file.name}</Chip.Label>
              <button aria-label={`Lepas ${file.name}`} onClick={() => onToggleFile(file.id)} type='button'>
                <XIcon size={12} />
              </button>
            </Chip>
          ))}
        </div>
      ) : null}

      {mentionMatches.length > 0 ? (
        <div className='absolute bottom-[calc(100%+0.75rem)] left-4 w-[min(28rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-[#e5e7eb] bg-surface-soft p-2 sm:left-6 lg:left-10'>
          <p className='px-3 py-2 text-[12px] font-medium uppercase tracking-[0.08em] text-body'>
            pilih dataset
          </p>
          {mentionMatches.map((file) => (
            <button
              key={file.id}
              className='flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-surface-soft active:scale-[0.99]'
              onClick={() => onChooseMentionFile(file)}
              type='button'
            >
              <span className='grid size-10 place-items-center rounded-lg bg-surface-soft text-body'>
                <FilePdfIcon size={20} weight='fill' />
              </span>
              <span className='min-w-0 flex-1'>
                <span className='block truncate text-[14px] font-semibold leading-[1.4]'>{file.name}</span>
                <span className='text-[12px] leading-[1.35] text-body'>{formatBytes(file.size)}</span>
              </span>
            </button>
          ))}
        </div>
      ) : null}

      <div className='mx-auto flex w-full max-w-[900px] items-center gap-2 rounded-2xl border border-hairline bg-surface-soft p-2'>
        <Dropdown>
          <Button isIconOnly aria-label='Tambah lampiran' className='size-10 rounded-xl bg-white text-primary ring-1 ring-hairline active:scale-95' variant='ghost'>
            <PlusIcon weight='bold' size={20} />
          </Button>
          <Dropdown.Popover placement='right bottom' className='shadow'>
            <Dropdown.Menu
              onAction={(key) => {
                if (key === 'new-file') onOpenUploadModal();
              }}
            >
              <Dropdown.Item id='new-file' textValue='PDF'>
                <Label>PDF</Label>
              </Dropdown.Item>
              <Dropdown.Item isDisabled id='coming-soon' textValue='Coming soon'>
                <Label>Coming soon</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>

        <Input
          ref={inputRef}
          aria-label='Input chat mb.ai'
          autoComplete='off'
          fullWidth
          id='chatbot-input'
          placeholder='Curhatin sama mb.ai... ketik @ untuk file'
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <Button isDisabled={isLoading} isIconOnly className='size-10 rounded-xl bg-primary hover:bg-primary-active text-white active:scale-95' variant='primary' onPress={onSubmit}>
          <PaperPlaneRightIcon size={16} weight='bold' className='text-white' />
        </Button>
      </div>
    </div>
  );
}
