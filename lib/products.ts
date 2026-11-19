// lib/products.ts — 제품·홈페이지 설정 DB 조회/저장 (서버 전용)
import { revalidatePath } from 'next/cache';
import { sql } from './db';
import { DEFAULT_SETTINGS, type PriceMode, type Product, type SiteSettings } from './productInfo';

type Row = Record<string, unknown>;

// image_data는 크니까 목록에서는 있는지만 본다
const COLUMNS = `id, name, cat, badge, kind, form, opts, spec, descr, tags, who, age_min, age_max,
  visible, featured, sort, image, image_ver, (image_data IS NOT NULL) AS custom_image, src`;

function toProduct(r: Row): Product {
  const custom = Boolean(r.custom_image);
  return {
    id: String(r.id),
    name: String(r.name),
    cat: String(r.cat),
    badge: (r.badge as string) ?? null,
    kind: (r.kind as string) ?? null,
    form: (r.form as string) ?? null,
    opts: Array.isArray(r.opts) ? (r.opts as Product['opts']) : [],
    spec: (r.spec as string) ?? null,
    descr: (r.descr as string) ?? null,
    tags: (r.tags as string[]) ?? [],
    who: (r.who as string) ?? null,
    ageMin: (r.age_min as number) ?? null,
    ageMax: (r.age_max as number) ?? null,
    visible: Boolean(r.visible),
    featured: Boolean(r.featured),
    sort: Number(r.sort),
    imageUrl: custom ? `/api/product-image/${r.id}?v=${r.image_ver}` : ((r.image as string) ?? null),
    customImage: custom,
    defaultImage: (r.image as string) ?? null,
    src: (r.src as string) ?? null,
  };
}

/** 홈페이지용: 노출 중인 제품만 */
export async function getVisibleProducts(): Promise<Product[]> {
  if (!sql) return [];
  const rows = await sql.query(`SELECT ${COLUMNS} FROM products WHERE visible ORDER BY sort, name`);
  return rows.map(toProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!sql) return null;
  const rows = await sql.query(`SELECT ${COLUMNS} FROM products WHERE id = $1`, [id]);
  return rows[0] ? toProduct(rows[0]) : null;
}

/** 관리자용: 숨긴 제품까지 */
export async function getAllProducts(): Promise<Product[]> {
  if (!sql) return [];
  const rows = await sql.query(`SELECT ${COLUMNS} FROM products ORDER BY sort, name`);
  return rows.map(toProduct);
}

export async function getSettings(): Promise<SiteSettings> {
  if (!sql) return DEFAULT_SETTINGS;
  const rows = await sql`SELECT value FROM site_settings WHERE key = 'products'`;
  return { ...DEFAULT_SETTINGS, ...((rows[0]?.value as Partial<SiteSettings>) ?? {}) };
}

export async function saveSettings(input: Partial<SiteSettings>): Promise<SiteSettings> {
  const cur = await getSettings();
  const modes: PriceMode[] = ['list', 'band', 'hidden'];
  const next: SiteSettings = {
    priceMode: modes.includes(input.priceMode as PriceMode) ? (input.priceMode as PriceMode) : cur.priceMode,
    promoOn: typeof input.promoOn === 'boolean' ? input.promoOn : cur.promoOn,
    promoText: typeof input.promoText === 'string' ? input.promoText.trim().slice(0, 120) || DEFAULT_SETTINGS.promoText : cur.promoText,
  };
  await sql!`
    INSERT INTO site_settings (key, value) VALUES ('products', ${JSON.stringify(next)}::jsonb)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `;
  refreshProductPages();
  return next;
}

/* ───────── 관리자 저장 ───────── */

export interface ProductInput {
  name?: string; cat?: string; badge?: string | null; kind?: string | null; form?: string | null;
  opts?: [string, number][]; spec?: string | null; descr?: string | null; tags?: string[]; who?: string | null;
  ageMin?: number | null; ageMax?: number | null; visible?: boolean; featured?: boolean; sort?: number;
}

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) || null : null);
const int = (v: unknown) => (v === '' || v == null || !Number.isFinite(Number(v)) ? null : Math.round(Number(v)));

