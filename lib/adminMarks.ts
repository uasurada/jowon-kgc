// lib/adminMarks.ts — 관리자 본인의 홈페이지 방문을 통계에서 빼기 위한 표시
import { sql } from './db';

/** 관리자로 확인된 브라우저(방문자 id)와 IP를 오늘 날짜로 기록한다 */
export async function markAdmin(visitor: string | null, ipHash: string | null) {
  if (!sql) return;
  await sql`
    INSERT INTO admin_marks (kind, value, day)
    SELECT kind, value, (now() AT TIME ZONE 'Asia/Seoul')::date
    FROM (VALUES ('visitor', ${visitor}::text), ('ip', ${ipHash}::text)) AS v(kind, value)
    WHERE value IS NOT NULL AND value <> ''
    ON CONFLICT DO NOTHING
  `;
  if (Math.random() < 0.01) await sql`DELETE FROM admin_marks WHERE day < current_date - 400`;
}

/**
 * page_views 한 줄이 관리자 방문이면 참. 브라우저는 날짜와 관계없이,
 * IP는 휴대폰처럼 여러 사람이 나눠 쓰는 경우를 생각해 관리자 접속 앞뒤 7일만 본다.
 */
export const IS_ADMIN_VIEW = `EXISTS (
  SELECT 1 FROM admin_marks m
  WHERE (m.kind = 'visitor' AND m.value = page_views.visitor)
     OR (m.kind = 'ip' AND m.value = page_views.ip_hash
         AND m.day BETWEEN (page_views.created_at AT TIME ZONE 'Asia/Seoul')::date - 7
                       AND (page_views.created_at AT TIME ZONE 'Asia/Seoul')::date + 7)
)`;
