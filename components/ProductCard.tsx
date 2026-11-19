import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { priceLines, won, type PriceMode, type PriceOption, type Product } from '@/lib/productInfo';

/** 제품 목록·추천 결과에 쓰는 카드 */
export default function ProductCard({ product: p, priceMode, option, reasons, href, onSelect }: {
  product: Product;
  priceMode: PriceMode;
  option?: PriceOption | null;   // 예산에 맞는 구성 (추천 결과)
  reasons?: string[];
  href?: string | null;          // null이면 링크 없음 (매장 태블릿)
  onSelect?: () => void;         // 링크 대신 눌렀을 때 (매장 태블릿: 화면 위에 상세 보기)
}) {
  const lines = option && priceMode !== 'hidden' ? priceLines({ opts: [option] }, priceMode) : priceLines(p, priceMode);
  // 구성이 여러 개면 카드에는 범위만 (예: 75,300원 ~ 331,000원). 구성별 가격은 상세에서
  const values = p.opts.map(([, v]) => v);
  const price = !option && lines.length > 1
    ? priceMode === 'list' ? `${won(Math.min(...values))} ~ ${won(Math.max(...values))}` : `${lines[0]} ~ ${lines[lines.length - 1]}`
    : lines[0];
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
        {price && <p className="pd-card-price">{price}</p>}
      </div>
    </>
  );
  if (href === null) {
    return onSelect
      ? <button type="button" className="pd-card pd-card-button" onClick={onSelect}>{body}</button>
      : <div className="pd-card">{body}</div>;
  }
  return <Link href={href ?? `/products/${p.id}`} className="pd-card">{body}</Link>;
}
