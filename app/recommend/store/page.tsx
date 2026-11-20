// app/recommend/store/page.tsx — 매장 태블릿용 맞춤 추천 (접수 버튼 없음, 방문 통계 제외, 90초 뒤 처음으로)
import type { Metadata } from 'next';
import Image from 'next/image';
import { MessageCircle, ShieldCheck } from 'lucide-react';
import Recommender from '@/components/Recommender';
import { getSettings, getVisibleProducts } from '@/lib/products';
import storeShelf from '../../../img/KakaoTalk_20260928_162936624_08.jpg';

export const revalidate = 600;

export const metadata: Metadata = {
  title: '맞춤 추천 (매장)',
  robots: { index: false, follow: false },
  // 태블릿에서 '홈 화면에 추가'한 아이콘으로 열면 주소창 없이 전체화면
  manifest: '/store.webmanifest',
  appleWebApp: { capable: true, title: '정관장 추천', statusBarStyle: 'black-translucent' },
};

export default async function StoreRecommendPage() {
  const [products, settings] = await Promise.all([getVisibleProducts(), getSettings()]);
  return (
    <main className="rc-store-page">
      {/* 제품 진열 사진을 흐리게 깔고 그 위에 추천 화면 */}
      <div className="rc-store-bg" aria-hidden="true">
        <Image src={storeShelf} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      <header className="rc-store-header">
        <div className="rc-store-brand">
          <Image src="/logos/jungkwanjang-wordmark-white-alpha.png" alt="JUNG KWAN JANG" width={600} height={137} priority unoptimized />
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
