import { Role } from "./lib/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const QUERY_KEYS = {
  documents: ["documents"] as const,
  datasets: ["datasets"] as const,
  auth: ["auth"] as const,
  research: ["research-data"] as const,
  users: ["users"] as const,
  sessions: ["sessions"] as const,
  aiSettings: ["ai-settings"] as const,
} as const;

export const SESSIONS_STORAGE_KEY = "mbai.chat.sessions.v1" as const;

export const CONTENT_TYPE = {
  multipart: "multipart/form-data",
  application: "application/json",
} as const;

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const fallbackUser = {
  name: "Dummy User",
  role: "dosen" as Role,
  image: "/avatar.jpg",
};

export const EMBEDDING_DIMENSIONALITY = 1024;

export const geminiFallbacks = [
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
];
