import { sql } from './db';
import type { PhoneHistory } from './emailCheck';
import { GIFT_LINK_DAYS } from './gift';

/* ======================
   타입 정의
====================== */

export interface PersonalInquiry {
  type: 'personal';
  name: string;
  phone: string;
  gift_type: string;
  budget: string;
  quantity: string;
  message?: string;
  privacy_consent?: boolean;
  privacy_consent_at?: string;
  // 선물로 보내기
  gift_send?: boolean;
  recipient_name?: string | null;
  recipient_phone?: string | null;
  sender_label?: string | null;
  recipient_address?: string | null;
}

export interface BusinessInquiry {
  type: 'business';
  name: string;
  phone: string;
  email: string;
  company_name: string;
  org_type: string;
  department: string;
  job_title?: string | null;
  purpose: string;
  quantity: string;
  budget_per_unit: string;
  delivery_type: string;
  desired_date?: string | null;
  message?: string;
  privacy_consent?: boolean;
  privacy_consent_at?: string;
}

/** 접수 출처·진위 (개인·기업 공통, 서버에서 채운다) */
export interface TrackFields {
  source?: string | null;
  referrer?: string | null;
  landing?: string | null;
  device?: string | null;
  geo_country?: string | null;
  geo_region?: string | null;
  geo_city?: string | null;
  ip_hash?: string | null;
  visitor?: string | null;
  elapsed_sec?: number | null;
  risk_level?: string | null;
  risk_flags?: string | null;
}

export type Inquiry = (PersonalInquiry | BusinessInquiry) & TrackFields;

export const INQUIRY_STATUSES = ['pending', 'contacted', 'completed', 'canceled'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export interface InquiryFilter {
  q?: string;          // 이름/기관명/전화번호/요청사항/메모 검색
  type?: string;       // personal | business
  status?: string;
  from?: string;       // YYYY-MM-DD (KST)
  to?: string;         // YYYY-MM-DD (KST, 해당일 포함)
}

function requireDb() {
  if (!sql) throw new Error('DATABASE_URL is not configured');
  return sql;
}

/* ======================
   DB 저장 함수
====================== */

/** 받는 분 링크용 무작위 토큰 (144비트, URL 안전) */
function newGiftToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_');
}

export async function saveInquiry(inquiry: Inquiry) {
  const db = requireDb();
  // 개인/기업 필드를 한 번에 다루기 위해 type을 제외한 필드를 합친 형태로 본다
  const i = inquiry as { type: Inquiry['type'] } & TrackFields & Partial<
    Omit<PersonalInquiry, 'type'> & Omit<BusinessInquiry, 'type'>
  >;

  // 주소를 모르는 선물만 받는 분 입력 링크를 만든다
  const token = i.gift_send && !i.recipient_address ? newGiftToken() : null;

  const rows = await db`
    INSERT INTO inquiries (
      type, name, phone, email, company_name, org_type, department, job_title,
      gift_type, purpose,
      budget, budget_per_unit, quantity, delivery_type, desired_date,
      message, privacy_consent, privacy_consent_at,
      gift_send, recipient_name, recipient_phone, sender_label, recipient_address,
      gift_token, gift_address_by, gift_address_at,
      source, referrer, landing, device, geo_country, geo_region, geo_city,
      ip_hash, visitor, elapsed_sec, risk_level, risk_flags
    ) VALUES (
      ${i.type}, ${i.name ?? null}, ${i.phone ?? null}, ${i.email ?? null},
      ${i.company_name ?? null}, ${i.org_type ?? null}, ${i.department ?? null}, ${i.job_title ?? null},
      ${i.gift_type ?? null}, ${i.purpose ?? null},
      ${i.budget ?? null}, ${i.budget_per_unit ?? null}, ${i.quantity ?? null},
      ${i.delivery_type ?? null}, ${i.desired_date ?? null}, ${i.message ?? null},
      ${i.privacy_consent ?? false}, ${i.privacy_consent_at ?? null},
      ${i.gift_send ?? false}, ${i.recipient_name ?? null}, ${i.recipient_phone ?? null},
      ${i.sender_label ?? null}, ${i.recipient_address ?? null},
      ${token}, ${i.recipient_address ? 'buyer' : null}, ${i.recipient_address ? new Date().toISOString() : null},
      ${i.source ?? null}, ${i.referrer ?? null}, ${i.landing ?? null}, ${i.device ?? null},
      ${i.geo_country ?? null}, ${i.geo_region ?? null}, ${i.geo_city ?? null},
      ${i.ip_hash ?? null}, ${i.visitor ?? null}, ${i.elapsed_sec ?? null}, ${i.risk_level ?? null}, ${i.risk_flags ?? null}
    )
    RETURNING id, gift_token
  `;

  return rows[0] as { id: string; gift_token: string | null };
}

/** 같은 IP(해시)로 최근 24시간 동안 들어온 접수 수 */
export async function countRecentByIp(ipHash: string) {
  const db = requireDb();
  const [row] = await db`
    SELECT count(*)::int AS n FROM inquiries
    WHERE ip_hash = ${ipHash} AND created_at > now() - interval '24 hours'
  `;
  return (row?.n as number) ?? 0;
}

