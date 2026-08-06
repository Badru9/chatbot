import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Guard /admin/* routes - check for session cookie
  if (path.startsWith('/admin')) {
    const sessionToken = request.cookies.get('session_token')?.value

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Note: We do an optimistic cookie check here.
    // Full DB validation happens in Server Actions via requireAdmin().
    // This is the recommended Next.js 16 pattern per proxy.ts docs.
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
