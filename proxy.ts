// proxy.ts (Next.js 16: 프로젝트 루트에 있어야 적용됨. app/ 아래에 두면 무시됨)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminRequest } from '@/lib/adminSession';

const LOGIN_PATH = '/admin/login';

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 로그인 화면은 누구나 접근
  if (pathname === LOGIN_PATH) return NextResponse.next();

  // 관리자 API는 각 라우트에서도 다시 확인한다 (lib/adminGuard.ts)
  if (await isAdminRequest(req)) return NextResponse.next();

  // API는 401, 화면은 로그인 페이지로 이동
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
