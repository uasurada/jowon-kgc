// lib/requestMeta.ts — 요청 헤더에서 기기·지역(IP 추정)·IP 해시를 뽑는다 (서버 전용)
import type { NextRequest } from 'next/server';
import { deviceOf } from './traffic';

async function sha256Hex(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function getRequestMeta(req: NextRequest) {
  const h = req.headers;
  const ua = h.get('user-agent') ?? '';
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || h.get('x-real-ip') || '';
  const city = h.get('x-vercel-ip-city');
  const salt = process.env.ADMIN_SESSION_SECRET || process.env.DATABASE_URL || 'jowon-kgc';
  return {
    ua,
    device: deviceOf(ua),
    // Vercel이 IP로 추정한 위치. 로컬 개발에서는 비어 있다
    country: h.get('x-vercel-ip-country'),
    region: h.get('x-vercel-ip-country-region'),
    city: city ? decodeURIComponent(city) : null,
    // 같은 기기 반복 접수 판별용. IP 원문은 남기지 않는다
    ipHash: ip ? (await sha256Hex(`${salt}|${ip}`)).slice(0, 16) : null,
  };
}
