// app/api/admin/settings/route.ts — 가격 표시 방식·행사 안내 설정
import { NextRequest, NextResponse } from 'next/server';
import { errorMessage } from '@/lib/db';
import { requireAdmin } from '@/lib/adminGuard';
import { saveSettings } from '@/lib/products';

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    return NextResponse.json({ success: true, settings: await saveSettings(await request.json()) });
  } catch (error) {
    console.error('settings error:', error);
    return NextResponse.json({ error: `설정 저장 실패: ${errorMessage(error)}` }, { status: 500 });
  }
}
