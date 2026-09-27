'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const toArray = (s: FormDataEntryValue | null) =>
  String(s ?? '').split(',').map((x) => x.trim()).filter(Boolean);

export async function saveHotelAction(id: string | null, formData: FormData) {
  const supabase = createClient();
  const payload = {
    name: String(formData.get('name')),
    destination_id: String(formData.get('destination_id')),
    description: String(formData.get('description') ?? ''),
    images: toArray(formData.get('images')),
    address: String(formData.get('address') ?? ''),
    rating: Number(formData.get('rating') ?? 0),
    amenities: toArray(formData.get('amenities')),
    policies: String(formData.get('policies') ?? ''),
    status: String(formData.get('status') ?? 'draft'),
  };

  let error;
  if (id) ({ error } = await supabase.from('hotels').update(payload).eq('id', id));
  else ({ error } = await supabase.from('hotels').insert(payload));
  if (error) throw new Error(error.message);

  revalidatePath('/admin/hotels');
  redirect('/admin/hotels');
}

export async function deleteHotelAction(id: string) {
  'use server';
  const supabase = createClient();
  await supabase.from('hotels').delete().eq('id', id);
  revalidatePath('/admin/hotels');
}
