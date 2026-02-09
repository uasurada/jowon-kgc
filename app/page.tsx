import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, ChevronRight, CheckCircle, Award, CreditCard, Package, Navigation, ExternalLink, BookOpen, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-red-700">정관장 조원점</div>
            <div className="text-xs text-gray-600">
              수원 장안구·북수원 정관장 공식 가맹점 | 홍삼 선물·상담
            </div>
          </div>
          <a 
            href="tel:031-268-0304" 
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            <Phone size={16} />
            <span>전화상담</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            정관장 홍삼 선물 상담<br className="md:hidden" /> 선물 선택이 어려우시죠?<br /> 정성을 담아 함께 고민해 드립니다
          </h1>

          {/* ✅ SEO용 보강 문장 (첫 화면에 의도 키워드 자연 삽입) */}
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            부모님 선물·면역력 관리·홍삼 처음 선택까지. 정관장 공식 가맹점(수원 장안구·북수원)에서<br /> 1:1 맞춤 상담을 도와드립니다.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6 mb-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <CheckCircle className="text-green-600" size={18} />
              <span className="text-sm font-medium text-gray-700">정관장 공식 가맹점(정품 보장)</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <CheckCircle className="text-green-600" size={18} />
              <span className="text-sm font-medium text-gray-700">부모님·직장 선물 / 기업 단체 주문 상담</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <CheckCircle className="text-green-600" size={18} />
              <span className="text-sm font-medium text-gray-700">홍삼 선물 전국 당일/익일 배송</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🎁 NEW: 카탈로그 배너 (히어로 바로 아래) */}
      <section className="py-6 px-4 bg-white border-y border-gray-200">
        <div className="max-w-4xl mx-auto">
          <a
            href="/catalog"
            className="group relative block bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 overflow-hidden hover:shadow-xl transition-all"
          >
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>

            {/* 컨텐츠 */}
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="text-red-600" size={28} />
                </div>
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={16} />
                    <span className="text-xs font-semibold bg-yellow-400 text-gray-900 px-2 py-1 rounded">
                      NEW
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-1">
                    2026 설날 선물 카탈로그
                  </h3>
                  <p className="text-sm text-red-100">
                    예산별 추천 제품 한눈에 보기
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-white font-semibold group-hover:translate-x-2 transition-transform">
                <span>카탈로그 보기</span>
                <ChevronRight size={24} />
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Main CTA Buttons */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
            어떤 선물을 찾으세요?
          </h2>

          {/* ✅ CTA 위 SEO 보강 문장 (의도 키워드 자연 삽입) */}
          <p className="text-sm text-gray-600 text-center mb-6">
            수원 정관장 매장에서 홍삼 선물 추천을 빠르게 도와드립니다.<br />
            부모님 선물, 면역력 관리, 기업 단체 주문까지 상황에 맞게 안내해드려요.
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* 개인 선물 버튼 */}
            <a
              href="/personal"
              className="group relative bg-gradient-to-br from-red-50 to-white border-2 border-red-200 hover:border-red-400 rounded-2xl p-6 text-left transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-3">👤</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">개인 선물 상담</h3>
              <p className="text-sm text-gray-600 mb-4">
                부모님 · 직장 상사<br />
                병문안 · 출산 선물
              </p>
              <div className="flex items-center text-red-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                <span>선물 추천받기</span>
                <ChevronRight size={20} />
              </div>
            </a>

            {/* 기업 주문 버튼 */}
            <a
              href="/business"
              className="group relative bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-6 text-left transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-3">🏢</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">기업 주문 상담</h3>
              <p className="text-sm text-gray-600 mb-4">
                직원 선물 · 거래처 선물<br />
                단체 주문 · 일괄 배송
              </p>
              <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                <span>견적 문의하기</span>
                <ChevronRight size={20} />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ✅ 질문형 섹션 (네이버 SEO에 특히 유리) */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-6">
            홍삼 선물, 이런 고민이 있으신가요?
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">부모님 선물로 어떤 홍삼이 좋을까요?</p>
              <p className="text-sm text-gray-600">
                연령·건강 목표·복용 경험에 따라 추천이 달라집니다.<br /> 수원 정관장 조원점에서 1:1로 안내해드려요.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">홍삼이 처음인데 어떤 제품이 맞을까요?</p>
              <p className="text-sm text-gray-600">
                섭취 목적(면역력/활력/피로)과 예산에 맞춰 부담 없는 제품부터<br /> 추천해드립니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">기업·단체 주문은 어떻게 진행되나요?</p>
              <p className="text-sm text-gray-600">
                예산·수량·납품 일정에 맞춰 견적과 구성 제안을 드리고,<br /> 전국 일괄 배송도 가능합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">수원/북수원 근처에서 바로 상담받을 수 있나요?</p>
              <p className="text-sm text-gray-600">
                장안구 조원동 매장 방문 상담 가능하며, 전화/카톡으로도<br /> 빠르게 상담해드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="text-yellow-700" size={24} />
              <h3 className="text-lg font-bold text-gray-900">실시간 상담 가능</h3>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
              <Clock size={16} />
              <span>평일 10:00-20:00 / 토요일 10:00-20:00</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a 
                href="tel:031-268-0304"
                className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 hover:border-gray-400 rounded-lg py-3 font-semibold text-gray-900 transition-colors"
              >
                <Phone size={18} />
                <span>전화 상담</span>
              </a>
              <a 
                href="https://pf.kakao.com/_IrSRX/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg py-3 font-semibold text-gray-900 transition-colors"
              >
                <MessageCircle size={18} />
                <span>카톡 상담</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features Section (텍스트 버전) */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-center text-gray-900 mb-8">
            왜 정관장 조원점인가요?
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 정관장 공식 가맹점 */}
            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border border-red-100 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-red-600" size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">KGC 공식 가맹점</h4>
              <p className="text-sm text-gray-600">
                정관장 정품 보장<br />
                믿을 수 있는 품질
              </p>
            </div>

            {/* 간편 결제 */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="text-blue-600" size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">간편 결제 지원</h4>
              <p className="text-sm text-gray-600">
                수원페이 · 백화점상품권<br />
                카드 · 비대면결제 · 계좌이체
              </p>
            </div>

            {/* 전국 배송 */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-green-600" size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">전국 배송 가능</h4>
              <p className="text-sm text-gray-600">
                당일/익일 배송<br />
                안전 포장 보장
              </p>
            </div>
          </div>

          {/* 추가 신뢰 요소 */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
              <CheckCircle className="text-green-600" size={16} />
              <span className="text-sm text-gray-700">정품 인증</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
              <CheckCircle className="text-green-600" size={16} />
              <span className="text-sm text-gray-700">안전한 거래</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
              <CheckCircle className="text-green-600" size={16} />
              <span className="text-sm text-gray-700">개인정보 보호</span>
            </div>
          </div>
        </div>
      </section>

      {/* Store Info */}
      <section className="py-8 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-red-600" />
            매장 정보
          </h3>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-gray-800 font-medium mb-2">정관장 조원점</p>
            <p className="text-sm text-gray-600 mb-3">
              경기도 수원시 장안구 송원로 81 메가플러스 A동 111호<br />
              주차 가능 · 방문 상담 환영<br />
              수원·북수원 인근 홍삼 선물/면역력 상담은 정관장 조원점에서 도와드립니다.
            </p>

            {/* ✅ 지도 미리보기 (absolute 제거: 무조건 보임) */}
            {/* ✅ 지도 바로 표시 (Google Maps Embed) */}
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
              <iframe
                title="정관장 조원점 지도"
                src="https://www.google.com/maps?q=37.302031,127.009303&z=16&output=embed"
                width="100%"
                height="280"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
              />
            </div>

            {/* ✅ 액션 버튼 */}
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="https://map.naver.com/v5/search/%EC%A0%95%EA%B4%80%EC%9E%A5%20%EC%A1%B0%EC%9B%90%EC%A0%90?c=15,0,0,0,dh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                <Navigation size={16} />
                길찾기
              </a>

              <a
                href="https://map.naver.com/v5/search/%EC%A0%95%EA%B4%80%EC%9E%A5%20%EC%A1%B0%EC%9B%90%EC%A0%90"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                지도 크게 보기
                <ExternalLink size={16} className="text-gray-500" />
              </a>
            </div>

            <p className="mt-2 text-xs text-gray-500">네이버지도로 연결됩니다.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm">
          <p className="mb-2">정관장 조원점 (수원 장안구 조원동 메가플러스빌딩 111호)</p>
          <p className="mb-4">사업자등록번호: 441-17-02401 | 대표: 박시영</p>
          <p className="text-xs text-gray-500">
            © 2026 정관장 조원점. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Floating Quick Action */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <a
          href="https://pf.kakao.com/_IrSRX/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          aria-label="카카오톡 상담"
        >
          <MessageCircle size={28} className="text-gray-900" />
        </a>
        <a
          href="tel:031-268-0304"
          className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          aria-label="전화 상담"
        >
          <Phone size={28} className="text-white" />
        </a>
      </div>
    </div>
  );
}
