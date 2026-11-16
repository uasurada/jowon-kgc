// app/api/admin/inquiries/[id]/route.ts — 처리 상태/메모 수정
import { NextRequest, NextResponse } from 'next/server';
import { updateInquiry } from '@/lib/inquiries';
import { errorMessage } from '@/lib/db';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: '잘못된 id' }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const patch: { status?: string; memo?: string | null } = {};
  if (typeof body.status === 'string') patch.status = body.status;
  if (typeof body.memo === 'string') patch.memo = body.memo.slice(0, 2000);

  try {
    const row = await updateInquiry(id, patch);
    if (!row) return NextResponse.json({ error: '해당 문의가 없습니다.' }, { status: 404 });
    return NextResponse.json({ row });
  } catch (error) {
    const message = errorMessage(error);
    const status = message === 'invalid status' ? 400 : 503;
    return NextResponse.json({ error: message || '수정 실패' }, { status });
  }
}
