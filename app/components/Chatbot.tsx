'use client';

import { SparkleIcon } from '@phosphor-icons/react';
import { type ChangeEvent, type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';

import ChatInputBar from './ChatInputBar';
import ChatSidebar, { type SidebarLibraryFile, type SidebarSession } from './ChatSidebar';
import MarkdownRenderer from './MarkdownRenderer';
import UploadFileModal from './UploadFileModal';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface LibraryFile extends SidebarLibraryFile {
  chunksCount?: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

interface UploadDocumentResponse {
  document?: LibraryFile;
  error?: string;
}

const LIBRARY_STORAGE_KEY = 'mbai.library.files.v2';
const SESSIONS_STORAGE_KEY = 'mbai.chat.sessions.v1';

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
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
  const firstUser = messages.find((message) => message.role === 'user')?.content;
  if (!firstUser) return 'Chat kosong';

  return firstUser.replace(/@[^\s]+/g, '').trim().slice(0, 48) || 'Chat dengan file';
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

export default function Chatbot() {
  const chatbotInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activeMenu, setActiveMenu] = useState<'new' | 'history' | 'library'>('new');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState(() => createId());
  const [libraryFiles, setLibraryFiles] = useState<LibraryFile[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStorageReady, setIsStorageReady] = useState(false);

  const mentionStart = input.lastIndexOf('@');
  const mentionQuery = mentionStart >= 0 ? input.slice(mentionStart + 1).toLowerCase() : '';
  const hasOpenMention = mentionStart >= 0 && !/\s/.test(mentionQuery);

  const mentionMatches = useMemo(
    () =>
      hasOpenMention
        ? libraryFiles.filter((file) => file.name.toLowerCase().includes(mentionQuery)).slice(0, 6)
        : [],
    [hasOpenMention, libraryFiles, mentionQuery],
  );

  const selectedFiles = useMemo(
    () => libraryFiles.filter((file) => selectedFileIds.includes(file.id)),
    [libraryFiles, selectedFileIds],
  );

  const sidebarSessions = useMemo(() => buildSidebarSessions(sessions), [sessions]);

  useEffect(() => {
    setLibraryFiles(safeParse<LibraryFile[]>(localStorage.getItem(LIBRARY_STORAGE_KEY), []));
    setSessions(safeParse<ChatSession[]>(localStorage.getItem(SESSIONS_STORAGE_KEY), []));
    setIsStorageReady(true);
  }, []);

  useEffect(() => {
    if (!isStorageReady) return;
    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(libraryFiles));
  }, [isStorageReady, libraryFiles]);

  useEffect(() => {
    if (!isStorageReady) return;
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  }, [isStorageReady, sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  useEffect(() => {
    if (messages.length === 0) return;

    setSessions((prev) => {
      const now = Date.now();
      const nextSession: ChatSession = {
        id: currentSessionId,
        title: getSessionTitle(messages),
        messages,
        createdAt: prev.find((session) => session.id === currentSessionId)?.createdAt ?? now,
        updatedAt: now,
      };
      const withoutCurrent = prev.filter((session) => session.id !== currentSessionId);

      return [nextSession, ...withoutCurrent].slice(0, 30);
    });
  }, [currentSessionId, messages]);

  const handleUploadFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUploadFile(event.target.files?.[0] ?? null);
  };

  const saveUploadFile = async () => {
    if (!uploadFile || isUploading) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });
      const payload = (await response.json()) as UploadDocumentResponse;

      if (!response.ok || !payload.document) {
        throw new Error(payload.error ?? 'Gagal upload PDF.');
      }

      setLibraryFiles((prev) => [payload.document!, ...prev.filter((file) => file.id !== payload.document!.id)]);
      setSelectedFileIds((prev) => (prev.includes(payload.document!.id) ? prev : [payload.document!.id, ...prev]));
      setUploadFile(null);
      setIsUploadModalOpen(false);
      setActiveMenu('library');
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Gagal memproses PDF. Detail: ${error instanceof Error ? error.message : 'unknown error'}`,
        },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(createId());
    setMessages([]);
    setInput('');
    setStreamingContent('');
    setSelectedFileIds([]);
    setActiveMenu('new');
  };

  const handleLoadSession = (sessionId: string) => {
    const session = sessions.find((item) => item.id === sessionId);
    if (!session) return;

    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setInput('');
    setStreamingContent('');
  };

  const handleDeleteFile = async (fileId: string) => {
    setLibraryFiles((prev) => prev.filter((file) => file.id !== fileId));
    setSelectedFileIds((prev) => prev.filter((id) => id !== fileId));

    await fetch('/api/documents', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId: fileId }),
    }).catch(() => undefined);
  };

  const toggleFile = (fileId: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId],
    );
  };

  const chooseMentionFile = (file: SidebarLibraryFile) => {
    const beforeMention = input.slice(0, mentionStart);
    const afterQuery = input.slice(mentionStart + mentionQuery.length + 1);
    setInput(`${beforeMention}@${file.name} ${afterQuery}`.replace(/\s+/g, ' '));
    setSelectedFileIds((prev) => (prev.includes(file.id) ? prev : [...prev, file.id]));
    requestAnimationFrame(() => chatbotInputRef.current?.focus());
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleSubmit();
    if (event.key === 'Escape') setInput((value) => value.replace(/@[^\s]*$/, ''));
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsLoading(true);
    setStreamingContent('');
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage.content,
          documentIds: selectedFileIds,
          messages: updatedMessages,
        }),
      });

      if (!res.ok) {
        const errorPayload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errorPayload?.error ?? 'Request chat gagal.');
      }

      if (!res.body) throw new Error('Response body kosong');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        fullResponse += text;
        setStreamingContent(fullResponse);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: fullResponse }]);
      setStreamingContent('');
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Gagal menghubungi API chat. Detail: ${error instanceof Error ? error.message : 'unknown error'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      id='chatbot-wrapper'
      className="relative h-full w-full overflow-hidden bg-white text-[#111111] lg:pl-[292px]"
    >
      <ChatSidebar
        activeMenu={activeMenu}
        libraryFiles={libraryFiles}
        selectedFileIds={selectedFileIds}
        sessions={sidebarSessions}
        onDeleteFile={handleDeleteFile}
        onLoadSession={handleLoadSession}
        onMenuChange={setActiveMenu}
        onNewChat={handleNewChat}
        onToggleFile={toggleFile}
      />

      <section className='mx-auto flex h-full w-full max-w-[900px] flex-col items-center justify-end gap-4 px-4 pb-36 pt-16 sm:px-6 lg:px-10 overflow-y-auto'>
        <div className='w-full flex-1 space-y-3'>
          {messages.length === 0 && !isLoading ? (
            <div className='mx-auto mt-20 max-w-2xl text-center'>
              <div className='mx-auto mb-6 grid size-12 place-items-center rounded-2xl border border-[#e5e7eb] bg-[#f8f9fa] text-[#111111]'>
                <SparkleIcon size={22} weight='fill' />
              </div>
              <p className='text-[36px] font-semibold leading-[1.15] tracking-[-1px] text-[#111111] sm:text-[48px] sm:leading-[1.1] sm:tracking-[-1.5px]'>
                Tanya apapun ke mb.ai.
              </p>
              <p className='mx-auto mt-4 max-w-xl text-[16px] font-normal leading-[1.6] text-[#374151]'>
                Upload PDF, lalu ketik <span className='font-semibold text-[#111111]'>@</span> untuk memilih dokumen sebagai konteks RAG.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] rounded-xl px-4 py-3 text-[15px] leading-[1.6] ${
                      message.role === 'user'
                        ? 'bg-[#111111] text-white'
                        : 'border border-[#e5e7eb] bg-[#f8f9fa] text-[#374151]'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <p className='whitespace-pre-wrap'>{message.content}</p>
                    ) : (
                      <div className='prose prose-sm max-w-none'>
                        <MarkdownRenderer content={message.content} />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && streamingContent ? (
                <div className='flex justify-start'>
                  <div className='max-w-[82%] rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-4 py-3 text-[15px] leading-[1.6] text-[#374151]'>
                    <div className='prose prose-sm max-w-none'>
                      <MarkdownRenderer content={streamingContent} />
                    </div>
                  </div>
                </div>
              ) : null}

              {isLoading && !streamingContent ? (
                <div className='flex justify-start'>
                  <div className='rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-4 py-3 text-[15px] leading-[1.6] text-[#374151]'>
                    <span className='animate-pulse'>mb.ai sedang berpikir...</span>
                  </div>
                </div>
              ) : null}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </section>

      <ChatInputBar
        input={input}
        inputRef={chatbotInputRef}
        isLoading={isLoading}
        mentionMatches={mentionMatches}
        selectedFiles={selectedFiles}
        onChooseMentionFile={chooseMentionFile}
        onInputChange={setInput}
        onKeyDown={handleInputKeyDown}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onSubmit={handleSubmit}
        onToggleFile={toggleFile}
      />

      <UploadFileModal
        file={uploadFile}
        isOpen={isUploadModalOpen}
        isUploading={isUploading}
        onCancel={() => setUploadFile(null)}
        onFileChange={handleUploadFileChange}
        onOpenChange={setIsUploadModalOpen}
        onSubmit={saveUploadFile}
      />
    </main>
  );
}
