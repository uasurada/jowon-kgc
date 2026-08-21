import React from 'react';
import Image from 'next/image';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ChevronRight,
  CheckCircle,
  CreditCard,
  Navigation,
  ExternalLink,
  BookOpen,
  Sparkles,
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
    a: '연령과 건강 상태에 따라 추천이 달라집니다. 60대 이상 부모님께는 홍삼 농축액이나 최상급 녹용으로 만든 천녹 제품을 많이 선택하십니다. 예산과 복용 경험을 알려주시면 1:1로 맞춤 추천해드립니다. 전화(031-268-0304) 또는 카카오톡으로 문의주세요.',
  },
  {
    q: '기업·단체 주문도 가능한가요?',
    a: '기업 명절 선물, 직원 복지 선물, 거래처 선물 등 단체 주문을 전문으로 처리합니다. 수량과 예산에 따라 맞춤 구성 및 전국 일괄 배송, 세금계산서 발행이 가능합니다. 기업 주문 상담 버튼을 통해 견적을 신청해주세요.',
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

const TRUST_BADGES = [
  { icon: <Shield className="text-green-600" size={20} />, title: '정관장 정품 보장', sub: '공식 가맹점 인증' },
  { icon: <Truck className="text-blue-600" size={20} />,   title: '전국 배송',       sub: '당일·익일 가능' },
  { icon: <CreditCard className="text-purple-600" size={20} />, title: '다양한 결제', sub: '수원페이·신용카드·상품권' },
  { icon: <MessageCircle className="text-yellow-600" size={20} />, title: '1:1 상담', sub: '카카오톡·전화' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* 상단 알림 바 */}
      <div className="bg-red-700 text-white text-center py-2 px-4 text-xs sm:text-sm font-medium tracking-wide">
        ✅&nbsp; KGC 공식 인증 가맹점&nbsp;&nbsp;|&nbsp;&nbsp;전국 택배 배송&nbsp;&nbsp;|&nbsp;&nbsp;기업 단체 주문 환영
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="inline-flex items-center bg-black rounded-lg px-3 py-2">
                <Image
                  src="/logos/kgc-wordmark.png"
                  alt="정관장 JUNG KWAN JANG"
                  width={638}
                  height={361}
                  priority
                  className="h-11 w-auto"
                />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">조원점</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">수원 장안구·북수원 공식 가맹점</div>
          </div>
          <a
            href="tel:031-268-0304"
            className="shrink-0 inline-flex items-center gap-1.5 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
          >
            <Phone size={15} />
            <span className="whitespace-nowrap">031-268-0304</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-red-200 rounded-full px-4 py-1.5 mb-5 shadow-sm">
            <CheckCircle className="text-green-600" size={14} />
            <span className="text-sm font-semibold text-gray-700">KGC 공식 인증 가맹점</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-gray-900 mb-4 break-keep">
            정관장 홍삼 선물,<br />
            <span className="text-red-600">직접 고민해 드립니다</span>
          </h1>

          <p className="text-base text-gray-500 mb-8 break-keep leading-relaxed">
            부모님 선물·면역력 관리·기업 단체 주문까지<br />
            수원 장안구 정관장 조원점에서 1:1 맞춤 상담
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm sm:max-w-none mx-auto">
            <a
              href="/personal"
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-bold text-base transition-all hover:shadow-lg"
            >
              개인 선물 상담 <ChevronRight size={18} />
            </a>
            <a
              href="/business"
              className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 hover:border-gray-500 text-gray-800 px-6 py-4 rounded-xl font-bold text-base transition-all hover:shadow-md"
            >
              <Building2 size={18} />
              기업 단체 주문
            </a>
          </div>
        </div>
      </section>

      {/* 신뢰 배지 */}
      <section className="py-5 px-4 border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TRUST_BADGES.map((b, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <div className="shrink-0">{b.icon}</div>
              <div>
                <div className="text-sm font-bold text-gray-900 break-keep">{b.title}</div>
                <div className="text-xs text-gray-500 break-keep">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 카탈로그 배너 */}
      <section className="py-5 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <a
            href="/catalog"
            className="group relative flex items-center justify-between bg-gradient-to-r from-red-600 to-red-700 rounded-2xl px-5 py-4 overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shrink-0">
                <BookOpen className="text-red-600" size={22} />
              </div>
              <div className="text-white">
                <div className="flex items-center gap-2 mb-0.5">
                  <Sparkles size={12} />
                  <span className="text-[11px] font-bold bg-yellow-400 text-gray-900 px-2 py-0.5 rounded">NEW</span>
                </div>
                <p className="font-bold text-base">2026 선물 카탈로그</p>
                <p className="text-sm text-red-100">예산별 추천 제품 한눈에 보기</p>
              </div>
            </div>
            <ChevronRight size={22} className="text-white group-hover:translate-x-1 transition-transform shrink-0" />
          </a>
        </div>
      </section>

      {/* 서비스 카드 */}
      <section className="py-6 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-bold text-center text-gray-900 mb-4">어떤 선물을 찾으세요?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="/personal"
              className="group bg-white border-2 border-red-100 hover:border-red-400 rounded-2xl p-5 transition-all hover:shadow-md"
            >
              <div className="text-3xl mb-3">👤</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">개인 선물 상담</h3>
              <p className="text-sm text-gray-500 mb-4 break-keep leading-relaxed">
                부모님 · 직장 상사 · 병문안<br />상견례 · 출산 선물 · 나를 위한 건강 선물
              </p>
              <div className="flex items-center text-red-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                무료 상담 신청하기 <ChevronRight size={16} />
              </div>
            </a>

            <a
              href="/business"
              className="group bg-white border-2 border-blue-100 hover:border-blue-400 rounded-2xl p-5 transition-all hover:shadow-md"
            >
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">기업 주문 상담</h3>
              <p className="text-sm text-gray-500 mb-4 break-keep leading-relaxed">
                직원·거래처 선물 · 행사 답례품<br />세금계산서 · 기업 특별가 적용
              </p>
              <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                무료 견적 신청하기 <ChevronRight size={16} />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 빠른 상담 */}
      <section className="py-6 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
                <MessageCircle size={18} className="text-gray-900" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">지금 바로 상담 가능합니다</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <Clock size={11} />
                  <span>평일·토요일 10:00 – 20:00</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:031-268-0304"
                className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 hover:border-gray-500 rounded-xl py-3.5 font-bold text-gray-900 text-sm transition-colors"
              >
                <Phone size={17} />전화 상담
              </a>
              <a
                href="https://pf.kakao.com/_IrSRX/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 rounded-xl py-3.5 font-bold text-gray-900 text-sm transition-colors"
              >
                <MessageCircle size={17} />카톡 상담
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-bold text-center text-gray-900 mb-5">자주 묻는 질문</h2>
          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer select-none hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900 text-sm break-keep">{item.q}</span>
                  <ChevronDown size={17} className="faq-chevron text-gray-400 shrink-0" />
                </summary>
                <div className="px-5 pb-4 pt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-100 break-keep">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 매장 정보 */}
      <section className="py-8 px-4 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-red-600" />
            매장 정보
          </h3>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <p className="font-bold text-gray-900 mb-0.5">정관장 조원점</p>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed break-keep">
              경기도 수원시 장안구 송원로 81 메가플러스 A동 111호<br />
              주차 가능 · 방문 상담 환영 · 평일·토요일 10:00–20:00
            </p>
            <div className="overflow-hidden rounded-xl border border-gray-100 mb-3">
              <iframe
                title="정관장 조원점 지도"
                src="https://www.google.com/maps?q=37.302031,127.009303&z=16&output=embed"
                width="100%"
                height="220"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://map.naver.com/v5/search/%EC%A0%95%EA%B4%80%EC%9E%A5%20%EC%A1%B0%EC%9B%90%EC%A0%90?c=15,0,0,0,dh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                <Navigation size={14} />길찾기
              </a>
              <a
                href="https://map.naver.com/v5/search/%EC%A0%95%EA%B4%80%EC%9E%A5%20%EC%A1%B0%EC%9B%90%EC%A0%90"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                지도 크게 보기 <ExternalLink size={13} />
              </a>
            </div>
            <p className="mt-2 text-xs text-gray-400">네이버지도로 연결됩니다.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-white font-black text-base mb-2">정관장 조원점</div>
              <p className="text-sm leading-relaxed break-keep mb-2">
                KGC한국인삼공사 공식 인증 가맹점.<br />수원 장안구·북수원 홍삼 선물 상담 전문.
              </p>
              <p className="text-xs text-gray-500 break-keep leading-relaxed">
                경기도 수원시 장안구 송원로 81<br />메가플러스 A동 111호
              </p>
            </div>
            <div>
              <div className="text-white font-semibold text-sm mb-3">바로가기</div>
              <nav className="space-y-2 text-sm">
                <a href="/personal" className="block hover:text-white transition-colors">개인 선물 상담</a>
                <a href="/business" className="block hover:text-white transition-colors">기업 단체 주문</a>
                <a href="/catalog" className="block hover:text-white transition-colors">제품 카탈로그</a>
                <a href="/privacy" className="block hover:text-white transition-colors">개인정보처리방침</a>
                <a href="tel:031-268-0304" className="block hover:text-white transition-colors">031-268-0304</a>
              </nav>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-5 text-xs text-gray-500 flex flex-col sm:flex-row gap-2 sm:gap-4 break-keep">
            <span>
              사업자등록번호: 441-17-02401{' '}
              <a
                href="https://teht.hometax.go.kr/websquare/websquare.html?w2xPath=/ui/ab/a/a/UTEABAAA13.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-white transition-colors"
              >
                (국세청 진위확인)
              </a>
            </span>
            <span>대표: 박시영</span>
            <span className="sm:ml-auto">© 2026 정관장 조원점. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* 플로팅 버튼 */}
      <div className="fixed bottom-6 right-4 flex flex-col gap-3 z-40">
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
