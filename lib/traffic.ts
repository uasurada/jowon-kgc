// lib/traffic.ts — 유입 경로·기기·지역·진위 판별 (서버·관리자 화면 공용, 순수 함수만)

/** ?src= 꼬리표 → 표시 이름. QR·전단 등을 만들 때 여기에 추가한다 */
export const SRC_LABELS: Record<string, string> = {
  'qr-counter': 'QR · 계산대',
  'qr-bag': 'QR · 쇼핑백',
  'qr-card': 'QR · 명함',
  'naver-place': '네이버 플레이스',
  'kakao-channel': '카카오톡 채널',
  'karrot': '당근',
  'flyer': '전단·안내문',
  'naver-blog': '네이버 블로그',
};

const REF_RULES: [RegExp, string][] = [
  [/(^|\.)map\.naver\.com$|(^|\.)place\.naver\.com$|^m\.place\.naver\.com$/, '네이버 지도·플레이스'],
  [/(^|\.)search\.naver\.com$/, '네이버 검색'],
  [/(^|\.)blog\.naver\.com$|(^|\.)cafe\.naver\.com$/, '네이버 블로그·카페'],
  [/(^|\.)naver\.com$/, '네이버'],
  [/(^|\.)google\.[a-z.]+$/, '구글'],
  [/(^|\.)pf\.kakao\.com$/, '카카오톡 채널'],
  [/(^|\.)(daum\.net|kakao\.com)$/, '다음·카카오'],
  [/(^|\.)(instagram\.com|facebook\.com|fb\.com|threads\.net)$/, 'SNS (인스타·페북)'],
  [/(^|\.)band\.us$/, '밴드'],
  [/(^|\.)(daangn\.com|karrotmarket\.com)$/, '당근'],
  [/(^|\.)bing\.com$/, 'Bing'],
];

/** 처음 들어온 경로를 사람이 읽는 이름으로 */
export function classifySource(p: { src?: string | null; ref?: string | null; ua?: string | null }) {
  const src = p.src?.trim().toLowerCase();
  if (src) return SRC_LABELS[src] ?? `꼬리표 · ${src.slice(0, 30)}`;
  const host = refHost(p.ref);
  if (host) {
    for (const [re, label] of REF_RULES) if (re.test(host)) return label;
    return `기타 사이트 · ${host}`;
  }
  // 앱 안에서 링크를 누르면 주소 정보가 안 넘어오는 경우가 많다
  const ua = p.ua ?? '';
  if (/KAKAOTALK/i.test(ua)) return '카카오톡 (링크 공유)';
  if (/NAVER\(inapp/i.test(ua)) return '네이버 앱';
  if (/Instagram|FBAN|FBAV/i.test(ua)) return 'SNS 앱';
  if (/BAND\//i.test(ua)) return '밴드 앱';
  return '직접 방문 (주소 입력·즐겨찾기)';
}

export function refHost(ref?: string | null) {
  if (!ref) return null;
  try {
    const h = new URL(ref).hostname.replace(/^www\./, '');
    return /(^|\.)jowon-kgc\.com$|localhost|vercel\.app$/.test(h) ? null : h;
  } catch {
    return null;
  }
}

export function deviceOf(ua?: string | null) {
  const s = ua ?? '';
  if (/iPad|Tablet|SM-T|SM-X/i.test(s)) return '태블릿';
  if (/Mobi|Android|iPhone/i.test(s)) return '모바일';
  return s ? 'PC' : null;
}

export function isBotUa(ua?: string | null) {
  if (!ua) return true;
  return /bot|crawl|spider|slurp|scrap|preview|facebookexternalhit|headless|lighthouse|pingdom|uptime|yeti|daumoa|curl|wget|python|axios|node-fetch|go-http|java\//i.test(ua);
}

// Vercel이 주는 지역 코드(ISO 3166-2:KR) → 시·도
const KR_REGIONS: Record<string, string> = {
  '11': '서울', '26': '부산', '27': '대구', '28': '인천', '29': '광주', '30': '대전', '31': '울산',
  '50': '세종', '41': '경기', '42': '강원', '51': '강원', '43': '충북', '44': '충남',
  '45': '전북', '52': '전북', '46': '전남', '47': '경북', '48': '경남', '49': '제주',
};

export function regionName(country?: string | null, region?: string | null) {
  if (!country) return null;
  if (country !== 'KR') return `해외(${country})`;
  return (region && KR_REGIONS[region]) || '국내';
}

// Vercel이 주는 영문 도시명 → 한글 (없으면 영문 그대로)
const CITY_KO: Record<string, string> = {
  seoul: '서울', suwon: '수원', yongin: '용인', seongnam: '성남', hwaseong: '화성', anyang: '안양', ansan: '안산',
  bucheon: '부천', goyang: '고양', uijeongbu: '의정부', pyeongtaek: '평택', siheung: '시흥', gimpo: '김포',
  gwangmyeong: '광명', hanam: '하남', osan: '오산', gunpo: '군포', uiwang: '의왕', namyangju: '남양주', paju: '파주',
  icheon: '이천', anseong: '안성', gwacheon: '과천', guri: '구리', yangju: '양주', pocheon: '포천', dongducheon: '동두천',
  incheon: '인천', busan: '부산', daegu: '대구', daejeon: '대전', gwangju: '광주', ulsan: '울산', sejong: '세종',
  cheongju: '청주', cheonan: '천안', asan: '아산', jeonju: '전주', changwon: '창원', gimhae: '김해', pohang: '포항',
  gumi: '구미', chuncheon: '춘천', wonju: '원주', gangneung: '강릉', jeju: '제주', 'jeju city': '제주', seogwipo: '서귀포',
};

export function cityName(city?: string | null) {
  if (!city) return null;
  const key = city.toLowerCase().replace(/-(si|gun|gu)$/, '').trim();
  return CITY_KO[key] ?? city;
}

/** "경기 수원" 같은 짧은 지역 표시 */
export function placeLabel(r: { geo_country?: string | null; geo_region?: string | null; geo_city?: string | null }) {
  const region = regionName(r.geo_country, r.geo_region);
  if (!region) return null;
  const city = cityName(r.geo_city);
  return r.geo_country === 'KR' && city && city !== region ? `${region} ${city}` : region;
}

export type TrustLevel = 'ok' | 'warn' | 'bot';

/** 전화번호가 형식상 말이 안 되거나 장난 번호처럼 보이면 true */
export function suspiciousPhone(phone?: string | null) {
  const d = String(phone ?? '').replace(/\D/g, '');
  const valid = /^01[016789]\d{7,8}$/.test(d) || /^0(2|[3-6][1-5]|70)\d{7,8}$/.test(d);
  return !valid || /(\d)\1{6,}/.test(d) || /12345678|98765432/.test(d);
}

export const TRUST_LABEL: Record<TrustLevel, string> = {
  ok: '✅ 정상 접수로 보임',
  warn: '⚠️ 확인 필요',
  bot: '🤖 자동 접수 의심',
};
