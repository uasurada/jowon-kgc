'use client';

import { useState } from 'react';
import { Check, Gift, MapPin, Phone } from 'lucide-react';
import { openAddressSearch } from '@/lib/postcode';
import type { GiftView } from '@/lib/inquiries';

type Screen = 'form' | 'saved' | 'declined';

export default function GiftReplyForm({ token, gift }: { token: string; gift: GiftView | null }) {
  const [screen, setScreen] = useState<Screen | null>(
    gift?.state === 'open' ? 'form' : gift?.state === 'done' ? 'saved' : gift?.state === 'declined' ? 'declined' : null
  );
  const [zipcode, setZipcode] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);

  const post = async (body: object) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/gift/${token}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || '처리 중 오류가 발생했습니다.');
      return true;
    } catch (e) {
      alert(e instanceof Error ? e.message : '네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
      return false;
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (await post({ action: 'address', zipcode, address1, address2, consent })) setScreen('saved');
  };

  const decline = async () => {
    if (!confirm('선물을 사양하시겠어요? 보내시는 분께 매장에서 안내해 드립니다.')) return;
    if (await post({ action: 'decline' })) setScreen('declined');
  };

  const contact = (
    <div className="success-actions">
      <a href="tel:031-268-0304" className="button button-dark"><Phone size={18} /> 031-268-0304</a>
    </div>
  );

  if (!gift || screen === null) {
    return (
      <div className="success-card">
        <p className="eyebrow">JUNGKWANJANG JOWON</p>
        <h1>링크를 확인할 수<br />없습니다.</h1>
        <p>이미 발송되었거나 기간이 지난 링크입니다.<br />정관장 조원점으로 연락 주시면 바로 도와드리겠습니다.</p>
        {contact}
      </div>
    );
  }

  if (screen === 'saved') {
    return (
      <div className="success-card">
        <span className="success-icon"><Check /></span>
        <p className="eyebrow">ADDRESS RECEIVED</p>
        <h1>배송지가<br />접수되었습니다.</h1>
        <p>{gift.senderLabel}님의 마음을 담아 정성껏 포장해 보내드리겠습니다.</p>
        <p className="gift-reply-small">주소를 잘못 입력하셨다면 발송 전까지 다시 입력하실 수 있습니다.</p>
        <div className="success-actions">
          <button type="button" className="button button-dark" onClick={() => setScreen('form')}>주소 다시 입력</button>
        </div>
      </div>
    );
  }

  if (screen === 'declined') {
    return (
      <div className="success-card">
        <p className="eyebrow">JUNGKWANJANG JOWON</p>
        <h1>사양 의사가<br />전달되었습니다.</h1>
        <p>보내시는 분께 매장에서 안내해 드리겠습니다.<br />마음이 바뀌시면 매장으로 연락 주세요.</p>
        {contact}
      </div>
    );
  }

  const valid = address1.trim() && address2.trim() && consent;

  return (
    <div className="success-card gift-reply-card">
      <span className="success-icon gift"><Gift /></span>
      <p className="eyebrow">A GIFT FOR YOU</p>
      <h1>{gift.recipientName ? `${gift.recipientName}님,` : '안녕하세요,'}<br />선물이 도착했어요.</h1>
      <p><strong>{gift.senderLabel}</strong>님께서 정관장 선물을 보내셨습니다.<br />받으실 주소를 알려주시면 정성껏 포장해 보내드립니다.</p>

      <div className="modern-form">
        <div>
          <span className="gift-reply-label">받으실 주소 <em>필수</em></span>
          <div className="address-fields">
            <div className="address-search">
              <input value={zipcode} onChange={(e) => setZipcode(e.target.value)} placeholder="우편번호" inputMode="numeric" aria-label="우편번호" />
              <button type="button" onClick={() => openAddressSearch((z, a) => { setZipcode(z); setAddress1(a); })}><MapPin size={15} /> 주소 검색</button>
            </div>
            <input value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="주소 (주소 검색 또는 직접 입력)" aria-label="주소" />
            <input value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="상세주소 (동·호수 등)" aria-label="상세주소" />
          </div>
        </div>

        <div className="privacy-box">
          <label>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>
              <b>[필수]</b> 선물 배송을 위한 개인정보 수집·이용에 동의합니다.
              <small className="gift-reply-consent">수집 항목: 주소 · 목적: 선물 배송(택배사 전달) · 보유: 1년 후 파기. 동의하지 않으시면 배송이 어렵습니다. <a href="/privacy" target="_blank" rel="noopener noreferrer">개인정보처리방침</a></small>
            </span>
          </label>
        </div>

        <button type="button" onClick={submit} disabled={busy || !valid} className="form-submit">
          {busy ? '보내는 중...' : '이 주소로 받을게요'}
        </button>
        <p className="gift-reply-small">
          입력이 어려우시면 문자를 받으신 번호로 주소를 회신하시거나 <a href="tel:031-268-0304">031-268-0304</a>로 전화 주세요.<br />
          <button type="button" className="gift-reply-decline" onClick={decline} disabled={busy}>선물을 사양할게요</button>
        </p>
      </div>
    </div>
  );
}
