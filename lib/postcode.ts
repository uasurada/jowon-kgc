// lib/postcode.ts — 카카오(다음) 우편번호 서비스. 무료·키 없음, 필요할 때만 스크립트를 불러온다

type DaumPostcodeData = { zonecode: string; roadAddress: string; jibunAddress: string };
declare global {
  interface Window {
    daum?: { Postcode: new (o: { oncomplete: (d: DaumPostcodeData) => void }) => { open: () => void } };
  }
}

function loadDaumPostcode() {
  if (window.daum?.Postcode) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('postcode load failed'));
    document.head.appendChild(s);
  });
}

/** 주소 검색 팝업을 열고, 선택하면 우편번호·도로명주소를 넘겨준다 */
export async function openAddressSearch(onSelect: (zipcode: string, address1: string) => void) {
  try {
    await loadDaumPostcode();
    new window.daum!.Postcode({
      oncomplete: (d) => onSelect(d.zonecode, d.roadAddress || d.jibunAddress),
    }).open();
  } catch {
    alert('주소 검색을 불러오지 못했습니다. 주소를 직접 입력해 주세요.');
  }
}
