'use client';

import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Phone, BookOpen } from 'lucide-react';
import PrivacyConsent from '@/components/PrivacyConsent';

const PURPOSES = [
  { id: 'employee', label: '직원 선물' },
  { id: 'client',   label: '거래처 선물' },
  { id: 'event',    label: '행사 답례품' },
  { id: 'other',    label: '기타' },
];

const QUANTITIES = [
  { value: '30~49세트',    sub: '소규모' },
  { value: '50~99세트',    sub: '중규모', popular: true },
  { value: '100~199세트',  sub: '대규모' },
  { value: '200세트 이상', sub: '대량 주문' },
];

const BUDGETS = [
  { value: '3~5만원대' },
  { value: '5~10만원대',  popular: true },
  { value: '10~20만원대' },
  { value: '20만원 이상' },
];

const SERVICES = [
  { icon: '📄', title: '세금계산서',    desc: '법인 지출 처리 완비' },
  { icon: '💳', title: '법인카드 결제', desc: '모든 법인카드 가능' },
  { icon: '🚚', title: '일괄·개별 배송', desc: '전국 어디든 배송' },
  { icon: '🏷️', title: '기업 특별가',  desc: '수량별 맞춤 공급가' },
  { icon: '📋', title: '견적서 제공',   desc: '결재용 견적서 발행' },
  { icon: '⚡', title: '1시간 내 응답', desc: '빠른 구성안 제안' },
];

