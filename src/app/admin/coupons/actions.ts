'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveCouponAction(id: string | null, formData: FormData) {
  const supabase = createClient();
  const payload = {
    code: String(formData.get('code')).toUpperCase().trim(),
    description: String(formData.get('description') ?? ''),
    discount_type: String(formData.get('discount_type')),
    discount_value: Number(formData.get('discount_value') ?? 0),
    min_purchase: Number(formData.get('min_purchase') ?? 0),
    max_discount: formData.get('max_discount') ? Number(formData.get('max_discount')) : null,
    expires_at: formData.get('expires_at') ? new Date(String(formData.get('expires_at'))).toISOString() : null,
    usage_limit: formData.get('usage_limit') ? Number(formData.get('usage_limit')) : null,
    per_user_limit: Number(formData.get('per_user_limit') ?? 1),
    status: String(formData.get('status') ?? 'active'),
  };

  let error;
  if (id) ({ error } = await supabase.from('coupons').update(payload).eq('id', id));
  else ({ error } = await supabase.from('coupons').insert(payload));
  if (error) throw new Error(error.message);

  revalidatePath('/admin/coupons');
  redirect('/admin/coupons');
}

export async function deleteCouponAction(id: string) {
  'use server';
  const supabase = createClient();
  await supabase.from('coupons').delete().eq('id', id);
  revalidatePath('/admin/coupons');
}
