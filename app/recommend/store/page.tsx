// app/recommend/store/page.tsx — 매장 태블릿용 맞춤 추천 (접수 버튼 없음, 방문 통계 제외, 90초 뒤 처음으로)
import type { Metadata } from 'next';
import Image from 'next/image';
import Recommender from '@/components/Recommender';
import { getSettings, getVisibleProducts } from '@/lib/products';

export const revalidate = 600;

export const metadata: Metadata = {
  title: '맞춤 추천 (매장)',
  robots: { index: false, follow: false },
};

export default async function StoreRecommendPage() {
  const [products, settings] = await Promise.all([getVisibleProducts(), getSettings()]);
  return (
    <main className="consult-page rc-store-page">
      <header className="rc-store-header">
        <Image src="/logos/jungkwanjang-wordmark-clean.png" alt="JUNG KWAN JANG" width={562} height={99} priority unoptimized />
        <strong>정관장 조원점 맞춤 추천</strong>
      </header>
      <div className="rc-wrap">
        <Recommender products={products} settings={settings} store />
      </div>
    </main>
  );
}
