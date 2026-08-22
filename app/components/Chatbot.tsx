"use client";

import { SESSIONS_STORAGE_KEY } from "@/constants";
import { useChatServices } from "@/hooks/useChatServices";
import { useDocumentServices } from "@/hooks/useDocumentServices";
import { ListIcon, SparkleIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { sendChatMessage } from "../../services/chatService";

import { Drawer, ScrollShadow } from "@heroui/react";
import ChatInputBar from "./ChatInputBar";
import ChatSidebar, { type SidebarLibraryFile } from "./ChatSidebar";
import MarkdownRenderer from "./MarkdownRenderer";
import UploadFileModal from "./UploadFileModal";
import UploadLibrary from "./UploadLibrary";
import {
  type ChatSession,
  createId,
  deleteBlob,
  getSessionTitle,
  type Message,
  safeParse,
  toSidebarFile,
} from "./chatbotUtils";
import SchedulePanel from "./portal/SchedulePanel";

interface ChatbotProps {
  tableData?: any[];
}

export default function Chatbot({ tableData }: ChatbotProps = {}) {
  const chatbotInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const [activeMenu, setActiveMenu] = useState<"new" | "history" | "library">(
    "new",
  );
  const [activeTool, setActiveTool] = useState<"jadwal" | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState(() => createId());
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");

  const { documentsQuery, uploadDocumentMutation, deleteDocumentMutation } =
    useDocumentServices();

  const {
    sessionsQuery,
    saveSessionMutation,
    deleteSessionMutation,
    syncLocalSessionsMutation,
    fetchSessionDetail,
  } = useChatServices();

  const libraryFiles = useMemo(
    () => (documentsQuery.data ?? []).map(toSidebarFile),
    [documentsQuery.data],
  );

  const mentionStart = input.lastIndexOf("@");
  const mentionQuery =
    mentionStart >= 0 ? input.slice(mentionStart + 1).toLowerCase() : "";
  const hasOpenMention = mentionStart >= 0 && !/\s/.test(mentionQuery);

  const mentionMatches = useMemo(
    () =>
      hasOpenMention
        ? libraryFiles
            .filter((f) => f.name.toLowerCase().includes(mentionQuery))
            .slice(0, 6)
        : [],
    [hasOpenMention, libraryFiles, mentionQuery],
  );

  const selectedFiles = useMemo(
    () => libraryFiles.filter((f) => selectedFileIds.includes(f.id)),
    [libraryFiles, selectedFileIds],
  );

  const sidebarSessions = useMemo(
    () => sessionsQuery.data ?? [],
    [sessionsQuery.data],
  );

  // Auto-migrate legacy localStorage chat sessions once if present
  useEffect(() => {
    try {
      const local = safeParse<ChatSession[]>(
        localStorage.getItem(SESSIONS_STORAGE_KEY),
        [],
      );
      if (Array.isArray(local) && local.length > 0) {
        syncLocalSessionsMutation.mutate(
          local.map((s) => ({
            id: s.id,
            title: s.title,
            messages: s.messages,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
          })),
          {
            onSuccess: () => {
              localStorage.removeItem(SESSIONS_STORAGE_KEY);
            },
          },
        );
      }
    } catch (err) {
      console.error("Local sessions migration error:", err);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const chatMutation = useMutation({ mutationFn: sendChatMessage });

  const saveUploadFile = async () => {
    if (!uploadFile || uploadDocumentMutation.isPending) return;
    try {
      const payload = await uploadDocumentMutation.mutateAsync(uploadFile);

      if (!payload.document)
        throw new Error(payload.error ?? "Gagal upload PDF.");
      setSelectedFileIds((prev) =>
        prev.includes(payload.document!.id)
          ? prev
          : [payload.document!.id, ...prev],
      );
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

  const handleLoadSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      const detail = await fetchSessionDetail(sessionId);
      if (detail) {
        setCurrentSessionId(detail.id);
        setMessages(detail.messages);
        setInput("");
        setStreamingContent("");
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSessionMutation.mutateAsync(sessionId);
      if (currentSessionId === sessionId) {
        handleNewChat();
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    setSelectedFileIds((prev) => prev.filter((id) => id !== fileId));
    try {
      // 1. Delete dari backend
      await deleteDocumentMutation.mutateAsync(fileId);

      // 2. Delete dari IndexedDB
      await deleteBlob(fileId);

      // 3. Refresh list
      queryClient.invalidateQueries({ queryKey: ["documents"] });
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
    if (event.key === "Escape") setInput((v) => v.replace(/@[^\s]*$/, ""));
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
        tableData,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: finalResponse,
      };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      setStreamingContent("");

      // Persist to database asynchronously
      const title = getSessionTitle(finalMessages);
      saveSessionMutation.mutate({
        id: currentSessionId,
        title,
        appendMessages: [userMessage, assistantMessage],
      });

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
      className={`relative h-full max-w-full overflow-x-hidden text-black lg:pl-73 flex flex-col `}
      style={{ minHeight: 0 }}
    >
      {/* Mobile Header */}
      <div className="flex h-12 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-4 lg:hidden">
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
        onDeleteSession={handleDeleteSession}
        onMenuChange={setActiveMenu}
        onNewChat={handleNewChat}
        onToggleFile={toggleFile}
      />

      {activeMenu !== "library" ? (
        <div className="flex flex-1 h-full w-full relative overflow-hidden">
          <div className="flex-1 flex flex-col h-full min-w-0 relative">
            <section className="mx-auto flex h-full w-full max-w-[95%] sm:max-w-[90%] flex-col items-center justify-end gap-4 px-3 pt-4 sm:px-6 lg:px-10 overflow-y-auto pb-36 sm:pb-40">
              <ScrollShadow className="container mx-auto flex-1 space-y-3">
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

          {/* Mobile Schedule Drawer */}
          <Drawer.Backdrop
            isOpen={activeTool === "jadwal"}
            onOpenChange={(isOpen) => {
              if (!isOpen) setActiveTool(null);
            }}
            variant="opaque"
            className=""
          >
            <Drawer.Content placement="right" className="w-full h-full">
              <Drawer.Dialog className="p-0 h-full w-full md:w-1/2 bg-white dark:bg-neutral-900">
                <SchedulePanel onClose={() => setActiveTool(null)} />
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>

          {/* Desktop Schedule Panel */}
          {/* {activeTool === "jadwal" && (
            <div className="hidden lg:flex w-[360px] xl:w-[400px] h-full shrink-0 border-l border-neutral-200 dark:border-neutral-800 bg-teal-400 dark:bg-neutral-900 flex-col animate-in fade-in slide-in-from-right-5 duration-200">
              <SchedulePanel onClose={() => setActiveTool(null)} />
            </div>
          )} */}
        </div>
      ) : (
        <UploadLibrary />
      )}

      <UploadFileModal
        file={uploadFile}
        isOpen={isUploadModalOpen}
        isUploading={uploadDocumentMutation.isPending}
        onCancel={() => setUploadFile(null)}
        onFileChange={(e: ChangeEvent<HTMLInputElement>) =>
          setUploadFile(e.target.files?.[0] ?? null)
        }
        onOpenChange={setIsUploadModalOpen}
        onSubmit={saveUploadFile}
      />
    </main>
  );
}
