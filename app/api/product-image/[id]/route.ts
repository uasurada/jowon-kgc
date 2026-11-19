// app/api/product-image/[id]/route.ts — 관리자가 올린 제품 이미지 (주소의 ?v=가 바뀌면 새 이미지)
import { NextRequest, NextResponse } from 'next/server';
import { getProductImage } from '@/lib/products';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const img = await getProductImage(id).catch(() => null);
  if (!img) return new NextResponse(null, { status: 404 });
  const body = typeof img.data === 'string' ? Buffer.from(img.data.replace(/^\\x/, ''), 'hex') : img.data;
  return new NextResponse(new Uint8Array(body), {
    headers: { 'Content-Type': img.type, 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
