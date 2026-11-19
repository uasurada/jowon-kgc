import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { priceLines, type PriceMode, type PriceOption, type Product } from '@/lib/productInfo';

/** 제품 목록·추천 결과에 쓰는 카드 */
export default function ProductCard({ product: p, priceMode, option, reasons, href }: {
  product: Product;
  priceMode: PriceMode;
  option?: PriceOption | null;   // 예산에 맞는 구성 (추천 결과)
  reasons?: string[];
  href?: string | null;          // null이면 링크 없음 (매장 태블릿)
}) {
  const prices = option && priceMode !== 'hidden' ? priceLines({ opts: [option] }, priceMode) : priceLines(p, priceMode);
  const body = (
    <>
      <div className="pd-card-image">
        {p.imageUrl && <Image src={p.imageUrl} alt={p.name} fill sizes="(max-width: 767px) 50vw, 280px" unoptimized />}
        {p.featured && <span className="pd-featured"><Star size={12} fill="currentColor" />매장 추천</span>}
      </div>
      <div className="pd-card-body">
        <p className="pd-card-cat">{p.cat}{p.badge && <b>{p.badge}</b>}</p>
        <h3>{p.name}</h3>
        {p.who && <p className="pd-card-who">{p.who}</p>}
        {reasons && reasons.length > 0 && (
          <p className="pd-reasons">{reasons.map((r) => <span key={r}>{r}</span>)}</p>
        )}
        {prices.length > 0 && (
          <p className="pd-card-price">{prices.slice(0, 3).join(' · ')}{prices.length > 3 && ' 외'}</p>
        )}
      </div>
    </>
  );
  return href === null
    ? <div className="pd-card">{body}</div>
    : <Link href={href ?? `/products/${p.id}`} className="pd-card">{body}</Link>;
}
