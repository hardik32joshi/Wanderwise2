'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const toArray = (s: FormDataEntryValue | null) =>
  String(s ?? '').split(',').map((x) => x.trim()).filter(Boolean);

export async function saveDestinationAction(id: string | null, formData: FormData) {
  const supabase = createClient();

  const name = String(formData.get('name'));
  const payload = {
    name,
    slug: slugify(name),
    country: String(formData.get('country') ?? 'India'),
    description: String(formData.get('description') ?? ''),
    cover_image: String(formData.get('cover_image') ?? ''),
    best_season: String(formData.get('best_season') ?? ''),
    climate: String(formData.get('climate') ?? ''),
    currency: String(formData.get('currency') ?? 'INR'),
    language: String(formData.get('language') ?? ''),
    visa_info: String(formData.get('visa_info') ?? ''),
    safety_info: String(formData.get('safety_info') ?? ''),
    food_info: String(formData.get('food_info') ?? ''),
    attractions: toArray(formData.get('attractions')),
    hidden_gems: toArray(formData.get('hidden_gems')),
    travel_tips: toArray(formData.get('travel_tips')),
    status: String(formData.get('status') ?? 'draft'),
  };

  let error;
  if (id) {
    ({ error } = await supabase.from('destinations').update(payload).eq('id', id));
  } else {
    ({ error } = await supabase.from('destinations').insert(payload));
  }

  if (error) {
    // In production, surface this via a proper toast; kept simple here.
    throw new Error(error.message);
  }

  revalidatePath('/admin/destinations');
  revalidatePath('/destinations');
  redirect('/admin/destinations');
}

export async function deleteDestinationAction(id: string) {
  'use server';
  const supabase = createClient();
  await supabase.from('destinations').delete().eq('id', id);
  revalidatePath('/admin/destinations');
}
