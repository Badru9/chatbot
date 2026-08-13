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
        aria-label="Buka AI Assistant"
        type="button"
      >
        <ChatCircleDotsIcon size={26} weight="fill" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-2xl border border-neutral-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#1e1e2d] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#009ef7] font-bold text-sm">
              AI
            </div>
            <div>
              <h3 className="text-sm font-semibold">AISnet AI Assistant & Chatbot</h3>
              <p className="text-xs text-neutral-400">Tanya seputar penelitian, dokumen, & jadwal</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Tutup chatbot"
            type="button"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Full Chatbot Container */}
        <div className="flex-1 overflow-hidden">
          <Chatbot tableData={tableData} />
        </div>
      </div>
    </div>
  );
}


