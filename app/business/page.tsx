'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Building2, Check, FileText, MessageCircle, Phone, ReceiptText, Truck } from 'lucide-react';
import PrivacyConsent from '@/components/PrivacyConsent';
import ConsultationHeader from '@/components/ConsultationHeader';
import storePhoto from '../../img/KakaoTalk_20260928_162936624_08.jpg';

const PURPOSES = ['직원 선물', '거래처 선물', '행사 답례품', '기타'];
const QUANTITIES = ['30~49세트', '50~99세트', '100~199세트', '200세트 이상'];
const BUDGETS = ['3~5만원대', '5~10만원대', '10~20만원대', '20만원 이상'];

export default function BusinessOrderConsultation() {
  const [formData, setFormData] = useState({ companyName: '', contactName: '', phone: '', purpose: '', quantity: '', budgetPerUnit: '', message: '' });
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const update = (key: string, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!formData.companyName || !formData.contactName || !formData.phone || !formData.quantity || !formData.budgetPerUnit || !privacyConsent) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType: 'business', formData }),
      });
      const result = await res.json();
      if (result.success) setSubmitted(true);
      else alert('오류가 발생했습니다: ' + result.error);
    } catch { alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.'); }
    finally { setIsSubmitting(false); }
  };

  if (submitted) {
    return (
      <main className="consult-success business-success">
        <div className="success-card">
          <span className="success-icon"><Check /></span>
          <p className="eyebrow">REQUEST COMPLETE</p>
          <h1>견적 문의가<br />접수되었습니다.</h1>
          <p>수량과 예산을 확인해 알맞은 구성과 견적을 안내해 드리겠습니다.</p>
          <div className="success-actions"><a href="tel:031-268-0304" className="button button-red"><Phone size={18} /> 전화 문의</a><Link href="/" className="button button-dark">홈으로 돌아가기</Link></div>
        </div>
      </main>
    );
  }

  const valid = formData.companyName && formData.contactName && formData.phone && formData.quantity && formData.budgetPerUnit && privacyConsent;
  return (
    <main className="consult-page business-page">
      <ConsultationHeader label="기업·단체 주문" />
      <section className="consult-hero business-hero">
        <div className="consult-hero-image"><Image src={storePhoto} alt="정관장 조원점 단체 선물 제품 진열" fill priority sizes="100vw" className="object-cover" /></div>
        <div className="consult-hero-shade" />
        <div className="consult-hero-copy">
          <p className="eyebrow light">BUSINESS GIFT</p>
          <h1>수량과 예산에 맞춘<br />기업 선물 제안.</h1>
          <p>직원·거래처 선물부터 행사 답례품까지 견적, 결제, 전국 배송을 한 번에 상담해 드립니다.</p>
          <div className="consult-proof"><span><ReceiptText /> 견적·세금계산서</span><span><Truck /> 일괄·개별 배송</span></div>
        </div>
      </section>

      <section className="business-benefits">
        <div><FileText /><span><strong>견적서 발행</strong><small>결재용 구성안 제공</small></span></div>
        <div><Building2 /><span><strong>수량별 상담</strong><small>예산에 맞춘 제품 구성</small></span></div>
        <div><Truck /><span><strong>전국 배송</strong><small>여러 주소 개별 발송 상담</small></span></div>
      </section>

      <section className="consult-body">
        <div className="consult-form-wrap">
          <div className="form-intro"><span>기업 견적 문의</span><h2>필요한 주문 정보를 알려주세요.</h2><p>확인 후 매장에서 구성과 견적을 안내해 드립니다.</p></div>
          <div className="modern-form">
            <div className="input-grid">
              <label>회사명 <em>필수</em><input value={formData.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="회사 또는 단체명" /></label>
              <label>담당자명 <em>필수</em><input value={formData.contactName} onChange={(e) => update('contactName', e.target.value)} placeholder="담당자 성함" autoComplete="name" /></label>
            </div>
            <label className="single-input">연락처 <em>필수</em><input type="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)} placeholder="010-0000-0000" autoComplete="tel" /></label>
            <fieldset><legend>주문 용도 <small>선택</small></legend><div className="choice-row">{PURPOSES.map((item) => <button key={item} type="button" className={formData.purpose === item ? 'selected' : ''} onClick={() => update('purpose', item)}>{item}</button>)}</div></fieldset>
            <fieldset><legend>주문 수량 <em>필수</em></legend><div className="choice-grid">{QUANTITIES.map((item) => <button key={item} type="button" className={formData.quantity === item ? 'selected' : ''} onClick={() => update('quantity', item)}>{item}</button>)}</div></fieldset>
            <fieldset><legend>세트당 예산 <em>필수</em></legend><div className="choice-grid">{BUDGETS.map((item) => <button key={item} type="button" className={formData.budgetPerUnit === item ? 'selected' : ''} onClick={() => update('budgetPerUnit', item)}>{item}</button>)}</div></fieldset>
            <label className="textarea-label">추가 요청사항 <small>선택</small><textarea value={formData.message} onChange={(e) => update('message', e.target.value)} placeholder="희망 납기, 배송지 수, 포장 방식 등 필요한 내용을 적어주세요." rows={4} /></label>
            <PrivacyConsent checked={privacyConsent} onChange={setPrivacyConsent} className="privacy-box" />
            <button onClick={handleSubmit} disabled={isSubmitting || !valid} className="form-submit">
              {isSubmitting ? '접수 중...' : <>무료 견적 요청하기 <ArrowRight size={18} /></>}
            </button>
            <p className="form-footnote">견적 문의는 결제나 주문 확정이 아닙니다.</p>
          </div>
        </div>
        <aside className="consult-aside">
          <div className="aside-card direct-card"><p className="eyebrow">DIRECT CONTACT</p><h3>일정이 급하신가요?</h3><p>월–토 10:00–20:00</p><a href="tel:031-268-0304"><Phone /> 031-268-0304</a><a href="https://pf.kakao.com/_IrSRX/" target="_blank" rel="noopener noreferrer"><MessageCircle /> 카카오톡 상담</a></div>
          <div className="aside-card catalog-card"><BookOpen /><h3>2026 선물 카탈로그</h3><p>제품 구성과 가격대를 먼저 살펴보세요.</p><Link href="/catalog">카탈로그 보기 <ArrowRight /></Link></div>
          <div className="aside-list"><p><Check /> 견적서 발행</p><p><Check /> 세금계산서 상담</p><p><Check /> 법인카드 결제</p><p><Check /> 일괄·개별 배송 상담</p></div>
        </aside>
      </section>
    </main>
  );
}
