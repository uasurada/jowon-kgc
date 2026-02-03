import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://jowon-kgc.com'),
  
  title: {
    default: '정관장 조원점 | 수원 장안구 홍삼 선물 전문 | jowon-kgc.com',
    template: '%s | 정관장 조원점',
  },
  
  description: '정관장 공식 대리점 20년. 부모님 선물, 기업 단체 주문, 전국 배송. 수원시 장안구 조원동 위치. 상담 환영.',
  
  keywords: [
    '정관장',
    '조원점',
    'KGC',
    '수원',
    '장안구',
    '조원동',
    '홍삼',
    '홍삼 선물',
    '부모님 선물',
    '기업 선물',
    '단체 주문',
    '정관장 대리점',
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
    description: '정관장 공식 대리점 20년. 부모님 선물, 기업 단체 주문, 전국 배송 가능.',
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
    description: '정관장 공식 대리점 20년. 부모님 선물, 기업 단체 주문, 전국 배송.',
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

// 이 부분이 빠져있었습니다!
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
        
        {/* 구조화 데이터 추가 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Store',
              '@id': 'https://jowon-kgc.com',
              name: '정관장 조원점',
              alternateName: 'KGC 조원점',
              description: '정관장 공식 대리점. 홍삼 선물, 건강 기능 식품 판매.',
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