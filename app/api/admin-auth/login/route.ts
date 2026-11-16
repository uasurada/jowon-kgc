// app/api/admin-auth/login/route.ts — 관리자 로그인 (proxy 인증 경로 밖)
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, SESSION_MAX_AGE, checkCredentials, createSessionToken } from '@/lib/adminSession';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const user = typeof body.username === 'string' ? body.username : '';
  const pass = typeof body.password === 'string' ? body.password : '';
  const remember = body.remember !== false;

  if (!checkCredentials(user, pass)) {
    // 무차별 대입 속도를 늦춘다
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // "로그인 유지" 해제 시 브라우저를 닫으면 로그아웃되는 세션 쿠키
    ...(remember ? { maxAge: SESSION_MAX_AGE } : {}),
  });
  return res;
}
