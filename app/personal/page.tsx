'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import PrivacyConsent from '@/components/PrivacyConsent';
import ConsultationHeader from '@/components/ConsultationHeader';
import storePhoto from '../../img/KakaoTalk_20260928_162936624_04.jpg';

const GIFT_TYPES = ['부모님', '직장 상사', '병문안', '상견례', '나를 위한', '출산·산모', '기타'];
const BUDGETS = ['5만원대', '10만원대', '20만원대', '30만원 이상'];
const QUANTITIES = ['1개', '2개', '3개', '4~5개', '6개 이상'];

export default function PersonalGiftConsultation() {
  const [formData, setFormData] = useState({ name: '', phone: '', giftType: '', budget: '', quantity: '1개', message: '' });
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const update = (key: string, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.budget || !privacyConsent) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType: 'personal', formData }),
      });
      const result = await res.json();
      if (result.success) setSubmitted(true);
      else alert('오류가 발생했습니다: ' + result.error);
    } catch { alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.'); }
    finally { setIsSubmitting(false); }
  };

  if (submitted) {
    return (
      <main className="consult-success">
        <div className="success-card">
          <span className="success-icon"><Check /></span>
          <p className="eyebrow">REQUEST COMPLETE</p>
          <h1>상담 신청이<br />접수되었습니다.</h1>
          <p>남겨주신 내용을 확인한 뒤 매장에서 직접 연락드리겠습니다.</p>
          <div className="success-actions">
            <a href="https://pf.kakao.com/_IrSRX/" target="_blank" rel="noopener noreferrer" className="button button-kakao"><MessageCircle size={18} /> 카카오톡 상담</a>
            <Link href="/" className="button button-dark">홈으로 돌아가기</Link>
          </div>
        </div>
      </main>
    );
  }

  const valid = formData.name && formData.phone && formData.budget && privacyConsent;
  return (
    <main className="consult-page">
      <ConsultationHeader label="개인 선물 상담" />
      <section className="consult-hero personal-hero">
        <div className="consult-hero-image"><Image src={storePhoto} alt="정관장 조원점 선물 제품 진열" fill priority sizes="100vw" className="object-cover" /></div>
        <div className="consult-hero-shade" />
        <div className="consult-hero-copy">
          <p className="eyebrow light">PERSONAL GIFT</p>
          <h1>마음을 전하는 선물,<br />고르는 일부터 도와드립니다.</h1>
          <p>받는 분과 예산만 알려주세요. 실제 매장에서 제품을 비교해 가장 알맞은 구성을 제안합니다.</p>
          <div className="consult-proof"><span><ShieldCheck /> KGC 공식 가맹점</span><span><Sparkles /> 1:1 맞춤 추천</span></div>
        </div>
      </section>

      <section className="consult-body">
        <div className="consult-form-wrap">
          <div className="form-intro"><span>간편 상담 신청</span><h2>어떤 선물을 찾으세요?</h2><p>필수 항목만 입력하면 상담 신청이 완료됩니다.</p></div>
          <div className="modern-form">
            <fieldset>
              <legend>선물 대상 <small>선택</small></legend>
              <div className="choice-row">{GIFT_TYPES.map((item) => <button key={item} type="button" className={formData.giftType === item ? 'selected' : ''} onClick={() => update('giftType', item)}>{item}</button>)}</div>
            </fieldset>
            <fieldset>
              <legend>예산 <em>필수</em></legend>
              <div className="choice-grid">{BUDGETS.map((item) => <button key={item} type="button" className={formData.budget === item ? 'selected' : ''} onClick={() => update('budget', item)}>{item}</button>)}</div>
            </fieldset>
            <fieldset>
              <legend>수량</legend>
              <div className="choice-row">{QUANTITIES.map((item) => <button key={item} type="button" className={formData.quantity === item ? 'selected' : ''} onClick={() => update('quantity', item)}>{item}</button>)}</div>
            </fieldset>
            <div className="input-grid">
              <label>성함 <em>필수</em><input value={formData.name} onChange={(e) => update('name', e.target.value)} placeholder="성함을 입력해 주세요" autoComplete="name" /></label>
              <label>연락처 <em>필수</em><input type="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)} placeholder="010-0000-0000" autoComplete="tel" /></label>
            </div>
            <label className="textarea-label">추가 요청사항 <small>선택</small><textarea value={formData.message} onChange={(e) => update('message', e.target.value)} placeholder="받는 분의 연령, 섭취 경험, 배송 요청 등을 적어주세요." rows={4} /></label>
            <PrivacyConsent checked={privacyConsent} onChange={setPrivacyConsent} className="privacy-box" />
            <button onClick={handleSubmit} disabled={isSubmitting || !valid} className="form-submit">
              {isSubmitting ? '접수 중...' : <>무료 상담 신청하기 <ArrowRight size={18} /></>}
            </button>
            <p className="form-footnote">상담 신청은 결제나 주문 확정이 아닙니다.</p>
          </div>
        </div>
        <aside className="consult-aside">
          <div className="aside-card direct-card"><p className="eyebrow">DIRECT CONTACT</p><h3>바로 상담할까요?</h3><p>월–토 10:00–20:00</p><a href="tel:031-268-0304"><Phone /> 031-268-0304</a><a href="https://pf.kakao.com/_IrSRX/" target="_blank" rel="noopener noreferrer"><MessageCircle /> 카카오톡 상담</a></div>
          <div className="aside-card location-card"><MapPin /><div><strong>정관장 조원점</strong><p>경기 수원시 장안구 경수대로 935<br />동양파라곤 1층 105호</p></div></div>
          <div className="aside-list"><p><Check /> 정품 보장</p><p><Check /> 선물 포장</p><p><Check /> 전국 택배 상담</p><p><Check /> 수원페이 · 카드 · 상품권</p></div>
        </aside>
      </section>
    </main>
  );
}
