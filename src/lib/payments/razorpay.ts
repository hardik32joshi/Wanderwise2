import crypto from 'crypto';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

/**
 * Creates a Razorpay order server-side. This is the ONLY correct way to
 * start a payment — the amount is set here, from the server's own total
 * calculation, never trusted from the client.
 */
export async function createRazorpayOrder(amountInRupees: number, receipt: string) {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error(
      'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment (see .env.example).'
    );
  }

  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(amountInRupees * 100), // paise
      currency: 'INR',
      receipt,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Razorpay order creation failed: ${body}`);
  }

  return res.json() as Promise<{ id: string; amount: number; currency: string }>;
}

/**
 * Verifies the signature Razorpay's checkout returns to the browser after
 * payment. This MUST be checked server-side before marking a booking paid —
 * never trust "payment success" reported only by client-side JS.
 * https://razorpay.com/docs/payments/server-integration/nodejs/payment-gateway/build-integration/#3-verify-payment-signature
 */
export function verifyRazorpayPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  if (!RAZORPAY_KEY_SECRET) throw new Error('RAZORPAY_KEY_SECRET is not set');
  const body = `${params.orderId}|${params.paymentId}`;
  const expected = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expected === params.signature;
}

/**
 * Verifies an incoming webhook's signature (X-Razorpay-Signature header)
 * against the raw request body, using a separate webhook secret you set
 * in the Razorpay dashboard. Always verify webhooks — they're how you
 * find out about payments that succeeded after the browser tab closed.
 */
export function verifyRazorpayWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error('RAZORPAY_WEBHOOK_SECRET is not set');
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return expected === signature;
}
