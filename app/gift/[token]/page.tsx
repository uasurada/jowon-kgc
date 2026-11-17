// app/gift/[token]/page.tsx — 선물 받는 분이 문자 링크로 들어와 배송지를 직접 입력하는 화면
import type { Metadata } from 'next';
import { getGiftView } from '@/lib/inquiries';
import GiftReplyForm from './GiftReplyForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '선물 배송지 입력',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function GiftReplyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const gift = await getGiftView(token).catch((e) => {
    console.error('Gift lookup failed:', e);
    return null;
  });

  return (
    <main className="consult-success">
      <GiftReplyForm token={token} gift={gift} />
    </main>
  );
}
