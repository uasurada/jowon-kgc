'use client';

import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Phone, ChevronRight, Building, Gift, Users, Award } from 'lucide-react';

export default function BusinessOrderConsultation() {
  const [step, setStep] = useState('select');
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    quantity: '',
    budgetPerUnit: '',
    deliveryType: 'bulk',
    desiredDate: '',
    message: ''
  });

    // ✅ 이거 추가
  const [isSubmitting, setIsSubmitting] = useState(false);
  const purposes = [
    {
      id: 'employee',
      icon: <Users className="text-blue-500" size={32} />,
      title: '직원 선물',
      desc: '명절, 창립기념일, 직원 복지',
      popular: true
    },
    {
      id: 'client',
      icon: <Award className="text-purple-500" size={32} />,
      title: '거래처 선물',
      desc: '비즈니스 감사 선물, VIP 고객',
      popular: true
    },
    {
      id: 'event',
      icon: <Gift className="text-green-500" size={32} />,
      title: '행사 답례품',
      desc: '세미나, 컨퍼런스, 기념품'
    },
    {
      id: 'other',
      icon: <Building className="text-orange-500" size={32} />,
      title: '기타 단체 주문',
      desc: '협회, 동호회, 각종 단체'
    }
  ];

  const budgetOptions = [
    '3만원대',
    '5만원대',
    '10만원대',
    '20만원대',
    '30만원 이상'
  ];

  const handlePurposeSelect = (purpose: string) => {
    setSelectedPurpose(purpose);
    setStep('form');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
  if (!formData.companyName || !formData.contactName || !formData.phone || !formData.quantity || !formData.budgetPerUnit) {
    alert('필수 항목을 입력해주세요');
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formType: 'business',
        formData: {
          companyName: formData.companyName,
          contactName: formData.contactName,
          phone: formData.phone,
          email: formData.email,
          purpose: selectedPurpose,
          quantity: formData.quantity,
          budgetPerUnit: formData.budgetPerUnit,
          deliveryType: formData.deliveryType,
          desiredDate: formData.desiredDate,
          message: formData.message,
        },
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ 견적 문의 완료:', result.id);
      setStep('complete');
    } else {
      alert('견적 문의 중 오류가 발생했습니다: ' + result.error);
    }
  } catch (error) {
    console.error('Submit error:', error);
    alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleKakaoChat = () => {
    window.open('http://pf.kakao.com/_your_channel', '_blank');
  };

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            견적 문의가 접수되었습니다!
          </h2>
          <p className="text-gray-600 mb-6">
            전담 매니저가 2~3가지 구성안을<br />
            빠르게 제안드리겠습니다.<br />
            (평균 응답 시간: 1시간 이내)
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">📋 다음 단계</h3>
            <ul className="text-sm text-gray-700 text-left space-y-1">
              <li>1. 견적서 및 구성안 발송 (1시간 내)</li>
              <li>2. 상세 상담 및 조율</li>
              <li>3. 주문 확정 및 제작</li>
              <li>4. 납품 및 배송</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 font-medium mb-2">
              💬 급하신가요?
            </p>
            <p className="text-xs text-gray-600 mb-3">
              담당자와 바로 상담하실 수 있습니다
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:031-1234-5678"
                className="flex items-center justify-center gap-1 bg-white border border-gray-300 hover:border-gray-400 rounded-lg py-2 text-sm font-semibold text-gray-900 transition-colors"
              >
                <Phone size={16} />
                <span>전화</span>
              </a>
              <button
                onClick={handleKakaoChat}
                className="flex items-center justify-center gap-1 bg-yellow-400 hover:bg-yellow-500 rounded-lg py-2 text-sm font-semibold text-gray-900 transition-colors"
              >
                <MessageCircle size={16} />
                <span>카톡</span>
              </button>
            </div>
          </div>

          <a
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => step === 'form' ? setStep('select') : window.history.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">뒤로</span>
          </button>
          <div className="text-lg font-bold text-gray-900">기업 주문 상담</div>
          <a 
            href="tel:031-1234-5678" 
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
          >
            <Phone size={18} />
            <span className="text-sm font-semibold">전화</span>
          </a>
        </div>
      </header>

      {step === 'select' && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
            </div>
            <p className="text-center text-sm text-gray-600">주문 용도 선택</p>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-3">
            어떤 용도의 선물인가요?
          </h1>
          <p className="text-center text-gray-600 mb-8">
            용도에 맞는 최적의 구성과 견적을 제안드립니다
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {purposes.map((purpose) => (
              <button
                key={purpose.id}
                onClick={() => handlePurposeSelect(purpose.id)}
                className="relative bg-white border-2 border-gray-200 hover:border-blue-400 rounded-xl p-6 text-left transition-all hover:shadow-md group"
              >
                {purpose.popular && (
                  <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    인기
                  </span>
                )}
                <div className="mb-3">{purpose.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{purpose.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{purpose.desc}</p>
                <div className="flex items-center text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  <span>선택하기</span>
                  <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-3">🏢 기업 고객 특별 혜택</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>수량별 맞춤 할인 제공</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>일괄 배송 / 개별 배송 모두 가능</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>세금계산서 발행 가능</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>반복 주문 시 추가 할인</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 rounded-xl p-6">
            <p className="font-semibold text-gray-900 mb-2">💬 전담 매니저 직접 상담</p>
            <p className="text-sm text-gray-600 mb-4">
              복잡한 요구사항도 빠르게 해결해드립니다
            </p>
            <div className="grid grid-cols-2 gap-3">
              <a 
                href="tel:031-1234-5678"
                className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 hover:border-gray-400 rounded-lg py-3 font-semibold text-gray-900 transition-colors"
              >
                <Phone size={18} />
                <span>전화 상담</span>
              </a>
              <button
                onClick={handleKakaoChat}
                className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg py-3 font-semibold text-gray-900 transition-colors"
              >
                <MessageCircle size={18} />
                <span>카톡 상담</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'form' && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
              <div className="w-16 h-1 bg-blue-600"></div>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            </div>
            <p className="text-center text-sm text-gray-600">견적 정보 입력</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-800">
              <span className="font-semibold">선택한 용도:</span> {purposes.find(p => p.id === selectedPurpose)?.title}
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  회사명 *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="(주)회사명"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  담당자명 *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  연락처 *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="010-1234-5678"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  이메일 (선택)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@company.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  수량 (대략) *
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="예: 50개, 100개"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  1인당 예산 *
                </label>
                <select
                  name="budgetPerUnit"
                  value={formData.budgetPerUnit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                >
                  <option value="">선택해주세요</option>
                  {budgetOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                배송 방식
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'bulk' }))}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    formData.deliveryType === 'bulk'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  일괄 배송
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'individual' }))}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    formData.deliveryType === 'individual'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  개별 배송
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {formData.deliveryType === 'bulk' ? '한 곳으로 일괄 배송' : '각 수령인에게 개별 배송'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                희망 납기일 (선택)
              </label>
              <input
                type="date"
                name="desiredDate"
                value={formData.desiredDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                추가 요청사항 (선택)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="특별한 요청사항이나 문의사항을 입력해주세요"
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>전송 중...</span>
                </>
              ) : (
                <>
                  <span>견적 문의하기</span>
                  <ChevronRight size={20} />
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-500">
              제출하시면 전담 매니저가 1시간 내로 구성안을 제안드립니다
            </p>
          </div>
        </div>
      )}
    </div>
  );
}