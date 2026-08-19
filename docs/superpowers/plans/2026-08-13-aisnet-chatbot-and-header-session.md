# AISnet User Session Header, Dynamic `tableData`, & Full Chatbot Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate logged-in user session into AISnet Header, convert static table data into dynamic `tableData` state, and integrate the full Chatbot UI as a floating slide-over drawer in AISnet.

**Architecture:** Use `useSession()` from `@/lib/auth-client` in `Header.tsx`, define `tableData` state in `app/aisnet/page.tsx`, and update `AisnetChatbot.tsx` to act as a floating button drawer wrapper around `Chatbot.tsx` with preloaded dataset context.

**Tech Stack:** Next.js, React, HeroUI (`@heroui/react`), Phosphor Icons (`@phosphor-icons/react`), React Query, Tailwind CSS.

## Global Constraints

- Target files: `app/aisnet/components/Header.tsx`, `app/aisnet/page.tsx`, `app/aisnet/AisnetChatbot.tsx`, `app/components/Chatbot.tsx`.
- Follow existing patterns and code conventions.
- Do not break existing `/` root Chatbot experience.

---

### Task 1: Integrate User Session into AISnet Header

**Files:**

- Modify: [app/aisnet/components/Header.tsx](file:///d:/Badru/Projects/chatbot/app/aisnet/components/Header.tsx)

**Interfaces:**

- Consumes: `useSession` hook from `@/lib/auth-client` which returns `{ user, isLoading }`.

- [ ] **Step 1: Inspect Header.tsx imports and structure**

Read `app/aisnet/components/Header.tsx` to ensure imports for `useSession` from `@/lib/auth-client` fit existing styling.

- [ ] **Step 2: Update Header.tsx to use session data**

Update `Header.tsx` with dynamic user data:

```tsx
"use client";

import { Avatar, Button } from "@heroui/react";
import { BellIcon } from "@phosphor-icons/react";
import { useSession } from "@/lib/auth-client";

export default function Header() {
  const { user, isLoading } = useSession();

  const userName = user?.name || "Kacung Napitupulu";
  const userRole = user?.role || "dosen";
  const userImage =
    user?.image || "https://api-aisnet.itg.ac.id/uploads/foto/F1669432653.png";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex justify-between fixed h-[65px] left-[265px] right-0 bg-white border-b border-neutral-200 z-[100]">
      <div className="flex justify-between w-full px-8">
        <div className="flex items-center" />

        <div className="flex flex-1 justify-between">
          {/* Breadcrumb */}
          <div className="flex items-center">
            <div className="flex items-center flex-wrap gap-2 text-sm">
              <h1 className="font-semibold text-neutral-900">Keuangan</h1>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-500">Penelitian dan PkM</span>
            </div>
          </div>

          {/* User controls */}
          <div className="flex shrink-0 items-center gap-3">
            <Button
              variant="ghost"
              className="flex items-center justify-center w-10 h-10 min-w-0 p-0 bg-transparent rounded-sm text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 border-none"
            >
              <span className="flex items-center justify-center">
                <BellIcon size={20} />
              </span>
            </Button>

            <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10 rounded-sm">
                {userImage ? (
                  <Avatar.Image alt={userName} src={userImage} />
                ) : null}
                <Avatar.Fallback className="rounded-sm bg-neutral-200 text-neutral-700">
                  {getInitials(userName)}
                </Avatar.Fallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="flex items-center font-semibold capitalize text-[15px] leading-tight text-neutral-800">
                  {userName}
                </span>
                <span className="font-medium capitalize text-neutral-400 text-xs leading-none">
                  {userRole}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Verify TypeScript build for Header**

Run build or check for lint errors to verify syntax.

---

### Task 2: Refactor `TABLE_DATA` to Dynamic `tableData` State in AISnet Page

**Files:**

- Modify: [app/aisnet/page.tsx](file:///d:/Badru/Projects/chatbot/app/aisnet/page.tsx)

- [ ] **Step 1: Declare `tableData` state inside `AisnetPage` component**

In `app/aisnet/page.tsx`:
Change static `TABLE_DATA` constant reference to `const [tableData, setTableData] = useState<TableRow[]>(INITIAL_TABLE_DATA)`.

- [ ] **Step 2: Update Table mapping and prop forwarding**

Update `tableData.map((row) => ...)` in the table body and pass `<AisnetChatbot tableData={tableData} />`.

---

### Task 3: Embed Full Chatbot Experience in AISnet Floating Drawer

**Files:**

- Modify: [app/aisnet/AisnetChatbot.tsx](file:///d:/Badru/Projects/chatbot/app/aisnet/AisnetChatbot.tsx)
- Modify: [app/components/Chatbot.tsx](file:///d:/Badru/Projects/chatbot/app/components/Chatbot.tsx) (if optional prop `embedded` or `initialContext` is needed)

- [ ] **Step 1: Prepare `Chatbot.tsx` for modular embedding**

Allow `Chatbot.tsx` to optionally take `tableDataContext?: TableRow[]` or `isEmbedded?: boolean`. When provided, format `tableData` into structured text and include it in AI chat context requests.

- [ ] **Step 2: Update `AisnetChatbot.tsx` as slide-over drawer containing `Chatbot`**

In `app/aisnet/AisnetChatbot.tsx`:
Implement floating action button at `fixed bottom-6 right-6 z-[200]` which opens a drawer panel containing the full `Chatbot` component.

```tsx
"use client";

import { useState } from "react";
import { ChatCircleDotsIcon, XIcon } from "@phosphor-icons/react";
import Chatbot from "../components/Chatbot";

interface TableRowDetail {
  ketuaPeneliti: string;
  anggota: string[];
  skema: string;
  tahunPelaksanaan: string;
  sumberDana: string;
  totalDana: string;
  statusPenelitian: string;
  abstrak: string;
  luaran: string[];
}

interface TableRow {
  no: number;
  jenis: string;
  judul: string;
  jenisPencairan: string;
  nominal: string;
  tanggal: string;
  details: TableRowDetail;
}

interface AisnetChatbotProps {
  tableData: TableRow[];
}

export default function AisnetChatbot({ tableData }: AisnetChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[200] flex items-center justify-center w-14 h-14 rounded-full bg-[#009ef7] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label="Buka AISnet AI Chatbot"
        type="button"
      >
        <ChatCircleDotsIcon size={26} weight="fill" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#1e1e2d] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#009ef7] font-bold text-sm">
              AI
            </div>
            <div>
              <h3 className="text-sm font-semibold">
                AISnet AI Assistant & Chatbot
              </h3>
              <p className="text-xs text-neutral-400">
                Tanya seputar penelitian, dokumen, & jadwal
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            type="button"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Chatbot container */}
        <div className="flex-1 overflow-hidden">
          <Chatbot tableData={tableData} />
        </div>
      </div>
    </div>
  );
}
```

---

### Task 4: Integration Verification

- [ ] **Step 1: Run project build**

Run build or dev server to verify all imports, types, and components compile cleanly without errors.
