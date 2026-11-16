'use client';

import React from 'react';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

export default function PrivacyConsent({ checked, onChange, className }: Props) {
  return (
    <div className={className}>
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-200"
        />
        <div>
          <div className="text-sm font-semibold text-gray-900">
            <span className="text-red-600">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
          </div>
          <div className="text-xs text-gray-600 mt-1">
            상담을 위해 이름/연락처, 문의 내용을 수집하며 상담·배송 목적 외에는 사용하지 않습니다.
          </div>

          {/* 자세히 보기 (UX: 페이지 이탈 없이 펼침) */}
          <details className="mt-2">
            <summary className="text-xs font-semibold text-gray-700 hover:text-gray-900 cursor-pointer">
              자세히 보기
            </summary>
            <div className="mt-2 text-xs text-gray-600 space-y-1 leading-relaxed">
              <div>• 수집 항목: 이름, 전화번호, 문의 내용 (기업: 회사·기관명, 부서, 이메일 / 선물 보내기: 받는 분 성함·전화번호·주소)</div>
              <div>• 수집 목적: 상담 및 문의 응대, 선물 배송지 확인, 서비스 개선</div>
              <div>• 받는 분 정보는 보내시는 분이 받는 분의 동의 범위 안에서 입력해 주시며, 배송지 확인 연락 외에는 사용하지 않습니다.</div>
              <div>• 보유 기간: 상담 완료 후 1년(분쟁 대응/이력 관리 목적) 또는 관련 법령에 따른 보관</div>
              <div>• 동의 거부: 필수 항목 동의 거부 시 상담 접수가 제한될 수 있습니다.</div>
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 text-red-600 font-semibold hover:text-red-700 underline underline-offset-2"
              >
                개인정보처리방침 전문 보기
              </a>
            </div>
          </details>
        </div>
      </label>
    </div>
  );
}
