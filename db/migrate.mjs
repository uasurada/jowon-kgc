// db/migrate.mjs — db/schema.sql을 DATABASE_URL에 적용 (사용: node db/migrate.mjs)
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
const schema = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');

// 주석 제거 후 ';' 단위로 실행
const statements = schema
  .replace(/--.*$/gm, '')
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean);

for (const stmt of statements) {
  await sql.query(stmt);
  console.log('ok:', stmt.split('\n')[0]);
}

const cols = await sql`
  SELECT column_name FROM information_schema.columns
  WHERE table_name = 'inquiries' ORDER BY ordinal_position
`;
console.log('inquiries columns:', cols.map((c) => c.column_name).join(', '));
