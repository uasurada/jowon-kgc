'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordPageView } from '@/lib/attribution';

/** 홈페이지 자체 방문 통계 (관리자 화면에서 확인) */
export default function Tracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) recordPageView(pathname);
  }, [pathname]);
  return null;
}
