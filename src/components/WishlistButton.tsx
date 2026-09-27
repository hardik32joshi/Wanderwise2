'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type ItemType = 'destination' | 'package' | 'hotel' | 'activity';

export default function WishlistButton({ itemType, itemId }: { itemType: ItemType; itemId: string }) {
  const supabase = createClient();
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (!uid) return;
      const { data: row } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', uid)
        .eq('item_type', itemType)
        .eq('item_id', itemId)
        .maybeSingle();
      setSaved(!!row);
    })();
  }, [itemId, itemType, supabase]);

  async function toggle() {
    if (!userId) {
      window.location.href = '/login';
      return;
    }
    setBusy(true);
    if (saved) {
      await supabase.from('wishlists').delete().eq('user_id', userId).eq('item_type', itemType).eq('item_id', itemId);
      setSaved(false);
    } else {
      await supabase.from('wishlists').insert({ user_id: userId, item_type: itemType, item_id: itemId });
      setSaved(true);
    }
    setBusy(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition ${
        saved ? 'bg-coral text-white' : 'bg-white/90 text-gray-700'
      }`}
      aria-label="Toggle wishlist"
    >
      {saved ? '♥' : '♡'}
    </button>
  );
}
