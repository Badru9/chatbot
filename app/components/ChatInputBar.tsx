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
  onChooseMentionFile: (file: SidebarLibraryFile) => void;
  onInputChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onOpenUploadModal: () => void;
  onSubmit: () => void;
  onToggleFile: (fileId: string) => void;
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
  onChooseMentionFile,
  onInputChange,
  onKeyDown,
  onOpenUploadModal,
  onSubmit,
  onToggleFile,
}: ChatInputBarProps) {
  return (
    <div className='absolute bottom-0 left-0 right-0 z-30 flex flex-col gap-3 border-t border-[#e5e7eb] bg-white/95 px-4 py-3 backdrop-blur-xl backdrop-saturate-150 sm:px-6 lg:left-[292px] lg:px-10'>
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

      <div className='mx-auto flex w-full max-w-[900px] items-center gap-2 rounded-2xl border border-[#e5e7eb] bg-surface-soft p-2'>
        <Dropdown>
          <Button isIconOnly aria-label='Tambah lampiran' className='size-10 rounded-xl bg-white text-[#111111] ring-1 ring-[#e5e7eb] active:scale-95' variant='ghost'>
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
        <Button isDisabled={isLoading} isIconOnly className='size-10 rounded-xl bg-[#111111] text-white active:scale-95' variant='ghost' onPress={onSubmit}>
          <PaperPlaneRightIcon size={16} weight='bold' className='text-white' />
        </Button>
      </div>
    </div>
  );
}
