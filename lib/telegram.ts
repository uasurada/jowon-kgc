// lib/telegram.ts

function escapeHtml(input: unknown) {
  const s = String(input ?? "");
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isNonEmpty(v: unknown) {
  if (v === null || v === undefined) return false;
  const s = String(v).trim();
  return s.length > 0 && s !== "-" && s.toLowerCase() !== "null" && s.toLowerCase() !== "undefined";
}

function line(labelHtml: string, value: unknown) {
  if (!isNonEmpty(value)) return "";
  return `${labelHtml}: ${escapeHtml(value)}\n`;
}

function linkLine(labelHtml: string, href: string, display: unknown) {
  if (!isNonEmpty(display)) return "";
  const safeDisplay = escapeHtml(display);
  const safeHref = escapeHtml(href);
  return `${labelHtml}: <a href="${safeHref}">${safeDisplay}</a>\n`;
}

function sectionTitle(titleHtml: string) {
  return `<b>${titleHtml}</b>\n`;
}

function divider() {
  return `\n<b>—</b>\n\n`;
}

/** 유입 경로·지역·기기 한 줄 + 진위 판정 한 줄 */
function traceLines(trace?: string | null, trust?: string | null) {
  let s = "";
  if (isNonEmpty(trace)) s += `${escapeHtml(trace)}
`;
  if (isNonEmpty(trust)) s += `${escapeHtml(trust)}
`;
  return s;
}

export async function sendTelegramHtml(html: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) throw new Error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: html,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.ok !== true) {
    throw new Error(`Telegram sendMessage failed: ${JSON.stringify(data)}`);
  }
  return data;
}

export function buildPersonalTelegramMessageSafe(params: {
  id?: string | number;
  giftTitle: string;
  budget?: string;
  quantity?: string;
  name?: string;
  phone?: string;
  message?: string | null;
  history?: string | null;
  trace?: string | null;
  trust?: string | null;
  gift?: {
    recipientName?: string | null;
    recipientPhone?: string | null;
    senderLabel?: string | null;
    address?: string | null;   // 구매자가 입력한 주소 (없으면 매장이 받는 분께 문의)
    sms: string;
  } | null;
}) {
  const phone = params.phone ?? "";
  const gift = params.gift;

  let html = "";
  html += sectionTitle(gift ? "🎁 개인 선물 보내기 접수" : "📦 개인 상담 접수");
  if (isNonEmpty(params.history)) html += `${escapeHtml(params.history)}\n`;
  html += traceLines(params.trace, params.trust);
  html += line(`<b>선물</b>`, params.giftTitle);
  html += line(`<b>예산</b>`, params.budget);
  html += line(`<b>수량</b>`, params.quantity);
  if (isNonEmpty(params.id)) html += line(`<b>ID</b>`, params.id);

  html += divider();

  html += sectionTitle(gift ? "👤 보내는 분 (구매자)" : "👤 고객 정보");
  html += line(`<b>이름</b>`, params.name);

  if (isNonEmpty(phone)) {
    const digits = String(phone).replace(/[^\d+]/g, "");
    html += linkLine(`<b>전화</b>`, `tel:${digits}`, phone);
  }

  if (gift) {
    html += divider();
    html += sectionTitle("🎁 받는 분");
    html += line(`<b>성함</b>`, gift.recipientName);
    if (isNonEmpty(gift.recipientPhone)) {
      const digits = String(gift.recipientPhone).replace(/[^\d+]/g, "");
      html += linkLine(`<b>전화</b>`, `tel:${digits}`, gift.recipientPhone);
    }
    html += line(`<b>주소</b>`, gift.address || "모름 → 매장이 문자로 문의");
    html += line(`<b>안내할 보낸 분</b>`, gift.senderLabel || params.name);
  }

  if (isNonEmpty(params.message)) {
    html += `\n<b>📝 요청사항</b>\n${escapeHtml(params.message)}\n`;
  }

  if (gift?.address) {
    html += `\n📦 주소 입력됨 → 결제 확인 후 바로 발송 (받는 분께 따로 연락 불필요)\n`;
  } else if (gift) {
    // <pre> 블록은 텔레그램에서 복사 버튼이 붙는다
    html += `\n<b>📱 결제 확인 후 받는 분께 보낼 문자</b> (주소 입력 링크 포함 · 관리자 화면 [문자 보내기]로도 가능)\n<pre>${escapeHtml(gift.sms)}</pre>\n`;
    html += `\n⏰ 7일 내 회신 없으면 보내는 분께 연락 (환불 또는 다른 주소 발송)\n`;
  }

  return html.trim();
}

