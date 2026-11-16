// proxy.ts (Next.js 16: 프로젝트 루트에 있어야 적용됨. app/ 아래에 두면 무시됨)
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

export function proxy(req: NextRequest) {
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

  // 비밀번호에 ':'가 들어가도 동작하도록 첫 번째 ':'에서만 분리
  const sep = decoded.indexOf(':');
  if (sep < 0) return unauthorized();
  const u = decoded.slice(0, sep);
  const p = decoded.slice(sep + 1);
  if (u !== user || p !== pass) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
