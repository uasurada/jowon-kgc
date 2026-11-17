import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import storeWide from '../img/KakaoTalk_20260928_162936624_10.jpg';
import InteractionGuard from '../components/InteractionGuard';
import Tracker from '../components/Tracker';

const notoSansKR = Noto_Sans_KR({
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  preload: false,
});

const SITE_URL = 'https://www.jowon-kgc.com';
const NAVER_PLACE_URL = 'https://map.naver.com/p/entry/place/20945563';
const GOOGLE_MAPS_URL = 'https://maps.google.com/?cid=10608350700964587932';

export const metadata: Metadata = {
  // 대표 주소는 www (jowon-kgc.com은 Vercel에서 www로 넘어간다)
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      '정관장 조원점 | 수원 장안구·북수원 홍삼 선물·상담 전문 | jowon-kgc.com',
    template: '%s | 정관장 조원점',
  },

  description:
    '정관장 공식 가맹점. 부모님 선물, 기업 단체 주문, 전국 배송. 수원시 장안구 위치. 홍삼이 처음이거나 어떤 제품이 맞는지 고민될 때 1:1 상담 환영.',

  keywords: [
    '정관장',
    '정관장 조원점',
    'KGC',
    '수원 정관장',
    '장안구 정관장',
    '북수원 정관장',
    '송죽동 정관장',
    '경수대로',
    '동양파라곤',
    '홍삼',
    '정관장 홍삼',
    '홍삼 선물',
    '부모님 선물',
    '부모님 홍삼 선물',
    '면역력 홍삼',
    '홍삼 추천',
    '홍삼 상담',
    '홍삼 처음',
    '기업 선물',
    '단체 주문',
    '명절 선물',
    '추석선물',
    '설날선물',
    '가정의달선물',
    '전국 배송',
  ],

  authors: [{ name: '정관장 조원점' }],
  creator: '정관장 조원점',
  publisher: '정관장 조원점',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: '정관장 조원점',
    title: '정관장 조원점 | 수원 장안구·북수원 홍삼 선물·상담 전문',
    description:
      '정관장 공식 가맹점. 부모님 선물·기업 단체 주문·전국 배송 가능. 홍삼이 처음이거나 제품 선택이 고민될 때 1:1 상담 환영.',
    images: [
      {
        url: storeWide.src,
        width: storeWide.width,
        height: storeWide.height,
        alt: '새롭게 단장한 정관장 조원점 실제 매장 내부',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: '정관장 조원점 | 수원 장안구·북수원 홍삼 선물·상담 전문',
    description:
      '정관장 공식 가맹점. 부모님 선물·기업 단체 주문·전국 배송. 홍삼 선택 1:1 상담 환영.',
    images: [storeWide.src],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION }
      : {}),
    other: {
      // 네이버 서치어드바이저: jowon-kgc.com(기존) · www.jowon-kgc.com(2026-11 추가)
      'naver-site-verification': [
        '8156acdfc5e377be3d7cce27e313460757452b89',
        'd124e099b1e6b38c8973d973e3b4a3bbf56a4360',
      ],
    },
  },

  category: 'business',
};

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${SITE_URL}/#store`,
    name: '정관장 조원점',
    alternateName: 'KGC 조원점',
    description:
      '정관장 공식 가맹점. 홍삼 선물, 부모님 건강 상담, 기업 단체 주문 및 전국 배송.',
    url: SITE_URL,
    telephone: '+82-31-268-0304',
    email: 'info@jowon-kgc.com',
    image: `${SITE_URL}${storeWide.src}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '경수대로 935 동양파라곤 1층 105호',
      addressLocality: '수원시 장안구',
      addressRegion: '경기도',
      addressCountry: 'KR',
    },
    // 네이버 지도 기준 좌표 (송죽동 499-3)
    geo: { '@type': 'GeoCoordinates', latitude: 37.3021818, longitude: 127.007767 },
    hasMap: NAVER_PLACE_URL,
    // 검색엔진·AI가 지도/채널의 같은 매장으로 연결하도록
    sameAs: [NAVER_PLACE_URL, GOOGLE_MAPS_URL, 'https://pf.kakao.com/_IrSRX'],
    brand: { '@type': 'Brand', name: '정관장' },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '20:00',
      },
    ],
    priceRange: '₩₩',
    areaServed: ['수원', '수원시 장안구', '북수원'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: '정관장 조원점',
    inLanguage: 'ko-KR',
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <html lang="ko" className={notoSansKR.className}>
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {CLARITY_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");
            `}
          </Script>
        )}
      </head>
      <body>
        <InteractionGuard />
        <Tracker />
        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </body>
    </html>
  );
}
