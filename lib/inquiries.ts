import { sql } from './db';

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
}

export interface BusinessInquiry {
  type: 'business';
  name: string;
  phone: string;
  email?: string;
  company_name: string;
  purpose: string;
  quantity: string;
  budget_per_unit: string;
  delivery_type: string;
  desired_date?: string | null;
  message?: string;
  privacy_consent?: boolean;
  privacy_consent_at?: string;
}

export type Inquiry = PersonalInquiry | BusinessInquiry;

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

export async function saveInquiry(inquiry: Inquiry) {
  const db = requireDb();
  // 개인/기업 필드를 한 번에 다루기 위해 type을 제외한 필드를 합친 형태로 본다
  const i = inquiry as { type: Inquiry['type'] } & Partial<
    Omit<PersonalInquiry, 'type'> & Omit<BusinessInquiry, 'type'>
  >;

  const rows = await db`
    INSERT INTO inquiries (
      type, name, phone, email, company_name, gift_type, purpose,
      budget, budget_per_unit, quantity, delivery_type, desired_date,
      message, privacy_consent, privacy_consent_at
    ) VALUES (
      ${i.type}, ${i.name ?? null}, ${i.phone ?? null}, ${i.email ?? null},
      ${i.company_name ?? null}, ${i.gift_type ?? null}, ${i.purpose ?? null},
      ${i.budget ?? null}, ${i.budget_per_unit ?? null}, ${i.quantity ?? null},
      ${i.delivery_type ?? null}, ${i.desired_date ?? null}, ${i.message ?? null},
      ${i.privacy_consent ?? false}, ${i.privacy_consent_at ?? null}
    )
    RETURNING id
  `;

  return rows[0] as { id: string };
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
    ];
    // 전화번호는 하이픈/공백 차이를 무시하고 숫자로 비교
    if (digits.length >= 3) {
      parts.push(`regexp_replace(phone, '\\D', '', 'g') LIKE ${p(`%${digits}%`)}`);
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
    db.query(
      `SELECT * FROM inquiries ${where} ORDER BY created_at DESC LIMIT ${lim} OFFSET ${off}`,
      params
    ),
    db.query(`SELECT count(*)::int AS n FROM inquiries ${where}`, params),
  ]);

  return { rows, total: (countRows[0]?.n as number) ?? 0 };
}

export async function updateInquiry(id: string, patch: { status?: string; memo?: string | null }) {
  const db = requireDb();

  if (patch.status !== undefined && !(INQUIRY_STATUSES as readonly string[]).includes(patch.status)) {
    throw new Error('invalid status');
  }

  const rows = await db`
    UPDATE inquiries SET
      status = COALESCE(${patch.status ?? null}::text, status),
      memo = CASE WHEN ${patch.memo !== undefined}::boolean THEN ${patch.memo ?? null}::text ELSE memo END,
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;

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
      count(i.id) FILTER (WHERE i.status = 'pending')::int AS pending
    FROM k LEFT JOIN inquiries i ON true
  `;

  const recent30 = await db`
    SELECT type, gift_type, purpose, budget, budget_per_unit
    FROM inquiries
    WHERE created_at >= now() - interval '30 days'
  `;

  return { stats: counts, recent30 };
}
