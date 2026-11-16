// app/admin/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Calendar, TrendingUp, Users, FileText, DollarSign, Package, RefreshCw, ExternalLink,
  Search, Download, Phone, X, Bell, ChevronLeft, ChevronRight, LogOut,
} from 'lucide-react';
import { emailVerdict, historyLabel, type RiskLevel } from '@/lib/emailCheck';
import { giftSmsText } from '@/lib/gift';

interface Stats {
  today: number;
  week: number;
  month: number;
  total: number;
  pending: number;
}

interface InquiryData {
  id: string;
  created_at: string;
  updated_at?: string;
  type: 'personal' | 'business';
  name: string;
  phone: string;
  email?: string | null;
  company_name?: string | null;
  gift_type?: string | null;
  purpose?: string | null;
  budget?: string | null;
  budget_per_unit?: string | null;
  quantity?: string | null;
  delivery_type?: string | null;
  desired_date?: string | null;
  message?: string | null;
  status: string;
  memo?: string | null;
  org_type?: string | null;
  department?: string | null;
  job_title?: string | null;
  gift_send?: boolean;
  recipient_name?: string | null;
  recipient_phone?: string | null;
  sender_label?: string | null;
  recipient_address?: string | null;
  // 같은 번호로 이 건보다 먼저 들어온 접수
  prev?: number;
  completed?: number;
  canceled?: number;
}

interface Filters {
  q: string;
  type: string;
  status: string;
  from: string;
  to: string;
}

const EMPTY_FILTERS: Filters = { q: '', type: '', status: '', from: '', to: '' };

const STATUS: Record<string, { text: string; color: string }> = {
  pending: { text: '접수', color: 'bg-yellow-100 text-yellow-800' },
  contacted: { text: '상담중', color: 'bg-blue-100 text-blue-800' },
  completed: { text: '완료', color: 'bg-green-100 text-green-800' },
  canceled: { text: '취소', color: 'bg-gray-200 text-gray-600' },
};

const GIFT_TYPE_NAMES: Record<string, string> = {
  self: '나를 위한 선물',
  parents: '부모님 선물',
  business: '직장 상사/감사',
  hospital: '병문안',
  baby: '출산/산모',
  event: '기타 행사',
  employee: '직원 선물',
  client: '거래처 선물',
  other: '기타 단체 주문',
};

const DELIVERY_NAMES: Record<string, string> = { bulk: '일괄 배송', individual: '개별 배송' };

const getGiftTypeName = (type?: string | null) => (type ? GIFT_TYPE_NAMES[type] || type : '-');

const formatDate = (dateString: string, withYear = false) =>
  new Date(dateString).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    ...(withYear ? { year: 'numeric' } : {}),
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

function toQuery(f: Filters, page?: number) {
  const sp = new URLSearchParams();
  (Object.keys(f) as (keyof Filters)[]).forEach((k) => {
    if (f[k]) sp.set(k, f[k]);
  });
  if (page && page > 1) sp.set('page', String(page));
  return sp.toString();
}

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, { cache: 'no-store', ...init });
  if (res.status === 401) {
    // 로그인 유지 기간이 끝났거나 비밀번호가 바뀐 경우
    window.location.href = '/admin/login?next=/admin';
    throw new Error('로그인이 필요합니다.');
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.error ? `${body.error} (${res.status})` : `API 오류: ${res.status}`);
  return body;
}

function StatusBadge({ status }: { status: string }) {
  const badge = STATUS[status] || STATUS.pending;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${badge.color}`}>
      {badge.text}
    </span>
  );
}

function TypeBadge({ type, gift }: { type: string; gift?: boolean }) {
  if (gift) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-pink-100 text-pink-800">
        🎁 선물
      </span>
    );
  }
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
        type === 'personal' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
      }`}
    >
      {type === 'personal' ? '개인' : '기업'}
    </span>
  );
}

