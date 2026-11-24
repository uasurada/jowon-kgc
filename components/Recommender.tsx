'use client';

import { Children, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, ArrowUp, Baby, Briefcase, Building2, Coffee, Crown, CupSoda, FlaskConical, Flower2, Gift, GraduationCap,
  HeartHandshake, House, MessageCircle, Phone, Pill, RotateCcw, Shuffle, Sparkles, Star, UserRound, X, Zap,
  type LucideIcon,
} from 'lucide-react';
import ProductCard from './ProductCard';
import {
  BUDGETS, FORM_PREFS, RESULT_LIMIT, TARGETS, agesFor, answersToQuery, hasResults, priceLines, recommend, won,
  type Answers, type Choice, type Product, type SiteSettings,
} from '@/lib/productInfo';
import { KAKAO_URL } from '@/lib/contact';

type Step = 'target' | 'kidAge' | 'budget' | 'form' | 'result';

const IDLE_MS = 90_000; // 매장 태블릿: 손님이 떠나면 처음 화면으로

// 선택지 아이콘 (홈페이지·태블릿 공통)
const ICONS: Record<string, LucideIcon> = {
  parents: HeartHandshake, vip: Crown, women: Flower2, men: UserRound, worker: Briefcase,
  student: GraduationCap, kids: Baby, family: House, business: Building2,
  any: Shuffle, stick: Zap, pouch: CupSoda, pill: Pill, jung: FlaskConical, set: Gift, light: Coffee,
};
const Icon = ({ k }: { k: string }) => {
  const I = ICONS[k];
  return I ? <I className="rc-option-icon" size={22} strokeWidth={1.7} aria-hidden="true" /> : null;
};

const needsAge = (a: Partial<Answers>) => agesFor(a.target).length > 0;
const stepsFor = (a: Partial<Answers>): Step[] => (needsAge(a) ? ['target', 'kidAge', 'budget', 'form'] : ['target', 'budget', 'form']);
const isComplete = (a: Partial<Answers>) => !!(a.target && a.budget && a.form && (!needsAge(a) || a.kidAge));

