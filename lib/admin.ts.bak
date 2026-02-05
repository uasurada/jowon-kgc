// lib/admin.ts - 관리자 페이지용 통계 함수

import { supabase } from './supabase';

// 기간별 문의 건수
export async function getInquiryStats() {
  const now = new Date();
  
  // 오늘
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const { count: todayCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayStart.toISOString());

  // 이번 주 (월요일부터)
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1); // 월요일
  weekStart.setHours(0, 0, 0, 0);
  const { count: weekCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', weekStart.toISOString());

  // 이번 달
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const { count: monthCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', monthStart.toISOString());

  // 전체
  const { count: totalCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true });

  return {
    today: todayCount || 0,
    week: weekCount || 0,
    month: monthCount || 0,
    total: totalCount || 0,
  };
}

// 최근 문의 목록
export async function getRecentInquiries(limit = 10) {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('최근 문의 조회 실패:', error);
    return [];
  }

  return data || [];
}

// 선물 유형별 통계
export async function getGiftTypeStats(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data } = await supabase
    .from('inquiries')
    .select('gift_type, purpose')
    .gte('created_at', startDate.toISOString());

  const stats: Record<string, number> = {};
  
  data?.forEach(item => {
    const type = item.gift_type || item.purpose;
    if (type) {
      stats[type] = (stats[type] || 0) + 1;
    }
  });

  return stats;
}

// 예산대별 통계
export async function getBudgetStats(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data } = await supabase
    .from('inquiries')
    .select('budget, budget_per_unit')
    .gte('created_at', startDate.toISOString());

  const stats: Record<string, number> = {};
  
  data?.forEach(item => {
    const budget = item.budget || item.budget_per_unit;
    if (budget) {
      stats[budget] = (stats[budget] || 0) + 1;
    }
  });

  return stats;
}

// 일별 문의 추이 (차트용)
export async function getDailyTrend(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data } = await supabase
    .from('inquiries')
    .select('created_at')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  const dailyCount: Record<string, number> = {};
  
  data?.forEach(item => {
    const date = new Date(item.created_at).toISOString().split('T')[0];
    dailyCount[date] = (dailyCount[date] || 0) + 1;
  });

  // 누락된 날짜 0으로 채우기
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    if (!dailyCount[dateStr]) {
      dailyCount[dateStr] = 0;
    }
  }

  return dailyCount;
}

// 시간대별 통계 (언제 문의가 많은지)
export async function getHourlyStats(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data } = await supabase
    .from('inquiries')
    .select('created_at')
    .gte('created_at', startDate.toISOString());

  const hourlyCount: Record<number, number> = {};
  
  data?.forEach(item => {
    const hour = new Date(item.created_at).getHours();
    hourlyCount[hour] = (hourlyCount[hour] || 0) + 1;
  });

  return hourlyCount;
}

// 개인 vs 기업 비율
export async function getTypeDistribution(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data } = await supabase
    .from('inquiries')
    .select('type')
    .gte('created_at', startDate.toISOString());

  let personalCount = 0;
  let businessCount = 0;

  data?.forEach(item => {
    if (item.type === 'personal') personalCount++;
    if (item.type === 'business') businessCount++;
  });

  return {
    personal: personalCount,
    business: businessCount,
    total: personalCount + businessCount,
    personalPercent: Math.round((personalCount / (personalCount + businessCount)) * 100),
    businessPercent: Math.round((businessCount / (personalCount + businessCount)) * 100),
  };
}

// 문의 상태별 통계
export async function getStatusStats() {
  const { data } = await supabase
    .from('inquiries')
    .select('status');

  const stats: Record<string, number> = {
    pending: 0,
    contacted: 0,
    completed: 0,
  };

  data?.forEach(item => {
    if (stats[item.status] !== undefined) {
      stats[item.status]++;
    }
  });

  return stats;
}

// 전환율 계산 (문의 → 완료)
export async function getConversionRate(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data } = await supabase
    .from('inquiries')
    .select('status')
    .gte('created_at', startDate.toISOString());

  const total = data?.length || 0;
  const completed = data?.filter(item => item.status === 'completed').length || 0;

  return {
    total,
    completed,
    rate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

// 엑셀 다운로드용 데이터
export async function getExportData(startDate: Date, endDate: Date) {
  const { data } = await supabase
    .from('inquiries')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: false });

  return data || [];
}