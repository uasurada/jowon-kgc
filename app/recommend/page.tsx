// app/recommend/page.tsx — 맞춤 추천 (매장 태블릿은 /recommend/store)
import { Suspense } from 'react';
import type { Metadata } from 'next';
import ConsultationHeader from '@/components/ConsultationHeader';
import Recommender from '@/components/Recommender';
import RecommenderFromUrl from '@/components/RecommenderFromUrl';
import { getSettings, getVisibleProducts } from '@/lib/products';

export const revalidate = 600;

export const metadata: Metadata = {
  title: '정관장 선물 맞춤 추천',
  description: '누가 드시는지, 예산과 원하는 형태만 고르면 알맞은 정관장 제품을 추천해 드려요. 부모님·수험생·어린이·기업 선물까지. 수원 정관장 조원점.',
  alternates: { canonical: '/recommend' },
};

export default async function RecommendPage() {
  const [products, settings] = await Promise.all([getVisibleProducts(), getSettings()]);
  return (
    <main className="consult-page">
      <ConsultationHeader label="맞춤 추천" active="/recommend" />
      <div className="rc-wrap">
        <div className="rc-intro">
          <p className="eyebrow">GIFT FINDER</p>
          <h1>어떤 제품이 좋을지<br />같이 골라 드릴게요</h1>
        </div>
        <Suspense fallback={<Recommender products={products} settings={settings} />}>
          <RecommenderFromUrl products={products} settings={settings} />
        </Suspense>
      </div>
    </main>
  );
}
