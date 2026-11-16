// lib/db.ts
import { neon } from '@neondatabase/serverless';

// Vercel Marketplace(Neon) 연동 시 DATABASE_URL이 자동 등록된다.
const url = process.env.DATABASE_URL;

// DB 설정이 없는 환경에서도 텔레그램 접수는 동작해야 하므로 null 허용
export const sql = url ? neon(url) : null;

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
