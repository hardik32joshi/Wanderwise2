'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const supabase = createClient();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setDone(true);
  }

  if (done) {
    return (
      <div className="max-w-sm mx-auto px-5 py-16 text-center">
        <h1 className="font-display text-2xl font-bold mb-3">Check your email</h1>
        <p className="text-gray-600 text-sm">We sent a verification link to <strong>{email}</strong>. Click it to activate your account, then sign in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <h1 className="font-display text-2xl font-bold mb-6">Create your account</h1>
      <form onSubmit={signUp} className="space-y-3">
        <input required placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" />
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" />
        <input type="password" required minLength={6} placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" />
        {error && <div className="text-xs text-coral">{error}</div>}
        <button disabled={loading} className="btn btn-primary w-full">{loading ? 'Creating…' : 'Sign Up'}</button>
      </form>
      <p className="text-sm text-gray-500 mt-6 text-center">
        Already have an account? <Link href="/login" className="text-primary font-semibold">Sign in</Link>
      </p>
    </div>
  );
}
