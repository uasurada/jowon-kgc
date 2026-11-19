// app/admin/products/page.tsx — 제품 관리: 노출·매장 추천, 정보 수정, 신제품 추가, 이미지 교체, 가격 표시 설정
'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ExternalLink, ImagePlus, Plus, RefreshCw, Search, Star, Trash2, X } from 'lucide-react';
import {
  BADGES, FORMS, KINDS, PRICE_MODE_LABEL, SRC_LABEL, TAGS, won,
  type PriceMode, type Product, type SiteSettings,
} from '@/lib/productInfo';

type Draft = Omit<Product, 'id' | 'imageUrl' | 'customImage' | 'defaultImage' | 'src'> & {
  id?: string; imageUrl?: string | null; customImage?: boolean; defaultImage?: string | null; src?: string | null;
};

const EMPTY: Draft = {
  name: '', cat: '', badge: null, kind: '건강기능식품', form: '스틱', opts: [['', 0]], spec: '', descr: '',
  tags: [], who: '', ageMin: null, ageMax: null, visible: true, featured: false, sort: 0,
};

async function api(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `오류 (${res.status})`);
  return data;
}

/** 사진을 가로세로 1000px 안으로 줄여 JPEG로 (휴대폰 사진도 200KB 안팎) */
async function shrinkImage(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1000 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('이미지 변환 실패'))), 'image/jpeg', 0.86));
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState<Draft | null>(null);

  const [reloadKey, setReloadKey] = useState(0);
  const load = useCallback(() => { setLoading(true); setReloadKey((k) => k + 1); }, []);

  useEffect(() => {
    let alive = true;
    api('/api/admin/products')
      .then((data) => {
        if (!alive) return;
        setProducts(data.products);
        setSettings(data.settings);
        setError('');
      })
      .catch((e) => alive && setError(e instanceof Error ? e.message : String(e)))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [reloadKey]);

  const toggle = async (p: Product, key: 'visible' | 'featured') => {
    const value = !p[key];
    setProducts((list) => list.map((x) => (x.id === p.id ? { ...x, [key]: value } : x)));
    try {
      await api(`/api/admin/products/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ [key]: value }) });
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
      setProducts((list) => list.map((x) => (x.id === p.id ? { ...x, [key]: !value } : x)));
    }
  };

  const cats = [...new Set(products.map((p) => p.cat))];
  const needle = q.trim().toLowerCase();
  const shown = products.filter((p) =>
    (!cat || p.cat === cat) &&
    (!status || (status === 'visible' ? p.visible : status === 'hidden' ? !p.visible : p.featured)) &&
    (!needle || `${p.name} ${p.cat} ${p.who ?? ''}`.toLowerCase().includes(needle)));
  const counts = { visible: products.filter((p) => p.visible).length, featured: products.filter((p) => p.featured).length };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-red-600">
            <ChevronLeft size={18} />접수 관리
          </Link>
          <h1 className="font-bold text-gray-900">제품 관리</h1>
          <div className="flex items-center gap-3 text-sm">
            <a href="/products" target="_blank" className="hidden sm:inline-flex items-center gap-1 text-gray-600 hover:text-red-600">제품 안내 <ExternalLink size={14} /></a>
            <button onClick={load} className="inline-flex items-center gap-1 text-gray-600 hover:text-red-600"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} /></button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {error && <p className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</p>}

        {settings && <SettingsCard settings={settings} onSaved={setSettings} />}

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="제품명 검색" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">전체 분류</option>
              {cats.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">전체 상태</option>
              <option value="visible">노출 중</option>
              <option value="hidden">숨김</option>
              <option value="featured">매장 추천</option>
            </select>
            <button onClick={() => setEditing({ ...EMPTY, cat: cat || '' })} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold">
              <Plus size={16} />새 제품
            </button>
          </div>
          <p className="text-xs text-gray-500">
            전체 {products.length}개 · 노출 {counts.visible}개 · 매장 추천 {counts.featured}개 — <b>노출</b>을 끄면 홈페이지와 맞춤 추천에서 빠지고, <b>매장 추천</b>을 켜면 추천 결과 위쪽에 &lsquo;매장 추천&rsquo; 표시와 함께 나옵니다.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {shown.map((p) => (
            <div key={p.id} className={`flex items-center gap-3 p-3 ${p.visible ? '' : 'bg-gray-50'}`}>
              <button onClick={() => setEditing(p)} className="shrink-0 w-16 h-14 bg-white border border-gray-200 rounded overflow-hidden">
                {p.imageUrl && <img src={p.imageUrl} alt="" className={`w-full h-full object-contain ${p.visible ? '' : 'opacity-40'}`} />}
              </button>
              <button onClick={() => setEditing(p)} className="flex-1 min-w-0 text-left">
                <p className={`font-semibold truncate ${p.visible ? 'text-gray-900' : 'text-gray-400'}`}>
                  {p.name}{p.badge && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 align-middle">{p.badge}</span>}
                </p>
                <p className="text-xs text-gray-500 truncate">{p.cat} · {p.opts.map(([l, v]) => `${l} ${won(v)}`).join(' / ') || '가격 없음'}</p>
                <p className="text-xs text-gray-400 truncate">{p.who}{p.src === 'draft' && <span className="ml-1 text-amber-600">(추천 대상 추정)</span>}</p>
              </button>
              <div className="flex flex-col sm:flex-row gap-1.5 shrink-0">
                <Switch on={p.visible} onClick={() => toggle(p, 'visible')} label="노출" />
                <Switch on={p.featured} onClick={() => toggle(p, 'featured')} label="매장 추천" star />
              </div>
            </div>
          ))}
          {!loading && !shown.length && <p className="p-8 text-center text-sm text-gray-500">조건에 맞는 제품이 없습니다.</p>}
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          매장 태블릿에서는 <a href="/recommend/store" target="_blank" className="text-red-600 underline">/recommend/store</a> 주소를 열어 두세요.
          접수 버튼 없이 추천만 보여 주고, 90초 동안 손대지 않으면 처음 화면으로 돌아갑니다. 태블릿 방문은 통계에서 빠집니다.
        </p>
      </main>

      {editing && (
        <Editor
          draft={editing}
          cats={cats}
          onClose={() => setEditing(null)}
          onSaved={(id) => { load(); if (id) setEditing((d) => (d ? { ...d, id } : d)); }}
          onDeleted={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function Switch({ on, onClick, label, star }: { on: boolean; onClick: () => void; label: string; star?: boolean }) {
  return (
    <button onClick={onClick} aria-pressed={on}
      className={`inline-flex items-center justify-center gap-1 min-w-[84px] px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
        on ? (star ? 'bg-red-600 border-red-600 text-white' : 'bg-gray-900 border-gray-900 text-white') : 'bg-white border-gray-300 text-gray-400'
      }`}>
      {star && <Star size={12} fill={on ? 'currentColor' : 'none'} />}{label} {on ? 'ON' : 'OFF'}
    </button>
  );
}

function SettingsCard({ settings, onSaved }: { settings: SiteSettings; onSaved: (s: SiteSettings) => void }) {
  const [s, setS] = useState(settings);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(s) !== JSON.stringify(settings);
  const save = async () => {
    setSaving(true);
    try {
      const data = await api('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) });
      onSaved(data.settings);
      setS(data.settings);
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      <div>
        <p className="text-sm font-bold text-gray-900 mb-2">홈페이지 가격 표시</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PRICE_MODE_LABEL) as PriceMode[]).map((m) => (
            <button key={m} onClick={() => setS({ ...s, priceMode: m })}
              className={`px-3 py-2 rounded-lg border text-sm ${s.priceMode === m ? 'bg-gray-900 border-gray-900 text-white font-semibold' : 'border-gray-300 text-gray-600'}`}>
              {PRICE_MODE_LABEL[m]}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-gray-500">정가로 보여 줄 때는 &ldquo;명절·행사 할인은 매장으로 문의&rdquo; 안내가 함께 나옵니다.</p>
      </div>
      <div>
        <label className="inline-flex items-center gap-2 text-sm font-bold text-gray-900">
          <input type="checkbox" checked={s.promoOn} onChange={(e) => setS({ ...s, promoOn: e.target.checked })} className="w-4 h-4 accent-red-600" />
          행사 중 안내 띄우기
        </label>
        <input value={s.promoText} onChange={(e) => setS({ ...s, promoText: e.target.value })} disabled={!s.promoOn} maxLength={120}
          className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-400" />
        <p className="mt-1 text-xs text-gray-500">제품 안내·맞춤 추천 화면 위쪽에 빨간 띠로 보입니다. 할인 금액은 적지 않는 것을 권합니다.</p>
      </div>
      <div className="flex justify-end">
        <button onClick={save} disabled={!dirty || saving} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold disabled:bg-gray-300">
          {saving ? '저장 중…' : '설정 저장'}
        </button>
      </div>
    </div>
  );
}

function Editor({ draft, cats, onClose, onSaved, onDeleted }: {
  draft: Draft; cats: string[]; onClose: () => void; onSaved: (newId?: string) => void; onDeleted: () => void;
}) {
  const [d, setD] = useState<Draft>({ ...draft, opts: draft.opts.length ? draft.opts : [['', 0]] });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(draft.imageUrl ?? null);
  const isNew = !d.id;
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));

  const save = async () => {
    if (!d.name.trim() || !d.cat.trim()) { alert('제품명과 분류를 입력해 주세요.'); return; }
    setSaving(true);
    const body = {
      name: d.name, cat: d.cat, badge: d.badge, kind: d.kind, form: d.form, spec: d.spec, descr: d.descr,
      tags: d.tags, who: d.who, ageMin: d.ageMin, ageMax: d.ageMax, visible: d.visible, featured: d.featured, sort: d.sort,
      opts: d.opts.filter(([l, v]) => l.trim() || v > 0),
      ...(draft.who !== d.who || JSON.stringify(draft.tags) !== JSON.stringify(d.tags) ? { src: 'store' } : {}),
    };
    try {
      if (isNew) {
        const data = await api('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        set('id', data.id);
        onSaved(data.id);
        alert('추가했습니다. 이제 사진을 올릴 수 있어요.');
      } else {
        await api(`/api/admin/products/${d.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        onSaved();
        onClose();
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const upload = async (file: File | undefined) => {
    if (!file || !d.id) return;
    setUploading(true);
    try {
      const blob = await shrinkImage(file);
      await api(`/api/admin/products/${d.id}/image`, { method: 'POST', headers: { 'Content-Type': 'image/jpeg' }, body: blob });
      setPreview(URL.createObjectURL(blob));
      set('customImage', true);
      onSaved();
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setUploading(false);
    }
  };

  const resetImage = async () => {
    if (!d.id || !confirm('올린 사진을 지우고 기본 사진으로 되돌릴까요?')) return;
    await api(`/api/admin/products/${d.id}/image`, { method: 'DELETE' }).catch((e) => alert(e.message));
    setPreview(d.defaultImage ?? null);
    set('customImage', false);
    onSaved();
  };

  const remove = async () => {
    if (!d.id || !confirm(`'${d.name}'을(를) 완전히 삭제할까요?\n잠시 안 팔 제품이면 삭제 대신 '노출'을 끄는 것을 권합니다.`)) return;
    try {
      await api(`/api/admin/products/${d.id}`, { method: 'DELETE' });
      onDeleted();
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    }
  };

  const input = 'w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm';
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between z-10">
          <h2 className="font-bold">{isNew ? '새 제품 추가' : '제품 수정'}</h2>
          <button onClick={onClose} aria-label="닫기"><X size={20} /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-32 h-28 shrink-0 border border-gray-200 rounded-lg overflow-hidden bg-white grid place-items-center">
              {preview ? <img src={preview} alt="" className="w-full h-full object-contain" /> : <span className="text-xs text-gray-400">사진 없음</span>}
            </div>
            <div className="space-y-2 text-sm">
              {d.id ? (
                <>
                  <label className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <ImagePlus size={16} />{uploading ? '올리는 중…' : '사진 바꾸기'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
                  </label>
                  {d.customImage && d.defaultImage && <button onClick={resetImage} className="block text-xs text-gray-500 underline">기본 사진으로 되돌리기</button>}
                  <p className="text-xs text-gray-500">휴대폰으로 찍은 사진도 자동으로 줄여서 올라갑니다.</p>
                  <a href={`/products/${d.id}`} target="_blank" className="inline-flex items-center gap-1 text-xs text-red-600">홈페이지에서 보기 <ExternalLink size={12} /></a>
                </>
              ) : <p className="text-xs text-gray-500">먼저 저장하면 사진을 올릴 수 있어요.</p>}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={d.visible} onChange={(e) => set('visible', e.target.checked)} className="w-4 h-4 accent-gray-900" />홈페이지 노출</label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-red-600"><input type="checkbox" checked={d.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4 accent-red-600" />매장 추천</label>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="text-sm font-semibold">제품명 *<input value={d.name} onChange={(e) => set('name', e.target.value)} className={input} /></label>
            <label className="text-sm font-semibold">분류 *
              <input value={d.cat} onChange={(e) => set('cat', e.target.value)} list="cat-list" className={input} placeholder="목록에서 고르거나 새로 입력" />
              <datalist id="cat-list">{cats.map((c) => <option key={c} value={c} />)}</datalist>
            </label>
            <label className="text-sm font-semibold">형태
              <select value={d.form ?? ''} onChange={(e) => set('form', e.target.value || null)} className={input}>
                <option value="">-</option>{FORMS.map((f) => <option key={f}>{f}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold">구분
              <select value={d.kind ?? ''} onChange={(e) => set('kind', e.target.value || null)} className={input}>
                <option value="">-</option>{KINDS.map((k) => <option key={k}>{k}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold">배지
              <select value={d.badge ?? ''} onChange={(e) => set('badge', e.target.value || null)} className={input}>
                <option value="">없음</option>{BADGES.map((b) => <option key={b}>{b}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold">정렬 순서 <small className="font-normal text-gray-400">작을수록 앞</small>
              <input type="number" value={d.sort} onChange={(e) => set('sort', Number(e.target.value))} className={input} />
            </label>
          </div>

          <div>
            <p className="text-sm font-semibold">구성·정가</p>
            <div className="mt-1 space-y-2">
              {d.opts.map(([label, price], i) => (
                <div key={i} className="flex gap-2">
                  <input value={label} onChange={(e) => set('opts', d.opts.map((o, j) => (j === i ? [e.target.value, o[1]] : o)))} placeholder="예: 30포" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <input type="number" value={price || ''} onChange={(e) => set('opts', d.opts.map((o, j) => (j === i ? [o[0], Number(e.target.value)] : o)))} placeholder="정가(원)" className="w-36 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <button onClick={() => set('opts', d.opts.filter((_, j) => j !== i))} className="px-2 text-gray-400 hover:text-red-600" aria-label="구성 삭제"><X size={16} /></button>
                </div>
              ))}
              <button onClick={() => set('opts', [...d.opts, ['', 0]])} className="text-xs text-red-600 font-semibold">+ 구성 추가</button>
            </div>
          </div>

          <label className="block text-sm font-semibold">제품 구성 <small className="font-normal text-gray-400">예: 10mL x 30포</small>
            <input value={d.spec ?? ''} onChange={(e) => set('spec', e.target.value)} className={input} />
          </label>

          <div>
            <p className="text-sm font-semibold">추천 대상 <small className="font-normal text-gray-400">맞춤 추천에서 이 대상을 고르면 나옵니다</small></p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {Object.entries(TAGS).map(([k, label]) => {
                const on = d.tags.includes(k);
                return (
                  <button key={k} onClick={() => set('tags', on ? d.tags.filter((t) => t !== k) : [...d.tags, k])}
                    className={`px-2.5 py-1 rounded-full border text-xs ${on ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-300 text-gray-600'}`}>{label}</button>
                );
              })}
            </div>
          </div>

          <label className="block text-sm font-semibold">추천 문구 <small className="font-normal text-gray-400">고객에게 보이는 한 줄 · 효능 표현은 피해 주세요</small>
            <input value={d.who ?? ''} onChange={(e) => set('who', e.target.value)} className={input} placeholder="예: 출근길에 바로 드시기 좋아 직장인 자녀분들이 많이 찾으세요" />
            {d.src && <span className="text-xs font-normal text-gray-400">근거: {SRC_LABEL[d.src] ?? d.src}</span>}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-semibold">나이 (최소) <small className="font-normal text-gray-400">어린이 제품만</small>
              <input type="number" value={d.ageMin ?? ''} onChange={(e) => set('ageMin', e.target.value === '' ? null : Number(e.target.value))} className={input} />
            </label>
            <label className="text-sm font-semibold">나이 (최대)
              <input type="number" value={d.ageMax ?? ''} onChange={(e) => set('ageMax', e.target.value === '' ? null : Number(e.target.value))} className={input} />
            </label>
          </div>

          <label className="block text-sm font-semibold">공식 설명 <small className="font-normal text-gray-400">카탈로그·정관장몰 문구 그대로</small>
            <textarea value={d.descr ?? ''} onChange={(e) => set('descr', e.target.value)} rows={5} className={input} />
          </label>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-3 flex items-center justify-between gap-2">
          {d.id ? <button onClick={remove} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"><Trash2 size={15} />삭제</button> : <span />}
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-sm">닫기</button>
            <button onClick={save} disabled={saving} className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold disabled:bg-gray-300">{saving ? '저장 중…' : isNew ? '추가' : '저장'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