/** 들어온 값 중 저장할 수 있는 것만 골라 DB 컬럼명으로 */
export function cleanInput(body: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if ('name' in body) out.name = text(body.name, 80);
  if ('cat' in body) out.cat = text(body.cat, 40);
  if ('badge' in body) out.badge = text(body.badge, 20);
  if ('kind' in body) out.kind = text(body.kind, 30);
  if ('form' in body) out.form = text(body.form, 30);
  if ('spec' in body) out.spec = text(body.spec, 300);
  if ('descr' in body) out.descr = text(body.descr, 2000);
  if ('who' in body) out.who = text(body.who, 200);
  if ('ageMin' in body) out.age_min = int(body.ageMin);
  if ('ageMax' in body) out.age_max = int(body.ageMax);
  if ('sort' in body) out.sort = int(body.sort) ?? 0;
  if ('visible' in body) out.visible = Boolean(body.visible);
  if ('featured' in body) out.featured = Boolean(body.featured);
  if ('tags' in body && Array.isArray(body.tags)) out.tags = body.tags.map(String).slice(0, 20);
  if ('opts' in body && Array.isArray(body.opts)) {
    out.opts = JSON.stringify(
      body.opts
        .map((o): [string, number | null] | null => (Array.isArray(o) ? [String(o[0] ?? '').trim().slice(0, 40), int(o[1])] : null))
        .filter((o): o is [string, number] => !!o && o[1] != null && o[1] >= 0)
        .slice(0, 10),
    );
  }
  if ('src' in body) out.src = text(body.src, 20);
  return out;
}

export async function updateProduct(id: string, fields: Record<string, unknown>) {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const sets = keys.map((k, i) => `${k} = $${i + 2}${k === 'opts' ? '::jsonb' : ''}`);
  await sql!.query(`UPDATE products SET ${sets.join(', ')}, updated_at = now() WHERE id = $1`, [id, ...keys.map((k) => fields[k])]);
  refreshProductPages(id);
}

export async function createProduct(fields: Record<string, unknown>): Promise<string> {
  const id = `p${Date.now().toString(36)}`;
  const max = await sql!`SELECT COALESCE(MAX(sort), 0) + 10 AS s FROM products`;
  const data: Record<string, unknown> = { sort: max[0].s, src: 'store', ...fields, id };
  const keys = Object.keys(data);
  await sql!.query(
    `INSERT INTO products (${keys.join(', ')}) VALUES (${keys.map((k, i) => `$${i + 1}${k === 'opts' ? '::jsonb' : ''}`).join(', ')})`,
    keys.map((k) => data[k]),
  );
  refreshProductPages();
  return id;
}

export async function deleteProduct(id: string) {
  await sql!`DELETE FROM products WHERE id = ${id}`;
  refreshProductPages(id);
}

export async function saveProductImage(id: string, data: Buffer | null, type: string | null) {
  await sql!`
    UPDATE products SET image_data = ${data}, image_type = ${type}, image_ver = image_ver + 1, updated_at = now()
    WHERE id = ${id}
  `;
  refreshProductPages(id);
}

export async function getProductImage(id: string) {
  if (!sql) return null;
  const rows = await sql`SELECT image_data, image_type FROM products WHERE id = ${id} AND image_data IS NOT NULL`;
  return rows[0] ? { data: rows[0].image_data as Buffer | string, type: String(rows[0].image_type) } : null;
}

/** 저장 후 홈페이지의 제품 화면을 새로 만든다 */
function refreshProductPages(id?: string) {
  try {
    revalidatePath('/products');
    revalidatePath('/recommend');
    revalidatePath('/recommend/store');
    if (id) revalidatePath(`/products/${id}`);
    revalidatePath('/sitemap.xml');
  } catch { /* 스크립트 등 요청 밖에서 호출되면 무시 */ }
}
