// lib/analytics.ts

// GA4 타입 선언
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// 이벤트 추적 함수
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// 페이지뷰 추적
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};

// 주요 이벤트 추적 함수들
export const analytics = {
  // 개인/기업 버튼 클릭
  trackPathSelect: (path: 'personal' | 'business') => {
    trackEvent('path_select', {
      path_type: path,
      event_category: 'engagement',
    });
  },

  // 선물 유형 선택 (개인)
  trackGiftTypeSelect: (giftType: string) => {
    trackEvent('gift_type_select', {
      gift_type: giftType,
      event_category: 'engagement',
    });
  },

  // 주문 용도 선택 (기업)
  trackPurposeSelect: (purpose: string) => {
    trackEvent('purpose_select', {
      purpose: purpose,
      event_category: 'engagement',
    });
  },

  // 폼 작성 시작
  trackFormStart: (formType: 'personal' | 'business') => {
    trackEvent('form_start', {
      form_type: formType,
      event_category: 'conversion',
    });
  },

  // 폼 제출 완료
  trackFormSubmit: (formType: 'personal' | 'business', formData: any) => {
    trackEvent('form_submit', {
      form_type: formType,
      gift_type: formData.giftType || formData.purpose,
      budget: formData.budget || formData.budgetPerUnit,
      quantity: formData.quantity,
      event_category: 'conversion',
      value: getBudgetValue(formData.budget || formData.budgetPerUnit),
    });
  },

  // 카톡 상담 클릭
  trackKakaoClick: (source: string) => {
    trackEvent('kakao_chat_click', {
      click_source: source,
      event_category: 'engagement',
    });
  },

  // 전화 상담 클릭
  trackPhoneClick: (source: string) => {
    trackEvent('phone_click', {
      click_source: source,
      event_category: 'engagement',
    });
  },

  // 이메일 클릭
  trackEmailClick: (source: string) => {
    trackEvent('email_click', {
      click_source: source,
      event_category: 'engagement',
    });
  },

  // 네이버 지도 클릭
  trackMapClick: () => {
    trackEvent('map_click', {
      event_category: 'engagement',
    });
  },

  // 폼 필드 인터랙션 (이탈 구간 파악용)
  trackFieldInteraction: (fieldName: string, formType: string) => {
    trackEvent('field_interaction', {
      field_name: fieldName,
      form_type: formType,
      event_category: 'engagement',
    });
  },

  // 스크롤 깊이
  trackScrollDepth: (depth: number) => {
    trackEvent('scroll_depth', {
      scroll_percentage: depth,
      event_category: 'engagement',
    });
  },
};

// 예산 텍스트를 숫자로 변환 (통계용)
function getBudgetValue(budget: string): number {
  const budgetMap: Record<string, number> = {
    '3만원대': 30000,
    '5만원대': 50000,
    '10만원대': 100000,
    '20만원대': 200000,
    '30만원 이상': 300000,
  };
  return budgetMap[budget] || 0;
}

// UTM 파라미터 추출
export const getUTMParams = () => {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_term: params.get('utm_term') || '',
    utm_content: params.get('utm_content') || '',
    referrer: document.referrer || '',
  };
};

// 세션 시작 시간 추적
export const trackSessionStart = () => {
  if (typeof window !== 'undefined') {
    const sessionStart = Date.now();
    sessionStorage.setItem('session_start', sessionStart.toString());
  }
};

// 세션 지속 시간 계산
export const getSessionDuration = (): number => {
  if (typeof window === 'undefined') return 0;

  const sessionStart = sessionStorage.getItem('session_start');
  if (!sessionStart) return 0;

  return Math.floor((Date.now() - parseInt(sessionStart)) / 1000); // 초 단위
};