/** 같은 전화번호(숫자만 비교)로 들어온 기존 접수 수. excludeId는 방금 저장한 건 */
export async function getPhoneHistory(phone: string, excludeId?: string | number | null): Promise<PhoneHistory> {
  const db = requireDb();
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.length < 8) return { prev: 0, completed: 0, canceled: 0 };

  const [row] = await db`
    SELECT
      count(*)::int AS prev,
      count(*) FILTER (WHERE status = 'completed')::int AS completed,
      count(*) FILTER (WHERE status = 'canceled')::int AS canceled
    FROM inquiries
    WHERE regexp_replace(phone, '\\D', '', 'g') = ${digits}
      AND id <> ${excludeId ?? -1}
  `;
  return row as PhoneHistory;
}

/* ======================
   관리자 조회/수정
====================== */

function buildWhere(f: InquiryFilter) {
  const conds: string[] = [];
  const params: unknown[] = [];
  const p = (v: unknown) => {
    params.push(v);
    return `$${params.length}`;
  };

  if (f.q?.trim()) {
    const q = f.q.trim();
    const digits = q.replace(/\D/g, '');
    const like = p(`%${q}%`);
    const parts = [
      `name ILIKE ${like}`,
      `company_name ILIKE ${like}`,
      `message ILIKE ${like}`,
      `memo ILIKE ${like}`,
      `email ILIKE ${like}`,
      `department ILIKE ${like}`,
      `recipient_name ILIKE ${like}`,
    ];
    // 전화번호는 하이픈/공백 차이를 무시하고 숫자로 비교 (받는 분 번호 포함)
    if (digits.length >= 3) {
      const d = p(`%${digits}%`);
      parts.push(`regexp_replace(phone, '\\D', '', 'g') LIKE ${d}`);
      parts.push(`regexp_replace(coalesce(recipient_phone, ''), '\\D', '', 'g') LIKE ${d}`);
    }
    conds.push(`(${parts.join(' OR ')})`);
  }
  if (f.type === 'personal' || f.type === 'business') conds.push(`type = ${p(f.type)}`);
  if (f.status && (INQUIRY_STATUSES as readonly string[]).includes(f.status)) {
    conds.push(`status = ${p(f.status)}`);
  }
  if (f.from && /^\d{4}-\d{2}-\d{2}$/.test(f.from)) {
    // date를 timestamp(시간대 없음)로 만든 뒤 KST로 해석해야 한국 자정 기준이 된다
    conds.push(`created_at >= (${p(f.from)}::date::timestamp AT TIME ZONE 'Asia/Seoul')`);
  }
  if (f.to && /^\d{4}-\d{2}-\d{2}$/.test(f.to)) {
    conds.push(`created_at < ((${p(f.to)}::date + 1)::timestamp AT TIME ZONE 'Asia/Seoul')`);
  }

  return { where: conds.length ? `WHERE ${conds.join(' AND ')}` : '', params };
}

export async function listInquiries(f: InquiryFilter, limit = 30, offset = 0) {
  const db = requireDb();
  const { where, params } = buildWhere(f);
  const lim = Math.min(Math.max(Math.trunc(limit) || 30, 1), 5000);
  const off = Math.max(Math.trunc(offset) || 0, 0);

  const [rows, countRows] = await Promise.all([
    // h: 같은 번호로 이 건보다 먼저 들어온 접수 (첫 접수/재접수 표시용)
    db.query(
      `SELECT i.*, h.prev, h.completed, h.canceled
       FROM (SELECT * FROM inquiries ${where} ORDER BY created_at DESC LIMIT ${lim} OFFSET ${off}) i
       LEFT JOIN LATERAL (
         SELECT count(*)::int AS prev,
                count(*) FILTER (WHERE j.status = 'completed')::int AS completed,
                count(*) FILTER (WHERE j.status = 'canceled')::int AS canceled
         FROM inquiries j
         WHERE regexp_replace(j.phone, '\\D', '', 'g') = regexp_replace(i.phone, '\\D', '', 'g')
           AND j.created_at < i.created_at
       ) h ON true
       ORDER BY i.created_at DESC`,
      params
    ),
    db.query(`SELECT count(*)::int AS n FROM inquiries ${where}`, params),
  ]);

  return { rows, total: (countRows[0]?.n as number) ?? 0 };
}

