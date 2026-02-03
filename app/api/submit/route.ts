import { NextRequest, NextResponse } from 'next/server';
import { saveInquiry } from '@/lib/inquiries';

import {
  sendTelegramHtml,
  buildPersonalTelegramMessageSafe,
  buildBusinessTelegramMessageSafe,
} from '@/lib/telegram';

import {
  mapPersonalGiftType,
  mapBusinessPurpose,
  mapDeliveryType,
} from '@/lib/formLabels';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formType, formData } = body;

    if (!formType || !formData) {
      return NextResponse.json(
        { error: '필수 데이터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    let inquiryData: any;

    if (formType === 'personal') {
      inquiryData = {
        type: 'personal',
        name: formData.name,
        phone: formData.phone,
        gift_type: formData.giftType, // id (parents/baby...)
        budget: formData.budget,
        quantity: formData.quantity,
        message: formData.message || null,
      };
    } else {
      inquiryData = {
        type: 'business',
        name: formData.contactName, // 담당자명
        phone: formData.phone,
        email: formData.email || null,
        company_name: formData.companyName,
        purpose: formData.purpose, // id (employee/client...)
        quantity: formData.quantity,
        budget_per_unit: formData.budgetPerUnit,
        delivery_type: formData.deliveryType, // bulk/individual
        desired_date: formData.desiredDate || null,
        message: formData.message || null,
      };
    }

    const saved = await saveInquiry(inquiryData);

    // ✅ 텔레그램 알림 (DB 저장 성공 후)
    try {
      if (formType === 'personal') {
        const html = buildPersonalTelegramMessageSafe({
          id: saved.id,
          giftTitle: mapPersonalGiftType(inquiryData.gift_type), // ✅ 한글 타이틀
          budget: inquiryData.budget,
          quantity: inquiryData.quantity, // ✅ 수량 포함
          name: inquiryData.name,
          phone: inquiryData.phone, // ✅ tel: 링크 처리됨
          message: inquiryData.message,
        });

        await sendTelegramHtml(html);
      } else {
        const html = buildBusinessTelegramMessageSafe({
          id: saved.id,
          purposeTitle: mapBusinessPurpose(inquiryData.purpose), // ✅ 한글 타이틀
          quantity: inquiryData.quantity, // ✅ 수량 포함
          budgetPerUnit: inquiryData.budget_per_unit,
          deliveryTypeTitle: mapDeliveryType(inquiryData.delivery_type), // ✅ 한글 표기
          desiredDate: inquiryData.desired_date, // ✅ 값 없으면 줄 숨김

          companyName: inquiryData.company_name,
          contactName: inquiryData.name, // 담당자명
          phone: inquiryData.phone, // ✅ tel: 링크 처리됨
          email: inquiryData.email, // ✅ mailto: 링크 처리됨
          message: inquiryData.message,
        });

        await sendTelegramHtml(html);
      }
    } catch (e) {
      // 🔥 알림 실패해도 문의 저장은 성공 처리
      console.error('❌ Telegram notify failed:', e);
    }

    return NextResponse.json({
      success: true,
      id: saved.id,
    });

  } catch (error: any) {
    console.error('❌ API error:', error);

    return NextResponse.json(
      {
        error: '문의 접수 중 오류가 발생했습니다.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// 헬스체크
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
