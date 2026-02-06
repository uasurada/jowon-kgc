import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인 홍삼 선물 상담 | 부모님 선물·면역력 추천 | 수원 정관장 조원점',
  description:
    '수원 장안구·북수원 정관장 조원점 개인 홍삼 선물 상담 페이지입니다. 부모님 선물, 직장 상사 선물, 병문안, 출산 선물까지 예산과 목적에 맞춰 1:1로 추천해드립니다.',
  alternates: { canonical: 'https://jowon-kgc.com/personal' },
};

export default function PersonalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
