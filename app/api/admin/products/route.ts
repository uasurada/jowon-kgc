// app/api/admin/products/route.ts — 제품 목록(숨김 포함)과 설정, 새 제품 추가
import { NextRequest, NextResponse } from 'next/server';
import { errorMessage } from '@/lib/db';
import { requireAdmin } from '@/lib/adminGuard';
import { cleanInput, createProduct, getAllProducts, getSettings } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const [products, settings] = await Promise.all([getAllProducts(), getSettings()]);
    return NextResponse.json({ products, settings });
  } catch (error) {
    console.error('products list error:', error);
    return NextResponse.json({ error: `제품 조회 실패: ${errorMessage(error)}` }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const fields = cleanInput(await request.json());
    if (!fields.name || !fields.cat) return NextResponse.json({ error: '제품명과 분류를 입력해 주세요.' }, { status: 400 });
    const id = await createProduct(fields);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('product create error:', error);
    return NextResponse.json({ error: `추가 실패: ${errorMessage(error)}` }, { status: 500 });
  }
}
