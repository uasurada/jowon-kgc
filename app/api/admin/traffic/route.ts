// app/api/admin/traffic/route.ts — 홈페이지 접속 통계
import { NextRequest, NextResponse } from 'next/server';
import { getTrafficStats } from '@/lib/trafficStats';
import { errorMessage } from '@/lib/db';
import { requireAdmin } from '@/lib/adminGuard';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const days = Number(request.nextUrl.searchParams.get('days'));
  const range = [1, 7, 30, 90].includes(days) ? days : 7;
  try {
    return NextResponse.json(await getTrafficStats(range));
  } catch (error) {
    console.error('traffic stats error:', error);
    return NextResponse.json({ error: `통계 조회 실패: ${errorMessage(error)}` }, { status: 503 });
  }
}
