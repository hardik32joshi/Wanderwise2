import { NextResponse } from 'next/server';
import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import { verifyRazorpayPaymentSignature } from '@/lib/payments/razorpay';

export async function POST(req: Request) {
  const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { data: booking } = await supabase
    .from('bookings')
    .select('id,user_id')
    .eq('id', bookingId)
    .single();
  if (!booking || booking.user_id !== user.id) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  const ok = verifyRazorpayPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  const admin = createServiceRoleClient();

  if (!ok) {
    await admin
      .from('payments')
      .update({ status: 'failed' })
      .eq('booking_id', bookingId)
      .eq('provider_order_id', razorpay_order_id);
    return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
  }

  await admin
    .from('payments')
    .update({ status: 'success', provider_payment_id: razorpay_payment_id, method: 'razorpay' })
    .eq('booking_id', bookingId)
    .eq('provider_order_id', razorpay_order_id);

  await admin.from('bookings').update({ status: 'confirmed' }).eq('id', bookingId);

  await admin.from('notifications').insert({
    user_id: user.id,
    type: 'booking_confirmed',
    title: 'Booking confirmed!',
    message: `Your booking has been confirmed. Payment ID: ${razorpay_payment_id}`,
  });

  return NextResponse.json({ success: true });
}
