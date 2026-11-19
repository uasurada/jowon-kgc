'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

/** 맞춤 추천 결과에서 들어온 제품 상세: 결과로 돌아가는 버튼 (아니면 제품 안내 경로) */
export default function BackToRecommend({ cat }: { cat: string }) {
  const router = useRouter();
  const fromRecommend = useSearchParams().get('from') === 'recommend';
  if (!fromRecommend) {
    return <p className="pd-crumb"><Link href="/products">제품 안내</Link> / {cat}</p>;
  }
  return (
    <button type="button" className="pd-back"
      onClick={() => (window.history.length > 1 ? router.back() : router.push('/recommend'))}>
      <ArrowLeft size={17} />추천 결과로 돌아가기
    </button>
  );
}
