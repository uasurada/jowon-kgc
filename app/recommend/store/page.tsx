// app/recommend/store/page.tsx — 매장 태블릿용 맞춤 추천 (접수 버튼 없음, 방문 통계 제외, 90초 뒤 처음으로)
import type { Metadata } from 'next';
import Image from 'next/image';
import { MessageCircle, ShieldCheck } from 'lucide-react';
import Recommender from '@/components/Recommender';
import { getSettings, getVisibleProducts } from '@/lib/products';
import storeWide from '../../../img/KakaoTalk_20260928_162936624_10.jpg';

export const revalidate = 600;

export const metadata: Metadata = {
  title: '맞춤 추천 (매장)',
  robots: { index: false, follow: false },
};

export default async function StoreRecommendPage() {
  const [products, settings] = await Promise.all([getVisibleProducts(), getSettings()]);
  return (
    <main className="rc-store-page">
      {/* 매장 사진을 어둡게 깔고 그 위에 추천 화면 */}
      <div className="rc-store-bg" aria-hidden="true">
        <Image src={storeWide} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      <header className="rc-store-header">
        <div className="rc-store-brand">
          <Image src="/logos/jungkwanjang-wordmark-white-v2.png" alt="JUNG KWAN JANG" width={562} height={99} priority unoptimized />
          <span>정관장 조원점</span>
        </div>
        <div className="rc-store-badges">
          <span><ShieldCheck size={18} />KGC 공식 가맹점</span>
          <span><MessageCircle size={18} />궁금한 점은 직원에게 물어보세요</span>
        </div>
      </header>
      <div className="rc-wrap">
        <Recommender products={products} settings={settings} store />
      </div>
    </main>
  );
}
