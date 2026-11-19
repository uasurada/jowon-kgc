// lib/productInfo.ts — 제품 안내·맞춤 추천 공통 (브라우저/서버 겸용, DB 접근 없음)

export type PriceOption = [label: string, price: number];

export interface Product {
  id: string;
  name: string;
  cat: string;
  badge: string | null;
  kind: string | null;
  form: string | null;
  opts: PriceOption[];
  spec: string | null;
  descr: string | null;
  tags: string[];
  who: string | null;
  ageMin: number | null;
  ageMax: number | null;
  visible: boolean;
  featured: boolean;
  sort: number;
  imageUrl: string | null;
  customImage: boolean;
  defaultImage: string | null;   // 처음 넣은 기본 이미지 (관리자 사진을 지우면 이것으로)
  src: string | null;
}

export type PriceMode = 'list' | 'band' | 'hidden';

export interface SiteSettings {
  priceMode: PriceMode;   // 정가 그대로 / 가격대만 / 숨김
  promoOn: boolean;       // 행사 중 안내
  promoText: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  priceMode: 'list',
  promoOn: false,
  promoText: '지금 매장 행사 중이에요. 할인 혜택은 상담 때 안내드립니다.',
};

export const PRICE_MODE_LABEL: Record<PriceMode, string> = {
  list: '정가 그대로',
  band: '가격대만 (예: 10만원대)',
  hidden: '가격 숨김',
};

/** 추천 대상 꼬리표 */
export const TAGS: Record<string, string> = {
  parents: '부모님',
  senior: '어르신',
  vip: '귀한 분·VIP',
  worker: '직장인·바쁜 분',
  student: '수험생·청소년',
  kids: '어린이',
  women: '여성',
  men: '남성',
  family: '온가족',
  beginner: '홍삼 처음·쓴맛 부담',
  couple: '부부',
  business: '기업·단체 선물',
};

export const FORMS = ['스틱', '파우치', '농축액(병)', '환·정제', '캡슐', '앰플', '젤리', '필름', '차', '절편·간식', '뿌리삼', '세트'];

export const KINDS = ['건강기능식품', '일반식품', '건강기능식품·일반식품'];

export const BADGES = ['PREMIUM', 'BEST', 'NEW'];

export const SRC_LABEL: Record<string, string> = {
  catalog: '카탈로그 문구',
  kgcshop: '정관장몰 추천대상',
  draft: '추정',
  store: '매장 작성',
};

export const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;

export function priceBand(n: number) {
  if (n < 50000) return '5만원 미만';
  if (n < 100000) return '5만원대';
  if (n < 200000) return '10만원대';
  if (n < 300000) return '20만원대';
  if (n < 500000) return '30~40만원대';
  if (n < 1000000) return '50~90만원대';
  return '100만원 이상';
}

/** 설정에 맞춰 보여 줄 가격 줄 (숨김이면 빈 배열) */
export function priceLines(p: Pick<Product, 'opts'>, mode: PriceMode): string[] {
  if (mode === 'hidden' || !p.opts.length) return [];
  if (mode === 'band') return [...new Set(p.opts.map(([, v]) => priceBand(v)))];
  return p.opts.map(([label, v]) => (p.opts.length > 1 || label ? `${label} ${won(v)}` : won(v)));
}

export function minPrice(p: Pick<Product, 'opts'>) {
  return p.opts.length ? Math.min(...p.opts.map(([, v]) => v)) : 0;
}

/* ───────── 맞춤 추천 ───────── */

export interface Choice { key: string; label: string; hint?: string }

export const TARGETS: (Choice & { tags: string[] })[] = [
  { key: 'parents', label: '부모님·어르신', tags: ['parents', 'senior'] },
  { key: 'vip', label: '귀한 분·윗사람', tags: ['vip'] },
  { key: 'women', label: '아내·여성', tags: ['women'] },
  { key: 'men', label: '남편·남성', tags: ['men'] },
  { key: 'worker', label: '직장인·나를 위해', tags: ['worker'] },
  { key: 'student', label: '수험생·청소년', tags: ['student'] },
  { key: 'kids', label: '어린이', tags: ['kids'] },
  { key: 'family', label: '온가족', tags: ['family', 'couple'] },
  { key: 'business', label: '거래처·단체 선물', tags: ['business'] },
];

export const KID_AGES: (Choice & { min: number; max: number })[] = [
  { key: '3-6', label: '3~6세', min: 3, max: 6 },
  { key: '7-10', label: '7~10세', min: 7, max: 10 },
  { key: '11-13', label: '초등 고학년', min: 11, max: 13 },
  { key: '14-19', label: '중·고등학생', min: 14, max: 19 },
];

