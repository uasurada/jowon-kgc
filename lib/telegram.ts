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
}) {
  const phone = params.phone ?? "";

  let html = "";
  html += sectionTitle("📦 개인 상담 접수");
  if (isNonEmpty(params.history)) html += `${escapeHtml(params.history)}\n`;
  html += line(`<b>선물</b>`, params.giftTitle);
  html += line(`<b>예산</b>`, params.budget);
  html += line(`<b>수량</b>`, params.quantity);
  if (isNonEmpty(params.id)) html += line(`<b>ID</b>`, params.id);

  html += divider();

  html += sectionTitle("👤 고객 정보");
  html += line(`<b>이름</b>`, params.name);

  if (isNonEmpty(phone)) {
    const digits = String(phone).replace(/[^\d+]/g, "");
    html += linkLine(`<b>전화</b>`, `tel:${digits}`, phone);
  }

  if (isNonEmpty(params.message)) {
    html += `\n<b>📝 요청사항</b>\n${escapeHtml(params.message)}\n`;
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

  message?: string | null;
}) {
  const phone = params.phone ?? "";
  const email = params.email ?? "";

  let html = "";
  html += sectionTitle("🏢 기업 견적 문의 접수");
  if (isNonEmpty(params.history)) html += `${escapeHtml(params.history)}\n`;
  if (isNonEmpty(params.emailCheck)) html += `<b>${escapeHtml(params.emailCheck)}</b>\n`;
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
