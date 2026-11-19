// db/seed-products.mjs — data/products.json(2026 추석 카탈로그)을 products 테이블에 넣는다 (사용: node db/seed-products.mjs)
// 이미 있는 id는 건드리지 않으므로 관리자 화면에서 고친 내용은 그대로 남는다
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const sql = neon(url);
const products = JSON.parse(readFileSync(new URL('../data/products.json', import.meta.url), 'utf8'));

let added = 0;
for (const p of products) {
  const rows = await sql`
    INSERT INTO products (id, name, cat, badge, kind, form, opts, spec, descr, tags, who, age_min, age_max, sort, image, src)
    VALUES (${p.id}, ${p.name}, ${p.cat}, ${p.badge ?? null}, ${p.kind}, ${p.form}, ${JSON.stringify(p.opts)}::jsonb,
            ${p.spec}, ${p.desc}, ${p.tags}, ${p.who}, ${p.age?.[0] ?? null}, ${p.age?.[1] ?? null}, ${p.sort}, ${p.image}, ${p.src})
    ON CONFLICT (id) DO NOTHING
    RETURNING id
  `;
  added += rows.length;
}
console.log(`products: ${added} added, ${products.length - added} already present`);
