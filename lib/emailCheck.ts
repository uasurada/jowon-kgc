// lib/emailCheck.ts — 기업 주문 이메일 도메인 판별 (서버·관리자 화면 공용)

export const ORG_TYPES = ['기업', '공공기관', '학교·병원·단체'] as const;

export type EmailKind = 'gov' | 'school' | 'org' | 'company' | 'free' | 'lookalike' | 'invalid';
export type RiskLevel = 'ok' | 'warn' | 'danger';

const EMAIL_RE = /^[^\s@]+@([a-z0-9-]+\.)+[a-z]{2,}$/i;

const GOV_SUFFIXES = ['go.kr', 'korea.kr', 'mil.kr'];
const SCHOOL_SUFFIXES = ['ac.kr', 'hs.kr', 'ms.kr', 'es.kr', 'sc.kr', 'kg.kr'];
const ORG_SUFFIXES = ['or.kr', 're.kr'];

// 누구나 바로 만들 수 있는 무료 메일
const FREE_DOMAINS = new Set([
  'gmail.com', 'naver.com', 'daum.net', 'hanmail.net', 'kakao.com', 'nate.com',
  'hotmail.com', 'outlook.com', 'outlook.kr', 'live.com', 'msn.com', 'yahoo.com', 'yahoo.co.kr',
  'icloud.com', 'me.com', 'empas.com', 'korea.com', 'chol.com', 'dreamwiz.com', 'paran.com',
  'proton.me', 'protonmail.com', 'qq.com', '163.com', 'mail.com', 'gmx.com', 'yandex.com',
]);

// go.kr / korea.kr 을 흉내 낸 도메인 (예: suwon-go-kr.com, go.kr.co, korea-kr.net)
const LOOKALIKE_RE = /(^|[.-])(go|gov|korea|mil)[-_.]?kr([.-]|$)|gokr|govkr/;

const endsWithSuffix = (domain: string, suffixes: string[]) =>
  suffixes.some((s) => domain === s || domain.endsWith(`.${s}`));

export function classifyEmail(email?: string | null): { kind: EmailKind; domain: string } {
  const e = String(email ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(e)) return { kind: 'invalid', domain: '' };
  const domain = e.split('@')[1];

  if (endsWithSuffix(domain, GOV_SUFFIXES)) return { kind: 'gov', domain };
  if (endsWithSuffix(domain, SCHOOL_SUFFIXES)) return { kind: 'school', domain };
  if (endsWithSuffix(domain, ORG_SUFFIXES)) return { kind: 'org', domain };
  if (FREE_DOMAINS.has(domain)) return { kind: 'free', domain };
  if (LOOKALIKE_RE.test(domain)) return { kind: 'lookalike', domain };
  return { kind: 'company', domain };
}

export function isValidEmail(email?: string | null) {
  return classifyEmail(email).kind !== 'invalid';
}

/** 텔레그램·관리자 화면에 보여줄 한 줄 판정 */
export function emailVerdict(email?: string | null, orgType?: string | null): { level: RiskLevel; label: string } {
  const { kind, domain } = classifyEmail(email);
  const isPublic = orgType === '공공기관';

  switch (kind) {
    case 'gov':
      return { level: 'ok', label: `✅ 공공기관 메일 (${domain})` };
    case 'school':
      return { level: 'ok', label: `✅ 교육기관 메일 (${domain})` };
    case 'org':
      return { level: 'ok', label: `✅ 기관·단체 메일 (${domain})` };
    case 'company':
      return isPublic
        ? { level: 'warn', label: `⚠️ 공공기관인데 go.kr 메일이 아님 (${domain}) — 기관 공식 도메인인지 확인` }
        : { level: 'ok', label: `🏢 회사 도메인 메일 (${domain})` };
    case 'free':
      return isPublic
        ? { level: 'danger', label: `🚨 공공기관이라면서 개인 메일 (${domain}) — 사칭 주의` }
        : { level: 'warn', label: `⚠️ 개인 메일 (${domain}) — 회사 확인 필요` };
    case 'lookalike':
      return { level: 'danger', label: `🚨 공공기관 사칭 의심 도메인 (${domain})` };
    default:
      return { level: 'danger', label: '🚨 이메일 없음/형식 오류' };
  }
}

/** 같은 전화번호의 이전 접수 이력 표시 (개인·기업 공통) */
export interface PhoneHistory {
  prev: number;       // 이 접수 이전의 같은 번호 접수 수
  completed: number;
  canceled: number;
}

export function historyLabel(h?: Partial<PhoneHistory> | null) {
  const prev = h?.prev ?? 0;
  if (!prev) return '🆕 첫 접수';
  const parts = [h?.completed ? `완료 ${h.completed}` : '', h?.canceled ? `취소 ${h.canceled}` : ''].filter(Boolean);
  const tag = h?.completed ? '⭐ 구매 이력 고객' : '🔁 재접수';
  return `${tag} · 이전 ${prev}건${parts.length ? ` (${parts.join(', ')})` : ''}`;
}
