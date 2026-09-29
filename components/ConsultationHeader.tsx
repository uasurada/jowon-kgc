import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Phone } from 'lucide-react';

export default function ConsultationHeader({ label }: { label: string }) {
  return (
    <header className="consult-header">
      <div className="consult-header-inner">
        <Link href="/" className="consult-back" aria-label="홈으로 돌아가기">
          <ArrowLeft size={18} /><span>홈</span>
        </Link>
        <Link href="/" className="consult-brand">
          <span><Image src="/logos/jungkwanjang-wordmark-clean.png" alt="JUNG KWAN JANG" width={562} height={99} priority unoptimized /></span>
          <strong>정관장 조원점</strong>
          <small>{label}</small>
        </Link>
        <a href="tel:031-268-0304" className="consult-call"><Phone size={17} /><span>031-268-0304</span></a>
      </div>
    </header>
  );
}
