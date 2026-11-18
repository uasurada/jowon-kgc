// lib/trafficStats.ts — 관리자 화면 접속 통계 집계 (한국 시간 기준)
import { sql } from './db';
import { cityName, regionName } from './traffic';
import { IS_ADMIN_VIEW } from './adminMarks';

type Row = Record<string, unknown>;
const n = (v: unknown) => Number(v ?? 0);

export async function getTrafficStats(days: number) {
  if (!sql) throw new Error('DATABASE_URL is not configured');
  const db = sql;
  // 오늘 0시(KST)부터 days-1일 전 0시까지
  const SINCE = `(date_trunc('day', now() AT TIME ZONE 'Asia/Seoul') - make_interval(days => $1::int - 1)) AT TIME ZONE 'Asia/Seoul'`;
  // 관리자 본인 방문은 빼고 센다
  const pv = (cols: string, tail = '') =>
    db.query(`SELECT ${cols} FROM page_views WHERE created_at >= ${SINCE} AND NOT ${IS_ADMIN_VIEW} ${tail}`, [days]);
  const iq = (cols: string, tail = '') => db.query(`SELECT ${cols} FROM inquiries WHERE created_at >= ${SINCE} ${tail}`, [days]);
  const bucket = days === 1 ? `to_char(created_at AT TIME ZONE 'Asia/Seoul', 'HH24')` : `to_char(created_at AT TIME ZONE 'Asia/Seoul', 'MM-DD')`;

  const [totals, series, sources, regions, cities, devices, pages, orders, orderSources, admin] = await Promise.all([
    pv(`count(DISTINCT visitor)::int AS visitors, count(*)::int AS views, count(*) FILTER (WHERE entry)::int AS visits`),
    pv(`${bucket} AS k, count(DISTINCT visitor)::int AS visitors, count(*)::int AS views`, 'GROUP BY 1'),
    pv(`coalesce(source, '알 수 없음') AS k, count(*)::int AS n`, 'AND entry GROUP BY 1 ORDER BY 2 DESC LIMIT 8'),
    pv(`geo_country, geo_region, count(DISTINCT visitor)::int AS n`, 'GROUP BY 1, 2 ORDER BY 3 DESC LIMIT 20'),
    pv(`geo_city AS k, count(DISTINCT visitor)::int AS n`, `AND geo_country = 'KR' AND geo_city IS NOT NULL GROUP BY 1 ORDER BY 2 DESC LIMIT 8`),
    pv(`coalesce(device, '알 수 없음') AS k, count(DISTINCT visitor)::int AS n`, 'GROUP BY 1 ORDER BY 2 DESC'),
    pv(`path AS k, count(*)::int AS n`, 'GROUP BY 1 ORDER BY 2 DESC LIMIT 8'),
    iq(`count(*) FILTER (WHERE risk_level IS DISTINCT FROM 'bot')::int AS real,
        count(*) FILTER (WHERE risk_level = 'warn')::int AS warn,
        count(*) FILTER (WHERE risk_level = 'bot')::int AS bot`),
    iq(`coalesce(source, '기록 없음') AS k, count(*)::int AS n`, `AND risk_level IS DISTINCT FROM 'bot' GROUP BY 1 ORDER BY 2 DESC LIMIT 8`),
    db.query(`SELECT count(*)::int AS views FROM page_views WHERE created_at >= ${SINCE} AND ${IS_ADMIN_VIEW}`, [days]),
  ]);

  // 방문이 없던 날·시간도 0으로 채운다
  const byKey = new Map((series as Row[]).map((r) => [String(r.k), r]));
  const keys: string[] = [];
  if (days === 1) {
    const hourNow = Number(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul', hour: '2-digit', hour12: false })) % 24;
    for (let h = 0; h <= hourNow; h++) keys.push(String(h).padStart(2, '0'));
  } else {
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5).toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
      keys.push(d.slice(5));
    }
  }

  // 시·도 단위로 합친다 (같은 시·도의 코드가 두 개인 경우 포함)
  const regionMap = new Map<string, number>();
  for (const r of regions as Row[]) {
    const name = regionName(r.geo_country as string, r.geo_region as string) ?? '알 수 없음';
    regionMap.set(name, (regionMap.get(name) ?? 0) + n(r.n));
  }

  const t = (totals as Row[])[0] ?? {};
  const o = (orders as Row[])[0] ?? {};
  const list = (rows: unknown) => (rows as Row[]).map((r) => ({ k: String(r.k), n: n(r.n) }));

  return {
    days,
    visitors: n(t.visitors),
    views: n(t.views),
    visits: n(t.visits),
    orders: n(o.real),
    ordersWarn: n(o.warn),
    ordersBot: n(o.bot),
    adminViews: n((admin as Row[])[0]?.views),
    series: keys.map((k) => ({ k: days === 1 ? `${k}시` : k, visitors: n(byKey.get(k)?.visitors), views: n(byKey.get(k)?.views) })),
    sources: list(sources),
    regions: [...regionMap].map(([k, v]) => ({ k, n: v })).sort((a, b) => b.n - a.n).slice(0, 8),
    cities: list(cities).map((c) => ({ ...c, k: cityName(c.k) ?? c.k })),
    devices: list(devices),
    pages: list(pages),
    orderSources: list(orderSources),
  };
}
