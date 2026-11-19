// app/api/admin/products/[id]/route.ts — 제품 수정·삭제
import { NextRequest, NextResponse } from 'next/server';
import { errorMessage } from '@/lib/db';
import { requireAdmin } from '@/lib/adminGuard';
import { cleanInput, deleteProduct, updateProduct } from '@/lib/products';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;
  try {
    const fields = cleanInput(await request.json());
    if ('name' in fields && !fields.name) return NextResponse.json({ error: '제품명을 입력해 주세요.' }, { status: 400 });
    if ('cat' in fields && !fields.cat) return NextResponse.json({ error: '분류를 입력해 주세요.' }, { status: 400 });
    await updateProduct(id, fields);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('product update error:', error);
    return NextResponse.json({ error: `저장 실패: ${errorMessage(error)}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;
  try {
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('product delete error:', error);
    return NextResponse.json({ error: `삭제 실패: ${errorMessage(error)}` }, { status: 500 });
  }
}
