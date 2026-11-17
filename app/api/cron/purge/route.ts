// app/api/cron/purge/route.ts — 매일 새벽 개인정보 파기 (vercel.json crons)
import { NextRequest, NextResponse } from 'next/server';
import { purgeExpiredPersonalData } from '@/lib/retention';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // CRON_SECRET을 설정하면 Vercel 크론만 실행할 수 있다. 미설정이어도 기간 지난 건만 지우므로 여러 번 불려도 무해
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  try {
    const purged = await purgeExpiredPersonalData();
    if (purged) console.log(`개인정보 파기: ${purged}건`);
    return NextResponse.json({ purged });
  } catch (error) {
    console.error('purge failed:', error);
    return NextResponse.json({ error: 'purge failed' }, { status: 500 });
  }
}