function HistoryBadge({ r }: { r: InquiryData }) {
  const color = !r.prev
    ? 'bg-sky-50 text-sky-700'
    : r.completed
      ? 'bg-amber-100 text-amber-800'
      : 'bg-gray-100 text-gray-700';
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${color}`}>
      {historyLabel(r)}
    </span>
  );
}

const RISK_COLOR: Record<RiskLevel, string> = {
  ok: 'bg-green-50 text-green-700',
  warn: 'bg-orange-100 text-orange-800',
  danger: 'bg-red-100 text-red-700',
};

function EmailBadge({ r, short = false }: { r: InquiryData; short?: boolean }) {
  if (r.type !== 'business') return null;
  const v = emailVerdict(r.email, r.org_type);
  // 목록에서는 판정 아이콘과 앞부분만
  const text = short ? v.label.replace(/\s*\(.*$/, '') : v.label;
  return (
    <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${RISK_COLOR[v.level]}`}>
      {text}
    </span>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ today: 0, week: 0, month: 0, total: 0, pending: 0 });
  const [giftTypeStats, setGiftTypeStats] = useState<Record<string, number>>({});
  const [budgetStats, setBudgetStats] = useState<Record<string, number>>({});
  const [typeDistribution, setTypeDistribution] = useState({
    personal: 0, business: 0, personalPercent: 0, businessPercent: 0,
  });

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<InquiryData[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(30);

  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<InquiryData | null>(null);

  const loadStats = useCallback(async () => {
    const json = await fetchJson('/api/admin/dashboard');
    setStats(json.stats);
    setGiftTypeStats(json.giftTypeStats);
    setBudgetStats(json.budgetStats);
    setTypeDistribution(json.typeDistribution);
  }, []);

  const loadList = useCallback(async (f: Filters, p: number) => {
    setListLoading(true);
    try {
      const json = await fetchJson(`/api/admin/inquiries?${toQuery(f, p)}`);
      setRows(json.rows);
      setTotal(json.total);
      setPageSize(json.pageSize);
    } finally {
      setListLoading(false);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadStats(), loadList(applied, page)]);
    } catch (err) {
      console.error('데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [loadStats, loadList, applied, page]);

  useEffect(() => {
    loadAll();
    // 최초 1회만 전체 로드, 이후 검색/페이지 이동은 목록만 다시 불러온다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSearch = (f: Filters, p = 1) => {
    setApplied(f);
    setPage(p);
    loadList(f, p).catch((err) => setError(err.message));
  };

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(filters);
  };

  const onRowUpdated = (row: InquiryData) => {
    // PATCH 응답에는 재접수 이력(prev 등)이 없으므로 기존 행에 덮어쓴다
    const merged = { ...rows.find((r) => r.id === row.id), ...row };
    setRows((prev) => prev.map((r) => (r.id === row.id ? merged : r)));
    setSelected(merged);
    loadStats().catch(() => {});
  };

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

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
            onClick={loadAll}
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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-xs sm:text-sm text-gray-600">정관장 조원점</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadAll}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw size={16} />
                <span className="text-sm font-medium hidden sm:inline">새로고침</span>
              </button>
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <span className="text-sm font-medium">사이트</span>
              </Link>
              <button
                onClick={async () => {
                  await fetch('/api/admin-auth/logout', { method: 'POST' });
                  window.location.href = '/admin/login';
                }}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="로그아웃"
              >
                <LogOut size={16} />
                <span className="text-sm font-medium hidden sm:inline">로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {[
            { label: '미처리(접수)', value: stats.pending, icon: <Bell className="text-yellow-600" size={20} />,
              onClick: () => { const f = { ...EMPTY_FILTERS, status: 'pending' }; setFilters(f); runSearch(f); } },
            { label: '오늘', value: stats.today, icon: <Calendar className="text-blue-600" size={20} /> },
            { label: '이번 주', value: stats.week, icon: <TrendingUp className="text-green-600" size={20} /> },
            { label: '이번 달', value: stats.month, icon: <Users className="text-purple-600" size={20} /> },
            { label: '전체 누적', value: stats.total, icon: <FileText className="text-orange-600" size={20} /> },
          ].map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={c.onClick}
              disabled={!c.onClick}
              className={`text-left bg-white rounded-xl p-4 sm:p-6 border border-gray-200 transition-shadow ${
                c.onClick ? 'hover:shadow-md cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{c.label}</span>
                {c.icon}
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{c.value}</p>
              <p className="text-xs text-gray-500 mt-1">건</p>
            </button>
          ))}
        </div>

        {/* 검색/필터 */}
        <form
          onSubmit={onSubmitSearch}
          className="bg-white rounded-xl border border-gray-200 p-4 mb-4 grid grid-cols-2 md:grid-cols-12 gap-2"
        >
          <div className="col-span-2 md:col-span-4 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              placeholder="이름, 기관명, 전화번호, 요청사항, 메모"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="">구분 전체</option>
            <option value="personal">개인</option>
            <option value="business">기업</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="">상태 전체</option>
            {Object.entries(STATUS).map(([k, v]) => (
              <option key={k} value={k}>{v.text}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            aria-label="시작일"
          />
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            aria-label="종료일"
          />
          <div className="col-span-2 md:col-span-12 flex flex-wrap gap-2 justify-end">
            <button
              type="button"
              onClick={() => { setFilters(EMPTY_FILTERS); runSearch(EMPTY_FILTERS); }}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              초기화
            </button>
            <a
              href={`/api/admin/inquiries/export?${toQuery(applied)}`}
              className="flex items-center gap-1 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              <Download size={16} /> 엑셀 다운로드
            </a>
            <button type="submit" className="flex items-center gap-1 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg">
              <Search size={16} /> 검색
            </button>
          </div>
        </form>

        {/* 문의 목록 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              주문·상담 내역 <span className="text-gray-500 font-normal text-base">({total}건)</span>
            </h2>
            {listLoading && <RefreshCw size={16} className="animate-spin text-gray-400" />}
          </div>

          {rows.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {toQuery(applied) ? '검색 결과가 없습니다.' : '아직 문의가 없습니다.'}
            </div>
          ) : (
            <>
              {/* 모바일: 카드 */}
              <ul className="md:hidden divide-y divide-gray-200">
                {rows.map((r) => (
                  <li key={r.id}>
                    <button type="button" onClick={() => setSelected(r)} className="w-full text-left p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-2 mb-1">
                        <TypeBadge type={r.type} gift={r.gift_send} />
                        <StatusBadge status={r.status} />
                        <span className="ml-auto text-xs text-gray-500">{formatDate(r.created_at)}</span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {r.company_name ? `${r.company_name} · ${r.name}` : r.name}
                        {r.gift_send && r.recipient_name && <span className="font-normal text-gray-500"> → {r.recipient_name}</span>}
                      </p>
                      <p className="text-sm text-gray-600">
                        {getGiftTypeName(r.gift_type || r.purpose)} · {r.budget || r.budget_per_unit || '-'} · {r.quantity || '-'}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <HistoryBadge r={r} />
                        <EmailBadge r={r} short />
                      </div>
                      {r.memo && <p className="text-xs text-gray-500 mt-1 truncate">📝 {r.memo}</p>}
                    </button>
                  </li>
                ))}
              </ul>

              {/* PC: 표 */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['접수일시', '구분', '상태', '이름/기관', '연락처', '이력·확인', '유형', '예산', '수량', '메모'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rows.map((r) => (
                      <tr key={r.id} onClick={() => setSelected(r)} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{formatDate(r.created_at)}</td>
                        <td className="px-4 py-3"><TypeBadge type={r.type} gift={r.gift_send} /></td>
                        <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {r.company_name ? (
                            <div>
                              <div>{r.company_name}</div>
                              <div className="text-xs text-gray-500">{r.name}</div>
                            </div>
                          ) : r.gift_send ? (
                            <div>
                              <div>{r.name}</div>
                              <div className="text-xs text-pink-700">→ {r.recipient_name}</div>
                            </div>
                          ) : r.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{r.phone}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col items-start gap-1">
                            <HistoryBadge r={r} />
                            <EmailBadge r={r} short />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{getGiftTypeName(r.gift_type || r.purpose)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.budget || r.budget_per_unit || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.quantity || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">{r.memo || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이지 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 p-4 border-t border-gray-200">
                  <button
                    disabled={page <= 1}
                    onClick={() => runSearch(applied, page - 1)}
                    className="p-2 rounded-lg bg-gray-100 disabled:opacity-40"
                    aria-label="이전 페이지"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm text-gray-600">{page} / {totalPages}</span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => runSearch(applied, page + 1)}
                    className="p-2 rounded-lg bg-gray-100 disabled:opacity-40"
                    aria-label="다음 페이지"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 통계 (최근 30일) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">개인 vs 기업 <span className="text-xs font-normal text-gray-500">30일</span></h3>
              <Users className="text-gray-400" size={20} />
            </div>
            <div className="space-y-4">
              {[
                { label: '개인 문의', n: typeDistribution.personal, pct: typeDistribution.personalPercent, bar: 'bg-red-600', txt: 'text-red-600' },
                { label: '기업 문의', n: typeDistribution.business, pct: typeDistribution.businessPercent, bar: 'bg-blue-600', txt: 'text-blue-600' },
              ].map((x) => (
                <div key={x.label}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-700">{x.label}</span>
                    <span className={`font-semibold ${x.txt}`}>{x.n}건 ({x.pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className={`${x.bar} h-3 rounded-full transition-all`} style={{ width: `${x.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {[
            { title: '선물 유형별', icon: <Package className="text-gray-400" size={20} />, data: giftTypeStats, label: getGiftTypeName, bar: 'bg-purple-600' },
            { title: '예산대별', icon: <DollarSign className="text-gray-400" size={20} />, data: budgetStats, label: (s: string) => s, bar: 'bg-green-600' },
          ].map((block) =>
            Object.keys(block.data).length > 0 ? (
              <div key={block.title} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">{block.title} <span className="text-xs font-normal text-gray-500">30일</span></h3>
                  {block.icon}
                </div>
                <div className="space-y-3">
                  {Object.entries(block.data)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 6)
                    .map(([k, count]) => {
                      const sum = Object.values(block.data).reduce((a, b) => a + b, 0);
                      const pct = Math.round((count / sum) * 100);
                      return (
                        <div key={k}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-700">{block.label(k)}</span>
                            <span className="font-semibold text-gray-900">{count}건 ({pct}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`${block.bar} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : null
          )}

          {/* 빠른 링크 */}
          <div className="bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">빠른 링크</h3>
            <div className="space-y-2">
              {[
                { href: 'https://analytics.google.com', title: 'Google Analytics', desc: '상세 방문자 통계' },
                { href: 'https://clarity.microsoft.com', title: 'Microsoft Clarity', desc: '사용자 행동 분석' },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-red-300 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{l.title}</p>
                    <p className="text-xs text-gray-600">{l.desc}</p>
                  </div>
                  <ExternalLink size={16} className="text-gray-400 group-hover:text-red-600" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <InquiryDetail inquiry={selected} onClose={() => setSelected(null)} onUpdated={onRowUpdated} />
      )}
    </div>
  );
}

function GiftPanel({ inquiry }: { inquiry: InquiryData }) {
  const [copied, setCopied] = useState(false);
  const sms = giftSmsText({
    recipientName: inquiry.recipient_name,
    senderLabel: inquiry.sender_label,
    buyerName: inquiry.name,
  });
  const digits = (inquiry.recipient_phone ?? '').replace(/[^\d+]/g, '');
  // "?&body=" 형태가 아이폰·안드로이드 모두에서 본문을 채운다
  const smsHref = `sms:${digits}?&body=${encodeURIComponent(sms)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sms);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 space-y-2 text-sm">
      <p className="font-bold text-pink-800">🎁 받는 분</p>
      <dl className="grid grid-cols-3 gap-x-3 gap-y-1">
        <dt className="text-gray-500">성함</dt>
        <dd className="col-span-2 text-gray-900">{inquiry.recipient_name}</dd>
        <dt className="text-gray-500">연락처</dt>
        <dd className="col-span-2">
          <a href={`tel:${digits}`} className="inline-flex items-center gap-1 text-red-600 font-semibold">
            <Phone size={14} /> {inquiry.recipient_phone}
          </a>
        </dd>
        <dt className="text-gray-500">주소</dt>
        <dd className="col-span-2 text-gray-900 break-words">
          {inquiry.recipient_address || <span className="text-pink-700">모름 → 문자로 문의</span>}
        </dd>
        <dt className="text-gray-500">안내할 이름</dt>
        <dd className="col-span-2 text-gray-900">{inquiry.sender_label || inquiry.name}</dd>
      </dl>
      {inquiry.recipient_address ? (
        <p className="text-xs text-gray-600">📦 보내는 분이 주소를 입력함 → 결제 확인 후 바로 발송 (받는 분께 따로 연락 불필요)</p>
      ) : (
        <>
          <div>
            <p className="text-gray-500 mb-1">결제 확인 후 받는 분께 보낼 문자</p>
            <p className="whitespace-pre-wrap bg-white rounded p-2 text-gray-800 text-xs">{sms}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <a href={smsHref} className="py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-center font-semibold">
              📱 문자 보내기
            </a>
            <button type="button" onClick={copy} className="py-2 rounded-lg bg-white border border-pink-300 text-pink-800 font-semibold">
              {copied ? '복사됨 ✓' : '문구 복사'}
            </button>
          </div>
          <p className="text-xs text-gray-500">⏰ 7일 내 회신 없으면 보내는 분께 연락 (환불 또는 다른 주소 발송)</p>
        </>
      )}
    </div>
  );
}

function InquiryDetail({
  inquiry,
  onClose,
  onUpdated,
}: {
  inquiry: InquiryData;
  onClose: () => void;
  onUpdated: (row: InquiryData) => void;
}) {
  const [status, setStatus] = useState(inquiry.status);
  const [memo, setMemo] = useState(inquiry.memo ?? '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const dirty = status !== inquiry.status || memo !== (inquiry.memo ?? '');

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const json = await fetchJson(`/api/admin/inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, memo }),
      });
      onUpdated(json.row);
      setMsg('저장되었습니다.');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : '저장 실패');
    } finally {
      setSaving(false);
    }
  };

  const fields: [string, React.ReactNode][] = [
    ['접수일시', formatDate(inquiry.created_at, true)],
    ['구분', inquiry.type === 'personal'
      ? (inquiry.gift_send ? '개인 · 🎁 선물 보내기' : '개인')
      : `기업${inquiry.org_type ? ` · ${inquiry.org_type}` : ''}`],
    ['접수 이력', <HistoryBadge key="h" r={inquiry} />],
    ['기관·회사명', inquiry.company_name],
    ['부서', inquiry.department],
    [inquiry.type === 'business' ? '담당자' : inquiry.gift_send ? '보내는 분' : '이름', [inquiry.name, inquiry.job_title].filter(Boolean).join(' ')],
    ['연락처', inquiry.phone ? (
      <a href={`tel:${inquiry.phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-1 text-red-600 font-semibold">
        <Phone size={14} /> {inquiry.phone}
      </a>
    ) : null],
    ['이메일', inquiry.email ? (
      <div className="space-y-1">
        <a href={`mailto:${inquiry.email}`} className="text-blue-600">{inquiry.email}</a>
        <div><EmailBadge r={inquiry} /></div>
      </div>
    ) : inquiry.type === 'business' ? <EmailBadge r={inquiry} /> : null],
    [inquiry.type === 'business' ? '목적' : '선물 유형', getGiftTypeName(inquiry.gift_type || inquiry.purpose)],
    [inquiry.type === 'business' ? '1개당 예산' : '예산', inquiry.budget || inquiry.budget_per_unit],
    ['수량', inquiry.quantity],
    ['배송', inquiry.delivery_type ? DELIVERY_NAMES[inquiry.delivery_type] || inquiry.delivery_type : null],
    ['희망일', inquiry.desired_date],
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">상세 내역 #{inquiry.id}</h3>
            <StatusBadge status={inquiry.status} />
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100" aria-label="닫기">
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <dl className="grid grid-cols-3 gap-x-3 gap-y-2 text-sm">
            {fields
              .filter(([, v]) => v !== null && v !== undefined && v !== '' && v !== '-')
              .map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt className="text-gray-500">{k}</dt>
                  <dd className="col-span-2 text-gray-900 break-words">{v}</dd>
                </React.Fragment>
              ))}
          </dl>

          {inquiry.gift_send && <GiftPanel inquiry={inquiry} />}

          {inquiry.type === 'business' && (
            <ul className="text-xs text-gray-700 bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1">
              <li>☎️ 받은 번호가 아닌 <b>기관·회사 대표번호</b>(홈페이지·114 확인)로 전화해 부서·담당자 재직 확인</li>
              <li>📧 견적서는 입력한 공식 이메일로만 발송</li>
              <li>💳 선입금/법인카드 확인 후 출고 · 후불·타 업체 대리구매·송금 요청은 거절</li>
            </ul>
          )}

          {inquiry.message && (
            <div>
              <p className="text-sm text-gray-500 mb-1">요청사항</p>
              <p className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{inquiry.message}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500 mb-2">처리 상태</p>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(STATUS).map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setStatus(k)}
                  className={`py-2 rounded-lg text-sm font-semibold border ${
                    status === k ? `${v.color} border-transparent ring-2 ring-red-400` : 'bg-white text-gray-600 border-gray-300'
                  }`}
                >
                  {v.text}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">메모</p>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="예: 기관 대표번호로 담당자 확인 완료 / 11/20 매장 픽업 예정"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm"
            />
          </div>

          {msg && <p className="text-sm text-gray-600">{msg}</p>}

          <div className="flex gap-2 pb-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium">
              닫기
            </button>
            <button
              onClick={save}
              disabled={!dirty || saving}
              className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-40"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
