'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const toArray = (s: FormDataEntryValue | null) =>
  String(s ?? '').split(',').map((x) => x.trim()).filter(Boolean);

export async function savePackageAction(id: string | null, formData: FormData) {
  const supabase = createClient();

  const title = String(formData.get('title'));
  const payload = {
    title,
    slug: slugify(title),
    destination_id: String(formData.get('destination_id')),
    description: String(formData.get('description') ?? ''),
    duration_days: Number(formData.get('duration_days') ?? 1),
    base_price: Number(formData.get('base_price') ?? 0),
    max_travelers: Number(formData.get('max_travelers') ?? 10),
    inclusions: toArray(formData.get('inclusions')),
    exclusions: toArray(formData.get('exclusions')),
    cancellation_policy: String(formData.get('cancellation_policy') ?? ''),
    status: String(formData.get('status') ?? 'draft'),
  };

  let packageId = id;
  let error;
  if (id) {
    ({ error } = await supabase.from('travel_packages').update(payload).eq('id', id));
  } else {
    const { data, error: insertErr } = await supabase.from('travel_packages').insert(payload).select().single();
    error = insertErr;
    packageId = data?.id ?? null;
  }
  if (error) throw new Error(error.message);

  const coverImage = String(formData.get('cover_image') ?? '');
  if (coverImage && packageId) {
    await supabase.from('package_images').delete().eq('package_id', packageId);
    await supabase.from('package_images').insert({ package_id: packageId, url: coverImage, sort_order: 0 });
  }

  revalidatePath('/admin/packages');
  revalidatePath('/packages');
  redirect('/admin/packages');
}

export async function deletePackageAction(id: string) {
  'use server';
  const supabase = createClient();
  await supabase.from('travel_packages').delete().eq('id', id);
  revalidatePath('/admin/packages');
}
