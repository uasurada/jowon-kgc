// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function unauthorized() {
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area"',
    },
  });
}

export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_BASIC_USER || 'admin';
  const pass = process.env.ADMIN_BASIC_PASS || '';

  // 비번 env가 비어있으면 안전상 무조건 막기
  if (!pass) return unauthorized();

  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Basic ')) return unauthorized();

  const base64 = auth.slice('Basic '.length);
  let decoded = '';
  try {
    decoded = Buffer.from(base64, 'base64').toString('utf8');
  } catch {
    return unauthorized();
  }

  const [u, p] = decoded.split(':');
  if (u !== user || p !== pass) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
