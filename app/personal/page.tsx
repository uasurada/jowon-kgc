'use client';

import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Phone, ChevronRight, Gift, Heart, Users, Baby, Briefcase, Sparkles } from 'lucide-react';

export default function PersonalGiftConsultation() {
  const [step, setStep] = useState('select');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    budget: '',
    quantity: '1',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const giftTypes = [
    {
      id: 'parents',
      icon: <Heart className="text-red-500" size={32} />,
      title: '부모님 선물',
      desc: '건강을 생각하는 효도 선물',
      popular: true,
      highlight: true // 특별 강조용
    },
    {
      id: 'business',
      icon: <Briefcase className="text-blue-500" size={32} />,
      title: '직장 상사 / 감사 선물',
      desc: '품격있는 비즈니스 선물',
      popular: true
    },
    {
      id: 'hospital',
      icon: <Gift className="text-green-500" size={32} />,
      title: '병문안 / 회복 기원',
      desc: '빠른 쾌유를 바라는 마음'
    },
    {
      id: 'self',
      icon: <Sparkles className="text-pink-500" size={32} />,
      title: '나를 위한 선물',
      desc: '오늘도 수고한 나를 위한 건강한 보상',
      popular: true,
      highlight: true // 특별 강조용
    },
    {
      id: 'baby',
      icon: <Baby className="text-purple-500" size={32} />,
      title: '출산 / 산모 선물',
      desc: '산후조리에 좋은 선물',
    },
    {
      id: 'event',
      icon: <Users className="text-orange-500" size={32} />,
      title: '기타 행사',
      desc: '집들이, 생일 등 각종 행사'
    }
  ];

  const budgetOptions = [
    { value: '5만원대', label: '5만원대' },
    { value: '10만원대', label: '10만원대 (인기)' },
    { value: '20만원대', label: '20만원대' },
    { value: '30만원 이상', label: '30만원 이상' }
  ];

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setStep('form');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.budget) {
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
          formType: 'personal',
          formData: {
            name: formData.name,
            phone: formData.phone,
            giftType: selectedType,
            budget: formData.budget,
            quantity: formData.quantity,
            message: formData.message,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ 문의 접수 완료:', result.id);
        setStep('complete');
      } else {
        alert('문의 접수 중 오류가 발생했습니다: ' + result.error);
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
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            상담 신청이 완료되었습니다!
          </h2>

          {/* ✅ 여기 로고 추가 */}
          <div className="mt-4 mb-4">
            <img
              src="/logos/kgc-logo.png"
              alt="정관장 조원점"
              className="mx-auto w-[150px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              정관장 조원점 · 공식 인증 판매점
            </p>
          </div>

          <p className="text-gray-600 mb-6">
            담당자가 확인 후 빠르게 연락드리겠습니다.<br />
            (평균 응답 시간: 30분 이내)
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 font-medium mb-2">
              💬 더 빠른 상담을 원하시나요?
            </p>
            <p className="text-xs text-gray-600 mb-3">
              카톡으로 바로 상담받으실 수 있습니다
            </p>
            <button
              onClick={handleKakaoChat}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              <span>카톡으로 즉시 상담</span>
            </button>
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
          <div className="text-lg font-bold text-gray-900">개인 선물 상담</div>
          <a 
            href="tel:031-268-0304" 
            className="flex items-center gap-1 text-red-600 hover:text-red-700"
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
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
            </div>
            <p className="text-center text-sm text-gray-600">선물 대상 선택</p>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-3">
            어떤 분께 드릴 선물인가요?
          </h1>
          <p className="text-center text-gray-600 mb-8">
            대상에 맞는 최적의 상품을 추천해드립니다
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {giftTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`relative bg-white border-2 rounded-xl p-6 text-left transition-all hover:shadow-md group ${
                  type.highlight 
                    ? 'border-pink-300 bg-gradient-to-br from-pink-50 to-white hover:border-pink-400' 
                    : 'border-gray-200 hover:border-red-400'
                }`}
              >
                {type.popular && (
                  <span className={`absolute top-3 right-3 text-white text-xs font-bold px-2 py-1 rounded ${
                    type.highlight ? 'bg-pink-500' : 'bg-red-600'
                  }`}>
                    {type.highlight ? '추천' : '인기'}
                  </span>
                )}
                <div className="mb-3">{type.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{type.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{type.desc}</p>
                <div className={`flex items-center text-sm font-semibold group-hover:translate-x-1 transition-transform ${
                  type.highlight ? 'text-pink-600' : 'text-red-600'
                }`}>
                  <span>선택하기</span>
                  <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 rounded-xl p-6">
            <p className="font-semibold text-gray-900 mb-2">💬 바로 상담하고 싶으세요?</p>
            <p className="text-sm text-gray-600 mb-4">
              카톡이나 전화로 즉시 상담 가능합니다
            </p>
            <div className="grid grid-cols-2 gap-3">
              <a 
                href="tel:031-268-0304"
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
              <div className="w-16 h-1 bg-red-600"></div>
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            </div>
            <p className="text-center text-sm text-gray-600">상담 정보 입력</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-800">
              <span className="font-semibold">선택한 선물:</span> {giftTypes.find(t => t.id === selectedType)?.title}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                예산 (대략적으로 선택해주세요)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {budgetOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, budget: option.value }))}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                      formData.budget === option.value
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                수량
              </label>
              <select
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
              >
                <option value="1">1개</option>
                <option value="2">2개</option>
                <option value="3">3개</option>
                <option value="4-5">4~5개</option>
                <option value="6+">6개 이상</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                성함
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="홍길동"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                연락처
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="01012345678"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
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
                placeholder="배송 관련 요청사항이나 특별히 원하시는 구성이 있으시면 적어주세요"
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>전송 중...</span>
                </>
              ) : (
                <>
                  <span>상담 신청하기</span>
                  <ChevronRight size={20} />
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-500">
              신청하시면 담당자가 30분 내로 연락드립니다
            </p>
          </div>
        </div>
      )}
    </div>
  );
}