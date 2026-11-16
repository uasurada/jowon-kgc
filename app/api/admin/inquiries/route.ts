// app/api/admin/inquiries/route.ts — 목록/검색 (proxy.ts 관리자 인증 적용 경로)
import { NextRequest, NextResponse } from 'next/server';
import { listInquiries } from '@/lib/inquiries';
import { errorMessage } from '@/lib/db';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 30;

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const page = Math.max(Number(sp.get('page')) || 1, 1);

  try {
    const { rows, total } = await listInquiries(
      {
        q: sp.get('q') ?? undefined,
        type: sp.get('type') ?? undefined,
        status: sp.get('status') ?? undefined,
        from: sp.get('from') ?? undefined,
        to: sp.get('to') ?? undefined,
      },
      PAGE_SIZE,
      (page - 1) * PAGE_SIZE
    );

    return NextResponse.json({ rows, total, page, pageSize: PAGE_SIZE });
  } catch (error) {
    console.error('inquiries list error:', error);
    return NextResponse.json({ error: `DB 조회 실패: ${errorMessage(error)}` }, { status: 503 });
  }
}
