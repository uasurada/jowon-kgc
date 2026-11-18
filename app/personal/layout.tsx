import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인 홍삼 선물 비대면 상담',
  description:
    '선물 고민을 전화·카카오톡으로 상담하고 주문까지. 매장 방문 없이 받는 분 연락처만으로 전국 배송합니다. 수원 정관장 조원점.',
  alternates: { canonical: '/personal' },
};

export default function PersonalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
