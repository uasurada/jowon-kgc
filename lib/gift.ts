// lib/gift.ts — 개인 "선물로 보내기" (텔레그램·관리자 화면·받는 분 페이지 공용)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jowon-kgc.com';

/** 받는 분 주소 입력 링크 유효 기간 (접수일 기준) */
export const GIFT_LINK_DAYS = 14;

export function giftLink(token: string) {
  return `${SITE_URL}/gift/${token}`;
}

/** "(12345) 도로명주소 상세주소" 한 줄 */
export function formatAddress(zipcode: unknown, address1: unknown, address2: unknown) {
  const zip = String(zipcode ?? '').trim();
  return [zip && `(${zip})`, String(address1 ?? '').trim(), String(address2 ?? '').trim()]
    .filter(Boolean)
    .join(' ')
    .slice(0, 300);
}

/** 받는 분께 처음 보낼 안내 문자. 링크로 직접 입력하거나, 어려우면 매장 휴대폰으로 회신 */
export function giftSmsText(p: {
  recipientName?: string | null;
  senderLabel?: string | null;
  buyerName?: string | null;
  token?: string | null;
}) {
  const to = p.recipientName?.trim() ? `${p.recipientName.trim()}님, ` : '';
  const from = (p.senderLabel?.trim() || p.buyerName?.trim() || '지인');
  const head = `[정관장 조원점] 안녕하세요, ${to}${from}님께서 보내신 정관장 선물이 준비되었습니다.\n`;
  const tail = `문의: 정관장 조원점 031-268-0304`;
  if (!p.token) {
    return head + `받으실 주소(받는 분 성함·연락처 포함)를 이 번호로 회신해 주시면 정성껏 포장해 보내드리겠습니다.\n` + tail;
  }
  return (
    head +
    `아래 링크에서 받으실 주소를 입력해 주시면 정성껏 포장해 보내드리겠습니다.\n` +
    `${giftLink(p.token)}\n` +
    `입력이 어려우시면 이 번호로 주소를 회신해 주셔도 됩니다.\n` +
    tail
  );
}
