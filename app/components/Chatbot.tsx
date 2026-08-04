"use client";

import { ListIcon, SparkleIcon } from "@phosphor-icons/react";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sendChatMessage } from "../../services/chatService";
import {
  fetchDocuments,
  uploadDocument,
  deleteDocument,
  type DocumentData,
} from "../../services/documentService";
import { QUERY_KEYS, SESSIONS_STORAGE_KEY } from "@/constants";

import ChatInputBar from "./ChatInputBar";
import ChatSidebar, {
  type SidebarLibraryFile,
  type SidebarSession,
} from "./ChatSidebar";
import MarkdownRenderer from "./MarkdownRenderer";
import UploadFileModal from "./UploadFileModal";
import { ScrollShadow } from "@heroui/react";
import UploadLibrary from "./UploadLibrary";
import SchedulePanel from "./portal/SchedulePanel";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const getSessionTitle = (messages: Message[]) => {
  const firstUser = messages.find(
    (message) => message.role === "user",
  )?.content;
  if (!firstUser) return "Chat kosong";

  return (
    firstUser
      .replace(/@[^\s]+/g, "")
      .trim()
      .slice(0, 48) || "Chat dengan file"
  );
};

function buildSidebarSessions(sessions: ChatSession[]): SidebarSession[] {
  return sessions
    .filter((session) => session.messages.length > 0)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((session) => ({
      id: session.id,
      title: session.title,
      updatedAt: session.updatedAt,
      messagesCount: session.messages.length,
    }));
}

/**
 * Map API DocumentData to SidebarLibraryFile shape for sidebar/input bar.
 */
function toSidebarFile(doc: DocumentData): SidebarLibraryFile {
  return {
    id: doc.id,
    name: doc.name,
    size: 0, // Size not returned by current API
    type: "application/pdf",
    uploadedAt: doc.uploadedAt
      ? new Date(doc.uploadedAt).getTime()
      : Date.now(),
    chunksCount: doc.chunkCount,
  };
}

