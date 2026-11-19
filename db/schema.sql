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

-- 관리자 로그인 시도 기록 (무차별 대입 차단, 30일 지나면 정리)
CREATE TABLE IF NOT EXISTS login_attempts (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash    TEXT,
  ok         BOOLEAN NOT NULL
);
CREATE INDEX IF NOT EXISTS login_attempts_created_at_idx ON login_attempts (created_at);

-- 개인정보 자동 파기: 같은 번호의 마지막 상담·주문 후 1년 지나면 개인정보만 지우고 통계용 정보는 남긴다 (2026-11)
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS anonymized_at TIMESTAMPTZ;

-- 관리자 본인 방문은 통계에서 뺀다 (2026-11)
-- visitor: 관리자로 로그인한 브라우저의 방문자 id (이전 방문까지 모두 제외)
-- ip: 관리자로 접속한 IP(해시)와 날짜. 휴대폰 IP는 여러 사람이 나눠 쓰므로 앞뒤 7일만 제외
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS ip_hash TEXT;
CREATE TABLE IF NOT EXISTS admin_marks (
  kind  TEXT NOT NULL,  -- visitor / ip
  value TEXT NOT NULL,
  day   DATE NOT NULL,
  PRIMARY KEY (kind, value, day)
);

-- 제품 안내·맞춤 추천 (2026-11). 처음 목록은 2026 추석 카탈로그에서 가져와 db/seed-products.mjs로 넣는다
CREATE TABLE IF NOT EXISTS products (
  id          TEXT PRIMARY KEY,               -- 주소에 쓰는 영문 id (예: everytime)
  name        TEXT NOT NULL,
  cat         TEXT NOT NULL,                  -- 카탈로그 분류
  badge       TEXT,                           -- PREMIUM / BEST / NEW
  kind        TEXT,                           -- 건강기능식품 / 일반식품
  form        TEXT,                           -- 스틱 / 파우치 / 농축액(병) ...
  opts        JSONB NOT NULL DEFAULT '[]',    -- [["30포", 107000], ...] 구성별 정가
  spec        TEXT,
  descr       TEXT,                           -- 본사 공식 설명
  tags        TEXT[] NOT NULL DEFAULT '{}',   -- 추천 대상 (parents, worker ...)
  who         TEXT,                           -- 고객에게 보이는 추천 한 줄
  age_min     INT,
  age_max     INT,
  visible     BOOLEAN NOT NULL DEFAULT true,  -- 홈페이지 노출
  featured    BOOLEAN NOT NULL DEFAULT false, -- 매장 추천 (추천 결과 위쪽, 배지 표시)
  sort        INT NOT NULL DEFAULT 0,
  image       TEXT,                           -- 기본 이미지 (public 경로)
  image_data  BYTEA,                          -- 관리자가 올린 이미지가 있으면 이것을 쓴다
  image_type  TEXT,
  image_ver   INT NOT NULL DEFAULT 0,
  src         TEXT,                           -- 추천 대상 근거: catalog / kgcshop / draft / store
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS products_sort_idx ON products (sort);

-- 홈페이지 설정 (가격 표시 방식, 행사 안내 등)
CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
