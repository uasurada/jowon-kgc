// lib/contact.ts — 매장 연락처 (화면 곳곳의 전화·카톡 버튼이 같이 쓴다)

export const STORE_TEL = '031-268-0304';
export const TEL_HREF = `tel:${STORE_TEL}`;

/** 카카오톡 채널 소개 화면 (검색엔진 연결용) */
export const KAKAO_CHANNEL_URL = 'https://pf.kakao.com/_IrSRX';
/** 누르면 바로 1:1 채팅이 열린다 (소개 화면에서 '채팅'을 한 번 더 누를 필요 없음) */
export const KAKAO_CHAT_URL = `${KAKAO_CHANNEL_URL}/chat`;