/** 맞춤 추천: 몇 가지를 고르면 알맞은 제품을 보여 준다. store=매장 태블릿 모드 */
export default function Recommender({ products, settings, store = false, initial }: {
  products: Product[];
  settings: SiteSettings;
  store?: boolean;
  initial?: Partial<Answers>;   // 주소에 담긴 답변 (상세에서 돌아왔을 때 결과를 다시 보여 준다)
}) {
  const restored = initial && isComplete(initial) ? initial : null;
  const [step, setStep] = useState<Step>(restored ? 'result' : 'target');
  const [answers, setAnswers] = useState<Partial<Answers>>(restored ?? {});
  const [history, setHistory] = useState<Step[]>(restored ? stepsFor(restored) : []);
  const [detail, setDetail] = useState<Product | null>(null);  // 매장 태블릿: 화면 위에 띄운 제품 상세
  const [page, setPage] = useState(0);  // 홈페이지 결과 '더 보기' 횟수
  const topRef = useRef<HTMLDivElement>(null);

  // 결과 화면이면 주소에 답변을 남겨, 제품 상세에 갔다가 뒤로 와도 결과가 그대로 보이게 한다
  const syncUrl = (a: Partial<Answers> | null) => {
    if (store) return;
    const q = a ? answersToQuery(a) : '';
    window.history.replaceState(window.history.state, '', q ? `/recommend?${q}` : '/recommend');
  };
  const reset = () => { setStep('target'); setAnswers({}); setHistory([]); setDetail(null); setPage(0); syncUrl(null); };

  // 매장 태블릿: 방문 통계에서 빼고, 한동안 손대지 않으면 처음으로
  useEffect(() => {
    if (!store) return;
    try { localStorage.setItem('kgc_admin', '1'); } catch { /* 저장소 없음 */ }
    const toStart = () => { setStep('target'); setAnswers({}); setHistory([]); setDetail(null); setPage(0); };
    let timer = setTimeout(toStart, IDLE_MS);
    const bump = () => { clearTimeout(timer); timer = setTimeout(toStart, IDLE_MS); };
    const events = ['pointerdown', 'keydown', 'scroll'] as const;
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    return () => { clearTimeout(timer); events.forEach((e) => window.removeEventListener(e, bump)); };
  }, [store]);

  const go = (next: Step) => {
    setHistory((h) => [...h, step]);
    setStep(next);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const back = () => {
    const prev = history[history.length - 1];
    if (!prev) return;
    setHistory((h) => h.slice(0, -1));
    setStep(prev);
    setPage(0);
    if (step === 'result') syncUrl(null);
  };
  const pick = (key: keyof Answers, value: string, next: Step) => {
    // 이 질문 뒤의 답은 지운다 (돌아와서 대상을 바꾸면 예전 나이·예산·형태가 남지 않게)
    const order: (keyof Answers)[] = ['target', 'kidAge', 'budget', 'form'];
    const a: Partial<Answers> = { ...answers, [key]: value };
    order.slice(order.indexOf(key) + 1).forEach((k) => delete a[k]);
    setAnswers(a);
    setPage(0);
    if (next === 'result') syncUrl(a);
    go(next);
  };
  // 고르면 나올 제품이 없는 선택지는 숨긴다
  // 선택지 거르기는 '이 질문보다 앞의 답'만 기준으로 (뒤로 와도 예전 답에 걸리지 않게)
  const can = (extra: Partial<Answers>) => {
    const order: (keyof Answers)[] = ['target', 'kidAge', 'budget', 'form'];
    const key = Object.keys(extra)[0] as keyof Answers;
    const before = Object.fromEntries(order.slice(0, order.indexOf(key)).map((k) => [k, answers[k]]));
    return hasResults(products, { ...before, ...extra });
  };

  const steps = stepsFor(answers);
  const stepNo = steps.indexOf(step) + 1;

  // 맞는 제품은 모두 보여 준다: 태블릿은 전부(손가락으로 위아래로), 홈페이지는 8개씩 더 보기
  const all = step === 'result' ? recommend(products, answers, 999) : [];
  const results = store ? all : all.slice(0, (page + 1) * RESULT_LIMIT);
  const label = (list: Choice[], key?: string) => list.find((c) => c.key === key)?.label;
  const summary = [label(TARGETS, answers.target), label(agesFor(answers.target), answers.kidAge), label(BUDGETS, answers.budget), label(FORM_PREFS, answers.form)]
    .filter(Boolean).join(' · ');

  const consultHref = (name: string, opt?: string) =>
    `/personal?product=${encodeURIComponent(opt ? `${name} (${opt})` : name)}`;

  return (
    <div className={`rc ${store ? 'rc-store' : ''}`} ref={topRef}>
      {store && step === 'target' && (
        <div className="rc-store-intro">
          <p className="eyebrow light">JOWON STORE · 맞춤 추천</p>
          <h1>드시는 분께 꼭 맞는 정관장을 찾아보세요</h1>
          <p>몇 가지만 누르면 어울리는 제품을 보여 드려요. 마음에 드는 제품은 직원에게 보여 주세요.</p>
        </div>
      )}
      {step !== 'result' ? (
        <div className="rc-panel">
          <div className="rc-steps" aria-hidden="true">
            {steps.map((s, i) => <span key={s} className={i < stepNo ? 'on' : ''} />)}
          </div>
          <div className="rc-progress">
            {history.length > 0
              ? <button type="button" onClick={back} className="rc-btn"><ArrowLeft size={16} />이전</button>
              : <span />}
            <span>{stepNo} / {steps.length}</span>
          </div>

          {step === 'target' && (
            <Question title="누가 드시나요?" desc="선물이라면 받으시는 분을 골라 주세요.">
              {TARGETS.filter((t) => hasResults(products, { target: t.key })).map((t) => (
                <button type="button" key={t.key} className={answers.target === t.key ? 'selected' : ''}
                  onClick={() => pick('target', t.key, t.ages ? 'kidAge' : 'budget')}><Icon k={t.key} /><strong>{t.label}</strong></button>
              ))}
            </Question>
          )}
          {step === 'kidAge' && (
            <Question title="나이가 어떻게 되나요?" desc="나이에 맞춘 제품이 따로 있어요. 애매하면 '전체 연령'을 눌러 주세요.">
              {agesFor(answers.target).filter((k) => can({ kidAge: k.key })).map((k) => (
                <button type="button" key={k.key} className={answers.kidAge === k.key ? 'selected' : ''}
                  onClick={() => pick('kidAge', k.key, 'budget')}><strong>{k.label}</strong>{k.hint && <small>{k.hint}</small>}</button>
              ))}
            </Question>
          )}
          {step === 'budget' && (
            <Question title="생각하시는 예산은요?" desc={settings.priceMode === 'list' ? '정관장 공식 정가 기준이에요.' : '대략적인 범위만 골라 주세요.'}>
              {BUDGETS.filter((b) => can({ budget: b.key })).map((b) => (
                <button type="button" key={b.key} className={answers.budget === b.key ? 'selected' : ''}
                  onClick={() => pick('budget', b.key, 'form')}>{b.label}</button>
              ))}
            </Question>
          )}
          {step === 'form' && (
            <Question title="어떤 형태가 편하세요?" desc="잘 모르시면 '상관없어요'를 눌러 주세요.">
              {FORM_PREFS.filter((f) => can({ form: f.key })).map((f) => (
                <button type="button" key={f.key} className={answers.form === f.key ? 'selected' : ''}
                  onClick={() => pick('form', f.key, 'result')}>
                  <Icon k={f.key} /><strong>{f.label}</strong>{f.hint && <small>{f.hint}</small>}
                </button>
              ))}
            </Question>
          )}
        </div>
      ) : (
        <div className="rc-result">
          <div className="rc-result-head">
            <div>
              <p className="eyebrow"><Sparkles size={14} /> 맞춤 추천</p>
              <h2>{results.length ? '이런 제품을 추천드려요' : '조건에 딱 맞는 제품이 없어요'}</h2>
              <p className="rc-summary">{summary}{store && <span className="rc-store-tip"> · 맞는 제품 {all.length}개 · 누르면 자세히 볼 수 있어요</span>}</p>
            </div>
            <div className="rc-result-actions">
              <button type="button" onClick={back} className="rc-btn"><ArrowLeft size={16} />이전</button>
              <button type="button" onClick={reset} className="rc-btn rc-btn-dark"><RotateCcw size={16} />처음부터</button>
            </div>
          </div>

          {settings.promoOn && <p className="pd-promo">{settings.promoText}</p>}

          {results.length > 0 ? (
            <div className="pd-grid">
              {results.map(({ product, option, reasons }) => (
                <div key={product.id} className="rc-item">
                  <ProductCard product={product} priceMode={settings.priceMode} option={option} reasons={reasons}
                    href={store ? null : `/products/${product.id}?from=recommend`} onSelect={store ? () => setDetail(product) : undefined} />
                  {!store && (
                    <Link href={consultHref(product.name, option?.[0])} className="rc-consult">이 제품으로 상담 신청</Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="pd-empty">예산이나 형태를 바꿔 보시거나, 매장에 바로 물어보세요. 드시는 분과 예산만 알려주시면 함께 골라 드려요.</p>
          )}

          {!store && results.length < all.length && (
            <button type="button" className="rc-more" onClick={() => setPage((n) => n + 1)}>
              제품 더 보기 <span>({all.length - results.length}개 더)</span>
            </button>
          )}

          {store ? (
            <div className="rc-store-foot">
              <p>마음에 드는 제품은 직원에게 보여 주세요</p>
              {all.length > 6 && (
                <button type="button" className="rc-btn" onClick={() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                  <ArrowUp size={18} />맨 위로
                </button>
              )}
              <button type="button" className="rc-btn rc-btn-dark" onClick={() => { reset(); window.scrollTo({ top: 0 }); }}><RotateCcw size={18} />처음부터</button>
            </div>
          ) : (
            <div className="rc-help" data-track="result">
              <p><strong>고르기 어려우세요?</strong> 드시는 분의 연령·섭취 경험을 알려주시면 매장에서 직접 골라 드립니다.</p>
              <div>
                <a href="tel:031-268-0304" className="button button-dark"><Phone size={16} />전화 상담</a>
                <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer" className="button button-kakao"><MessageCircle size={16} />카카오톡 상담</a>
              </div>
            </div>
          )}
          {!store && settings.priceMode !== 'hidden' && (
            <p className="pd-price-note">가격은 정관장 공식 정가 기준입니다. 명절·행사 할인은 매장으로 문의해 주세요.</p>
          )}
        </div>
      )}
      {detail && <StoreDetail product={detail} priceMode={settings.priceMode} onClose={() => setDetail(null)} />}
    </div>
  );
}

/** 매장 태블릿: 페이지를 벗어나지 않고 제품 상세를 크게 보여 준다 */
function StoreDetail({ product: p, priceMode, onClose }: { product: Product; priceMode: SiteSettings['priceMode']; onClose: () => void }) {
  return (
    <div className="rc-detail" role="dialog" aria-modal="true" aria-label={p.name} onClick={onClose}>
      <div className="rc-detail-card" onClick={(e) => e.stopPropagation()}>
        <div className="rc-detail-image">
          {p.imageUrl && <Image src={p.imageUrl} alt={p.name} fill sizes="560px" unoptimized />}
        </div>
        <div className="rc-detail-body">
          <p className="pd-card-cat">{p.cat}{p.badge && <b>{p.badge}</b>}</p>
          <h2>{p.name}</h2>
          {p.featured && <p className="pd-featured inline"><Star size={13} fill="currentColor" />조원점 추천 제품</p>}
          {p.who && <p className="pd-detail-who"><strong>이런 분께 추천해요</strong>{p.who}</p>}
          {priceMode === 'list' && p.opts.length > 0 && (
            <div className="pd-price-box">
              {p.opts.map(([label, v]) => <p key={label}><span>{label}</span><strong>{won(v)}</strong></p>)}
              <small>정관장 공식 정가 기준 · 행사 할인은 직원에게 문의해 주세요</small>
            </div>
          )}
          {priceMode === 'band' && p.opts.length > 0 && (
            <div className="pd-price-box"><p><span>가격대</span><strong>{priceLines(p, 'band').join(', ')}</strong></p></div>
          )}
          <dl className="pd-spec">
            {p.form && <><dt>형태</dt><dd>{p.form}</dd></>}
            {p.spec && <><dt>구성</dt><dd>{p.spec}</dd></>}
          </dl>
          {p.descr && <p className="rc-detail-desc">{p.descr}</p>}
          {p.kind?.includes('건강기능식품') && <small className="rc-detail-note">건강기능식품은 질병의 예방 및 치료를 위한 의약품이 아닙니다.</small>}
        </div>
        <button type="button" className="rc-detail-close" onClick={onClose}><X size={22} />닫기</button>
      </div>
    </div>
  );
}

function Question({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rc-question">
      <h2>{title}</h2>
      <p>{desc}</p>
      {/* 선택지 수에 따라 태블릿에서 칸 수를 바꿔 한 화면에 들어오게 한다 */}
      <div className={`rc-options n-${Children.count(children)}`}>{children}</div>
    </div>
  );
}
