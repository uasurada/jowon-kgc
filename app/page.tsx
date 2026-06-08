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
  Star,
  Shield,
  Truck,
  Building2,
  ChevronDown,
} from 'lucide-react';

const faqItems = [
  {
    q: '정관장 조원점은 KGC 공식 가맹점인가요?',
    a: '네, KGC한국인삼공사 공식 인증 가맹점입니다. 정품 보증서와 함께 제품을 구매하실 수 있으며 위조품·가품 걱정 없이 안심하고 구매하실 수 있습니다. 수원 장안구 조원동에 위치한 지역 밀착형 매장으로 오랫동안 운영해왔습니다.',
  },
  {
    q: '부모님 선물로 어떤 홍삼 제품이 좋을까요?',
    a: '연령과 건강 상태에 따라 추천이 달라집니다. 60대 이상 부모님께는 홍삼 농축액이나 6년근 홍삼 제품을 많이 선택하십니다. 예산과 복용 경험을 알려주시면 1:1로 맞춤 추천해드립니다. 전화(031-268-0304) 또는 카카오톡으로 문의주세요.',
  },
  {
    q: '기업·단체 주문도 가능한가요?',
    a: '기업 명절 선물, 직원 복지 선물, 거래처 선물 등 단체 주문을 전문으로 처리합니다. 수량과 예산에 따라 맞춤 구성 및 전국 일괄 배송, 세금계산서 발행이 가능합니다. 상단의 기업 주문 상담 버튼을 통해 견적을 신청해주세요.',
  },
  {
    q: '전화나 카카오톡으로도 주문이 가능한가요?',
    a: '전화(031-268-0304) 또는 카카오톡 채널로 상담 후 비대면 주문도 가능합니다. 매장 방문 없이 제품 확인·결제·배송까지 모두 진행하실 수 있습니다. 전국 택배 배송이 가능하며 오전 주문 시 당일 발송을 목표로 합니다.',
  },
  {
    q: '수원페이·상품권으로도 결제가 되나요?',
    a: '수원페이, 백화점상품권, 신용·체크카드, 계좌이체, 비대면 결제 등 다양한 결제 수단을 지원합니다. 자세한 결제 방법은 상담 시 안내해드립니다.',
  },
];

