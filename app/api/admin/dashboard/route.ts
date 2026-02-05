// app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  const now = new Date();

  // 오늘 시작
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 이번 주 시작(월요일)
  const weekStart = new Date(now);
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  weekStart.setDate(now.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);

  // 이번 달 시작
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // 통계 count들
  const [{ count: today }, { count: week }, { count: month }, { count: total }] =
    await Promise.all([
      supabaseServer.from('inquiries').select('*', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()),
      supabaseServer.from('inquiries').select('*', { count: 'exact', head: true }).gte('created_at', weekStart.toISOString()),
      supabaseServer.from('inquiries').select('*', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString()),
      supabaseServer.from('inquiries').select('*', { count: 'exact', head: true }),
    ]);

  // 최근 문의
  const { data: recent, error: recentError } = await supabaseServer
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (recentError) {
    return NextResponse.json({ error: recentError.message }, { status: 500 });
  }

  // 30일 통계용
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const { data: rows, error: rowsError } = await supabaseServer
    .from('inquiries')
    .select('type, gift_type, purpose, budget, budget_per_unit, created_at')
    .gte('created_at', startDate.toISOString());

  if (rowsError) {
    return NextResponse.json({ error: rowsError.message }, { status: 500 });
  }

  // 선물/목적 집계
  const giftTypeStats: Record<string, number> = {};
  const budgetStats: Record<string, number> = {};
  let personal = 0;
  let business = 0;

  for (const r of rows ?? []) {
    const gt = r.gift_type || r.purpose;
    if (gt) giftTypeStats[gt] = (giftTypeStats[gt] || 0) + 1;

    const b = r.budget || r.budget_per_unit;
    if (b) budgetStats[b] = (budgetStats[b] || 0) + 1;

    if (r.type === 'personal') personal++;
    if (r.type === 'business') business++;
  }

  const distTotal = personal + business;
  const typeDistribution = {
    personal,
    business,
    total: distTotal,
    personalPercent: distTotal ? Math.round((personal / distTotal) * 100) : 0,
    businessPercent: distTotal ? Math.round((business / distTotal) * 100) : 0,
  };

  return NextResponse.json({
    stats: {
      today: today || 0,
      week: week || 0,
      month: month || 0,
      total: total || 0,
    },
    recentInquiries: recent || [],
    giftTypeStats,
    budgetStats,
    typeDistribution,
  });
}
