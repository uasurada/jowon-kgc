// app/sitemap.ts — /sitemap.xml 자동 생성 (제품 페이지는 DB에서 노출 중인 것만)
import type { MetadataRoute } from 'next';
import { getVisibleProducts } from '@/lib/products';

const SITE_URL = 'https://www.jowon-kgc.com';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const products = await getVisibleProducts().catch(() => []);
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/personal`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/business`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/recommend`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...products.map((p) => ({ url: `${SITE_URL}/products/${p.id}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 })),
    { url: `${SITE_URL}/catalog`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
