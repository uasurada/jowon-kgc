import { NextRequest, NextResponse } from 'next/server';
import { saveInquiry, getPhoneHistory, countRecentByIp } from '@/lib/inquiries';
import { getRequestMeta } from '@/lib/requestMeta';
import { classifySource, isBotUa, placeLabel, refHost, suspiciousPhone, TRUST_LABEL, type TrustLevel } from '@/lib/traffic';
import { ORG_TYPES, isValidEmail, emailVerdict, historyLabel, type PhoneHistory } from '@/lib/emailCheck';
import { giftSmsText, formatAddress } from '@/lib/gift';

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
      const isGift = formData.delivery === 'gift';
      const knowsAddress = isGift && formData.addressKnown === 'yes';
      // "(12345) 도로명주소 상세주소" 한 줄로 저장
      const recipientAddress = knowsAddress
        ? formatAddress(formData.zipcode, formData.address1, formData.address2)
        : null;
      if (isGift) {
        const missing = [
          !String(formData.recipientName ?? '').trim() && '받는 분 성함',
          String(formData.recipientPhone ?? '').replace(/\D/g, '').length < 9 && '받는 분 연락처',
          knowsAddress && !String(formData.address1 ?? '').trim() && '받는 분 주소',
        ].filter(Boolean);
        if (missing.length) {
          return NextResponse.json(
            { error: `${missing.join(', ')}을(를) 확인해 주세요.` },
            { status: 400 }
          );
        }
      }

      inquiryData = {
        type: 'personal',
        name: formData.name,
        phone: formData.phone,
        gift_type: formData.giftType, // id (parents/baby...)
        budget: formData.budget,
        quantity: formData.quantity,
        message: formData.message || null,
        privacy_consent: true,
        privacy_consent_at: new Date().toISOString(),
        ...(isGift && {
          gift_send: true,
          recipient_name: String(formData.recipientName).trim(),
          recipient_phone: String(formData.recipientPhone).trim(),
          sender_label: String(formData.senderLabel ?? '').trim() || null,
          recipient_address: recipientAddress,
        }),
      };
    } else {
      // 기업 주문은 금액이 커서 사칭 확인에 필요한 항목을 서버에서도 필수로 검사한다
      const missing = [
        !String(formData.companyName ?? '').trim() && '회사·기관명',
        !(ORG_TYPES as readonly string[]).includes(formData.orgType) && '기관 구분',
        !String(formData.department ?? '').trim() && '부서명',
        !String(formData.contactName ?? '').trim() && '담당자명',
        !String(formData.phone ?? '').trim() && '연락처',
        !isValidEmail(formData.email) && '이메일',
      ].filter(Boolean);
      if (missing.length) {
        return NextResponse.json(
          { error: `${missing.join(', ')}을(를) 확인해 주세요.` },
          { status: 400 }
        );
      }

      inquiryData = {
        type: 'business',
        name: formData.contactName, // 담당자명
        phone: formData.phone,
        email: String(formData.email).trim(),
        company_name: formData.companyName,
        org_type: formData.orgType,
        department: String(formData.department).trim(),
        job_title: String(formData.jobTitle ?? '').trim() || null,
        purpose: formData.purpose, // id (employee/client...)
        quantity: formData.quantity,
        budget_per_unit: formData.budgetPerUnit,
        delivery_type: formData.deliveryType, // bulk/individual
        desired_date: formData.desiredDate || null,
        message: formData.message || null,
        privacy_consent: true,
        privacy_consent_at: new Date().toISOString(),        
      };
    }

    // 출처·지역·진위 판별 (판별 실패해도 접수는 계속)
    const reqMeta = await getRequestMeta(request);
    const attr = body.meta && typeof body.meta === 'object' ? body.meta : null;
    const elapsed = Number.isFinite(attr?.elapsedSec) ? Math.max(0, Math.round(attr.elapsedSec)) : null;
    const flags: string[] = [];
    let trust: TrustLevel = 'ok';
    // website는 화면에 보이지 않는 칸이라 사람은 채우지 않는다
    if (String(formData.website ?? '').trim() || isBotUa(reqMeta.ua)) {
      trust = 'bot';
      flags.push('자동 프로그램 의심');
    }
    if (!attr) flags.push('브라우저 정보 없음');
    if (elapsed !== null && elapsed < 5) flags.push(`작성 ${elapsed}초`);
    if (reqMeta.country && reqMeta.country !== 'KR') flags.push(`해외 접속(${reqMeta.country})`);
    if (suspiciousPhone(inquiryData.phone)) flags.push('연락처 형식 이상');
    if (reqMeta.ipHash) {
      const recent = await countRecentByIp(reqMeta.ipHash).catch(() => 0);
      // 같은 IP에서 하루 10건 넘게 들어오면 도배로 보고 받지 않는다
      if (recent >= 10) {
        return NextResponse.json(
          { error: '접수가 너무 많습니다. 잠시 후 다시 시도하시거나 031-268-0304로 전화 주세요.' },
          { status: 429 }
        );
      }
      if (recent >= 2) flags.push(`같은 IP에서 24시간 내 ${recent + 1}번째 접수`);
    }
    if (trust !== 'bot' && flags.length) trust = 'warn';

    Object.assign(inquiryData, {
      source: classifySource({ src: attr?.src, ref: attr?.ref, ua: reqMeta.ua }),
      referrer: refHost(attr?.ref),
      landing: typeof attr?.landing === 'string' ? attr.landing.slice(0, 200) : null,
      device: reqMeta.device,
      geo_country: reqMeta.country,
      geo_region: reqMeta.region,
      geo_city: reqMeta.city,
      ip_hash: reqMeta.ipHash,
      visitor: typeof attr?.visitor === 'string' ? attr.visitor.slice(0, 40) : null,
      elapsed_sec: elapsed,
      risk_level: trust,
      risk_flags: flags.join(' · ') || null,
    });
    const place = placeLabel(inquiryData);
    const trace = [
      `🔎 ${inquiryData.source}`,
      place && `📍 ${place}`,
      reqMeta.device && `📱 ${reqMeta.device}`,
    ].filter(Boolean).join(' · ');
    const trustLine = `${TRUST_LABEL[trust]}${flags.length ? ` — ${flags.join(', ')}` : ''}`;

    let saved: { id?: string | number; gift_token?: string | null } | null = null;
    let databaseError: unknown = null;

    // Supabase가 일시 중단되어도 상담 접수 자체가 막히지 않도록 한다.
    try {
      saved = await saveInquiry(inquiryData);
    } catch (error) {
      databaseError = error;
      console.error('Database save failed; falling back to Telegram:', error);
    }

    // 같은 번호 재접수 여부 (조회 실패해도 접수는 계속)
    let history: PhoneHistory | null = null;
    if (saved) {
      history = await getPhoneHistory(inquiryData.phone, saved.id).catch((e) => {
        console.error('Phone history lookup failed:', e);
        return null;
      });
    }

    let telegramSent = false;

    // DB 저장 여부와 관계없이 텔레그램으로 상담 내용을 전달한다.
    try {
      if (trust === 'bot' && saved) {
        // 자동 접수로 보이면 알림을 보내지 않는다 (관리자 화면에는 남김)
      } else if (formType === 'personal') {
        const html = buildPersonalTelegramMessageSafe({
          trace,
          trust: trustLine,
          id: saved?.id,
          giftTitle: mapPersonalGiftType(inquiryData.gift_type), // ✅ 한글 타이틀
          budget: inquiryData.budget,
          quantity: inquiryData.quantity, // ✅ 수량 포함
          name: inquiryData.name,
          phone: inquiryData.phone, // ✅ tel: 링크 처리됨
          message: inquiryData.message,
          history: history ? historyLabel(history) : null,
          gift: inquiryData.gift_send
            ? {
                recipientName: inquiryData.recipient_name,
                recipientPhone: inquiryData.recipient_phone,
                senderLabel: inquiryData.sender_label,
                address: inquiryData.recipient_address,
                sms: giftSmsText({
                  recipientName: inquiryData.recipient_name,
                  senderLabel: inquiryData.sender_label,
                  buyerName: inquiryData.name,
                  token: saved?.gift_token,
                }),
              }
            : null,
        });

        await sendTelegramHtml(html);
      } else {
        const html = buildBusinessTelegramMessageSafe({
          trace,
          trust: trustLine,
          id: saved?.id,
          purposeTitle: mapBusinessPurpose(inquiryData.purpose), // ✅ 한글 타이틀
          quantity: inquiryData.quantity, // ✅ 수량 포함
          budgetPerUnit: inquiryData.budget_per_unit,
          deliveryTypeTitle: mapDeliveryType(inquiryData.delivery_type), // ✅ 한글 표기
          desiredDate: inquiryData.desired_date, // ✅ 값 없으면 줄 숨김

          companyName: inquiryData.company_name,
          orgType: inquiryData.org_type,
          department: inquiryData.department,
          jobTitle: inquiryData.job_title,
          emailCheck: emailVerdict(inquiryData.email, inquiryData.org_type).label,
          history: history ? historyLabel(history) : null,
          contactName: inquiryData.name, // 담당자명
          phone: inquiryData.phone, // ✅ tel: 링크 처리됨
          email: inquiryData.email, // ✅ mailto: 링크 처리됨
          message: inquiryData.message,
        });

        await sendTelegramHtml(html);
      }
      telegramSent = true;
    } catch (e) {
      // DB 저장이 성공했다면 텔레그램 알림 실패만으로 접수를 실패시키지 않는다.
      console.error('❌ Telegram notify failed:', e);
    }

    if (!saved && !telegramSent) {
      throw databaseError ?? new Error('No consultation delivery channel is available.');
    }

    return NextResponse.json({
      success: true,
      id: saved?.id ?? null,
      channel: saved ? 'database' : 'telegram',
    });

  } catch (error) {
    // 내부 오류 내용은 서버 로그에만 남기고 화면에는 보내지 않는다
    console.error('❌ API error:', error);

    return NextResponse.json(
      { error: '문의 접수 중 오류가 발생했습니다.' },
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
