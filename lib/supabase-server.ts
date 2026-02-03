import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('SUPABASE_URL (server):', url);
console.log('SERVICE_ROLE exists:', !!key);
console.log('SERVICE_ROLE prefix:', key?.slice(0, 10)); // sb_secret_ 로 찍혀야 함

if (!url) throw new Error('SUPABASE_URL is missing');
if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');

export const supabaseServer = createClient(url, key);
