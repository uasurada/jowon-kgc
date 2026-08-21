import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Phone, MessageCircle, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "정관장 조원점(jowon-kgc.com)의 개인정보 수집·이용·보관 및 파기에 관한 안내입니다.",
};

const SECTIONS = [
  {
    title: "1. 수집하는 개인정보 항목",
    body: (
      <>
        <p>
          정관장 조원점은 개인 선물 상담, 기업·단체 주문 견적 문의를 위해
          아래 항목을 수집합니다.
        </p>
        <ul>
          <li>필수: 이름(또는 담당자명), 연락처</li>
          <li>선택: 이메일, 회사명, 문의 내용(선물 대상·예산·수량 등)</li>
          <li>자동 수집: 문의 접수 일시, 개인정보 수집·이용 동의 일시</li>
        </ul>
      </>
    ),
  },
  {
    title: "2. 수집 및 이용 목적",
    body: (
      <>
        <p>수집한 개인정보는 다음 목적을 위해서만 이용합니다.</p>
        <ul>
          <li>개인 선물 상담 및 기업·단체 견적 안내</li>
          <li>상담 결과 회신을 위한 본인 확인 및 연락</li>
          <li>상담 이력 관리 및 서비스 품질 개선</li>
        </ul>
        <p>
          위 목적 외의 용도로는 이용하지 않으며, 목적이 변경되는 경우
          별도의 동의를 다시 받습니다.
        </p>
      </>
    ),
  },
  {
    title: "3. 보유 및 이용 기간",
    body: (
      <p>
        수집한 개인정보는 상담 완료 후 <strong>1년간</strong> 보관하며
        (분쟁 대응 및 상담 이력 관리 목적), 보유 기간이 지나면 지체 없이
        파기합니다. 다만 관계 법령에 특별한 규정이 있는 경우 해당 법령에서
        정한 기간 동안 보관합니다.
      </p>
    ),
  },
  {
    title: "4. 개인정보의 제3자 제공",
    body: (
      <p>
        정관장 조원점은 이용자의 개인정보를 원칙적으로 외부에 제공하지
        않습니다. 다만 상담 신청 접수 및 담당자 알림을 위해 내부적으로
        운영하는 데이터베이스·알림 시스템을 통해 안전하게 처리되며, 이
        범위를 벗어나 제3자에게 제공되지 않습니다.
      </p>
    ),
  },
  {
    title: "5. 정보주체의 권리",
    body: (
      <>
        <p>
          이용자는 언제든지 본인의 개인정보에 대해 아래 권리를 행사할 수
          있습니다.
        </p>
        <ul>
          <li>개인정보 열람·정정 요구</li>
          <li>개인정보 삭제 요구</li>
          <li>개인정보 처리 정지 요구</li>
        </ul>
        <p>
          아래 연락처로 요청하시면 지체 없이 조치하겠습니다.
        </p>
      </>
    ),
  },
  {
    title: "6. 개인정보 파기 절차 및 방법",
    body: (
      <p>
        보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 전자적 파일
        형태의 경우 복구할 수 없는 방법으로 영구 삭제하며, 종이 문서는
        분쇄하거나 소각하여 파기합니다.
      </p>
    ),
  },
  {
    title: "7. 개인정보 보호책임자",
    body: (
      <ul className="not-italic">
        <li>성명: 박시영 (대표)</li>
        <li>
          연락처:{" "}
          <a href="tel:031-268-0304" className="text-red-600 font-semibold">
            031-268-0304
          </a>
        </li>
        <li>이메일: info@jowon-kgc.com</li>
        <li>사업자등록번호: 441-17-02401</li>
      </ul>
    ),
  },
  {
    title: "8. 고지의 의무",
    body: (
      <p>
        본 개인정보처리방침의 내용이 추가·삭제 및 수정이 있을 시에는 개정
        최소 7일 전부터 홈페이지를 통해 고지합니다.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">홈으로</span>
          </Link>
          <span className="text-base font-bold text-gray-900">
            개인정보처리방침
          </span>
          <a
            href="tel:031-268-0304"
            className="flex items-center gap-1.5 text-red-600 hover:text-red-700"
          >
            <Phone size={18} />
            <span className="text-sm font-semibold hidden sm:inline">
              031-268-0304
            </span>
            <span className="text-sm font-semibold sm:hidden">전화</span>
          </a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          개인정보처리방침
        </h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed break-keep">
          정관장 조원점(이하 &lsquo;회사&rsquo;)은 「개인정보 보호법」에 따라
          이용자의 개인정보를 소중히 다루며, 아래와 같이 개인정보를
          수집·이용·보관·파기합니다.
          <br />
          시행일자: 2026년 8월 21일
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {SECTIONS.map((s) => (
            <section key={s.title} className="p-5 md:p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-3">
                {s.title}
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed break-keep space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
                {s.body}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              개인정보 관련 문의가 있으신가요?
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              전화 또는 카카오톡으로 바로 문의하실 수 있습니다.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <a
              href="tel:031-268-0304"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-gray-400 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors"
            >
              <Phone size={15} />
              전화
            </a>
            <a
              href="https://pf.kakao.com/_IrSRX/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors"
            >
              <MessageCircle size={15} />
              카톡
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
