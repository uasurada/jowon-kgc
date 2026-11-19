// app/api/admin/products/[id]/image/route.ts — 제품 이미지 교체(본문 = 이미지 파일) / 기본 이미지로 되돌리기
import { NextRequest, NextResponse } from 'next/server';
import { errorMessage } from '@/lib/db';
import { requireAdmin } from '@/lib/adminGuard';
import { saveProductImage } from '@/lib/products';

type Ctx = { params: Promise<{ id: string }> };
const TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX = 1.5 * 1024 * 1024; // 브라우저에서 줄여서 보내므로 보통 200KB 안팎

export async function POST(request: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;
  const type = request.headers.get('content-type')?.split(';')[0] ?? '';
  if (!TYPES.includes(type)) return NextResponse.json({ error: 'JPG·PNG·WEBP 이미지만 올릴 수 있어요.' }, { status: 400 });
  const data = Buffer.from(await request.arrayBuffer());
  if (!data.length || data.length > MAX) return NextResponse.json({ error: '이미지가 너무 큽니다.' }, { status: 400 });
  try {
    await saveProductImage(id, data, type);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('product image error:', error);
    return NextResponse.json({ error: `이미지 저장 실패: ${errorMessage(error)}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;
  try {
    await saveProductImage(id, null, null);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: `되돌리기 실패: ${errorMessage(error)}` }, { status: 500 });
  }
}
