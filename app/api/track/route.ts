// app/api/track/route.ts — 방문 기록 (로그인 없음, 실패해도 조용히 무시)
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getRequestMeta } from '@/lib/requestMeta';
import { classifySource, isBotUa } from '@/lib/traffic';
import { isAdminRequest } from '@/lib/adminSession';
import { markAdmin } from '@/lib/adminMarks';

export async function POST(request: NextRequest) {
  try {
    if (!sql) return new NextResponse(null, { status: 204 });
    const meta = await getRequestMeta(request);
    if (isBotUa(meta.ua)) return new NextResponse(null, { status: 204 });

    const body = await request.json().catch(() => ({}));
    const visitor = String(body.visitor ?? '').slice(0, 40) || null;

    // 관리자로 로그인된 브라우저: 이 브라우저와 IP를 관리자로 표시하고 방문으로 세지 않는다
    if (await isAdminRequest(request)) {
      await markAdmin(visitor, meta.ipHash);
      return new NextResponse(null, { status: 204 });
    }

    const path = String(body.path ?? '').slice(0, 200);
    if (!path.startsWith('/') || path.startsWith('/admin')) return new NextResponse(null, { status: 204 });
    const entry = body.entry === true;

    await sql`
      INSERT INTO page_views (path, entry, source, device, geo_country, geo_region, geo_city, visitor, ip_hash)
      VALUES (
        ${path}, ${entry},
        ${entry ? classifySource({ src: body.src, ref: body.ref, ua: meta.ua }) : null},
        ${meta.device}, ${meta.country}, ${meta.region}, ${meta.city},
        ${visitor || meta.ipHash}, ${meta.ipHash}
      )
    `;

    // 400일 지난 기록은 가끔 정리
    if (Math.random() < 0.01) await sql`DELETE FROM page_views WHERE created_at < now() - interval '400 days'`;
  } catch (e) {
    console.error('track failed:', e);
  }
  return new NextResponse(null, { status: 204 });
}
