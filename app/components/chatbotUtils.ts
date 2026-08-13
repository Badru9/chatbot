import type { DocumentData } from "../../services/documentService";
import type { SidebarLibraryFile, SidebarSession } from "./ChatSidebar";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const getSessionTitle = (messages: Message[]) => {
  const firstUser = messages.find((m) => m.role === "user")?.content;
  if (!firstUser) return "Chat kosong";
  return (
    firstUser
      .replace(/@[^\s]+/g, "")
      .trim()
      .slice(0, 48) || "Chat dengan file"
  );
};

export function buildSidebarSessions(sessions: ChatSession[]): SidebarSession[] {
  return sessions
    .filter((s) => s.messages.length > 0)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((s) => ({
      id: s.id,
      title: s.title,
      updatedAt: s.updatedAt,
      messagesCount: s.messages.length,
    }));
}

export function toSidebarFile(doc: DocumentData): SidebarLibraryFile {
  return {
    id: doc.id,
    name: doc.name,
    size: 0,
    type: "application/pdf",
    uploadedAt: doc.uploadedAt ? new Date(doc.uploadedAt).getTime() : Date.now(),
    chunksCount: doc.chunkCount,
  };
}

const BLOBS_DB_NAME = "mbai.pdfBlobs";
const BLOBS_STORE_NAME = "blobs";

function openBlobsDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(BLOBS_DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(BLOBS_STORE_NAME)) {
        db.createObjectStore(BLOBS_STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

export async function deleteBlob(fileId: string): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  try {
    const db = await openBlobsDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(BLOBS_STORE_NAME, "readwrite");
      const store = tx.objectStore(BLOBS_STORE_NAME);
      const request = store.delete(fileId);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (err) {
    console.error("Failed to delete blob from IndexedDB:", err);
  }
}