export default function Chatbot() {
  const chatbotInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const [activeMenu, setActiveMenu] = useState<"new" | "history" | "library">(
    "new",
  );
  const [activeTool, setActiveTool] = useState<"jadwal" | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState(() => createId());
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStorageReady, setIsStorageReady] = useState(false);

  // Fetch library files from API (replaces localStorage)
  const { data: documentsRaw = [] } = useQuery<DocumentData[]>({
    queryKey: QUERY_KEYS.documents,
    queryFn: fetchDocuments,
  });

  // Map to SidebarLibraryFile for sidebar/input bar compatibility
  const libraryFiles = useMemo(
    () => documentsRaw.map(toSidebarFile),
    [documentsRaw],
  );

  const mentionStart = input.lastIndexOf("@");
  const mentionQuery =
    mentionStart >= 0 ? input.slice(mentionStart + 1).toLowerCase() : "";
  const hasOpenMention = mentionStart >= 0 && !/\s/.test(mentionQuery);

  const mentionMatches = useMemo(
    () =>
      hasOpenMention
        ? libraryFiles
            .filter((file) => file.name.toLowerCase().includes(mentionQuery))
            .slice(0, 6)
        : [],
    [hasOpenMention, libraryFiles, mentionQuery],
  );

  const selectedFiles = useMemo(
    () => libraryFiles.filter((file) => selectedFileIds.includes(file.id)),
    [libraryFiles, selectedFileIds],
  );

  const sidebarSessions = useMemo(
    () => buildSidebarSessions(sessions),
    [sessions],
  );

  // Sessions: still use localStorage
  useEffect(() => {
    setSessions(
      safeParse<ChatSession[]>(localStorage.getItem(SESSIONS_STORAGE_KEY), []),
    );
    setIsStorageReady(true);
  }, []);

  useEffect(() => {
    if (!isStorageReady) return;
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  }, [isStorageReady, sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  useEffect(() => {
    if (messages.length === 0) return;

    setSessions((prev) => {
      const now = Date.now();
      const nextSession: ChatSession = {
        id: currentSessionId,
        title: getSessionTitle(messages),
        messages,
        createdAt:
          prev.find((session) => session.id === currentSessionId)?.createdAt ??
          now,
        updatedAt: now,
      };
      const withoutCurrent = prev.filter(
        (session) => session.id !== currentSessionId,
      );

      return [nextSession, ...withoutCurrent].slice(0, 30);
    });
  }, [currentSessionId, messages]);

  const handleUploadFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUploadFile(event.target.files?.[0] ?? null);
  };

  const chatMutation = useMutation({
    mutationFn: sendChatMessage,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: (payload) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents });
      if (payload.document) {
        setSelectedFileIds((prev) =>
          prev.includes(payload.document!.id)
            ? prev
            : [payload.document!.id, ...prev],
        );
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents }),
  });

  const saveUploadFile = async () => {
    if (!uploadFile || uploadMutation.isPending) return;

    try {
      const payload = await uploadMutation.mutateAsync(uploadFile);

      if (!payload.document) {
        throw new Error(payload.error ?? "Gagal upload PDF.");
      }

      setUploadFile(null);
      setIsUploadModalOpen(false);
      setActiveMenu("library");
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Gagal memproses PDF. Detail: ${error instanceof Error ? error.message : "unknown error"}`,
        },
      ]);
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(createId());
    setMessages([]);
    setInput("");
    setStreamingContent("");
    setSelectedFileIds([]);
    setActiveMenu("new");
  };

  const handleLoadSession = (sessionId: string) => {
    const session = sessions.find((item) => item.id === sessionId);
    if (!session) return;

    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setInput("");
    setStreamingContent("");
  };

  const handleDeleteFile = async (fileId: string) => {
    setSelectedFileIds((prev) => prev.filter((id) => id !== fileId));

    try {
      await deleteMutation.mutateAsync(fileId);
    } catch (error) {
      console.error("Failed to delete file from backend:", error);
    }
  };

  const toggleFile = (fileId: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId],
    );
  };

  const chooseMentionFile = (file: SidebarLibraryFile) => {
    const beforeMention = input.slice(0, mentionStart);
    const afterQuery = input.slice(mentionStart + mentionQuery.length + 1);
    setInput(
      `${beforeMention}@${file.name} ${afterQuery}`.replace(/\s+/g, " "),
    );
    setSelectedFileIds((prev) =>
      prev.includes(file.id) ? prev : [...prev, file.id],
    );
    requestAnimationFrame(() => chatbotInputRef.current?.focus());
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSubmit();
    if (event.key === "Escape")
      setInput((value) => value.replace(/@[^\s]*$/, ""));
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsLoading(true);
    setStreamingContent("");
    setInput("");

    try {
      let finalResponse = "";
      await chatMutation.mutateAsync({
        prompt: userMessage.content,
        documentIds: selectedFileIds,
        messages: updatedMessages.map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        })),
        activeTools: activeTool ? [activeTool] : [],
        onChunk: (accumulatedText) => {
          finalResponse = accumulatedText;
          setStreamingContent(accumulatedText);
        },
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: finalResponse },
      ]);
      setStreamingContent("");

      if (activeTool === "jadwal") {
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Gagal menghubungi API chat. Detail: ${error instanceof Error ? error.message : "unknown error"}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      id="chatbot-wrapper"
      className="relative h-full max-w-full overflow-x-hidden text-black lg:pl-73 flex flex-col"
      style={{ minHeight: 0 }}
    >
      {/* Mobile Header */}
      <div className="flex h-12 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 px-4 backdrop-blur-md lg:hidden shrink-0 z-20">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex items-center gap-2 rounded-lg p-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-xs font-semibold"
          type="button"
        >
          <ListIcon size={20} />
          <span>Menu</span>
        </button>
        <span className="font-bold text-sm text-neutral-900 dark:text-white">
          mb.ai
        </span>
        {activeTool === "jadwal" ? (
          <button
            onClick={() => setActiveTool(null)}
            className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-full px-2.5 py-0.5 cursor-pointer"
            type="button"
          >
            Jadwal
          </button>
        ) : (
          <div className="w-12" />
        )}
      </div>

      <ChatSidebar
        activeMenu={activeMenu}
        libraryFiles={libraryFiles}
        selectedFileIds={selectedFileIds}
        sessions={sidebarSessions}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        onDeleteFile={handleDeleteFile}
        onLoadSession={handleLoadSession}
        onMenuChange={setActiveMenu}
        onNewChat={handleNewChat}
        onToggleFile={toggleFile}
      />

      {activeMenu !== "library" ? (
        <div className="flex flex-1 h-full w-full relative overflow-hidden">
          {/* Kolom Chat (Kiri) */}
          <div className="flex-1 flex flex-col h-full min-w-0 relative">
            <section className="mx-auto flex h-full w-full max-w-[95%] sm:max-w-[90%] flex-col items-center justify-end gap-4 px-3 pt-4 sm:px-6 lg:px-10 overflow-y-auto pb-36 sm:pb-40">
              <ScrollShadow className="w-full flex-1 space-y-3">
                {messages.length === 0 && !isLoading ? (
                  <div className="mx-auto mt-12 sm:mt-20 max-w-2xl text-center px-2">
                    <div className="mx-auto mb-4 sm:mb-6 grid size-10 sm:size-12 place-items-center rounded-2xl border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-white shadow-xs">
                      <SparkleIcon size={20} weight="fill" />
                    </div>
                    <p className="text-[28px] sm:text-[40px] md:text-[48px] font-bold leading-tight tracking-tight text-neutral-900 dark:text-white">
                      Tanya apapun ke mb.ai.
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <div
                        key={`${message.role}-${index}`}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[88%] sm:max-w-[82%] rounded-2xl px-4 py-3 text-[14px] sm:text-[15px] leading-[1.6] ${
                            message.role === "user"
                              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                              : "border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-neutral-900 dark:text-neutral-100"
                          }`}
                        >
                          {message.role === "user" ? (
                            <p className="whitespace-pre-wrap">
                              {message.content}
                            </p>
                          ) : (
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                              <MarkdownRenderer content={message.content} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {isLoading && streamingContent ? (
                      <div className="flex justify-start">
                        <div className="max-w-[88%] sm:max-w-[82%] rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 px-4 py-3 text-[14px] sm:text-[15px] leading-[1.6] text-neutral-900 dark:text-neutral-100">
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <MarkdownRenderer content={streamingContent} />
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {isLoading && !streamingContent ? (
                      <div className="flex justify-start">
                        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 px-4 py-3 text-[14px] sm:text-[15px] leading-[1.6] text-neutral-600 dark:text-neutral-300">
                          <span className="animate-pulse">
                            mb.ai sedang berpikir...
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
                <div ref={messagesEndRef} />
              </ScrollShadow>
            </section>

            <ChatInputBar
              input={input}
              inputRef={chatbotInputRef}
              isLoading={isLoading}
              mentionMatches={mentionMatches}
              selectedFiles={selectedFiles}
              activeTool={activeTool}
              onChooseMentionFile={chooseMentionFile}
              onInputChange={setInput}
              onKeyDown={handleInputKeyDown}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onSubmit={handleSubmit}
              onToggleFile={toggleFile}
              onToggleTool={(tool) => setActiveTool(tool)}
            />
          </div>

          {/* Schedule Panel: Mobile Overlay Drawer */}
          {activeTool === "jadwal" && (
            <div className="fixed inset-0 z-40 flex justify-end lg:hidden">
              <div
                className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
                onClick={() => setActiveTool(null)}
              />
              <div className="relative z-50 h-full w-full sm:w-[400px] bg-white dark:bg-neutral-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
                <SchedulePanel />
              </div>
            </div>
          )}

          {/* Schedule Panel: Desktop Split Column */}
          {activeTool === "jadwal" && (
            <div className="hidden lg:flex w-[360px] xl:w-[400px] h-full shrink-0 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex-col animate-in fade-in slide-in-from-right-5 duration-200">
              <SchedulePanel />
            </div>
          )}
        </div>
      ) : (
        <UploadLibrary />
      )}

      <UploadFileModal
        file={uploadFile}
        isOpen={isUploadModalOpen}
        isUploading={uploadMutation.isPending}
        onCancel={() => setUploadFile(null)}
        onFileChange={handleUploadFileChange}
        onOpenChange={setIsUploadModalOpen}
        onSubmit={saveUploadFile}
      />
    </main>
  );
}
