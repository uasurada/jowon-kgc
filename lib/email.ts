// lib/email.ts

import emailjs from '@emailjs/browser';

// EmailJS 초기화
emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);

interface EmailParams {
  type: 'personal' | 'business';
  name: string;
  phone: string;
  giftType?: string;
  purpose?: string;
  companyName?: string;
  budget?: string;
  budgetPerUnit?: string;
  quantity: string;
  message?: string;
  submittedAt: string;
}

// 이메일 발송 함수
export async function sendEmailNotification(params: EmailParams) {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;

  // 이메일 템플릿 파라미터 구성
  const templateParams = {
    to_email: process.env.NEXT_PUBLIC_EMAIL, // 동석님 이메일
    inquiry_type: params.type === 'personal' ? '개인 선물 상담' : '기업 주문 상담',
    name: params.name,
    phone: params.phone,
    company_name: params.companyName || '-',
    gift_type: params.giftType || params.purpose || '-',
    budget: params.budget || params.budgetPerUnit || '-',
    quantity: params.quantity,
    message: params.message || '(추가 메시지 없음)',
    submitted_at: params.submittedAt,
    // 관리 페이지 링크 (나중에 만들 경우)
    admin_link: 'https://jowonjeom.com/admin',
  };

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams
    );
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Email send failed:', error);
    throw error;
  }
}

// 간단한 텍스트 알림 (EmailJS 템플릿 없이)
export async function sendSimpleNotification(
  formType: 'personal' | 'business',
  formData: any
) {
  const submittedAt = new Date().toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  // 개인 상담인 경우
  if (formType === 'personal') {
    const emailText = `
🔔 새로운 개인 선물 상담

선물 유형: ${formData.giftType}
예산: ${formData.budget}
수량: ${formData.quantity}

이름: ${formData.name}
연락처: ${formData.phone}

${formData.message ? `추가 메시지:\n${formData.message}` : ''}

접수 시각: ${submittedAt}

---
정관장 조원점 자동 알림
    `.trim();

    return sendEmailNotification({
      type: 'personal',
      name: formData.name,
      phone: formData.phone,
      giftType: formData.giftType,
      budget: formData.budget,
      quantity: formData.quantity,
      message: formData.message,
      submittedAt,
    });
  }

  // 기업 주문인 경우
  else {
    const emailText = `
🔔 새로운 기업 주문 상담

회사명: ${formData.companyName}
담당자: ${formData.contactName}
연락처: ${formData.phone}
이메일: ${formData.email || '-'}

주문 용도: ${formData.purpose}
수량: ${formData.quantity}
1인당 예산: ${formData.budgetPerUnit}
배송 방식: ${formData.deliveryType === 'bulk' ? '일괄 배송' : '개별 배송'}
${formData.desiredDate ? `희망 납기일: ${formData.desiredDate}` : ''}

${formData.message ? `추가 메시지:\n${formData.message}` : ''}

접수 시각: ${submittedAt}

---
정관장 조원점 자동 알림
    `.trim();

    return sendEmailNotification({
      type: 'business',
      name: formData.contactName,
      phone: formData.phone,
      companyName: formData.companyName,
      purpose: formData.purpose,
      budgetPerUnit: formData.budgetPerUnit,
      quantity: formData.quantity,
      message: formData.message,
      submittedAt,
    });
  }
}

// EmailJS 템플릿 예시 (EmailJS 대시보드에서 설정)
/*
제목: [정관장 조원점] 새로운 {{inquiry_type}} 문의

본문:
안녕하세요, 새로운 문의가 접수되었습니다.

━━━━━━━━━━━━━━━━━━
📋 문의 정보
━━━━━━━━━━━━━━━━━━

문의 유형: {{inquiry_type}}
이름: {{name}}
연락처: {{phone}}
{{#company_name}}회사명: {{company_name}}{{/company_name}}

선물/용도: {{gift_type}}
예산: {{budget}}
수량: {{quantity}}

{{#message}}
추가 메시지:
{{message}}
{{/message}}

━━━━━━━━━━━━━━━━━━
접수 시각: {{submitted_at}}

{{#admin_link}}
관리자 페이지: {{admin_link}}
{{/admin_link}}

---
정관장 조원점 자동 알림 시스템
*/