'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import { TAGS, type Product, type PriceMode } from '@/lib/productInfo';

const FILTER_TAGS = ['parents', 'vip', 'worker', 'student', 'kids', 'women', 'men', 'family', 'beginner', 'business'];

/** 제품 안내: 분류·대상으로 거르기 */
export default function ProductBrowser({ products, priceMode }: { products: Product[]; priceMode: PriceMode }) {
  const [cat, setCat] = useState('');
  const [tag, setTag] = useState('');
  const cats = [...new Set(products.map((p) => p.cat))];
  const shown = products.filter((p) => (!cat || p.cat === cat) && (!tag || p.tags.includes(tag)));
  const featured = !cat && !tag ? products.filter((p) => p.featured) : [];

  return (
    <>
      <div className="pd-filters">
        <div className="pd-chips" role="group" aria-label="분류">
          <button type="button" className={!cat ? 'selected' : ''} onClick={() => setCat('')}>전체</button>
          {cats.map((c) => <button type="button" key={c} className={cat === c ? 'selected' : ''} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        <div className="pd-chips small" role="group" aria-label="드시는 분">
          <span>드시는 분</span>
          <button type="button" className={!tag ? 'selected' : ''} onClick={() => setTag('')}>전체</button>
          {FILTER_TAGS.map((t) => <button type="button" key={t} className={tag === t ? 'selected' : ''} onClick={() => setTag(t)}>{TAGS[t]}</button>)}
        </div>
      </div>

      {featured.length > 0 && (
        <section className="pd-section">
          <h2 className="pd-section-title">조원점 추천 제품</h2>
          <div className="pd-grid">{featured.map((p) => <ProductCard key={p.id} product={p} priceMode={priceMode} />)}</div>
        </section>
      )}

      <section className="pd-section">
        <h2 className="pd-section-title">{cat || (tag ? `${TAGS[tag]}께 맞는 제품` : '전체 제품')} <small>{shown.length}개</small></h2>
        {shown.length
          ? <div className="pd-grid">{shown.map((p) => <ProductCard key={p.id} product={p} priceMode={priceMode} />)}</div>
          : <p className="pd-empty">조건에 맞는 제품이 없어요. 다른 조건을 골라 보세요.</p>}
      </section>
    </>
  );
}
