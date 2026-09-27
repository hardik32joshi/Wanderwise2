'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function NavAuth() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  if (email === undefined) return <div className="w-24" />;

  if (!email) {
    return (
      <Link href="/login" className="btn btn-primary">
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden sm:inline text-gray-500">{email}</span>
      <button onClick={signOut} className="btn btn-outline !py-1.5">
        Sign Out
      </button>
    </div>
  );
}