export default function BusinessOrderConsultation() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    purpose: '',
    quantity: '',
    budgetPerUnit: '',
    message: '',
  });
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.companyName || !formData.contactName || !formData.phone || !formData.quantity || !formData.budgetPerUnit) {
      alert('필수 항목을 모두 입력해주세요');
      return;
    }
    if (!privacyConsent) {
      alert('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType: 'business', formData }),
      });
      const result = await res.json();
      if (result.success) setSubmitted(true);
      else alert('오류가 발생했습니다: ' + result.error);
    } catch {
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = !!(
    formData.companyName && formData.contactName && formData.phone &&
    formData.quantity && formData.budgetPerUnit && privacyConsent
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">견적 문의가 접수되었습니다!</h2>
          <p className="text-gray-600 mb-6">
            전담 매니저가 2~3가지 구성안을 빠르게 제안드립니다.<br />
            <span className="text-blue-600 font-semibold">평균 응답 시간: 1시간 이내</span>
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-left">
            <p className="font-semibold text-gray-900 mb-2 text-sm">📋 다음 단계</p>
            <ol className="text-sm text-gray-700 space-y-1">
              <li>1. 견적서 및 구성안 발송 (1시간 내)</li>
              <li>2. 상세 상담 및 조율</li>
              <li>3. 주문 확정 및 제작</li>
              <li>4. 납품 및 배송</li>
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-5">
            <a href="tel:031-268-0304" className="flex items-center justify-center gap-1.5 bg-white border border-gray-300 hover:border-gray-400 rounded-xl py-3 text-sm font-semibold text-gray-900 transition-colors">
              <Phone size={15} />전화
            </a>
            <button onClick={() => window.open('https://pf.kakao.com/_IrSRX/', '_blank')} className="flex items-center justify-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 rounded-xl py-3 text-sm font-semibold text-gray-900 transition-colors">
              <MessageCircle size={15} />카톡
            </button>
          </div>
          <a href="/" className="text-sm text-gray-500 hover:text-gray-700">홈으로 돌아가기</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <ArrowLeft size={20} />
            <span className="font-medium">뒤로</span>
          </button>
          <span className="text-base font-bold text-gray-900">기업 주문 상담</span>
          <a href="tel:031-268-0304" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700">
            <Phone size={18} />
            <span className="text-sm font-semibold hidden sm:inline">031-268-0304</span>
            <span className="text-sm font-semibold sm:hidden">전화</span>
          </a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-10 lg:items-start">

          {/* ── 폼 영역 ── */}
          <div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">기업·단체 주문 견적 문의</h1>
            <p className="text-sm text-gray-500 mb-6 break-keep">필수 정보만 입력하시면 1시간 내 맞춤 견적을 보내드립니다</p>

            {/* 모바일 전용 배지 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 lg:hidden">
              {[
                { icon: '📄', label: '세금계산서' },
                { icon: '💳', label: '법인카드' },
                { icon: '🏷️', label: '기업 특별가' },
                { icon: '⚡', label: '1시간 응답' },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center bg-white border border-gray-200 rounded-xl py-3 px-1 text-center shadow-sm">
                  <span className="text-lg mb-0.5">{b.icon}</span>
                  <span className="text-[10px] font-semibold text-gray-700">{b.label}</span>
                </div>
              ))}
            </div>

            <div className="space-y-5">

              {/* 회사 · 담당자 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  회사 · 담당자 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="(주)회사명"
                    className="flex-1 px-4 py-3.5 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400"
                  />
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="담당자명"
                    className="w-[120px] px-3 py-3.5 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* 연락처 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  연락처 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                  autoComplete="tel"
                  className="w-full sm:max-w-xs px-4 py-3.5 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400"
                />
                <p className="mt-1.5 text-xs text-gray-400">견적 안내 목적으로만 사용됩니다</p>
              </div>

              {/* 주문 용도 (선택) */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  주문 용도 <span className="text-gray-400 font-normal text-xs ml-1">(선택)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {PURPOSES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, purpose: prev.purpose === p.id ? '' : p.id }))}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                        formData.purpose === p.id
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 주문 수량 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  주문 수량 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {QUANTITIES.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, quantity: opt.value }))}
                      className={`relative flex flex-col items-center justify-center py-3.5 rounded-xl border-2 transition-all min-h-[64px] ${
                        formData.quantity === opt.value
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {opt.popular && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">인기</span>
                      )}
                      <span className="text-sm font-bold">{opt.value}</span>
                      <span className="text-xs text-gray-400 mt-0.5">{opt.sub}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-blue-600 mt-2 font-medium">🏷️ 30세트 이상부터 기업 특별가 · 수량 많을수록 세트당 단가 ↓</p>
              </div>

              {/* 1인당 예산 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  1인당 예산 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BUDGETS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, budgetPerUnit: opt.value }))}
                      className={`relative flex items-center justify-center py-3.5 rounded-xl border-2 transition-all min-h-[52px] text-sm font-medium ${
                        formData.budgetPerUnit === opt.value
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {opt.popular && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">인기</span>
                      )}
                      {opt.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* 추가 요청사항 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  추가 요청사항 <span className="text-gray-400 font-normal text-xs ml-1">(선택)</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="납기 일정, 포장 방식, 기타 요청사항을 적어주세요"
                  rows={3}
                  className="w-full px-4 py-3.5 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none placeholder:text-gray-400"
                />
              </div>

              <PrivacyConsent checked={privacyConsent} onChange={setPrivacyConsent} />

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !isValid}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all text-base min-h-[56px] flex items-center justify-center"
              >
                {isSubmitting ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />전송 중...</>
                ) : '무료 견적 신청하기 →'}
              </button>
              <p className="text-xs text-center text-gray-400">⚡ 1시간 내 구성안과 견적을 보내드립니다 · 세금계산서 발행 가능</p>

              {/* 모바일 전용 직접 상담 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 lg:hidden">
                <p className="text-sm font-semibold text-gray-900 mb-3">💬 바로 상담하실 분</p>
                <div className="grid grid-cols-2 gap-2">
                  <a href="tel:031-268-0304" className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-gray-400 rounded-xl py-3 text-sm font-semibold text-gray-900 transition-colors">
                    <Phone size={16} />전화 상담
                  </a>
                  <button onClick={() => window.open('https://pf.kakao.com/_IrSRX/', '_blank')} className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 rounded-xl py-3 text-sm font-semibold text-gray-900 transition-colors">
                    <MessageCircle size={16} />카톡 상담
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ── 데스크탑 사이드바 ── */}
          <aside className="hidden lg:block sticky top-24 space-y-4">

            {/* 기업 전용 서비스 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">🏢 기업 고객 전용 서비스</h3>
              <div className="space-y-3">
                {SERVICES.map((s) => (
                  <div key={s.title} className="flex items-center gap-3">
                    <span className="text-xl shrink-0 w-7 text-center">{s.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{s.title}</div>
                      <div className="text-xs text-gray-500">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 특별가 배너 */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-5 text-white">
              <p className="font-black text-base mb-1">🏷️ 수량별 기업 특별가</p>
              <p className="text-sm text-red-100 mb-3 break-keep leading-relaxed">
                카탈로그 정가와 별도로 기업 전용 공급가 적용.<br />
                주문 수량이 많을수록 세트당 단가가 낮아집니다.
              </p>
              <a href="/catalog" className="inline-flex items-center gap-1.5 bg-white text-red-700 font-bold text-xs px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
                <BookOpen size={13} />제품 카탈로그 보기
              </a>
            </div>

            {/* 직접 상담 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
              <p className="font-bold text-gray-900 mb-1 text-sm">💬 지금 바로 상담</p>
              <p className="text-xs text-gray-500 mb-3">평일·토요일 10:00 – 20:00</p>
              <div className="space-y-2">
                <a href="tel:031-268-0304" className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-gray-400 rounded-xl py-3 text-sm font-semibold text-gray-900 transition-colors w-full">
                  <Phone size={16} />031-268-0304
                </a>
                <button onClick={() => window.open('https://pf.kakao.com/_IrSRX/', '_blank')} className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 rounded-xl py-3 text-sm font-semibold text-gray-900 transition-colors w-full">
                  <MessageCircle size={16} />카카오톡 상담
                </button>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
