'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Gift, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import PrivacyConsent from '@/components/PrivacyConsent';
import ConsultationHeader from '@/components/ConsultationHeader';
import storePhoto from '../../img/KakaoTalk_20260928_162936624_04.jpg';

const GIFT_TYPES = ['부모님', '직장 상사', '병문안', '상견례', '나를 위한', '출산·산모', '기타'];
const BUDGETS = ['5만원대', '10만원대', '20만원대', '30만원 이상'];
const QUANTITIES = ['1개', '2개', '3개', '4~5개', '6개 이상'];

// 카카오(다음) 우편번호 서비스 — 무료, 키 없음. 주소를 아는 선물일 때만 불러온다
type DaumPostcodeData = { zonecode: string; roadAddress: string; jibunAddress: string };
declare global {
  interface Window {
    daum?: { Postcode: new (o: { oncomplete: (d: DaumPostcodeData) => void }) => { open: () => void } };
  }
}
function loadDaumPostcode() {
  if (window.daum?.Postcode) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('postcode load failed'));
    document.head.appendChild(s);
  });
}

export default function PersonalGiftConsultation() {
  const [formData, setFormData] = useState({
    name: '', phone: '', giftType: '', budget: '', quantity: '1개', message: '',
    delivery: 'self', recipientName: '', recipientPhone: '', senderLabel: '',
    addressKnown: 'no', zipcode: '', address1: '', address2: '',
  });
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const update = (key: string, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));

  const isGift = formData.delivery === 'gift';
  const knowsAddress = isGift && formData.addressKnown === 'yes';
  const giftValid = !isGift || (
    formData.recipientName.trim() &&
    formData.recipientPhone.replace(/\D/g, '').length >= 9 &&
    (!knowsAddress || formData.address1.trim())
  );

  const searchAddress = async () => {
    try {
      await loadDaumPostcode();
      new window.daum!.Postcode({
        oncomplete: (d) => setFormData((prev) => ({ ...prev, zipcode: d.zonecode, address1: d.roadAddress || d.jibunAddress })),
      }).open();
    } catch {
      alert('주소 검색을 불러오지 못했습니다. 주소를 직접 입력해 주세요.');
    }
  };
  const valid = formData.name && formData.phone && formData.budget && giftValid && privacyConsent;

  const handleSubmit = async () => {
    if (!valid) return;
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
          <h1>{isGift ? <>선물 신청이<br />접수되었습니다.</> : <>상담 신청이<br />접수되었습니다.</>}</h1>
          <p>
            {knowsAddress
              ? '먼저 보내시는 분께 연락드려 제품과 결제를 안내해 드립니다. 결제 확인 후 입력하신 주소로 정성껏 포장해 보내드립니다.'
              : isGift
                ? '먼저 보내시는 분께 연락드려 제품과 결제를 안내해 드립니다. 결제 확인 후 받는 분께 연락드려 배송지를 여쭙겠습니다.'
                : '남겨주신 내용을 확인한 뒤 매장에서 직접 연락드리겠습니다.'}
          </p>
          <div className="success-actions">
            <a href="https://pf.kakao.com/_IrSRX/" target="_blank" rel="noopener noreferrer" className="button button-kakao"><MessageCircle size={18} /> 카카오톡 상담</a>
            <Link href="/" className="button button-dark">홈으로 돌아가기</Link>
          </div>
        </div>
      </main>
    );
  }

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
          <div className="consult-proof"><span><ShieldCheck /> KGC 공식 가맹점</span><span><Sparkles /> 1:1 맞춤 추천</span><span><Gift /> 주소 몰라도 선물 가능</span></div>
        </div>
      </section>

      <section className="consult-body">
        <div className="consult-form-wrap">
          <div className="form-intro"><span>간편 상담 신청</span><h2>어떤 선물을 찾으세요?</h2><p>필수 항목만 입력하면 상담 신청이 완료됩니다.</p></div>
          <div className="modern-form">
            <fieldset>
              <legend>받는 방법 <em>필수</em></legend>
              <div className="choice-grid two">
                <button type="button" className={!isGift ? 'selected' : ''} onClick={() => update('delivery', 'self')}>제가 받을게요<small>매장 수령 · 택배</small></button>
                <button type="button" className={isGift ? 'selected' : ''} onClick={() => update('delivery', 'gift')}><span><Gift size={15} /> 선물로 보낼게요</span><small>받는 분 주소 몰라도 OK</small></button>
              </div>
            </fieldset>
            {isGift && (
              <div className="gift-box">
                <p className="gift-box-title"><Gift size={16} /> 전화번호만으로 선물하기</p>
                <p className="gift-box-desc">상사, 은사님, 사돈처럼 주소를 여쭙기 어려운 분께도 부담 없이 보내세요. 주소를 모르시면 결제 확인 후 정관장 조원점이 받는 분께 문자로 연락드려 배송지를 받아 정성껏 포장해 보내드립니다.</p>
                <div className="input-grid">
                  <label>받는 분 성함 <em>필수</em><input value={formData.recipientName} onChange={(e) => update('recipientName', e.target.value)} placeholder="예: 김영희" /></label>
                  <label>받는 분 연락처 <em>필수</em><input type="tel" value={formData.recipientPhone} onChange={(e) => update('recipientPhone', e.target.value)} placeholder="010-0000-0000" /></label>
                </div>
                <fieldset>
                  <legend>받는 분 주소 <em>필수</em></legend>
                  <div className="choice-grid two">
                    <button type="button" className={!knowsAddress ? 'selected' : ''} onClick={() => update('addressKnown', 'no')}>주소를 몰라요<small>매장이 받는 분께 문자로 여쭤요</small></button>
                    <button type="button" className={knowsAddress ? 'selected' : ''} onClick={() => update('addressKnown', 'yes')}>주소를 알아요<small>직접 입력 · 바로 발송</small></button>
                  </div>
                </fieldset>
                {knowsAddress && (
                  <div className="address-fields">
                    <div className="address-search">
                      <input value={formData.zipcode} onChange={(e) => update('zipcode', e.target.value)} placeholder="우편번호" inputMode="numeric" aria-label="우편번호" />
                      <button type="button" onClick={searchAddress}><MapPin size={15} /> 주소 검색</button>
                    </div>
                    <input value={formData.address1} onChange={(e) => update('address1', e.target.value)} placeholder="주소 (주소 검색 또는 직접 입력)" aria-label="주소" />
                    <input value={formData.address2} onChange={(e) => update('address2', e.target.value)} placeholder="상세주소 (동·호수 등)" aria-label="상세주소" />
                  </div>
                )}
                <label className="single-input">받는 분께 안내할 보내는 분 이름 <small>선택</small><input value={formData.senderLabel} onChange={(e) => update('senderLabel', e.target.value)} placeholder="예: 막내아들 민수 (비우면 신청자 성함)" /></label>
                {!knowsAddress && <p className="form-hint">받는 분이 7일 안에 회신하지 않으시면 보내시는 분께 연락드려 환불 또는 다른 주소 발송을 안내해 드립니다.</p>}
              </div>
            )}
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
              <label>{isGift ? '보내는 분 성함' : '성함'} <em>필수</em><input value={formData.name} onChange={(e) => update('name', e.target.value)} placeholder="성함을 입력해 주세요" autoComplete="name" /></label>
              <label>{isGift ? '보내는 분 연락처' : '연락처'} <em>필수</em><input type="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)} placeholder="010-0000-0000" autoComplete="tel" /></label>
            </div>
            <label className="textarea-label">추가 요청사항 <small>선택</small><textarea value={formData.message} onChange={(e) => update('message', e.target.value)} placeholder="받는 분의 연령, 섭취 경험, 배송 요청 등을 적어주세요." rows={4} /></label>
            <p className="form-notice">
              모든 주문은 <strong>결제 확인 후 출고</strong>됩니다. (계좌이체 · 카드 결제 · 전화 카드결제 가능)<br />
              입금은 <strong>정관장 조원점(예금주 박시영) 계좌로만</strong> 안내드리며, 정관장 제품 외 타 업체 물품의 대리 구매나 대금 송금 요청에는 응하지 않습니다.<br />
              택배 송장의 보내는 분 주소는 반품·교환 처리를 위해 <strong>정관장 조원점 매장 주소</strong>로 표기되며, 보내는 분 성함과 연락처만 주문하신 분 정보로 기재됩니다.
            </p>
            <PrivacyConsent checked={privacyConsent} onChange={setPrivacyConsent} className="privacy-box" />
            <button onClick={handleSubmit} disabled={isSubmitting || !valid} className="form-submit">
              {isSubmitting ? '접수 중...' : <>{isGift ? '선물 신청하기' : '무료 상담 신청하기'} <ArrowRight size={18} /></>}
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
