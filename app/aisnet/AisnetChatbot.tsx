"use client";

import { useEffect, useRef, useState } from "react";
import { Button, ScrollShadow } from "@heroui/react";
import {
  ChatCircleDotsIcon,
  XIcon,
  PaperPlaneRightIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import MarkdownRenderer from "../components/MarkdownRenderer";

// ─── Types ─────────────────────────────────────────────────────
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

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AisnetChatbotProps {
  tableData: TableRow[];
}

// ─── Component ─────────────────────────────────────────────────
export default function AisnetChatbot({ tableData }: AisnetChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsLoading(true);
    setStreamingContent("");
    setInput("");

    try {
      const response = await fetch("/api/aisnet-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage.content,
          messages: updatedMessages,
          pageContext: JSON.stringify(tableData, null, 2),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${response.status}`);
      }

      if (!response.body) throw new Error("Response body is null");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreamingContent(fullText);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: fullText }]);
      setStreamingContent("");
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Gagal menghubungi AI. ${error instanceof Error ? error.message : "Error tidak diketahui."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ─── Floating Action Button (collapsed) ────────────────────
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

  // ─── Chat Panel (expanded) ─────────────────────────────────
  return (
    <div className="fixed bottom-6 right-6 z-[200] w-[400px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1e1e2d] text-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#009ef7]">
            <SparkleIcon size={16} weight="fill" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-tight">
              AISnet AI Assistant
            </h3>
            <p className="text-[10px] text-[#9899ac] leading-tight">
              Tanya informasi seputar data penelitian
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[#9899ac] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Tutup chat"
          type="button"
        >
          <XIcon size={18} />
        </button>
      </div>

      {/* Messages */}
      <ScrollShadow className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#f5f8fa]">
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-[#eff2f5] text-[#009ef7] mb-4 shadow-sm">
              <SparkleIcon size={22} weight="fill" />
            </div>
            <p className="text-sm font-semibold text-[#181c32] mb-1">
              Halo! Saya asisten AI AISnet.
            </p>
            <p className="text-xs text-[#a1a5b7] leading-relaxed max-w-[280px]">
              Tanyakan apa saja tentang data penelitian dan pencairan dana yang
              ada di halaman ini.
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-4">
              {[
                "Berapa total pencairan?",
                "Judul penelitian no.1?",
                "Siapa ketua peneliti?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q);
                    requestAnimationFrame(() => inputRef.current?.focus());
                  }}
                  className="px-3 py-1.5 text-[11px] rounded-full border border-[#eff2f5] bg-white text-[#5e6278] hover:bg-[#009ef7] hover:text-white hover:border-[#009ef7] transition-all cursor-pointer"
                  type="button"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div
                key={`${msg.role}-${idx}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.6] ${
                    msg.role === "user"
                      ? "bg-[#009ef7] text-white"
                      : "bg-white border border-[#eff2f5] text-[#181c32]"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <MarkdownRenderer content={msg.content} />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && streamingContent ? (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl bg-white border border-[#eff2f5] px-3.5 py-2.5 text-[13px] leading-[1.6] text-[#181c32]">
                  <div className="prose prose-sm max-w-none">
                    <MarkdownRenderer content={streamingContent} />
                  </div>
                </div>
              </div>
            ) : null}

            {isLoading && !streamingContent ? (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white border border-[#eff2f5] px-3.5 py-2.5 text-[13px] text-[#a1a5b7]">
                  <span className="animate-pulse">AI sedang berpikir...</span>
                </div>
              </div>
            ) : null}
          </>
        )}
        <div ref={messagesEndRef} />
      </ScrollShadow>

      {/* Input */}
      <div className="shrink-0 px-3 py-2.5 border-t border-[#eff2f5] bg-white">
        <div className="flex items-center gap-2 rounded-xl border border-[#eff2f5] bg-[#f5f8fa] p-1.5">
          <input
            ref={inputRef}
            type="text"
            autoComplete="off"
            placeholder="Ketik pertanyaan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-[13px] text-[#181c32] placeholder:text-[#a1a5b7] px-2"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#009ef7] text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Kirim pesan"
            type="button"
          >
            <PaperPlaneRightIcon size={14} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
