import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, BookOpen, Building2, Check, ChevronDown, Clock3,
  CreditCard, MapPin, MessageCircle, Navigation, PackageCheck,
  Phone, ShieldCheck, Truck,
} from 'lucide-react';
import storeWide from '../img/KakaoTalk_20260928_162936624_10.jpg';
import storeCounter from '../img/KakaoTalk_20260928_162936624_03.jpg';
import storeDisplay from '../img/KakaoTalk_20260928_162936624_06.jpg';
import storeProducts from '../img/KakaoTalk_20260928_162936624_08.jpg';
import storeEntrance from '../img/KakaoTalk_20260928_162936624.jpg';

const kakaoUrl = 'https://pf.kakao.com/_IrSRX/';
const naverMapUrl = 'https://map.naver.com/v5/search/%EA%B2%BD%EA%B8%B0%20%EC%88%98%EC%9B%90%EC%8B%9C%20%EC%9E%A5%EC%95%88%EA%B5%AC%20%EA%B2%BD%EC%88%98%EB%8C%80%EB%A1%9C%20935';

const faqItems = [
  { q: '온라인으로도 주문할 수 있나요?', a: '네. 전화 또는 카카오톡으로 용도와 예산을 알려주시면 제품 안내부터 결제, 배송까지 비대면으로 도와드립니다.' },
  { q: '어떤 제품을 골라야 할지 모르겠어요.', a: '드시는 분의 연령, 평소 섭취 경험, 선물 목적과 예산을 기준으로 매장에서 직접 비교해 드립니다. 정해둔 제품이 없어도 편하게 문의해 주세요.' },
  { q: '기업·단체 주문도 가능한가요?', a: '가능합니다. 수량과 예산에 맞춘 구성, 견적서와 세금계산서, 여러 주소로 나누어 보내는 배송까지 상담해 드립니다.' },
  { q: '어떤 결제 수단을 이용할 수 있나요?', a: '신용·체크카드, 계좌이체, 수원페이, 상품권과 비대면 결제를 지원합니다. 결제 방법이 궁금하시면 매장으로 문의해 주세요.' },
];

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqItems.map(({ q, a }) => ({
    '@type': 'Question', name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function LandingPage() {
  return (
    <main className="site-shell">
      <div className="notice-bar">
        <span>KGC 정관장 공식 가맹점</span><span className="notice-dot" />
        <span>수원시 장안구</span><span className="notice-dot hidden sm:block" />
        <span className="hidden sm:block">전국 택배 상담</span>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="정관장 조원점 홈">
            <span className="brand-mark">
              <Image src="/logos/jungkwanjang-wordmark-white-v2.png" alt="JUNG KWAN JANG" width={562} height={99} priority unoptimized />
            </span>
            <span className="brand-copy"><strong>정관장 조원점</strong><small>JOWON STORE</small></span>
          </Link>
          <nav className="desktop-nav" aria-label="주요 메뉴">
            <a href="#store">매장 소개</a><a href="#service">주문 안내</a><a href="#location">오시는 길</a>
          </nav>
          <a href="tel:031-268-0304" className="header-call"><Phone size={16} /><span>031-268-0304</span></a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-photo">
          <Image src={storeWide} alt="리모델링을 마친 정관장 조원점 매장 내부 전경" fill priority sizes="100vw" className="object-cover" />
          <div className="hero-shade" />
        </div>
        <div className="hero-content">
          <p className="eyebrow light">새롭게 단장한 정관장 조원점</p>
          <h1>직접 보고, 비교하고,<br />편안하게 고르세요.</h1>
          <p className="hero-lead">선물 받는 분과 예산을 말씀해 주시면<br className="sm:hidden" /> 매장에서 꼭 맞는 제품을 함께 찾아드립니다.</p>
          <div className="hero-actions">
            <a href={kakaoUrl} target="_blank" rel="noopener noreferrer" className="button button-kakao"><MessageCircle size={19} /> 카카오톡 상담</a>
            <Link href="/personal" className="button button-light">선물 추천받기 <ArrowRight size={18} /></Link>
          </div>
          <div className="hero-proof">
            <span><ShieldCheck size={17} /> 공식 가맹점</span>
            <span><MapPin size={17} /> 동양파라곤 1층</span>
          </div>
        </div>
        <div className="photo-caption">실제 정관장 조원점 매장입니다</div>
      </section>

      <section className="quick-info" aria-label="매장 주요 정보">
        <div><Clock3 /><span><small>영업시간</small><strong>월–토 10:00–20:00</strong></span></div>
        <div><MapPin /><span><small>매장 위치</small><strong>경수대로 935, 1층 105호</strong></span></div>
        <div><Truck /><span><small>주문·배송</small><strong>비대면 주문 · 전국 택배</strong></span></div>
      </section>

      <section id="store" className="section store-story">
        <div className="section-heading">
          <p className="eyebrow">JOWON STORE</p>
          <h2>화면 속 매장이<br />바로 이곳입니다.</h2>
          <p>수원 장안구에서 직접 운영하는 오프라인 매장입니다. 새롭게 단장한 공간에서 다양한 제품을 천천히 살펴보고 상담받으실 수 있습니다.</p>
        </div>
        <div className="store-grid">
          <figure className="store-image store-image-main">
            <Image src={storeCounter} alt="정관장 조원점 상담 카운터" fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
          </figure>
          <figure className="store-image">
            <Image src={storeDisplay} alt="정관장 조원점 홍삼 제품 진열대" fill sizes="(min-width: 768px) 32vw, 100vw" className="object-cover" />
          </figure>
          <div className="store-note">
            <span>매장에서 직접</span><strong>제품 비교부터<br />선물 포장까지</strong>
            <p>부담 없이 둘러보시고 궁금한 점만 물어보셔도 좋습니다.</p>
          </div>
        </div>
      </section>

      <section id="service" className="section service-section">
        <div className="section-heading centered">
          <p className="eyebrow">HOW TO ORDER</p>
          <h2>필요한 방식으로<br className="sm:hidden" /> 간편하게 주문하세요.</h2>
          <p>방문이 어려우시면 전화와 카카오톡으로도 제품 상담과 주문이 가능합니다.</p>
        </div>
        <div className="service-grid">
          <article className="service-card personal-card">
            <span className="card-number">01</span><div className="service-icon"><PackageCheck /></div>
            <p className="card-kicker">한 분을 위한 선물</p><h3>개인 선물 상담</h3>
            <p>부모님, 감사 선물, 나를 위한 건강 관리까지 용도와 예산에 맞춰 추천해 드립니다.</p>
            <Link href="/personal">선물 상담 시작하기 <ArrowRight size={17} /></Link>
          </article>
          <article className="service-card business-card">
            <span className="card-number">02</span><div className="service-icon"><Building2 /></div>
            <p className="card-kicker">여러 분을 위한 선물</p><h3>기업·단체 주문</h3>
            <p>직원과 거래처 선물의 견적, 세금계산서, 개별 배송까지 한 번에 진행합니다.</p>
            <Link href="/business">단체 견적 요청하기 <ArrowRight size={17} /></Link>
          </article>
        </div>
      </section>

      <section className="section product-section">
        <div className="product-image">
          <Image src={storeProducts} alt="정관장 조원점의 다양한 홍삼 선물 제품" fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />
        </div>
        <div className="product-copy">
          <p className="eyebrow light">PRODUCT GUIDE</p><h2>제품이 많을수록<br />상담은 더 쉬워야 합니다.</h2>
          <p>받는 분의 연령, 섭취 방식, 예산을 알려주세요. 매장에 진열된 제품을 기준으로 이해하기 쉽게 비교해 드립니다.</p>
          <ul>
            <li><Check /> 예산에 맞는 제품 비교</li><li><Check /> 섭취 방법과 구성 안내</li><li><Check /> 선물 포장 및 전국 배송</li>
          </ul>
          <Link href="/catalog" className="text-link"><BookOpen size={18} /> 2026 선물 카탈로그 보기 <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="section consult-strip">
        <div><p className="eyebrow">QUICK CONSULTATION</p><h2>정해둔 제품이 없어도 괜찮습니다.</h2><p>“부모님 선물 10만원대”처럼 간단히 말씀해 주세요. 매장에서 직접 답변드립니다.</p></div>
        <div className="consult-actions">
          <a href={kakaoUrl} target="_blank" rel="noopener noreferrer" className="button button-kakao"><MessageCircle size={19} /> 카카오톡 문의</a>
          <a href="tel:031-268-0304" className="button button-dark"><Phone size={18} /> 전화 문의</a>
        </div>
      </section>

      <section id="location" className="section location-section">
        <div className="location-photo">
          <Image src={storeEntrance} alt="거리에서 바라본 정관장 조원점 입구와 매장 내부" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          <span>매장 입구에서 보이는 실제 모습</span>
        </div>
        <div className="location-copy">
          <p className="eyebrow">VISIT US</p><h2>정관장 조원점</h2>
          <div className="address-block"><MapPin /><div><strong>경기 수원시 장안구 경수대로 935</strong><span>동양파라곤 1층 105호</span></div></div>
          <div className="location-list">
            <p><Clock3 /> <span>월–토 10:00–20:00</span></p>
            <p><Phone /> <a href="tel:031-268-0304">031-268-0304</a></p>
            <p><CreditCard /> <span>수원페이 · 카드 · 상품권 · 비대면 결제</span></p>
          </div>
          <a href={naverMapUrl} target="_blank" rel="noopener noreferrer" className="button button-red"><Navigation size={18} /> 네이버 지도에서 길찾기</a>
          <p className="parking-note">차량 방문 전 주차 안내가 필요하시면 매장으로 전화해 주세요.</p>
        </div>
      </section>

      <section className="section faq-section">
        <div className="section-heading centered"><p className="eyebrow">FAQ</p><h2>자주 묻는 질문</h2></div>
        <div className="faq-list">
          {faqItems.map((item) => (
            <details key={item.q}><summary><span>{item.q}</span><ChevronDown className="faq-chevron" /></summary><p>{item.a}</p></details>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-main">
          <div><strong className="footer-title">정관장 조원점</strong><p>KGC 정관장 공식 가맹점<br />경기 수원시 장안구 경수대로 935 동양파라곤 1층 105호</p></div>
          <div className="footer-contact"><small>매장 상담</small><a href="tel:031-268-0304">031-268-0304</a><span>월–토 10:00–20:00</span></div>
        </div>
        <div className="footer-bottom"><span>사업자등록번호 441-17-02401 · 대표 박시영</span><Link href="/privacy">개인정보처리방침</Link><span>© 2026 정관장 조원점</span></div>
      </footer>

      <div className="mobile-contact" aria-label="빠른 상담">
        <a href="tel:031-268-0304"><Phone size={19} /> 전화 상담</a>
        <a href={kakaoUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} /> 카카오톡 상담</a>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
