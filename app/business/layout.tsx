import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '기업 홍삼 단체 주문 | 직원·거래처 선물 견적 | 수원 정관장 조원점',
  description:
    '수원 장안구·북수원 정관장 조원점 기업/단체 홍삼 주문 상담 페이지입니다. 직원 선물, 거래처 선물, 행사 답례품 등 수량·예산·납기 일정에 맞춰 견적과 구성안을 빠르게 제안드립니다.',
  alternates: { canonical: 'https://jowon-kgc.com/business' },
};

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
