import 'server-only'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/server/services/auth'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: string
  image: string | null
}

export type AuthSession = {
  session: {
    id: string
    userId: string
    expiresAt: Date
  }
  user: AuthUser
}

/**
 * Extracts session token from cookies.
 * For use in Server Actions and Route Handlers.
 */
export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('session_token')?.value || null
}

/**
 * Validates auth and returns session+user. Throws if unauthorized.
 * Use in Server Actions and Route Handlers.
 */
export async function requireAuth(): Promise<AuthSession> {
  const token = await getTokenFromCookies()
  if (!token) {
    throw new Error('Unauthorized')
  }

  const result = await getSession(token)
  if (!result) {
    throw new Error('Unauthorized')
  }

  return result as AuthSession
}

/**
 * Validates auth and checks admin role. Throws if not admin.
 */
export async function requireAdmin(): Promise<AuthSession> {
  const session = await requireAuth()
  if (session.user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }
  return session
}
