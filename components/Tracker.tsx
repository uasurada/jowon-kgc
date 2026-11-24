'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordContactClick, recordPageView } from '@/lib/attribution';

/** 홈페이지 자체 방문 통계 (관리자 화면에서 확인) */
export default function Tracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) recordPageView(pathname);
  }, [pathname]);

  // 화면 어디에 있든 전화·카톡 버튼을 누르면 기록한다 (버튼마다 따로 붙이지 않아도 되게)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]');
      const href = a?.getAttribute('href') ?? '';
      const kind = href.startsWith('tel:') ? 'tel' : href.includes('pf.kakao.com') ? 'kakao' : null;
      if (kind) recordContactClick(kind, location.pathname, a?.closest('[data-track]')?.getAttribute('data-track') ?? null);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
}
