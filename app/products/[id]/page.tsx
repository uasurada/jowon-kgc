// app/products/[id]/page.tsx — 제품 상세 (본사 공식 설명 + 매장 상담 연결)
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, MessageCircle, Phone, Sparkles, Star } from 'lucide-react';
import { Suspense } from 'react';
import BackToRecommend from '@/components/BackToRecommend';
import ConsultationHeader from '@/components/ConsultationHeader';
import ProductCard from '@/components/ProductCard';
import { getProduct, getSettings, getVisibleProducts } from '@/lib/products';
import { TAGS, priceLines } from '@/lib/productInfo';
import { KAKAO_CHAT_URL } from '@/lib/contact';

export const revalidate = 600;

type Props = { params: Promise<{ id: string }> };

// 빈 목록이면 처음 방문할 때 만들어 두고 10분마다 갱신 (관리자 저장 시 바로 갱신)
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).id);
  if (!p || !p.visible) return { title: '제품 안내' };
  const desc = [p.who && `${p.who}께 추천.`, p.descr].filter(Boolean).join(' ').slice(0, 78);
  return {
    title: `${p.name} 상담·선물`,
    description: desc,
    alternates: { canonical: `/products/${p.id}` },
    openGraph: { title: `${p.name} | 정관장 조원점`, description: desc, images: p.imageUrl ? [p.imageUrl] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const [p, settings, all] = await Promise.all([getProduct(id), getSettings(), getVisibleProducts()]);
  if (!p || !p.visible) notFound();
  const prices = priceLines(p, settings.priceMode);
  const related = all.filter((x) => x.id !== p.id && x.cat === p.cat).slice(0, 4);
  const consultHref = `/personal?product=${encodeURIComponent(p.name)}`;

  return (
    <main className="consult-page">
      <ConsultationHeader label="제품 안내" active="/products" />
      <div className="pd-wrap">
        <Suspense fallback={<p className="pd-crumb"><Link href="/products">제품 안내</Link> / {p.cat}</p>}>
          <BackToRecommend cat={p.cat} />
        </Suspense>
        <article className="pd-detail">
          <div className="pd-detail-image">
            {p.imageUrl && <Image src={p.imageUrl} alt={p.name} fill sizes="(max-width: 767px) 100vw, 520px" priority unoptimized />}
          </div>
          <div className="pd-detail-body">
            <p className="pd-card-cat">{p.cat}{p.badge && <b>{p.badge}</b>}</p>
            <h1>{p.name}</h1>
            {p.featured && <p className="pd-featured inline"><Star size={12} fill="currentColor" />조원점 추천 제품</p>}
            {p.who && <p className="pd-detail-who"><strong>이런 분께 추천해요</strong>{p.who}</p>}
            {p.tags.length > 0 && <p className="pd-tags">{p.tags.map((t) => TAGS[t] && <span key={t}>{TAGS[t]}</span>)}</p>}

            {prices.length > 0 && (
              <div className="pd-price-box">
                {settings.priceMode === 'list'
                  ? p.opts.map(([label, v]) => <p key={label}><span>{label}</span><strong>{v.toLocaleString('ko-KR')}원</strong></p>)
                  : <p><span>가격대</span><strong>{prices.join(', ')}</strong></p>}
                <small>정관장 공식 정가 기준 · 명절·행사 할인은 매장으로 문의해 주세요</small>
              </div>
            )}
            {settings.promoOn && <p className="pd-promo">{settings.promoText}</p>}

            <dl className="pd-spec">
              {p.form && <><dt>형태</dt><dd>{p.form}</dd></>}
              {p.spec && <><dt>구성</dt><dd>{p.spec}</dd></>}
              {p.kind && <><dt>구분</dt><dd>{p.kind}</dd></>}
            </dl>

            <div className="pd-actions" data-track="product">
              <Link href={consultHref} className="button button-red">이 제품으로 상담 신청 <ArrowRight size={16} /></Link>
              <a href={KAKAO_CHAT_URL} target="_blank" rel="noopener noreferrer" className="button button-kakao"><MessageCircle size={16} />카톡 문의</a>
              <a href="tel:031-268-0304" className="button button-dark"><Phone size={16} />전화</a>
            </div>
            <p className="pd-action-note">상담 신청은 결제가 아니에요. 매장에서 연락드려 구성과 금액을 안내드립니다. 주소를 몰라도 받는 분 연락처만으로 선물할 수 있어요.</p>
          </div>
        </article>

        {p.descr && (
          <section className="pd-desc">
            <h2>제품 설명</h2>
            <p>{p.descr}</p>
            <small>제품 설명은 정관장(한국인삼공사) 공식 자료 기준입니다.{p.kind?.includes('건강기능식품') && ' 건강기능식품은 질병의 예방 및 치료를 위한 의약품이 아닙니다.'}</small>
          </section>
        )}

        <div className="pd-cta">
          <p><strong>다른 제품과 비교하고 싶으세요?</strong> 드시는 분과 예산만 고르면 알맞은 제품을 골라 드려요.</p>
          <Link href="/recommend" className="button button-dark"><Sparkles size={16} />맞춤 추천 받기</Link>
        </div>

        {related.length > 0 && (
          <section className="pd-section">
            <h2 className="pd-section-title">같은 분류의 제품</h2>
            <div className="pd-grid">{related.map((r) => <ProductCard key={r.id} product={r} priceMode={settings.priceMode} />)}</div>
          </section>
        )}
      </div>
    </main>
  );
}
