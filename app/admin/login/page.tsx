// app/admin/login/page.tsx
'use client';

import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, remember }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error || '로그인에 실패했습니다.');

      // 외부 주소로 튕기지 않도록 /admin 하위 경로만 허용
      const next = new URLSearchParams(window.location.search).get('next') || '/admin';
      window.location.href = next.startsWith('/admin') ? next : '/admin';
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* name/autocomplete 속성이 있어야 브라우저·휴대폰 비밀번호 저장이 동작한다 */}
      <form
        onSubmit={onSubmit}
        method="post"
        action="/api/admin-auth/login"
        className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
            <Lock className="text-red-600" size={22} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">관리자 로그인</h1>
          <p className="text-sm text-gray-600">정관장 조원점</p>
        </div>

        <label className="block text-sm text-gray-700 mb-1" htmlFor="username">아이디</label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg mb-4"
        />

        <label className="block text-sm text-gray-700 mb-1" htmlFor="password">비밀번호</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg mb-4"
        />

        <label className="flex items-center gap-2 text-sm text-gray-700 mb-6 select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 accent-red-600"
          />
          로그인 유지 (30일)
        </label>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}
