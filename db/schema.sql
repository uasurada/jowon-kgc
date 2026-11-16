-- 상담/주문 접수 (Neon Postgres)
CREATE TABLE IF NOT EXISTS inquiries (
  id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  type               TEXT NOT NULL CHECK (type IN ('personal', 'business')),
  name               TEXT,
  phone              TEXT,
  email              TEXT,
  company_name       TEXT,
  gift_type          TEXT,   -- 개인: parents/baby/...
  purpose            TEXT,   -- 기업: employee/client/...
  budget             TEXT,
  budget_per_unit    TEXT,
  quantity           TEXT,
  delivery_type      TEXT,
  desired_date       TEXT,
  message            TEXT,
  privacy_consent    BOOLEAN NOT NULL DEFAULT false,
  privacy_consent_at TIMESTAMPTZ,
  status             TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'contacted', 'completed', 'canceled')),
  memo               TEXT,
  legacy_id          TEXT UNIQUE  -- Supabase에서 옮겨온 레코드의 원래 id
);

CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_phone_idx ON inquiries (phone);

-- 기업 주문 사칭 방지용 (2026-11)
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS org_type   TEXT;  -- 기업/공공기관/학교·병원·단체
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS job_title  TEXT;

-- 개인 선물 보내기: 받는 분 전화번호만으로 매장이 연락해 배송지를 받는다 (2026-11)
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS gift_send       BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS recipient_name  TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS recipient_phone TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS sender_label    TEXT;  -- 받는 분께 안내할 보내는 분 이름
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS card_message    TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS recipient_address TEXT;  -- 구매자가 주소를 아는 경우만. 비어 있으면 매장이 받는 분께 문의

-- 같은 번호 재접수 조회 (하이픈 차이 무시)
CREATE INDEX IF NOT EXISTS inquiries_phone_digits_idx ON inquiries (regexp_replace(phone, '\D', '', 'g'));
