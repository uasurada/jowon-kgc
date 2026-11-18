import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인 홍삼 선물 상담',
  description:
    '부모님·지인 선물, 병문안, 출산 선물까지 예산과 목적에 맞춰 1:1로 추천해 드립니다. 수원 정관장 조원점.',
  alternates: { canonical: '/personal' },
};

export default function PersonalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
