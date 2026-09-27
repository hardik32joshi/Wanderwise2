'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateBookingStatusAction(bookingId: string, status: string) {
  const supabase = createClient();
  const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
  if (error) throw new Error(error.message);

  const { data: booking } = await supabase.from('bookings').select('user_id, booking_number').eq('id', bookingId).single();
  if (booking) {
    await supabase.from('notifications').insert({
      user_id: booking.user_id,
      type: 'booking_status_changed',
      title: 'Booking status updated',
      message: `Booking ${booking.booking_number} is now "${status}".`,
    });
  }

  revalidatePath('/admin/bookings');
}
