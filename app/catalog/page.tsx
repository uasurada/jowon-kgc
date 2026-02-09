import React from "react";
import Link from "next/link";
import { ExternalLink, Phone, MessageCircle, BookOpen } from "lucide-react";

export default function CatalogPage() {
  const catalogUrl = process.env.NEXT_PUBLIC_CATALOG_URL;
  const title = process.env.NEXT_PUBLIC_CATALOG_TITLE || "시즌 선물 카탈로그";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 컨테이너: 카탈로그 뷰어는 더 크게 보이도록 max-w-6xl */}
      <div className="max-w-6xl mx-auto px-2 md:px-4 py-6 md:py-10">
        {/* 안내 카드: 가독성 위해 max-w-4xl로 살짝 좁게 */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-5 md:p-6">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="text-red-600" size={22} />
            </div>

            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {title}
              </h1>

              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                가격 노출 없이, 선물 구성과 추천 흐름을 확인하실 수 있어요.
                <br />
                원하시면 카톡/전화로 목적에 맞춰 빠르게 추천해드립니다.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="tel:031-268-0304"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  <Phone size={16} />
                  전화 상담
                </a>

                <a
                  href="https://pf.kakao.com/_IrSRX/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 text-sm font-semibold hover:bg-yellow-500 transition-colors"
                >
                  <MessageCircle size={16} />
                  카톡 상담
                </a>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  홈으로
                </Link>

                {catalogUrl ? (
                  <a
                    href={catalogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    카탈로그 새창{" "}
                    <ExternalLink size={16} className="text-gray-500" />
                  </a>
                ) : (
                  <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-500 text-sm font-semibold">
                    카탈로그 준비 중
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ 뷰어 영역 */}
        <div className="mt-4">
          {/* 데스크탑/태블릿: iframe로 크게 표시 */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {catalogUrl ? (
              <iframe
                title={title}
                src={catalogUrl}
                className="w-full block"
                style={{ height: "92vh" }}
                loading="lazy"
              />
            ) : (
              <div className="p-10 text-center">
                <p className="text-gray-700 font-semibold">
                  현재 카탈로그가 준비 중입니다.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  잠시 후 다시 확인해주세요.
                </p>
              </div>
            )}
          </div>

          {/* 모바일: iframe 대신 새창 보기 버튼 (작게 보이는 문제 해결) */}
          <div className="md:hidden bg-white rounded-2xl border border-gray-200 p-5 text-center">
            <p className="text-sm text-gray-800 font-semibold">
              모바일에서는 전체 화면으로 보는 게 더 편해요.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              아래 버튼을 누르면 카탈로그가 크게 열립니다.
            </p>

            {catalogUrl ? (
              <a
                href={catalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors w-full"
              >
                카탈로그 크게 보기 <ExternalLink size={18} />
              </a>
            ) : (
              <div className="mt-4 w-full px-5 py-3 rounded-xl bg-gray-100 text-gray-500 text-sm font-semibold">
                카탈로그 준비 중
              </div>
            )}

            {/* ✅ 추가: 홈페이지로 돌아가기 버튼 */}
            <Link
              href="/"
              className="mt-2 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition-colors w-full"
            >
              홈페이지로 돌아가기
            </Link>

            {/* ✅ 안내 문구 보강 */}
            <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
              ※ 카탈로그는 새 창으로 열립니다.
              <br />
              보신 후 창을 닫거나, 위 버튼을 눌러 홈페이지로 돌아오세요.
            </p>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">
            ※ 카탈로그가 화면에 안 보이면 “카탈로그 새창”으로 확인하실 수 있어요.
          </p>
        </div>
      </div>
    </div>
  );
}
