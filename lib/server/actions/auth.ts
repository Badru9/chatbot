"use server";

import { cookies, headers } from "next/headers";
import {
  login as loginService,
  logout as logoutService,
  getSession as getSessionService,
} from "@/lib/server/services/auth";
import { loginSchema } from "@/lib/server/middleware/validators";

export async function loginAction(formData: {
  email: string;
  password: string;
}) {
  const parsed = loginSchema.safeParse(formData);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return { error: "Validasi gagal", details: errors };
  }

  const { email, password } = parsed.data;

  const headersList = await headers();
  const ipAddress =
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    "unknown";
  const userAgent = headersList.get("user-agent") || undefined;

  const result = await loginService(email, password, ipAddress, userAgent);
  if (!result) {
    return { error: "Email atau password salah." };
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set("session_token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  });

  return {
    token: result.token,
    user: result.user,
    session: result.session,
  };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (token) {
    await logoutService(token);
  }

  cookieStore.delete("session_token");
  return { success: true };
}

export async function getSessionAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return null;
  }

  const result = await getSessionService(token);
  return result;
}