/** 받는 분이 링크로 주소를 입력했거나 선물을 사양했을 때 */
export function buildGiftReplyTelegramMessage(params: {
  id: string | number;
  kind: "address" | "declined";
  buyerName?: string | null;
  buyerPhone?: string | null;
  recipientName?: string | null;
  recipientPhone?: string | null;
  address?: string | null;
  previousAddress?: string | null;
}) {
  let html = "";
  const changed = isNonEmpty(params.previousAddress) && params.previousAddress !== params.address;
  if (params.kind === "address") {
    html += sectionTitle(changed ? "✏️ 받는 분 주소 변경됨 (발송 전 확인)" : "📦 받는 분 주소 입력 완료");
    html += line(`<b>ID</b>`, params.id);
    html += line(`<b>받는 분</b>`, params.recipientName);
    if (isNonEmpty(params.recipientPhone)) {
      const digits = String(params.recipientPhone).replace(/[^\d+]/g, "");
      html += linkLine(`<b>전화</b>`, `tel:${digits}`, params.recipientPhone);
    }
    html += line(`<b>${changed ? "새 주소" : "주소"}</b>`, params.address);
    if (changed) html += line(`<b>이전 주소</b>`, params.previousAddress);
    html += line(`<b>보내는 분</b>`, params.buyerName);
    html += `\n🚚 송장: 보내는 분 주소는 매장, 성함·연락처는 보내는 분 정보로\n`;
  } else {
    html += sectionTitle("🙏 받는 분이 선물을 사양함");
    html += line(`<b>ID</b>`, params.id);
    html += line(`<b>받는 분</b>`, params.recipientName);
    html += line(`<b>보내는 분</b>`, params.buyerName);
    if (isNonEmpty(params.buyerPhone)) {
      const digits = String(params.buyerPhone).replace(/[^\d+]/g, "");
      html += linkLine(`<b>보내는 분 전화</b>`, `tel:${digits}`, params.buyerPhone);
    }
    html += `\n☎️ 보내는 분께 연락해 환불 또는 다른 분께 발송 안내\n`;
  }
  return html.trim();
}

export function buildBusinessTelegramMessageSafe(params: {
  id?: string | number;
  purposeTitle: string;
  quantity?: string;
  budgetPerUnit?: string;
  deliveryTypeTitle?: string;
  desiredDate?: string | null;

  companyName?: string;
  orgType?: string | null;
  department?: string | null;
  jobTitle?: string | null;
  contactName?: string;
  phone?: string;
  email?: string | null;
  emailCheck?: string | null;
  history?: string | null;
  trace?: string | null;
  trust?: string | null;

  message?: string | null;
}) {
  const phone = params.phone ?? "";
  const email = params.email ?? "";

  let html = "";
  html += sectionTitle("🏢 기업 견적 문의 접수");
  if (isNonEmpty(params.history)) html += `${escapeHtml(params.history)}\n`;
  if (isNonEmpty(params.emailCheck)) html += `<b>${escapeHtml(params.emailCheck)}</b>\n`;
  html += traceLines(params.trace, params.trust);
  html += "\n";
  html += line(`<b>용도</b>`, params.purposeTitle);
  html += line(`<b>수량</b>`, params.quantity);
  html += line(`<b>1인 예산</b>`, params.budgetPerUnit);
  html += line(`<b>배송</b>`, params.deliveryTypeTitle);
  html += line(`<b>납기</b>`, params.desiredDate);
  if (isNonEmpty(params.id)) html += line(`<b>ID</b>`, params.id);

  html += divider();

  html += sectionTitle("📇 담당자");
  html += line(`<b>구분</b>`, params.orgType);
  html += line(`<b>회사·기관</b>`, params.companyName);
  html += line(`<b>부서</b>`, params.department);
  html += line(
    `<b>담당자</b>`,
    [params.contactName, params.jobTitle].filter(isNonEmpty).join(" ")
  );

  if (isNonEmpty(phone)) {
    const digits = String(phone).replace(/[^\d+]/g, "");
    html += linkLine(`<b>전화</b>`, `tel:${digits}`, phone);
  }

  if (isNonEmpty(email)) {
    html += linkLine(`<b>이메일</b>`, `mailto:${String(email).trim()}`, email);
  }

  if (isNonEmpty(params.message)) {
    html += `\n<b>📝 요청사항</b>\n${escapeHtml(params.message)}\n`;
  }

  html += `\n☎️ 진행 전 기관·회사 <b>대표번호</b>로 부서·담당자 재직 확인\n💳 선입금/법인카드 확인 후 출고 · 타 업체 대리구매·송금 요청은 거절\n`;

  return html.trim();
}
