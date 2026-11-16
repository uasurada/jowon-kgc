// lib/gift.ts — 개인 "선물로 보내기" (텔레그램·관리자 화면 공용)

export const CARD_MESSAGE_MAX = 200;

/** 받는 분께 처음 보낼 안내 문자. 매장 휴대폰에서 보내므로 "이 번호로 회신" */
export function giftSmsText(p: { recipientName?: string | null; senderLabel?: string | null; buyerName?: string | null }) {
  const to = p.recipientName?.trim() ? `${p.recipientName.trim()}님, ` : '';
  const from = (p.senderLabel?.trim() || p.buyerName?.trim() || '지인');
  return (
    `[정관장 조원점] 안녕하세요, ${to}${from}님께서 보내신 정관장 선물이 준비되었습니다.\n` +
    `받으실 주소(받는 분 성함·연락처 포함)를 이 번호로 회신해 주시면 정성껏 포장해 보내드리겠습니다.\n` +
    `문의: 정관장 조원점 031-268-0304`
  );
}
