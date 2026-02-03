// lib/formLabels.ts

export const PERSONAL_GIFT_TYPE_MAP: Record<string, string> = {
  parents: '부모님 선물',
  business: '직장 상사 / 감사 선물',
  hospital: '병문안 / 회복 기원',
  baby: '출산 / 산모 선물',
  event: '기타 행사',
};

export const BUSINESS_PURPOSE_MAP: Record<string, string> = {
  employee: '직원 선물',
  client: '거래처 선물',
  event: '행사 답례품',
  other: '기타 단체 주문',
};

export const DELIVERY_TYPE_MAP: Record<string, string> = {
  bulk: '일괄 배송',
  individual: '개별 배송',
};

export function mapPersonalGiftType(id?: string | null) {
  if (!id) return '-';
  return PERSONAL_GIFT_TYPE_MAP[id] ?? id;
}

export function mapBusinessPurpose(id?: string | null) {
  if (!id) return '-';
  return BUSINESS_PURPOSE_MAP[id] ?? id;
}

export function mapDeliveryType(id?: string | null) {
  if (!id) return '-';
  return DELIVERY_TYPE_MAP[id] ?? id;
}
