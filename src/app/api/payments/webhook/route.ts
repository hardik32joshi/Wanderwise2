import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { verifyRazorpayWebhookSignature } from '@/lib/payments/razorpay';

// Configure this URL in your Razorpay Dashboard → Settings → Webhooks:
//   https://yourdomain.com/api/payments/webhook
// Events to subscribe to: payment.captured, payment.failed
// This is the reliable source of truth for payment status — the browser
// redirect in /api/payments/verify can be closed/interrupted, but the
// webhook always fires from Razorpay's servers.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature') ?? '';

  let validSignature = false;
  try {
    validSignature = verifyRazorpayWebhookSignature(rawBody, signature);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
  if (!validSignature) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const event = payload.event;
  const paymentEntity = payload.payload?.payment?.entity;
  const orderId = paymentEntity?.order_id;

  const admin = createServiceRoleClient();

  const { data: payment } = await admin
    .from('payments')
    .select('id,booking_id')
    .eq('provider_order_id', orderId)
    .single();

  if (payment) {
    await admin.from('payment_transactions').insert({
      payment_id: payment.id,
      event_type: event,
      raw_payload: payload,
    });

    if (event === 'payment.captured') {
      await admin.from('payments').update({ status: 'success', provider_payment_id: paymentEntity.id }).eq('id', payment.id);
      await admin.from('bookings').update({ status: 'confirmed' }).eq('id', payment.booking_id);
    } else if (event === 'payment.failed') {
      await admin.from('payments').update({ status: 'failed' }).eq('id', payment.id);
    }
  }

  return NextResponse.json({ received: true });
}
