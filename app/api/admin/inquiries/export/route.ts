// app/api/admin/inquiries/export/route.ts — 현재 검색조건으로 엑셀(CSV) 다운로드
import { NextRequest, NextResponse } from 'next/server';
import { listInquiries } from '@/lib/inquiries';
import { errorMessage } from '@/lib/db';
import { mapPersonalGiftType, mapBusinessPurpose, mapDeliveryType } from '@/lib/formLabels';
import { emailVerdict, historyLabel } from '@/lib/emailCheck';
import { placeLabel, TRUST_LABEL, type TrustLevel } from '@/lib/traffic';
import { requireAdmin } from '@/lib/adminGuard';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  pending: '접수',
  contacted: '상담중',
  completed: '완료',
  canceled: '취소',
};

function csvCell(v: unknown) {
  let s = v === null || v === undefined ? '' : String(v);
  // 엑셀 수식 주입 방지
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

function kst(ts: string | Date) {
  // 엑셀에서 정렬되기 쉬운 "2026-11-16 15:35" 형식
  return new Date(ts).toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' }).slice(0, 16);
}

/** 선물 배송지 진행 상태 */
function giftAddressLabel(r: Record<string, unknown>) {
  const by: Record<string, string> = { buyer: '보내는 분 입력', recipient: '받는 분 직접 입력', store: '매장 입력' };
  if (r.recipient_address) return by[String(r.gift_address_by)] ?? '입력됨';
  return r.gift_declined_at ? '받는 분 사양' : '대기';
}

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const sp = request.nextUrl.searchParams;

  try {
    const { rows } = await listInquiries(
      {
        q: sp.get('q') ?? undefined,
        type: sp.get('type') ?? undefined,
        status: sp.get('status') ?? undefined,
        from: sp.get('from') ?? undefined,
        to: sp.get('to') ?? undefined,
      },
      5000,
      0
    );

    const header = [
      '번호', '접수일시', '구분', '상태', '접수 이력', '이름/담당자', '직책', '기관 구분', '기관·회사명', '부서',
      '연락처', '이메일', '이메일 판정', '유형/목적', '예산', '수량', '배송', '희망일',
      '선물 보내기', '받는 분', '받는 분 연락처', '받는 분 주소', '주소 입력', '안내할 보낸 분', '요청사항', '메모',
      '진위 판정', '판정 사유', '유입 경로', '첫 페이지', '접속 지역(IP 추정)', '기기', '작성 시간(초)',
    ];

    const lines = rows.map((r) =>
      [
        r.id,
        kst(r.created_at),
        r.type === 'personal' ? '개인' : '기업',
        STATUS_LABEL[r.status] ?? r.status,
        historyLabel(r),
        r.name,
        r.job_title,
        r.org_type,
        r.company_name,
        r.department,
        r.phone,
        r.email,
        r.type === 'business' ? emailVerdict(r.email, r.org_type).label : '',
        r.type === 'personal' ? mapPersonalGiftType(r.gift_type) : mapBusinessPurpose(r.purpose),
        r.budget || r.budget_per_unit,
        r.quantity,
        r.delivery_type ? mapDeliveryType(r.delivery_type) : '',
        r.desired_date,
        r.gift_send ? 'Y' : '',
        r.recipient_name,
        r.recipient_phone,
        r.recipient_address,
        r.gift_send ? giftAddressLabel(r) : '',
        r.sender_label,
        r.message,
        r.memo,
        r.risk_level ? TRUST_LABEL[r.risk_level as TrustLevel] ?? r.risk_level : '',
        r.risk_flags,
        r.source,
        r.landing,
        placeLabel(r),
        r.device,
        r.elapsed_sec,
      ].map(csvCell).join(',')
    );

    // BOM을 붙여야 엑셀에서 한글이 깨지지 않는다
    const csv = '﻿' + [header.map(csvCell).join(','), ...lines].join('\r\n');
    const date = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="inquiries-${date}.csv"; filename*=UTF-8''${encodeURIComponent(`상담내역-${date}.csv`)}`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('export error:', error);
    return NextResponse.json({ error: `DB 조회 실패: ${errorMessage(error)}` }, { status: 503 });
  }
}
