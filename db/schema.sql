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
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS card_message    TEXT;  -- 현재 미사용 (카드 메시지 기능 제외)
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS recipient_address TEXT;  -- 구매자가 주소를 아는 경우만. 비어 있으면 매장이 받는 분께 문의

-- 같은 번호 재접수 조회 (하이픈 차이 무시)
CREATE INDEX IF NOT EXISTS inquiries_phone_digits_idx ON inquiries (regexp_replace(phone, '\D', '', 'g'));

-- 받는 분 주소 직접 입력 링크 (/gift/[token]) — 문자로 링크를 보내고, 나중에 알림톡으로 교체 (2026-11)
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS gift_token       TEXT UNIQUE;  -- 추측 불가한 무작위 값
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS gift_address_by  TEXT;         -- buyer(구매자) / recipient(받는 분) / store(매장 직접 입력)
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS gift_address_at  TIMESTAMPTZ;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS gift_declined_at TIMESTAMPTZ;  -- 받는 분이 선물을 사양한 시각

-- 접수 출처·진위 판별 (2026-11)
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS source      TEXT;  -- 유입 경로 (네이버 검색, QR·쇼핑백 등)
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS referrer    TEXT;  -- 처음 들어온 외부 주소의 도메인
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS landing     TEXT;  -- 처음 들어온 페이지
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS device      TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS geo_country TEXT;  -- IP 기반 추정 (통신사 사정상 실제와 다를 수 있음)
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS geo_region  TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS geo_city    TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS ip_hash     TEXT;  -- IP 원문은 저장하지 않는다
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS visitor     TEXT;  -- 브라우저별 무작위 방문자 id
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS elapsed_sec INT;   -- 페이지를 연 뒤 접수까지 걸린 시간
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS risk_level  TEXT;  -- ok / warn / bot
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS risk_flags  TEXT;
CREATE INDEX IF NOT EXISTS inquiries_ip_hash_idx ON inquiries (ip_hash, created_at);

-- 홈페이지 접속 통계 (관리자 화면용, 쿠키 없이 브라우저 저장소의 무작위 id만 사용)
CREATE TABLE IF NOT EXISTS page_views (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  path        TEXT NOT NULL,
  entry       BOOLEAN NOT NULL DEFAULT false,  -- 방문(세션)의 첫 페이지
  source      TEXT,
  device      TEXT,
  geo_country TEXT,
  geo_region  TEXT,
  geo_city    TEXT,
  visitor     TEXT
);
CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views (created_at);
