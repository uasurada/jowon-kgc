// lib/retention.ts — 개인정보 보유 기간(마지막 상담·주문일로부터 1년) 경과분 파기
import { sql } from './db';

export const RETENTION = '1 year';

/**
 * 같은 전화번호(숫자만 비교)의 가장 최근 상담·주문이 1년 넘게 지난 건의 개인정보를 지운다.
 * 날짜·구분·예산·유입 경로 등 통계용 정보는 익명으로 남긴다. 몇 번을 실행해도 결과는 같다.
 */
export async function purgeExpiredPersonalData() {
  if (!sql) throw new Error('DATABASE_URL is not configured');
  const rows = await sql`
    WITH last AS (
      SELECT regexp_replace(coalesce(phone, ''), '\\D', '', 'g') AS digits,
             max(greatest(created_at, updated_at)) AS last_at
      FROM inquiries
      WHERE anonymized_at IS NULL
      GROUP BY 1
    )
    UPDATE inquiries i SET
      name = NULL, phone = NULL, email = NULL, job_title = NULL,
      message = NULL, memo = NULL,
      recipient_name = NULL, recipient_phone = NULL, recipient_address = NULL, sender_label = NULL,
      card_message = NULL, gift_token = NULL, ip_hash = NULL, visitor = NULL,
      anonymized_at = now()
    FROM last
    WHERE i.anonymized_at IS NULL
      AND regexp_replace(coalesce(i.phone, ''), '\\D', '', 'g') = last.digits
      -- 번호가 없는 건은 묶지 않고 건별 날짜로 본다
      AND (CASE WHEN last.digits = '' THEN greatest(i.created_at, i.updated_at) ELSE last.last_at END)
          < now() - ${RETENTION}::interval
    RETURNING i.id
  `;
  return rows.length;
}
