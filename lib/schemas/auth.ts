import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
}

export interface AuthSessionResponse {
  session?: {
    id: string;
    userId: string;
    token: string;
    expiresAt: string;
  };
  user?: AuthUser;
}
