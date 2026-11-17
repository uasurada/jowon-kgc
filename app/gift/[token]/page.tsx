// app/gift/[token]/page.tsx — 선물 받는 분이 문자 링크로 들어와 배송지를 직접 입력하는 화면
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
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
    <main className="gift-reply-page">
      {/* 문자 링크로 처음 들어온 분이 매장을 알아볼 수 있도록 로고·매장 정보를 함께 보여준다 */}
      <header className="gift-reply-brand">
        <Link href="/" aria-label="정관장 조원점 홈">
          <Image src="/logos/jungkwanjang-wordmark-clean.png" alt="정관장 JUNG KWAN JANG" width={562} height={99} priority unoptimized />
        </Link>
        <strong>정관장 조원점</strong>
        <span><ShieldCheck size={14} /> KGC 정관장 공식 가맹점</span>
      </header>

      <GiftReplyForm token={token} gift={gift} />

      <footer className="gift-reply-store">
        <p className="gift-reply-safe">이 페이지에서는 결제나 계좌·카드 정보를 요청하지 않습니다.</p>
        <strong>정관장 조원점</strong>
        <p><MapPin size={14} /> 경기 수원시 장안구 경수대로 935 동양파라곤 1층 105호</p>
        <p><Phone size={14} /> <a href="tel:031-268-0304">031-268-0304</a> · 월–토 10:00–20:00</p>
        <p><MessageCircle size={14} /> <a href="https://pf.kakao.com/_IrSRX/" target="_blank" rel="noopener noreferrer">카카오톡 채널 정관장 조원점</a></p>
        <small>사업자등록번호 441-17-02401 · 대표 박시영 · <Link href="/privacy">개인정보처리방침</Link></small>
        <small>© 2026 정관장 조원점 · jowon-kgc.com</small>
      </footer>
    </main>
  );
}