const reviews = [
  {
    text: '어버이날 선물로 홍삼을 처음 사봤는데, 부모님 나이와 건강 상태를 말씀드렸더니 딱 맞는 제품을 추천해주셨어요. 포장도 예쁘고 부모님이 너무 좋아하셨습니다.',
    name: '김○○님',
    sub: '2026년 5월 · 어버이날 선물',
    initial: '김',
    color: 'bg-red-100 text-red-700',
  },
  {
    text: '명절 직원 단체 선물 50세트를 주문했는데, 견적부터 배송까지 신속하게 처리해주셨어요. 세금계산서 발행도 바로 되고 약속 날짜에 정확히 배송됐습니다.',
    name: '이○○님 (총무팀)',
    sub: '2026년 2월 · 기업 단체 주문',
    initial: '이',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    text: '홍삼이 처음이라 어떤 걸 사야 할지 몰랐는데, 카카오톡으로 상담하니까 예산에 맞는 입문용 제품을 바로 추천해주셨어요. 부담 없이 시작할 수 있어서 좋았습니다.',
    name: '박○○님',
    sub: '2026년 4월 · 첫 홍삼 구매',
    initial: '박',
    color: 'bg-green-100 text-green-700',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* 상단 알림 바 */}
      <div className="bg-red-700 text-white text-center py-2 px-4 text-xs sm:text-sm font-medium tracking-wide">
        ✅&nbsp; KGC 공식 인증 가맹점&nbsp;&nbsp;|&nbsp;&nbsp;전국 택배 배송&nbsp;&nbsp;|&nbsp;&nbsp;기업 단체 주문 환영
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-black text-red-700 tracking-tight">
              정관장 조원점
            </div>
            <div className="mt-0.5 text-[11px] sm:text-xs text-gray-500 leading-snug break-keep">
              수원 장안구·북수원 공식 가맹점
            </div>
          </div>

          <a
            href="tel:031-268-0304"
            className="shrink-0 inline-flex items-center gap-1.5 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
          >
            <Phone size={15} />
            <span className="whitespace-nowrap">031-268-0304</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-red-50 via-orange-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">

          {/* 신뢰 배지 */}
          <div className="inline-flex items-center gap-2 bg-white border border-red-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <CheckCircle className="text-green-600" size={15} />
            <span className="text-sm font-semibold text-gray-700">KGC 공식 인증 가맹점</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-gray-900 mb-4 break-keep">
            정관장 홍삼 선물,<br />
            <span className="text-red-600">직접 고민해 드립니다</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 mx-auto max-w-xl leading-relaxed break-keep mb-8">
            부모님 선물·면역력 관리·기업 단체 주문까지,<br className="hidden sm:block" />
            수원 장안구 정관장 조원점에서 1:1 맞춤 상담을 도와드립니다.
          </p>

          {/* Hero CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm sm:max-w-none mx-auto mb-10">
            <a
              href="/personal"
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-bold text-base transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>개인 선물 상담</span>
              <ChevronRight size={18} />
            </a>
            <a
              href="/business"
              className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 hover:border-gray-500 text-gray-800 px-6 py-4 rounded-xl font-bold text-base transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <Building2 size={18} />
              <span>기업 단체 주문</span>
            </a>
          </div>

          {/* 3 포인트 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
              <Shield className="text-green-600 shrink-0" size={17} />
              <span className="text-sm font-medium text-gray-800 break-keep">정관장 정품 보장</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
              <Truck className="text-blue-600 shrink-0" size={17} />
              <span className="text-sm font-medium text-gray-800 break-keep">전국 당일/익일 배송</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
              <MessageCircle className="text-yellow-600 shrink-0" size={17} />
              <span className="text-sm font-medium text-gray-800 break-keep">카카오톡 1:1 상담</span>
            </div>
          </div>
        </div>
      </section>

      {/* 신뢰 지표 스트립 */}
      <section className="bg-gray-900 text-white py-7 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center divide-x divide-gray-700">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-red-400 mb-1">10년+</div>
              <div className="text-xs sm:text-sm text-gray-400 break-keep">수원 지역 운영</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-yellow-400 mb-1">KGC</div>
              <div className="text-xs sm:text-sm text-gray-400 break-keep">공식 인증 가맹점</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-green-400 mb-1">전국</div>
              <div className="text-xs sm:text-sm text-gray-400 break-keep">배송 가능</div>
            </div>
          </div>
        </div>
      </section>

      {/* 카탈로그 배너 */}
      <section className="py-6 px-4 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <a
            href="/catalog"
            className="group relative block bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-5 sm:p-6 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
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
                    <Sparkles size={14} />
                    <span className="text-[11px] font-bold bg-yellow-400 text-gray-900 px-2 py-0.5 rounded">
                      NEW
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-0.5 leading-tight break-keep">
                    2026 선물 카탈로그
                  </h3>
                  <p className="text-sm text-red-100 leading-snug break-keep">
                    예산별 추천 제품 한눈에 보기
                  </p>
                </div>
              </div>

              <div className="shrink-0 inline-flex items-center gap-1 text-white font-semibold">
                <span className="hidden sm:inline text-sm">카탈로그 보기</span>
                <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* 메인 CTA 카드 */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-2 tracking-tight">
            어떤 선물을 찾으세요?
          </h2>
          <p className="text-sm text-gray-500 text-center mb-7 break-keep">
            상황에 맞게 전문 상담으로 최적의 제품을 추천해드립니다
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <a
              href="/personal"
              className="group relative bg-white border-2 border-red-100 hover:border-red-400 rounded-2xl p-6 text-left transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute top-3 right-3 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                인기
              </div>
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 tracking-tight">
                개인 선물 상담
              </h3>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed break-keep">
                부모님 · 직장 상사 · 병문안<br />
                출산 선물 · 나를 위한 선물
              </p>
              <div className="flex items-center text-red-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                <span>선물 추천받기</span>
                <ChevronRight size={18} />
              </div>
            </a>

            <a
              href="/business"
              className="group relative bg-white border-2 border-blue-100 hover:border-blue-400 rounded-2xl p-6 text-left transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute top-3 right-3 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                단체
              </div>
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 tracking-tight">
                기업 주문 상담
              </h3>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed break-keep">
                직원 선물 · 거래처 선물<br />
                단체 주문 · 일괄 배송
              </p>
              <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                <span>견적 문의하기</span>
                <ChevronRight size={18} />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 고객 후기 */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 tracking-tight">
              고객 후기
            </h2>
            <div className="flex items-center justify-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-2 text-sm font-bold text-gray-700">4.9 / 5.0</span>
            </div>
            <p className="text-xs text-gray-400">실제 구매 고객의 후기</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Star key={j} size={13} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4 break-keep">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${r.color}`}>
                    {r.initial}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
              자주 묻는 질문
            </h2>
            <p className="text-sm text-gray-500 break-keep">
              궁금하신 점이 있으시면 아래에서 확인해 보세요
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer select-none hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base break-keep">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className="faq-chevron text-gray-400 shrink-0"
                  />
                </summary>
                <div className="px-5 pb-5 pt-3 text-sm text-gray-600 leading-relaxed border-t border-gray-100 break-keep">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 빠른 상담 */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
                <MessageCircle size={20} className="text-gray-900" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">지금 바로 상담 가능합니다</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-0.5">
                  <Clock size={12} />
                  <span>평일·토요일 10:00 – 20:00</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:031-268-0304"
                className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 hover:border-gray-500 rounded-xl py-3.5 font-bold text-gray-900 transition-colors"
              >
                <Phone size={18} />
                <span>전화 상담</span>
              </a>
              <a
                href="https://pf.kakao.com/_IrSRX/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 rounded-xl py-3.5 font-bold text-gray-900 transition-colors"
              >
                <MessageCircle size={18} />
                <span>카톡 상담</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 홍삼 선물 고민 */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-center text-gray-900 mb-6 tracking-tight break-keep">
            홍삼 선물, 이런 고민이 있으신가요?
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                q: '부모님 선물로 어떤 홍삼이 좋을까요?',
                a: '연령·건강 목표·복용 경험에 따라 추천이 달라집니다. 수원 정관장 조원점에서 1:1로 안내해드려요.',
              },
              {
                q: '홍삼이 처음인데 어떤 제품이 맞을까요?',
                a: '섭취 목적(면역력/활력/피로)과 예산에 맞춰 부담 없는 제품부터 추천해드립니다.',
              },
              {
                q: '기업·단체 주문은 어떻게 진행되나요?',
                a: '예산·수량·납품 일정에 맞춰 견적과 구성 제안을 드리고, 전국 일괄 배송도 가능합니다.',
              },
              {
                q: '수원/북수원 근처에서 바로 상담받을 수 있나요?',
                a: '장안구 조원동 매장 방문 상담 가능하며, 전화/카톡으로도 빠르게 상담해드립니다.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <p className="font-semibold text-gray-900 mb-2 break-keep text-sm sm:text-base">
                  {item.q}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed break-keep">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 왜 조원점인가 */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-8 tracking-tight break-keep">
            왜 정관장 조원점인가요?
          </h3>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <Award className="text-red-600" size={22} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 break-keep">KGC 공식 가맹점</h4>
              <p className="text-sm text-gray-500 leading-relaxed break-keep">
                정관장 정품 100% 보장. 공식 가맹점에서만 살 수 있는 정품 보증
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <CreditCard className="text-blue-600" size={22} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 break-keep">다양한 결제 수단</h4>
              <p className="text-sm text-gray-500 leading-relaxed break-keep">
                수원페이·백화점상품권·카드·계좌이체·비대면 결제 모두 가능
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <Package className="text-green-600" size={22} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 break-keep">전국 배송</h4>
              <p className="text-sm text-gray-500 leading-relaxed break-keep">
                당일·익일 배송 가능. 안전 포장으로 전국 어디서나 받아보실 수 있습니다
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {['정품 인증', '안전한 거래', '개인정보 보호', '빠른 응답', '친절 상담'].map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600"
              >
                <CheckCircle size={13} className="text-green-500" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 매장 정보 */}
      <section className="py-10 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2 tracking-tight">
            <MapPin size={20} className="text-red-600" />
            매장 정보
          </h3>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <p className="text-gray-900 font-bold text-base mb-1">정관장 조원점</p>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed break-keep">
              경기도 수원시 장안구 송원로 81 메가플러스 A동 111호<br />
              주차 가능 · 방문 상담 환영 · 평일·토요일 10:00–20:00
            </p>

            <div className="overflow-hidden rounded-xl border border-gray-100">
              <iframe
                title="정관장 조원점 지도"
                src="https://www.google.com/maps?q=37.302031,127.009303&z=16&output=embed"
                width="100%"
                height="260"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="https://map.naver.com/v5/search/%EC%A0%95%EA%B4%80%EC%9E%A5%20%EC%A1%B0%EC%9B%90%EC%A0%90?c=15,0,0,0,dh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                <Navigation size={15} />
                길찾기
              </a>
              <a
                href="https://map.naver.com/v5/search/%EC%A0%95%EA%B4%80%EC%9E%A5%20%EC%A1%B0%EC%9B%90%EC%A0%90"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                지도 크게 보기
                <ExternalLink size={14} />
              </a>
            </div>
            <p className="mt-2 text-xs text-gray-400">네이버지도로 연결됩니다.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="text-white font-black text-lg mb-2">정관장 조원점</div>
              <p className="text-sm leading-relaxed break-keep mb-3">
                KGC한국인삼공사 공식 인증 가맹점.<br />
                수원 장안구·북수원 홍삼 선물 상담 전문.
              </p>
              <p className="text-xs text-gray-500 break-keep leading-relaxed">
                경기도 수원시 장안구 송원로 81<br />
                메가플러스 A동 111호
              </p>
            </div>
            <div>
              <div className="text-white font-semibold text-sm mb-3">바로가기</div>
              <nav className="space-y-2 text-sm">
                <a href="/personal" className="block hover:text-white transition-colors">개인 선물 상담</a>
                <a href="/business" className="block hover:text-white transition-colors">기업 단체 주문</a>
                <a href="/catalog" className="block hover:text-white transition-colors">제품 카탈로그</a>
                <a href="tel:031-268-0304" className="block hover:text-white transition-colors">031-268-0304</a>
              </nav>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-xs text-gray-500 flex flex-col sm:flex-row gap-2 sm:gap-4 break-keep">
            <span>사업자등록번호: 441-17-02401</span>
            <span>대표: 박시영</span>
            <span className="sm:ml-auto">© 2026 정관장 조원점. All rights reserved.</span>
          </div>
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
          <MessageCircle size={26} className="text-gray-900" />
        </a>

        <a
          href="tel:031-268-0304"
          className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          aria-label="전화 상담"
        >
          <Phone size={26} className="text-white" />
        </a>
      </div>

      {/* FAQ 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
