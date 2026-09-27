import { NextResponse } from 'next/server';
import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import { createRazorpayOrder } from '@/lib/payments/razorpay';

export async function POST(req: Request) {
  const { bookingId } = await req.json();
  if (!bookingId) return NextResponse.json({ error: 'bookingId is required' }, { status: 400 });

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  // Load the booking's real total from the database — never trust an
  // amount the client might send.
  const { data: booking, error } = await supabase
    .from('bookings')
    .select('id,total,user_id,status,booking_number')
    .eq('id', bookingId)
    .single();

  if (error || !booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  if (booking.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (booking.status !== 'pending') {
    return NextResponse.json({ error: `Booking is already ${booking.status}` }, { status: 400 });
  }

  try {
    const order = await createRazorpayOrder(Number(booking.total), booking.booking_number);

    // Writes below use the service-role client: payments/bookings status
    // changes are only ever made by trusted server code that has already
    // verified booking ownership above — RLS blocks customers from writing
    // to `payments` directly (see schema.sql), by design.
    const admin = createServiceRoleClient();
    await admin.from('bookings').update({ status: 'payment_pending' }).eq('id', booking.id);
    await admin.from('payments').insert({
      booking_id: booking.id,
      amount: booking.total,
      currency: 'INR',
      status: 'pending',
      provider: 'razorpay',
      provider_order_id: order.id,
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
