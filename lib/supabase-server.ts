import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Telegram-only fallback deployments may intentionally omit Supabase settings.
export const supabaseServer = url && key ? createClient(url, key) : null;
