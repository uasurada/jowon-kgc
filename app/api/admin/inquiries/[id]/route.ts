// app/api/admin/inquiries/[id]/route.ts — 처리 상태/메모/선물 배송지(매장 직접 입력) 수정
import { NextRequest, NextResponse } from 'next/server';
import { updateInquiry } from '@/lib/inquiries';
import { errorMessage } from '@/lib/db';
import { formatAddress } from '@/lib/gift';
import { requireAdmin } from '@/lib/adminGuard';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: '잘못된 id' }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const patch: { status?: string; memo?: string | null; recipient_address?: string | null } = {};
  if (typeof body.status === 'string') patch.status = body.status;
  if (typeof body.memo === 'string') patch.memo = body.memo.slice(0, 2000);
  if (body.recipient_address && typeof body.recipient_address === 'object') {
    const a = body.recipient_address;
    if (!String(a.address1 ?? '').trim()) {
      return NextResponse.json({ error: '주소를 입력해 주세요.' }, { status: 400 });
    }
    patch.recipient_address = formatAddress(a.zipcode, a.address1, a.address2);
  }

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
