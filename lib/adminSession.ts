// lib/adminSession.ts — 관리자 로그인 유지용 서명 쿠키 (proxy.ts / 로그인 API 공용)

export const ADMIN_COOKIE = 'admin_session';
export const SESSION_DAYS = 30;
export const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60; // 초

const encoder = new TextEncoder();

function credentials() {
  return {
    user: process.env.ADMIN_BASIC_USER || 'admin',
    pass: process.env.ADMIN_BASIC_PASS || '',
  };
}

// 서명 키는 관리자 계정 정보에서 만든다 → 비밀번호를 바꾸면 기존 로그인은 모두 무효
async function signingKey() {
  const { user, pass } = credentials();
  const secret = process.env.ADMIN_SESSION_SECRET || `${user}:${pass}`;
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string) {
  if (!/^[0-9a-f]+$/.test(hex) || hex.length % 2) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

/** 길이가 달라도 시간이 새지 않도록 비교 */
function safeEqual(a: string, b: string) {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

export function checkCredentials(user: string, pass: string) {
  const c = credentials();
  // 비밀번호 env가 비어있으면 안전상 무조건 거부
  if (!c.pass) return false;
  return safeEqual(user, c.user) && safeEqual(pass, c.pass);
}

export async function createSessionToken() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const sig = await crypto.subtle.sign('HMAC', await signingKey(), encoder.encode(String(exp)));
  return `${exp}.${toHex(sig)}`;
}

export async function verifySessionToken(token: string | undefined) {
  if (!token || !credentials().pass) return false;
  const [expStr, sigHex] = token.split('.');
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now() / 1000) return false;
  const sig = fromHex(sigHex ?? '');
  if (!sig) return false;
  return crypto.subtle.verify('HMAC', await signingKey(), sig, encoder.encode(expStr));
}

/** 스크립트/점검용: Authorization: Basic 헤더도 계속 허용 (브라우저 팝업은 띄우지 않음) */
export function checkBasicHeader(header: string | null) {
  if (!header?.startsWith('Basic ')) return false;
  let decoded = '';
  try {
    decoded = Buffer.from(header.slice('Basic '.length), 'base64').toString('utf8');
  } catch {
    return false;
  }
  // 비밀번호에 ':'가 들어가도 동작하도록 첫 번째 ':'에서만 분리
  const sep = decoded.indexOf(':');
  if (sep < 0) return false;
  return checkCredentials(decoded.slice(0, sep), decoded.slice(sep + 1));
}

/** 로그인 쿠키 또는 Basic 헤더가 유효한지 (proxy와 각 관리자 API에서 같이 사용) */
export async function isAdminRequest(req: {
  cookies: { get(name: string): { value: string } | undefined };
  headers: Headers;
}) {
  return (
    (await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) ||
    checkBasicHeader(req.headers.get('authorization'))
  );
}
