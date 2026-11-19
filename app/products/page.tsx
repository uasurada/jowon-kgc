// app/products/page.tsx — 제품 안내 (관리자 화면에서 노출·가격 설정)
import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import ConsultationHeader from '@/components/ConsultationHeader';
import ProductBrowser from '@/components/ProductBrowser';
import { getSettings, getVisibleProducts } from '@/lib/products';

export const revalidate = 600;

export const metadata: Metadata = {
  title: '정관장 제품 안내·가격',
  description: '홍삼정, 에브리타임, 홍삼톤, 화애락, 아이패스 등 정관장 제품을 드시는 분·예산별로 비교해 보세요. 수원 정관장 조원점에서 상담·전국 배송합니다.',
  alternates: { canonical: '/products' },
};

export default async function ProductsPage() {
  const [products, settings] = await Promise.all([getVisibleProducts(), getSettings()]);
  return (
    <main className="consult-page">
      <ConsultationHeader label="제품 안내" active="/products" />
      <section className="pd-hero">
        <div>
          <p className="eyebrow">PRODUCTS</p>
          <h1>정관장 제품 안내</h1>
          <p>드시는 분과 예산에 맞는 제품을 찾아보세요. 어떤 제품이 맞을지 모르셔도 괜찮아요.</p>
          <Link href="/recommend" className="button button-red"><Sparkles size={16} />30초 맞춤 추천 받기</Link>
        </div>
      </section>
      <div className="pd-wrap">
        {settings.promoOn && <p className="pd-promo">{settings.promoText}</p>}
        <ProductBrowser products={products} priceMode={settings.priceMode} />
        {settings.priceMode !== 'hidden' && (
          <p className="pd-price-note">가격은 정관장 공식 정가 기준입니다. 명절·행사 할인은 매장으로 문의해 주세요.</p>
        )}
      </div>
    </main>
  );
}
