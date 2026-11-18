// lib/attribution.ts — 브라우저에서 처음 들어온 경로를 기억해 접수·통계에 붙인다 (클라이언트 전용)

const ATTR_KEY = 'kgc_attr';      // 처음 들어온 경로 (30일 유지)
const VISITOR_KEY = 'kgc_vid';    // 무작위 방문자 id
const ADMIN_KEY = 'kgc_admin';    // 관리자 브라우저는 통계에서 뺀다
const SESSION_KEY = 'kgc_session';
const PAGE_AT_KEY = 'kgc_pv_at';  // 현재 페이지를 연 시각
const ADMIN_MARK_KEY = 'kgc_admin_mark'; // 관리자 표시를 보낸 날짜 (하루 한 번)

export interface Attribution {
  src: string | null;
  ref: string | null;
  landing: string | null;
  visitor: string | null;
  elapsedSec: number | null;
}

function store(kind: 'local' | 'session') {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function externalRef() {
  try {
    const r = document.referrer;
    return r && new URL(r).host !== location.host ? r : null;
  } catch {
    return null;
  }
}

function visitorId(ls: Storage | null) {
  let visitor = ls?.getItem(VISITOR_KEY) ?? null;
  if (!visitor && ls) {
    visitor = crypto.getRandomValues(new Uint32Array(2)).join('-');
    ls.setItem(VISITOR_KEY, visitor);
  }
  return visitor;
}

function send(body: string) {
  if (!navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'application/json' }))) {
    fetch('/api/track', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
  }
}

/** 페이지가 바뀔 때마다 호출. 방문 통계 전송 + 처음 경로 기억 */
export function recordPageView(pathname: string) {
  const ls = store('local');
  const ss = store('session');
  if (pathname.startsWith('/admin')) {
    ls?.setItem(ADMIN_KEY, '1');
    // 로그인된 관리자면 서버가 이 브라우저와 IP를 관리자로 표시한다 (이전 방문까지 통계에서 빠짐)
    const today = new Date().toDateString();
    if (pathname !== '/admin/login' && ss?.getItem(ADMIN_MARK_KEY) !== today) {
      ss?.setItem(ADMIN_MARK_KEY, today);
      send(JSON.stringify({ path: pathname, visitor: visitorId(ls) }));
    }
    return;
  }
  ss?.setItem(PAGE_AT_KEY, String(Date.now()));

  const params = new URLSearchParams(location.search);
  const src = params.get('src') || params.get('utm_source');
  const entry = !ss?.getItem(SESSION_KEY);
  const ref = entry ? externalRef() : null;

  // 새 꼬리표나 외부 경로로 들어오면 처음 경로를 갱신 (30일 지나면 새로)
  try {
    const prev = JSON.parse(ls?.getItem(ATTR_KEY) || 'null');
    const stale = !prev || Date.now() - prev.at > 30 * 864e5;
    if (stale || src || ref) {
      ls?.setItem(ATTR_KEY, JSON.stringify({ src, ref, landing: pathname, at: Date.now() }));
    }
  } catch { /* 저장소를 못 쓰면 이번 접수만 출처 없이 */ }

  const visitor = visitorId(ls);
  ss?.setItem(SESSION_KEY, '1');

  if (ls?.getItem(ADMIN_KEY)) return;
  // 받는 분 링크의 토큰은 통계에 남기지 않는다
  const path = pathname.startsWith('/gift/') ? '/gift' : pathname;
  send(JSON.stringify({ path, entry, src, ref, visitor }));
}

/** 접수할 때 함께 보낼 출처 정보 */
export function getAttribution(): Attribution {
  const ls = store('local');
  const ss = store('session');
  let a: { src?: string; ref?: string; landing?: string } = {};
  try {
    a = JSON.parse(ls?.getItem(ATTR_KEY) || '{}') ?? {};
  } catch { /* 없음 */ }
  const pageAt = Number(ss?.getItem(PAGE_AT_KEY));
  return {
    src: a.src ?? null,
    ref: a.ref ?? null,
    landing: a.landing ?? null,
    visitor: ls?.getItem(VISITOR_KEY) ?? null,
    elapsedSec: pageAt ? Math.round((Date.now() - pageAt) / 1000) : null,
  };
}
