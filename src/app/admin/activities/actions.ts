'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export async function saveActivityAction(id: string | null, formData: FormData) {
  const supabase = createClient();
  const title = String(formData.get('title'));
  const payload = {
    title,
    slug: slugify(title) + '-' + Math.random().toString(36).slice(2, 6),
    destination_id: String(formData.get('destination_id')),
    description: String(formData.get('description') ?? ''),
    location: String(formData.get('location') ?? ''),
    duration: String(formData.get('duration') ?? ''),
    price: Number(formData.get('price') ?? 0),
    capacity: Number(formData.get('capacity') ?? 20),
    cancellation_policy: String(formData.get('cancellation_policy') ?? ''),
    status: String(formData.get('status') ?? 'draft'),
  };

  let error;
  if (id) {
    // keep existing slug on update
    const { slug, ...updatePayload } = payload;
    ({ error } = await supabase.from('activities').update(updatePayload).eq('id', id));
  } else {
    ({ error } = await supabase.from('activities').insert(payload));
  }
  if (error) throw new Error(error.message);

  revalidatePath('/admin/activities');
  redirect('/admin/activities');
}

export async function deleteActivityAction(id: string) {
  'use server';
  const supabase = createClient();
  await supabase.from('activities').delete().eq('id', id);
  revalidatePath('/admin/activities');
}