export async function updateInquiry(
  id: string,
  patch: { status?: string; memo?: string | null; recipient_address?: string | null }
) {
  const db = requireDb();

  if (patch.status !== undefined && !(INQUIRY_STATUSES as readonly string[]).includes(patch.status)) {
    throw new Error('invalid status');
  }

  // 매장이 전화·문자로 받은 주소를 직접 입력하는 경우
  const setAddress = patch.recipient_address !== undefined;

  const rows = await db`
    UPDATE inquiries SET
      status = COALESCE(${patch.status ?? null}::text, status),
      memo = CASE WHEN ${patch.memo !== undefined}::boolean THEN ${patch.memo ?? null}::text ELSE memo END,
      recipient_address = CASE WHEN ${setAddress}::boolean THEN ${patch.recipient_address ?? null}::text ELSE recipient_address END,
      gift_address_by = CASE WHEN ${setAddress}::boolean
        THEN (CASE WHEN ${patch.recipient_address ?? null}::text IS NULL THEN NULL ELSE 'store' END)
        ELSE gift_address_by END,
      gift_address_at = CASE WHEN ${setAddress}::boolean
        THEN (CASE WHEN ${patch.recipient_address ?? null}::text IS NULL THEN NULL ELSE now() END)
        ELSE gift_address_at END,
      -- 사양했던 분이 나중에 전화로 주소를 준 경우
      gift_declined_at = CASE WHEN ${Boolean(patch.recipient_address)}::boolean THEN NULL ELSE gift_declined_at END,
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;

  return rows[0] ?? null;
}

/* ======================
   받는 분 주소 입력 (/gift/[token], 로그인 없음)
====================== */

export type GiftState = 'open' | 'done' | 'declined' | 'closed';

export interface GiftView {
  state: GiftState;
  recipientName: string | null;
  senderLabel: string;
}

// 링크가 살아 있는 조건: 미완료·미취소 + 접수 후 GIFT_LINK_DAYS일 이내
const giftOpenSql = (t = '') =>
  `${t}status NOT IN ('completed', 'canceled') AND ${t}created_at > now() - make_interval(days => ${GIFT_LINK_DAYS})`;

export function isGiftToken(token: string) {
  return /^[A-Za-z0-9_-]{24}$/.test(token);
}

/** 받는 분 화면용. 주소·연락처 등은 돌려주지 않는다 */
export async function getGiftView(token: string): Promise<GiftView | null> {
  if (!isGiftToken(token)) return null;
  const db = requireDb();
  const rows = await db.query(
    `SELECT recipient_name, sender_label, name, gift_address_by, gift_declined_at, (${giftOpenSql()}) AS open
     FROM inquiries WHERE gift_token = $1`,
    [token]
  );
  const r = rows[0];
  if (!r) return null;
  const state: GiftState = !r.open ? 'closed'
    : r.gift_declined_at ? 'declined'
    : r.gift_address_by ? 'done'
    : 'open';
  return {
    state,
    recipientName: r.recipient_name ?? null,
    senderLabel: r.sender_label?.trim() || r.name?.trim() || '지인',
  };
}

/** 받는 분이 주소 입력(또는 수정). 링크가 닫혔으면 null */
export async function submitGiftAddress(token: string, address: string) {
  if (!isGiftToken(token)) return null;
  const db = requireDb();
  // 이미 입력된 주소가 바뀌면 알림에 이전 주소를 함께 보여주려고 같이 돌려받는다
  const rows = await db.query(
    `WITH prev AS (SELECT id, recipient_address FROM inquiries WHERE gift_token = $1)
     UPDATE inquiries i SET
       recipient_address = $2, gift_address_by = 'recipient', gift_address_at = now(),
       gift_declined_at = NULL, updated_at = now()
     FROM prev
     WHERE i.id = prev.id AND ${giftOpenSql('i.')}
     RETURNING i.id, i.name, i.recipient_name, i.recipient_phone, i.sender_label, i.recipient_address,
               prev.recipient_address AS prev_address`,
    [token, address]
  );
  return rows[0] ?? null;
}

/** 받는 분이 선물을 사양. 링크가 닫혔으면 null */
export async function declineGift(token: string) {
  if (!isGiftToken(token)) return null;
  const db = requireDb();
  const rows = await db.query(
    `UPDATE inquiries SET gift_declined_at = now(), updated_at = now()
     WHERE gift_token = $1 AND ${giftOpenSql()}
     RETURNING id, name, phone, recipient_name, recipient_phone`,
    [token]
  );
  return rows[0] ?? null;
}

export async function getDashboardStats() {
  const db = requireDb();

  // 오늘/이번 주(월요일 시작)/이번 달은 한국 시간 기준
  const [counts] = await db`
    WITH k AS (SELECT (now() AT TIME ZONE 'Asia/Seoul') AS t)
    SELECT
      count(i.id) FILTER (WHERE i.created_at >= (date_trunc('day',   k.t) AT TIME ZONE 'Asia/Seoul'))::int AS today,
      count(i.id) FILTER (WHERE i.created_at >= (date_trunc('week',  k.t) AT TIME ZONE 'Asia/Seoul'))::int AS week,
      count(i.id) FILTER (WHERE i.created_at >= (date_trunc('month', k.t) AT TIME ZONE 'Asia/Seoul'))::int AS month,
      count(i.id)::int AS total,
      count(i.id) FILTER (WHERE i.status = 'pending')::int AS pending,
      count(i.id) FILTER (WHERE i.anonymized_at IS NOT NULL)::int AS anonymized
    FROM k LEFT JOIN inquiries i ON true
  `;

  const recent30 = await db`
    SELECT type, gift_type, purpose, budget, budget_per_unit
    FROM inquiries
    WHERE created_at >= now() - interval '30 days'
  `;

  return { stats: counts, recent30 };
}
