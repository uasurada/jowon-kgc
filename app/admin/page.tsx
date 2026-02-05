// app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Users, FileText, DollarSign, Package, RefreshCw, ExternalLink } from 'lucide-react';

interface Stats {
  today: number;
  week: number;
  month: number;
  total: number;
}

interface InquiryData {
  id: string;
  created_at: string;
  type: string;
  name: string;
  phone: string;
  gift_type?: string;
  purpose?: string;
  budget?: string;
  budget_per_unit?: string;
  status: string;
  company_name?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ today: 0, week: 0, month: 0, total: 0 });
  const [recentInquiries, setRecentInquiries] = useState<InquiryData[]>([]);
  const [giftTypeStats, setGiftTypeStats] = useState<Record<string, number>>({});
  const [budgetStats, setBudgetStats] = useState<Record<string, number>>({});
  const [typeDistribution, setTypeDistribution] = useState({ personal: 0, business: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ 서버 API에서 한번에 받아오기 (Supabase 직접 접근 X)
      const res = await fetch('/api/admin/dashboard', { cache: 'no-store' });
      if (!res.ok) throw new Error(`API 오류: ${res.status}`);

      const json = await res.json();

      setStats(json.stats);
      setRecentInquiries(json.recentInquiries);
      setGiftTypeStats(json.giftTypeStats);
      setBudgetStats(json.budgetStats);
      setTypeDistribution(json.typeDistribution);

    } catch (err: any) {
      console.error('데이터 로드 실패:', err);
      setError(err.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGiftTypeName = (type: string) => {
    const names: Record<string, string> = {
      'self': '나를 위한 선물',
      'parents': '부모님 선물',
      'business': '직장 상사/감사',
      'hospital': '병문안',
      'baby': '출산/산모',
      'event': '기타 행사',
      'employee': '직원 선물',
      'client': '거래처 선물'
    };
    return names[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; color: string }> = {
      'pending': { text: '대기', color: 'bg-yellow-100 text-yellow-800' },
      'contacted': { text: '연락완료', color: 'bg-blue-100 text-blue-800' },
      'completed': { text: '완료', color: 'bg-green-100 text-green-800' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl p-8 text-center border border-red-200">
          <div className="text-red-600 mb-4">⚠️ 오류 발생</div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-sm text-gray-600">정관장 조원점</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw size={16} />
                <span className="text-sm font-medium">새로고침</span>
              </button>
              <a
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <span className="text-sm font-medium">사이트로 이동</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">오늘 문의</span>
              <Calendar className="text-blue-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.today}</p>
            <p className="text-xs text-gray-500 mt-1">건</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">이번 주</span>
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.week}</p>
            <p className="text-xs text-gray-500 mt-1">건</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">이번 달</span>
              <Users className="text-purple-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.month}</p>
            <p className="text-xs text-gray-500 mt-1">건</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">전체 누적</span>
              <FileText className="text-orange-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-1">건</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 최근 문의 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">
                  최근 문의 내역 ({recentInquiries.length}건)
                </h2>
              </div>
              <div className="overflow-x-auto">
                {recentInquiries.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    아직 문의가 없습니다.
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">시간</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">구분</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">이름</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">연락처</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">유형</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">예산</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentInquiries.map((inquiry) => (
                        <tr key={inquiry.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                            {formatDate(inquiry.created_at)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                              inquiry.type === 'personal'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {inquiry.type === 'personal' ? '개인' : '기업'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {inquiry.company_name ? (
                              <div>
                                <div>{inquiry.company_name}</div>
                                <div className="text-xs text-gray-500">{inquiry.name}</div>
                              </div>
                            ) : (
                              inquiry.name
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{inquiry.phone}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {getGiftTypeName(inquiry.gift_type || inquiry.purpose || '-')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {inquiry.budget || inquiry.budget_per_unit || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* 통계 차트 */}
          <div className="space-y-6">
            {/* 개인 vs 기업 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">개인 vs 기업</h3>
                <Users className="text-gray-400" size={20} />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-700">개인 문의</span>
                    <span className="font-semibold text-red-600">
                      {typeDistribution.personal}건 ({(typeDistribution as any).personalPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-red-600 h-3 rounded-full transition-all"
                      style={{ width: `${(typeDistribution as any).personalPercent}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-700">기업 문의</span>
                    <span className="font-semibold text-blue-600">
                      {typeDistribution.business}건 ({(typeDistribution as any).businessPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${(typeDistribution as any).businessPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 선물 유형별 */}
            {Object.keys(giftTypeStats).length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">선물 유형별</h3>
                  <Package className="text-gray-400" size={20} />
                </div>
                <div className="space-y-3">
                  {Object.entries(giftTypeStats)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([type, count]) => {
                      const total = Object.values(giftTypeStats).reduce((a, b) => a + b, 0);
                      const percentage = Math.round((count / total) * 100);
                      return (
                        <div key={type}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-700">{getGiftTypeName(type)}</span>
                            <span className="font-semibold text-gray-900">{count}건 ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 예산대별 */}
            {Object.keys(budgetStats).length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">예산대별</h3>
                  <DollarSign className="text-gray-400" size={20} />
                </div>
                <div className="space-y-3">
                  {Object.entries(budgetStats)
                    .sort(([, a], [, b]) => b - a)
                    .map(([budget, count]) => {
                      const total = Object.values(budgetStats).reduce((a, b) => a + b, 0);
                      const percentage = Math.round((count / total) * 100);
                      return (
                        <div key={budget}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-700">{budget}</span>
                            <span className="font-semibold text-gray-900">{count}건 ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 빠른 링크 */}
            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">빠른 링크</h3>
              <div className="space-y-2">
                <a
                  href="https://analytics.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-red-300 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Google Analytics</p>
                    <p className="text-xs text-gray-600">상세 방문자 통계</p>
                  </div>
                  <ExternalLink size={16} className="text-gray-400 group-hover:text-red-600" />
                </a>
                <a
                  href="https://clarity.microsoft.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-red-300 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Microsoft Clarity</p>
                    <p className="text-xs text-gray-600">사용자 행동 분석</p>
                  </div>
                  <ExternalLink size={16} className="text-gray-400 group-hover:text-red-600" />
                </a>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-red-300 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Supabase</p>
                    <p className="text-xs text-gray-600">데이터베이스 관리</p>
                  </div>
                  <ExternalLink size={16} className="text-gray-400 group-hover:text-red-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
