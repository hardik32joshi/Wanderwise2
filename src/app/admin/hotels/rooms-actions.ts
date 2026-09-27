'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addRoomAction(hotelId: string, formData: FormData) {
  const supabase = createClient();
  await supabase.from('hotel_rooms').insert({
    hotel_id: hotelId,
    room_type: String(formData.get('room_type')),
    capacity: Number(formData.get('capacity') ?? 2),
    price: Number(formData.get('price') ?? 0),
    available_quantity: Number(formData.get('available_quantity') ?? 1),
  });
  revalidatePath(`/admin/hotels/${hotelId}`);
}

export async function deleteRoomAction(roomId: string, hotelId: string) {
  'use server';
  const supabase = createClient();
  await supabase.from('hotel_rooms').delete().eq('id', roomId);
  revalidatePath(`/admin/hotels/${hotelId}`);
}
