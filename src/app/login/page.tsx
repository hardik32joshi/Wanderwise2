'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const supabase = createClient();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push(params.get('redirectedFrom') || '/dashboard');
    router.refresh();
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <h1 className="font-display text-2xl font-bold mb-6">Sign In</h1>
      <form onSubmit={signIn} className="space-y-3">
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" />
        <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" />
        {error && <div className="text-xs text-coral">{error}</div>}
        <button disabled={loading} className="btn btn-primary w-full">{loading ? 'Signing in…' : 'Sign In'}</button>
      </form>
      <button onClick={signInWithGoogle} className="btn btn-outline w-full mt-3">Continue with Google</button>
      <p className="text-sm text-gray-500 mt-6 text-center">
        No account? <Link href="/signup" className="text-primary font-semibold">Sign up</Link>
      </p>
    </div>
  );
}
