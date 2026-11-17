// app/api/admin-auth/login/route.ts — 관리자 로그인 (proxy 인증 경로 밖)
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, SESSION_MAX_AGE, checkCredentials, createSessionToken } from '@/lib/adminSession';
import { getRequestMeta } from '@/lib/requestMeta';
import { sql } from '@/lib/db';

// 15분 동안 같은 IP 10회, 전체 30회 실패하면 잠시 막는다
const WINDOW = "15 minutes";
const MAX_PER_IP = 10;
const MAX_TOTAL = 30;

async function tooManyFailures(ipHash: string | null) {
  if (!sql) return false;
  const [row] = await sql`
    SELECT
      count(*) FILTER (WHERE ip_hash = ${ipHash})::int AS mine,
      count(*)::int AS total
    FROM login_attempts
    WHERE NOT ok AND created_at > now() - ${WINDOW}::interval
  `;
  return row.mine >= MAX_PER_IP || row.total >= MAX_TOTAL;
}

async function record(ipHash: string | null, ok: boolean) {
  if (!sql) return;
  await sql`INSERT INTO login_attempts (ip_hash, ok) VALUES (${ipHash}, ${ok})`;
  if (Math.random() < 0.05) await sql`DELETE FROM login_attempts WHERE created_at < now() - interval '30 days'`;
}

export async function POST(request: NextRequest) {
  const { ipHash } = await getRequestMeta(request);

  if (await tooManyFailures(ipHash).catch(() => false)) {
    return NextResponse.json(
      { error: '로그인 실패가 많아 잠시 막혔습니다. 15분 뒤 다시 시도해 주세요.' },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const user = typeof body.username === 'string' ? body.username : '';
  const pass = typeof body.password === 'string' ? body.password : '';
  const remember = body.remember !== false;

  if (!checkCredentials(user, pass)) {
    await record(ipHash, false).catch((e) => console.error('login record failed:', e));
    // 무차별 대입 속도를 늦춘다
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  await record(ipHash, true).catch((e) => console.error('login record failed:', e));
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
