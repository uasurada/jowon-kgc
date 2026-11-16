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