export const BUDGETS: (Choice & { min: number; max: number })[] = [
  { key: 'u5', label: '5만원 미만', min: 0, max: 49999 },
  { key: '5', label: '5만원대', min: 50000, max: 99999 },
  { key: '10', label: '10만원대', min: 100000, max: 199999 },
  { key: '20', label: '20만원대', min: 200000, max: 299999 },
  { key: '30', label: '30만원 이상', min: 300000, max: Infinity },
  { key: 'any', label: '상관없어요', min: 0, max: Infinity },
];

export const FORM_PREFS: (Choice & { forms: string[]; tag?: string })[] = [
  { key: 'any', label: '상관없어요', forms: [] },
  { key: 'stick', label: '간편한 스틱', hint: '들고 다니며 한 포씩', forms: ['스틱', '필름', '젤리'] },
  { key: 'pouch', label: '마시는 파우치·병', hint: '따뜻하게 데워 드셔도 좋아요', forms: ['파우치', '앰플'] },
  { key: 'pill', label: '알약·환', hint: '쓴맛 없이 간편하게', forms: ['환·정제', '캡슐'], tag: 'beginner' },
  { key: 'jung', label: '홍삼정(진한 농축액)', hint: '숟가락으로 떠서', forms: ['농축액(병)'] },
  { key: 'set', label: '선물세트 구성', hint: '여러 제품을 한 상자에', forms: ['세트'] },
];

export interface Answers { target: string; kidAge?: string; budget: string; form: string }

export interface Recommendation { product: Product; option: PriceOption | null; reasons: string[] }

/** 답변에 맞는 제품을 점수순으로. 매장 추천 제품이 위로 온다 */
export function recommend(all: Product[], a: Answers, limit = 6): Recommendation[] {
  const target = TARGETS.find((t) => t.key === a.target);
  const budget = BUDGETS.find((b) => b.key === a.budget) ?? BUDGETS[BUDGETS.length - 1];
  const pref = FORM_PREFS.find((f) => f.key === a.form) ?? FORM_PREFS[0];
  const kid = a.target === 'kids' || a.target === 'student' ? KID_AGES.find((k) => k.key === a.kidAge) : undefined;

  const scored = all.flatMap((p) => {
    if (!p.visible) return [];
    const forTarget = !target || target.tags.some((t) => p.tags.includes(t));
    if (!forTarget) return [];
    // 연령 제품은 나이가 맞을 때만
    if (kid && p.ageMin != null && p.ageMax != null && (p.ageMax < kid.min || p.ageMin > kid.max)) return [];
    if (target && !['kids', 'student'].includes(target.key) && p.tags.length && p.tags.every((t) => t === 'kids')) return [];

    const inBudget = p.opts.filter(([, v]) => v >= budget.min && v <= budget.max);
    const option = inBudget.length
      ? inBudget.reduce((x, y) => (y[1] > x[1] ? y : x))
      : null;
    const reasons: string[] = [];
    let score = 0;
    if (option) score += 4;
    else if (budget.key !== 'any') {
      // 예산에서 조금 벗어난 정도면 낮은 점수로 남긴다
      const near = p.opts.some(([, v]) => v >= budget.min * 0.8 && v <= (budget.max === Infinity ? Infinity : budget.max * 1.25));
      if (!near) return [];
      score += 1;
    }
    if (pref.forms.length) {
      if (p.form && pref.forms.includes(p.form)) { score += 3; reasons.push(`${p.form} 형태`); }
      else if (pref.tag && p.tags.includes(pref.tag)) score += 1;
      else score -= 1;
    }
    if (kid && p.ageMin != null && p.ageMax != null) {
      // 고른 나이대에 딱 맞는 제품일수록 위로
      score += p.ageMin >= kid.min - 1 && p.ageMax <= kid.max + 1 ? 3 : 1.5;
      reasons.push('나이에 맞춘 제품');
    }
    if (target && p.tags[0] && target.tags.includes(p.tags[0])) score += 1;
    if (p.featured) { score += 3; reasons.unshift('매장 추천'); }
    if (p.badge === 'BEST') score += 0.5;
    return [{ product: p, option, reasons, score }];
  });

  return scored
    .sort((x, y) => y.score - x.score || x.product.sort - y.product.sort)
    .slice(0, limit)
    .map(({ product, option, reasons }) => ({ product, option, reasons }));
}
