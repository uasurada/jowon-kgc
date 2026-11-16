# 정관장 조원점 홈페이지

정관장 조원점의 매장 소개, 개인 선물 상담, 기업·단체 주문 상담을 위한 공식 운영 홈페이지입니다.

- 운영 사이트: [https://www.jowon-kgc.com](https://www.jowon-kgc.com)
- 매장: 경기 수원시 장안구 경수대로 935 동양파라곤 1층 105호
- 전화: 031-268-0304
- 2026년 9월 전면 개편 기록: [docs/2026-09-renewal.md](docs/2026-09-renewal.md)

## 상담 접수 · 관리자

- 접수(`/api/submit`)는 Neon Postgres(`inquiries` 테이블)에 저장하고 텔레그램으로 알림을 보낸다. 둘 중 하나만 성공해도 접수는 성공 처리된다.
- DB는 Vercel Marketplace의 Neon(`jowon-kgc-db`)이며 `DATABASE_URL`이 자동 등록된다. 스키마 변경 시 `db/schema.sql` 수정 후 `node db/migrate.mjs`.
- 관리자 페이지 `/admin`(목록·검색·상태/메모·엑셀 다운로드)과 `/api/admin/*`는 루트의 `proxy.ts`가 Basic 인증으로 보호한다(`ADMIN_BASIC_USER`, `ADMIN_BASIC_PASS`). Next.js 16은 `proxy.ts`가 프로젝트 루트에 있어야만 적용한다.
- `.env.local`에서 `#`, `$`가 들어간 값은 작은따옴표로 감싼다(그렇지 않으면 `#` 뒤가 주석으로 잘린다).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
