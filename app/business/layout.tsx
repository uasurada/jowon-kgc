import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '기업 단체 홍삼 주문·견적',
  description:
    '직원·거래처 선물, 행사 답례품을 수량·예산·납기에 맞춰 견적과 구성안을 빠르게 제안합니다. 수원 정관장 조원점.',
  alternates: { canonical: '/business' },
};

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
