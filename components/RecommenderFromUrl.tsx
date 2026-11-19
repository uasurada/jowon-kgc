'use client';

import { useSearchParams } from 'next/navigation';
import Recommender from './Recommender';
import { answersFromQuery, type Product, type SiteSettings } from '@/lib/productInfo';

/** 주소의 답변(?t=&b=&f=)으로 시작하는 맞춤 추천 — 제품 상세에서 뒤로 오면 결과가 그대로 보인다 */
export default function RecommenderFromUrl({ products, settings }: { products: Product[]; settings: SiteSettings }) {
  const params = useSearchParams();
  return <Recommender key={params.toString()} products={products} settings={settings} initial={answersFromQuery(params)} />;
}
