export interface SessionMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SessionSummary {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messagesCount: number;
}

export interface SessionDetail {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: SessionMessage[];
}

export async function fetchSessions(): Promise<SessionSummary[]> {
  const res = await fetch("/api/sessions", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Gagal mengambil daftar percakapan");
  }

  const result = await res.json();
  return result.data || [];
}

export async function fetchSession(id: string): Promise<SessionDetail> {
  const res = await fetch(`/api/sessions/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Gagal mengambil data percakapan");
  }

  const result = await res.json();
  return result.data;
}

export async function saveSessionMessages(
  id: string,
  payload: {
    title?: string;
    messages?: SessionMessage[];
    appendMessages?: SessionMessage[];
  },
): Promise<SessionDetail> {
  const res = await fetch(`/api/sessions/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Gagal memperbarui percakapan");
  }

  const result = await res.json();
  return result.data;
}

export async function deleteSession(id: string): Promise<void> {
  const res = await fetch(`/api/sessions/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Gagal menghapus percakapan");
  }
}

export async function syncLocalSessions(
  sessions: {
    id: string;
    title: string;
    messages: SessionMessage[];
    createdAt?: number;
    updatedAt?: number;
  }[],
): Promise<void> {
  const res = await fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessions }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Gagal menyinkronkan percakapan lokal");
  }
}
