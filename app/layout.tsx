import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://jowon-kgc.com'),
  
  title: {
    default: '정관장 조원점 | 수원 장안구 홍삼 선물 전문 | jowon-kgc.com',
    template: '%s | 정관장 조원점',
  },
  
  description: '정관장 공식 가맹점. 부모님 선물, 기업 단체 주문, 전국 배송. 수원시 장안구 조원동 위치. 상담 환영.',
  
  keywords: [
    '정관장',
    '조원점',
    'KGC',
    '수원',
    '장안구',
    '조원동',
    '송원로',
    '홍삼',
    '추석선물',
    '설날선물',
    '가정의달선물',
    '홍삼 선물',
    '부모님 선물',
    '기업 선물',
    '단체 주문',
    '정관장 조원점',
    'KGC 조원',
    '수원 홍삼',
    '장안구 정관장',
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
    url: 'https://jowon-kgc.com',
    siteName: '정관장 조원점',
    title: '정관장 조원점 | 수원 장안구 홍삼 선물 전문',
    description: '정관장 공식 가맹점. 부모님 선물, 기업 단체 주문, 전국 배송 가능.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '정관장 조원점',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: '정관장 조원점 | 수원 장안구 홍삼 선물 전문',
    description: '정관장 공식 가맹점. 부모님 선물, 기업 단체 주문, 전국 배송.',
    images: ['/og-image.jpg'],
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
    google: 'your-google-verification-code',
    other: {
      'naver-site-verification': 'your-naver-verification-code',
    },
  },
  
  alternates: {
    canonical: 'https://jowon-kgc.com',
  },
  
  category: 'business',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <html lang="ko">
      <head>
        {/* Google Analytics 4 */}
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

        {/* Microsoft Clarity */}
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
      <body className="antialiased">
        {children}
        
        {/* 구조화 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Store',
              '@id': 'https://jowon-kgc.com',
              name: '정관장 조원점',
              alternateName: 'KGC 조원점',
              description: '정관장 공식 가맹점. 홍삼 선물, 건강 기능 식품 판매.',
              url: 'https://jowon-kgc.com',
              telephone: '+82-31-268-0304',
              email: 'info@jowon-kgc.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '송원로 81 메가플러스 A동 111호',
                addressLocality: '수원시',
                addressRegion: '경기도',
                postalCode: '16295',
                addressCountry: 'KR',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 37.302031,
                longitude: 127.009303,
              },
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
            }),
          }}
        />
      </body>
    </html>
  );
}