// app/api/track/route.ts — 방문 기록 (로그인 없음, 실패해도 조용히 무시)
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getRequestMeta } from '@/lib/requestMeta';
import { classifySource, isBotUa } from '@/lib/traffic';

export async function POST(request: NextRequest) {
  try {
    if (!sql) return new NextResponse(null, { status: 204 });
    const meta = await getRequestMeta(request);
    if (isBotUa(meta.ua)) return new NextResponse(null, { status: 204 });

    const body = await request.json().catch(() => ({}));
    const path = String(body.path ?? '').slice(0, 200);
    if (!path.startsWith('/') || path.startsWith('/admin')) return new NextResponse(null, { status: 204 });
    const entry = body.entry === true;

    await sql`
      INSERT INTO page_views (path, entry, source, device, geo_country, geo_region, geo_city, visitor)
      VALUES (
        ${path}, ${entry},
        ${entry ? classifySource({ src: body.src, ref: body.ref, ua: meta.ua }) : null},
        ${meta.device}, ${meta.country}, ${meta.region}, ${meta.city},
        ${String(body.visitor ?? '').slice(0, 40) || meta.ipHash}
      )
    `;

    // 400일 지난 기록은 가끔 정리
    if (Math.random() < 0.01) await sql`DELETE FROM page_views WHERE created_at < now() - interval '400 days'`;
  } catch (e) {
    console.error('track failed:', e);
  }
  return new NextResponse(null, { status: 204 });
}
