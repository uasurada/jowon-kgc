'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle, Phone } from 'lucide-react';
import { KAKAO_URL, TEL_HREF } from '@/lib/contact';

/** 휴대폰 화면 아래에 붙는 전화·카톡 버튼 (PC에서는 숨김). 상담 신청서·관리자·매장 태블릿 화면에는 띄우지 않는다 */
function showOn(path: string) {
  return path === '/' || path === '/products' || path.startsWith('/products/') || path === '/recommend' || path === '/catalog';
}

export default function ContactBar() {
  const pathname = usePathname() ?? '';
  if (!showOn(pathname)) return null;
  return (
    <div className="mobile-contact" aria-label="빠른 상담">
      <a href={TEL_HREF} data-track="bar"><Phone size={19} /> 전화 상담</a>
      <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer" data-track="bar"><MessageCircle size={19} /> 카톡으로 물어보기</a>
    </div>
  );
}
