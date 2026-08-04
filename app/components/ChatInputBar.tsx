"use client";

import { Button, Chip, Dropdown, Input, Label } from "@heroui/react";
import {
  FilePdfIcon,
  PaperPlaneRightIcon,
  PlusIcon,
  XIcon,
} from "@phosphor-icons/react";
import type { KeyboardEvent, RefObject } from "react";

import type { SidebarLibraryFile } from "./ChatSidebar";

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
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

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
    <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col gap-2.5 border-t border-neutral-200/80 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 px-3 py-2.5 backdrop-blur-xl sm:px-6 sm:py-3 lg:px-8">
      {/* Selector Tools */}
      <div className="flex items-center gap-2 px-1 border-b border-neutral-100 dark:border-neutral-800/80 pb-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 shrink-0">
          Tools:
        </span>
        <button
          onClick={() =>
            onToggleTool(activeTool === "jadwal" ? null : "jadwal")
          }
          className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 flex items-center gap-1.5 font-medium cursor-pointer shrink-0 ${
            activeTool === "jadwal"
              ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950 dark:border-white shadow-xs"
              : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700"
          }`}
          type="button"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              activeTool === "jadwal"
                ? "bg-emerald-400"
                : "bg-neutral-300 dark:bg-neutral-600"
            }`}
          />
          Jadwal Mengajar
        </button>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 ? (
        <div className="flex flex-wrap gap-2 px-1 max-h-24 overflow-y-auto">
          {selectedFiles.map((file) => (
            <Chip key={file.id} color="accent" size="sm" variant="soft">
              <FilePdfIcon size={12} weight="fill" />
              <Chip.Label className="truncate max-w-[140px] sm:max-w-[200px]">
                {file.name}
              </Chip.Label>
              <button
                aria-label={`Lepas ${file.name}`}
                onClick={() => onToggleFile(file.id)}
                type="button"
                className="cursor-pointer hover:opacity-75"
              >
                <XIcon size={12} />
              </button>
            </Chip>
          ))}
        </div>
      ) : null}

      {/* Mention matches popover */}
      {mentionMatches.length > 0 ? (
        <div className="absolute bottom-[calc(100%+0.5rem)] left-3 right-3 sm:left-6 sm:right-auto sm:w-[min(28rem,calc(100vw-3rem))] overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-2 shadow-lg z-50">
          <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Pilih dataset
          </p>
          {mentionMatches.map((file) => (
            <button
              key={file.id}
              className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-[0.99] cursor-pointer"
              onClick={() => onChooseMentionFile(file)}
              type="button"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <FilePdfIcon size={18} weight="fill" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold leading-tight text-neutral-900 dark:text-white">
                  {file.name}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {formatBytes(file.size)}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {/* Main Input Row */}
      <div className="mx-auto flex w-full max-w-[900px] items-center gap-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 p-1.5 sm:p-2 transition-all shadow-xs">
        <Dropdown>
          <Button
            isIconOnly
            aria-label="Tambah lampiran"
            className="size-9 sm:size-10 shrink-0 rounded-xl bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 shadow-xs hover:bg-neutral-100 dark:hover:bg-neutral-700 active:scale-95 cursor-pointer"
            variant="ghost"
          >
            <PlusIcon weight="bold" size={18} />
          </Button>
          <Dropdown.Popover placement="top start" className="shadow-md">
            <Dropdown.Menu
              onAction={(key) => {
                if (key === "new-file") onOpenUploadModal();
              }}
            >
              <Dropdown.Item id="new-file" textValue="PDF">
                <Label>PDF</Label>
              </Dropdown.Item>
              <Dropdown.Item
                isDisabled
                id="coming-soon"
                textValue="Coming soon"
              >
                <Label>Coming soon</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>

        <Input
          ref={inputRef}
          aria-label="Input chat mb.ai"
          autoComplete="off"
          fullWidth
          id="chatbot-input"
          placeholder="Curhatin sama mb.ai... ketik @ untuk file"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 min-w-0"
        />

        <Button
          isDisabled={isLoading}
          isIconOnly
          className="size-9 sm:size-10 shrink-0 rounded-xl bg-primary dark:bg-white text-white dark:text-primary hover:bg-neutral-800 dark:hover:bg-neutral-100 active:scale-95 shadow-xs cursor-pointer"
          variant="primary"
          onPress={onSubmit}
        >
          <PaperPlaneRightIcon size={16} weight="bold" />
        </Button>
      </div>
    </div>
  );
}
