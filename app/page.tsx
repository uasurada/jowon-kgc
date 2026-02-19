import React from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ChevronRight,
  CheckCircle,
  Award,
  CreditCard,
  Package,
  Navigation,
  ExternalLink,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-bold text-red-700 tracking-tight">
              정관장 조원점
            </div>
            <div className="mt-0.5 text-[11px] sm:text-xs text-gray-600 leading-snug break-keep">
              수원 장안구·북수원 정관장 공식 가맹점 | 홍삼 선물·상담
            </div>
          </div>

          <a
            href="tel:031-268-0304"
            className="shrink-0 inline-flex items-center gap-2 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            <Phone size={16} />
            <span className="whitespace-nowrap">전화상담</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-white py-10 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mx-auto max-w-[22ch] sm:max-w-[26ch] md:max-w-none text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-gray-900">
            <span className="block">정관장 홍삼 선물 상담</span>
            <span className="block">선물 선택이 어려우시죠?</span>
            <span className="block">정성을 담아 함께 고민해 드립니다</span>
          </h1>

          {/* ✅ SEO용 보강 문장 */}
          <p className="mt-4 text-sm sm:text-base text-gray-600 mx-auto max-w-2xl leading-relaxed break-keep">
            부모님 선물·면역력 관리·홍삼 처음 선택까지.
            <span className="block sm:inline"> </span>
            정관장 공식 가맹점(수원 장안구·북수원)에서 1:1 맞춤 상담을 도와드립니다.
          </p>

          {/* ✅ 핵심 포인트(칩) - 모바일 정돈 */}
          <div className="mt-6 mb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
            <div className="flex items-start gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
              <CheckCircle className="text-green-600 mt-0.5 shrink-0" size={18} />
              <span className="text-sm font-medium text-gray-800 leading-snug break-keep">
                정관장 공식 가맹점(정품 보장)
              </span>
            </div>

            <div className="flex items-start gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
              <CheckCircle className="text-green-600 mt-0.5 shrink-0" size={18} />
              <span className="text-sm font-medium text-gray-800 leading-snug break-keep">
                부모님·직장 선물 / 기업 단체 주문 상담
              </span>
            </div>

            <div className="flex items-start gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
              <CheckCircle className="text-green-600 mt-0.5 shrink-0" size={18} />
              <span className="text-sm font-medium text-gray-800 leading-snug break-keep">
                홍삼 선물 전국 당일/익일 배송
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 🎁 카탈로그 배너 */}
      <section className="py-6 px-4 bg-white border-y border-gray-200">
        <div className="max-w-4xl mx-auto">
          <a
            href="/catalog"
            className="group relative block bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-5 sm:p-6 overflow-hidden hover:shadow-xl transition-all"
          >
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="text-red-600" size={26} />
                </div>

                <div className="text-white min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={16} />
                    <span className="text-[11px] font-semibold bg-yellow-400 text-gray-900 px-2 py-1 rounded">
                      NEW
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 leading-tight break-keep">
                    2026 선물 카탈로그
                  </h3>
                  <p className="text-sm text-red-100 leading-snug break-keep">
                    예산별 추천 제품 한눈에 보기
                  </p>
                </div>
              </div>

              {/* 모바일에서도 방향성이 보이게 */}
              <div className="shrink-0 inline-flex items-center gap-2 text-white font-semibold">
                <span className="hidden sm:inline">카탈로그 보기</span>
                <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Main CTA Buttons */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-3 tracking-tight">
            어떤 선물을 찾으세요?
          </h2>

          <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed break-keep">
            수원 정관장 매장에서 홍삼 선물 추천을 빠르게 도와드립니다.
            <span className="block sm:inline"> </span>
            부모님 선물, 면역력 관리, 기업 단체 주문까지 상황에 맞게 안내해드려요.
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* 개인 선물 버튼 */}
            <a
              href="/personal"
              className="group relative bg-gradient-to-br from-red-50 to-white border-2 border-red-200 hover:border-red-400 rounded-2xl p-5 sm:p-6 text-left transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-3">👤</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 tracking-tight">
                개인 선물 상담
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed break-keep">
                부모님 · 직장 상사
                <span className="block" />
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
              className="group relative bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-5 sm:p-6 text-left transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-3">🏢</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 tracking-tight">
                기업 주문 상담
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed break-keep">
                직원 선물 · 거래처 선물
                <span className="block" />
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

      {/* ✅ 질문형 섹션 */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-900 mb-6 tracking-tight break-keep">
            홍삼 선물, 이런 고민이 있으신가요?
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2 break-keep">
                부모님 선물로 어떤 홍삼이 좋을까요?
              </p>
              <p className="text-sm text-gray-600 leading-relaxed break-keep">
                연령·건강 목표·복용 경험에 따라 추천이 달라집니다.
                <span className="block sm:inline"> </span>
                수원 정관장 조원점에서 1:1로 안내해드려요.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2 break-keep">
                홍삼이 처음인데 어떤 제품이 맞을까요?
              </p>
              <p className="text-sm text-gray-600 leading-relaxed break-keep">
                섭취 목적(면역력/활력/피로)과 예산에 맞춰 부담 없는 제품부터 추천해드립니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2 break-keep">
                기업·단체 주문은 어떻게 진행되나요?
              </p>
              <p className="text-sm text-gray-600 leading-relaxed break-keep">
                예산·수량·납품 일정에 맞춰 견적과 구성 제안을 드리고, 전국 일괄 배송도 가능합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2 break-keep">
                수원/북수원 근처에서 바로 상담받을 수 있나요?
              </p>
              <p className="text-sm text-gray-600 leading-relaxed break-keep">
                장안구 조원동 매장 방문 상담 가능하며, 전화/카톡으로도 빠르게 상담해드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="text-yellow-700" size={24} />
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">실시간 상담 가능</h3>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700 mb-4 leading-snug break-keep">
              <Clock size={16} className="shrink-0" />
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

      {/* Trust & Features Section */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg sm:text-xl font-bold text-center text-gray-900 mb-8 tracking-tight break-keep">
            왜 정관장 조원점인가요?
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border border-red-100 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-red-600" size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 break-keep">KGC 공식 가맹점</h4>
              <p className="text-sm text-gray-600 leading-relaxed break-keep">
                정관장 정품 보장
                <span className="block" />
                믿을 수 있는 품질
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="text-blue-600" size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 break-keep">간편 결제 지원</h4>
              <p className="text-sm text-gray-600 leading-relaxed break-keep">
                수원페이 · 백화점상품권
                <span className="block" />
                카드 · 비대면결제 · 계좌이체
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-green-600" size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 break-keep">전국 배송 가능</h4>
              <p className="text-sm text-gray-600 leading-relaxed break-keep">
                당일/익일 배송
                <span className="block" />
                안전 포장 보장
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
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
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 tracking-tight">
            <MapPin size={20} className="text-red-600" />
            매장 정보
          </h3>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-gray-800 font-semibold mb-2">정관장 조원점</p>

            <p className="text-sm text-gray-600 mb-3 leading-relaxed break-keep">
              경기도 수원시 장안구 송원로 81 메가플러스 A동 111호
              <span className="block" />
              주차 가능 · 방문 상담 환영
              <span className="block" />
              수원·북수원 인근 홍삼 선물/면역력 상담은 정관장 조원점에서 도와드립니다.
            </p>

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
          <p className="mb-2 break-keep">
            정관장 조원점 (수원 장안구 조원동 메가플러스빌딩 111호)
          </p>
          <p className="mb-4 break-keep">사업자등록번호: 441-17-02401 | 대표: 박시영</p>
          <p className="text-xs text-gray-500">© 2026 정관장 조원점. All rights reserved.</p>
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
