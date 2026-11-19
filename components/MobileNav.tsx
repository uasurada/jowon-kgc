import Link from 'next/link';

const LINKS = [
  { href: '/products', label: '제품 안내' },
  { href: '/recommend', label: '맞춤 추천' },
  { href: '/personal', label: '선물 상담' },
  { href: '/business', label: '기업 주문' },
];

/** 휴대폰 화면 상단 메뉴 (PC에서는 숨김) */
export default function MobileNav({ active }: { active?: string }) {
  return (
    <nav className="m-nav" aria-label="빠른 메뉴">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={active === l.href ? 'active' : ''} aria-current={active === l.href ? 'page' : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
