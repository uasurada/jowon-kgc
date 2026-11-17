// lib/adminGuard.ts — 관리자 API 이중 확인. proxy.ts가 우회되더라도 데이터가 나가지 않게 한다
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminRequest } from './adminSession';

/** 로그인 안 됐으면 401 응답을, 됐으면 null을 돌려준다 */
export async function requireAdmin(req: NextRequest) {
  if (await isAdminRequest(req)) return null;
  return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
}
