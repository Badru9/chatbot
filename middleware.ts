import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const cookie = request.headers.get('cookie') || '';
  
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(`${backendUrl}/api/auth/get-session`, {
        headers: {
          cookie: cookie,
        },
      });
      
      if (!response.ok) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      const session = await response.json();
      
      if (!session || !session.user || session.user.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
