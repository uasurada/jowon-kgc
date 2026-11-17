import type { NextConfig } from "next";

// 모든 페이지 공통 보안 헤더
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },                // 다른 사이트에 몰래 끼워 넣기(클릭재킹) 차단
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // 관리자 화면·데이터는 검색 노출·캐시 금지
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      { source: "/admin", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "no-store" }] },
      { source: "/api/admin/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;
