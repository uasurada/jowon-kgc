'use client';

import { useEffect, useState } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';

interface Item { k: string; n: number }
interface Traffic {
  days: number;
  visitors: number;
  adminViews: number;
  views: number;
  visits: number;
  orders: number;
  ordersWarn: number;
  ordersBot: number;
  series: { k: string; visitors: number; views: number }[];
  sources: Item[];
  regions: Item[];
  cities: Item[];
  devices: Item[];
  pages: Item[];
  orderSources: Item[];
  kakaoClicks: number;
  telClicks: number;
  clickPages: Item[];
}

const RANGES = [
  { days: 1, label: '오늘' },
  { days: 7, label: '7일' },
  { days: 30, label: '30일' },
  { days: 90, label: '90일' },
];

const PAGE_NAMES: Record<string, string> = {
  '/': '홈',
  '/personal': '개인 선물 상담',
  '/business': '기업·단체 주문',
  '/catalog': '카탈로그',
  '/products': '전체 제품',
  '/recommend': '맞춤 추천',
  '/recommend/store': '매장 태블릿 추천',
  '/gift': '선물 주소 입력 (받는 분)',
  '/privacy': '개인정보처리방침',
};

function RankList({ title, items, unit, color, label }: {
  title: string; items: Item[]; unit: string; color: string; label?: (k: string) => string;
}) {
  const max = Math.max(...items.map((i) => i.n), 1);
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-sm font-bold text-gray-900 mb-3">{title}</p>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400">아직 기록이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((i) => (
            <li key={i.k}>
              <div className="flex justify-between gap-2 text-xs mb-1">
                <span className="text-gray-700 truncate">{label ? label(i.k) : i.k}</span>
                <span className="font-semibold text-gray-900 whitespace-nowrap">{i.n}{unit}</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full">
                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${(i.n / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TrafficStats() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<Traffic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch(`/api/admin/traffic?days=${days}`, { cache: 'no-store' })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.error || `API 오류: ${res.status}`);
        if (alive) { setData(json); setError(null); }
      })
      .catch((e) => alive && setError(e instanceof Error ? e.message : '통계를 불러오지 못했습니다.'))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [days, reload]);

  const pick = (d: number) => { setLoading(true); setDays(d); };
  const maxDay = Math.max(...(data?.series.map((s) => s.visitors) ?? [0]), 1);
  const conv = data && data.visitors ? ((data.orders / data.visitors) * 100).toFixed(1) : '0.0';
  const everyN = data ? Math.ceil(data.series.length / 10) : 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <BarChart3 size={20} className="text-red-600" /> 홈페이지 방문 통계
          {loading && <RefreshCw size={14} className="animate-spin text-gray-400" />}
        </h2>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r.days}
              type="button"
              onClick={() => (r.days === days ? (setLoading(true), setReload((x) => x + 1)) : pick(r.days))}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${r.days === days ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
            {[
              { label: '방문자', value: `${data.visitors}명`, sub: '같은 사람은 1명으로' },
              { label: '방문 횟수', value: `${data.visits}회`, sub: `페이지뷰 ${data.views}` },
              { label: '주문·상담 접수', value: `${data.orders}건`, sub: `⚠️ 확인 필요 ${data.ordersWarn} · 🤖 자동 의심 ${data.ordersBot}` },
              { label: '카톡·전화 버튼', value: `${data.kakaoClicks + data.telClicks}회`, sub: `💬 카톡 ${data.kakaoClicks} · 📞 전화 ${data.telClicks}` },
              { label: '방문자 대비 접수', value: `${conv}%`, sub: '접수 ÷ 방문자' },
            ].map((c) => (
              <div key={c.label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{c.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{c.value}</p>
                <p className="text-[11px] text-gray-500 mt-1">{c.sub}</p>
              </div>
            ))}
          </div>

          <div className="mb-5">
            <p className="text-sm font-bold text-gray-900 mb-2">{days === 1 ? '시간대별 방문자' : '일별 방문자'}</p>
            <div className="flex items-end gap-[2px] h-28 border-b border-gray-200">
              {data.series.map((s) => (
                <div key={s.k} className="flex-1 h-full flex flex-col justify-end items-center">
                  {s.visitors > 0 && <span className="text-[10px] text-gray-600 leading-none mb-0.5">{s.visitors}</span>}
                  <div
                    className="w-full bg-red-500/80 rounded-t"
                    style={{ height: `${(s.visitors / maxDay) * 100}%`, minHeight: s.visitors ? 3 : 0 }}
                    title={`${s.k} · 방문자 ${s.visitors}명 · 페이지뷰 ${s.views}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-[2px] mt-1">
              {data.series.map((s, i) => (
                <span key={s.k} className="flex-1 text-center text-[10px] text-gray-400">
                  {i % everyN === 0 ? s.k : ''}
                </span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <RankList title="🔎 어디서 들어왔나 (방문 기준)" items={data.sources} unit="회" color="bg-blue-500" />
            <RankList title="🧾 접수는 어디서 왔나" items={data.orderSources} unit="건" color="bg-red-500" />
            <RankList title="📍 지역 (시·도)" items={data.regions} unit="명" color="bg-green-500" />
            <RankList title="🏙 도시" items={data.cities} unit="명" color="bg-emerald-500" />
            <RankList title="📱 기기" items={data.devices} unit="명" color="bg-purple-500" />
            <RankList title="📄 많이 본 페이지" items={data.pages} unit="회" color="bg-amber-500" label={(k) => PAGE_NAMES[k] ?? k} />
            <RankList title="👆 카톡·전화를 누른 곳" items={data.clickPages} unit="회" color="bg-yellow-500" label={(k) => k.replace(/ · (\/[^ ]*)$/, (m, p) => ` · ${PAGE_NAMES[p] ?? p}`)} />
          </div>

          <ul className="text-[11px] text-gray-500 mt-4 leading-relaxed list-disc pl-4">
            <li>지역은 IP로 추정한 값이라 휴대폰 데이터(LTE·5G)는 실제 위치와 다를 수 있습니다.</li>
            <li>
              관리자로 로그인한 브라우저와, 관리자가 접속한 IP(앞뒤 7일)의 방문은 통계에서 빠집니다
              {data.adminViews > 0 && <> (이 기간 {data.adminViews}회 제외)</>}.
            </li>
            <li>카톡·전화 버튼은 누른 횟수입니다. 실제로 연락이 왔는지는 매장에서 확인해 주세요.</li>
            <li>QR·전단에는 주소 뒤에 <code className="bg-gray-100 px-1 rounded">?src=qr-bag</code>처럼 꼬리표를 붙이면 따로 집계됩니다.</li>
          </ul>
        </>
      )}
    </div>
  );
}
