'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, MessageCircle, Phone, Shield, Truck, Award } from 'lucide-react';
import PrivacyConsent from '@/components/PrivacyConsent';

const GIFT_TYPES = [
  { id: 'parents',    label: '부모님' },
  { id: 'business',   label: '직장 상사' },
  { id: 'hospital',   label: '병문안' },
  { id: 'engagement', label: '상견례' },
  { id: 'self',       label: '나를 위한' },
  { id: 'baby',       label: '출산·산모' },
  { id: 'other',      label: '기타' },
];

const BUDGETS = [
  { value: '5만원대' },
  { value: '10만원대', popular: true },
  { value: '20만원대' },
  { value: '30만원 이상' },
];

const QUANTITIES = [
  { value: '1',   label: '1개' },
  { value: '2',   label: '2개' },
  { value: '3',   label: '3개' },
  { value: '4-5', label: '4~5개' },
  { value: '6+',  label: '6개+' },
];

const SIDEBAR_FEATURES = [
  { icon: <Shield className="text-green-600" size={18} />, title: '정관장 정품 보장', desc: 'KGC 공식 가맹점 인증' },
  { icon: <Truck className="text-blue-600" size={18} />,   title: '전국 당일·익일 배송', desc: '안전 포장 배송' },
  { icon: <Award className="text-purple-600" size={18} />, title: '1:1 맞춤 추천', desc: '예산·목적별 최적 제품' },
];

export default function PersonalGiftConsultation() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    giftType: '',
    budget: '',
    quantity: '1',
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
    if (!formData.name || !formData.phone || !formData.budget) {
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
        body: JSON.stringify({ formType: 'personal', formData }),
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

  const isValid = !!(formData.name && formData.phone && formData.budget && privacyConsent);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">상담 신청이 완료되었습니다!</h2>
          <div className="my-4 flex flex-col items-center">
            <div className="inline-flex bg-black rounded-lg px-3 py-2">
              <Image
                src="/logos/kgc-wordmark.png"
                alt="정관장 JUNG KWAN JANG"
                width={638}
                height={361}
                className="h-9 w-auto"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">정관장 조원점 · 공식 인증 판매점</p>
          </div>
          <p className="text-gray-600 mb-6">
            담당자가 확인 후 빠르게 연락드립니다.<br />
            <span className="text-red-600 font-semibold">평균 응답 시간: 30분 이내</span>
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5">
            <p className="text-sm font-semibold text-gray-900 mb-2">💬 더 빠른 상담을 원하시나요?</p>
            <button
              onClick={() => window.open('https://pf.kakao.com/_IrSRX/', '_blank')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />카톡으로 즉시 상담
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
          <span className="text-base font-bold text-gray-900">개인 선물 상담</span>
          <a href="tel:031-268-0304" className="flex items-center gap-1.5 text-red-600 hover:text-red-700">
            <Phone size={18} />
            <span className="text-sm font-semibold hidden sm:inline">031-268-0304</span>
            <span className="text-sm font-semibold sm:hidden">전화</span>
          </a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10 lg:items-start">

          {/* ── 폼 영역 ── */}
          <div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">정관장 홍삼 개인 선물 상담</h1>
            <p className="text-sm text-gray-500 mb-6 break-keep">예산과 목적에 맞는 최적의 구성을 1:1로 추천해드립니다</p>

            <div className="space-y-5">

              {/* 선물 대상 (선택) */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  선물 대상 <span className="text-gray-400 font-normal text-xs ml-1">(선택)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {GIFT_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, giftType: prev.giftType === t.id ? '' : t.id }))}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                        formData.giftType === t.id
                          ? 'border-red-600 bg-red-600 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-red-400'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 예산 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  예산 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BUDGETS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, budget: opt.value }))}
                      className={`relative flex items-center justify-center py-3.5 rounded-xl border-2 transition-all min-h-[52px] text-sm font-medium ${
                        formData.budget === opt.value
                          ? 'border-red-600 bg-red-50 text-red-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-red-300'
                      }`}
                    >
                      {opt.popular && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">인기</span>
                      )}
                      {opt.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* 수량 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">수량</label>
                <div className="flex flex-wrap gap-2">
                  {QUANTITIES.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, quantity: opt.value }))}
                      className={`px-5 py-3 rounded-xl border-2 font-medium transition-all text-sm min-h-[48px] ${
                        formData.quantity === opt.value
                          ? 'border-red-600 bg-red-50 text-red-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-red-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 성함 + 연락처 (데스크탑에서 한 줄) */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    성함 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="홍길동"
                    autoComplete="name"
                    className="w-full px-4 py-3.5 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none placeholder:text-gray-400"
                  />
                </div>
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
                    className="w-full px-4 py-3.5 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none placeholder:text-gray-400"
                  />
                  <p className="mt-1.5 text-xs text-gray-400">상담 목적으로만 사용됩니다</p>
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
                  placeholder="특별히 원하시는 구성이나 배송 요청사항을 적어주세요"
                  rows={3}
                  className="w-full px-4 py-3.5 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none placeholder:text-gray-400"
                />
              </div>

              <PrivacyConsent checked={privacyConsent} onChange={setPrivacyConsent} />

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !isValid}
                className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all text-base min-h-[56px] flex items-center justify-center"
              >
                {isSubmitting ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />전송 중...</>
                ) : '무료 상담 신청하기 →'}
              </button>
              <p className="text-xs text-center text-gray-400">⚡ 30분 내 담당자가 연락드립니다</p>

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
                <p className="mt-2 text-xs text-gray-500 text-center">수원 장안구·북수원 정관장 조원점</p>
              </div>

            </div>
          </div>

          {/* ── 데스크탑 사이드바 ── */}
          <aside className="hidden lg:block sticky top-24 space-y-4">

            {/* 왜 조원점인가 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">✅ 정관장 조원점이란?</h3>
              <div className="space-y-3">
                {SIDEBAR_FEATURES.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">{f.icon}</div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{f.title}</div>
                      <div className="text-xs text-gray-500">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
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

            {/* 매장 위치 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-600">
              <p className="font-semibold text-gray-900 mb-1">📍 정관장 조원점</p>
              <p className="text-xs leading-relaxed break-keep">
                경기도 수원시 장안구 송원로 81<br />메가플러스 A동 111호<br />
                <span className="text-gray-400">주차 가능 · 방문 상담 환영</span>
              </p>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
