// app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import { sql, errorMessage } from '@/lib/db';
import { getDashboardStats } from '@/lib/inquiries';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!sql) {
    return NextResponse.json(
      { error: 'DB(DATABASE_URL)가 설정되지 않았습니다. 상담 접수는 텔레그램으로만 전달되고 있습니다.' },
      { status: 503 }
    );
  }

  try {
    const { stats, recent30 } = await getDashboardStats();

    // 최근 30일 선물/목적·예산 집계
    const giftTypeStats: Record<string, number> = {};
    const budgetStats: Record<string, number> = {};
    let personal = 0;
    let business = 0;

    for (const r of recent30) {
      const gt = r.gift_type || r.purpose;
      if (gt) giftTypeStats[gt] = (giftTypeStats[gt] || 0) + 1;

      const b = r.budget || r.budget_per_unit;
      if (b) budgetStats[b] = (budgetStats[b] || 0) + 1;

      if (r.type === 'personal') personal++;
      if (r.type === 'business') business++;
    }

    const distTotal = personal + business;

    return NextResponse.json({
      stats,
      giftTypeStats,
      budgetStats,
      typeDistribution: {
        personal,
        business,
        total: distTotal,
        personalPercent: distTotal ? Math.round((personal / distTotal) * 100) : 0,
        businessPercent: distTotal ? Math.round((business / distTotal) * 100) : 0,
      },
    });
  } catch (error) {
    console.error('dashboard error:', error);
    return NextResponse.json(
      { error: `DB 조회 실패: ${errorMessage(error)}` },
      { status: 503 }
    );
  }
}
