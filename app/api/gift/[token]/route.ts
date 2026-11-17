// app/api/gift/[token]/route.ts — 받는 분이 링크에서 주소 입력 / 선물 사양 (로그인 없음, 토큰으로만 식별)
import { NextRequest, NextResponse } from 'next/server';
import { submitGiftAddress, declineGift, isGiftToken } from '@/lib/inquiries';
import { formatAddress } from '@/lib/gift';
import { sendTelegramHtml, buildGiftReplyTelegramMessage } from '@/lib/telegram';

const CLOSED = '이미 처리되었거나 기간이 지난 링크입니다. 정관장 조원점(031-268-0304)으로 연락해 주세요.';

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!isGiftToken(token)) return NextResponse.json({ error: CLOSED }, { status: 404 });

  const body = await request.json().catch(() => ({}));

  try {
    if (body.action === 'decline') {
      const row = await declineGift(token);
      if (!row) return NextResponse.json({ error: CLOSED }, { status: 404 });
      await sendTelegramHtml(buildGiftReplyTelegramMessage({
        id: row.id, kind: 'declined',
        buyerName: row.name, buyerPhone: row.phone, recipientName: row.recipient_name,
      })).catch((e) => console.error('Telegram notify failed:', e));
      return NextResponse.json({ success: true });
    }

    if (!String(body.address1 ?? '').trim() || !String(body.address2 ?? '').trim()) {
      return NextResponse.json({ error: '주소와 상세주소를 입력해 주세요.' }, { status: 400 });
    }
    if (body.consent !== true) {
      return NextResponse.json({ error: '개인정보 수집·이용에 동의해 주세요.' }, { status: 400 });
    }

    const address = formatAddress(body.zipcode, body.address1, body.address2);
    const row = await submitGiftAddress(token, address);
    if (!row) return NextResponse.json({ error: CLOSED }, { status: 404 });

    await sendTelegramHtml(buildGiftReplyTelegramMessage({
      id: row.id, kind: 'address',
      previousAddress: row.prev_address,
      buyerName: row.sender_label || row.name,
      recipientName: row.recipient_name, recipientPhone: row.recipient_phone,
      address: row.recipient_address,
    })).catch((e) => console.error('Telegram notify failed:', e));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gift reply failed:', error);
    return NextResponse.json({ error: '처리 중 오류가 발생했습니다. 031-268-0304로 연락해 주세요.' }, { status: 503 });
  }
}
