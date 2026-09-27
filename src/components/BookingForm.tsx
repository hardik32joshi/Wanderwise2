'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { createBookingAction, validateCouponAction } from '@/app/packages/[slug]/actions';

export default function BookingForm({
  packageId,
  basePrice,
  maxTravelers,
}: {
  packageId: string;
  basePrice: number;
  maxTravelers: number;
}) {
  const router = useRouter();
  const [travelDate, setTravelDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<any>(null);

  const subtotal = basePrice * travelers;
  const taxes = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + taxes;

  async function checkCoupon() {
    if (!couponCode) return;
    const result = await validateCouponAction(couponCode, subtotal);
    setCouponMsg(result.message);
    setDiscount(result.valid ? Number(result.discount_amount) : 0);
  }

  async function reserve() {
    setError(null);
    if (!travelDate) { setError('Choose a travel date'); return; }
    setLoading(true);
    const result = await createBookingAction({
      packageId,
      travelDate,
      travelersCount: travelers,
      basePrice,
      couponCode: discount > 0 ? couponCode : undefined,
    });
    setLoading(false);
    if ('error' in result) { setError(result.error!); return; }
    setBooking(result.booking);
  }

  async function payWithRazorpay() {
    setError(null);
    setLoading(true);
    const res = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: booking.id }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) { setError(data.error); return; }

    if (!data.keyId) {
      setError('Razorpay is not configured on this deployment yet (missing RAZORPAY_KEY_ID/SECRET). Your booking is saved as "pending" — an admin can confirm it manually once payments are configured.');
      return;
    }

    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: 'WanderWise',
      description: 'Package booking',
      order_id: data.orderId,
      handler: async function (response: any) {
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: booking.id, ...response }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          router.push('/dashboard');
        } else {
          setError(verifyData.error ?? 'Payment verification failed');
        }
      },
      theme: { color: '#1a6b5c' },
    };
    // @ts-ignore — Razorpay is loaded via the <Script> tag below
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  return (
    <div className="card p-5 sticky top-24">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="text-2xl font-extrabold text-primary-dark mb-1">₹{basePrice.toLocaleString('en-IN')}</div>
      <div className="text-xs text-gray-400 mb-4">per traveler</div>

      {!booking ? (
        <>
          <label className="text-xs font-semibold block mb-1">Travel date</label>
          <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3" />

          <label className="text-xs font-semibold block mb-1">Travelers</label>
          <input type="number" min={1} max={maxTravelers} value={travelers} onChange={(e) => setTravelers(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3" />

          <label className="text-xs font-semibold block mb-1">Coupon code</label>
          <div className="flex gap-2 mb-1">
            <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="GOA500" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <button onClick={checkCoupon} className="btn btn-outline !py-2">Apply</button>
          </div>
          {couponMsg && <div className={`text-xs mb-3 ${discount > 0 ? 'text-primary' : 'text-coral'}`}>{couponMsg}</div>}

          <div className="text-sm space-y-1 border-t border-gray-100 pt-3 mb-4">
            <Row label="Subtotal" value={subtotal} />
            {discount > 0 && <Row label="Discount" value={-discount} />}
            <Row label="Taxes (5%)" value={taxes} />
            <Row label="Total" value={total} bold />
          </div>

          {error && <div className="text-xs text-coral mb-3">{error}</div>}
          <button onClick={reserve} disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Reserving…' : 'Reserve Booking'}
          </button>
        </>
      ) : (
        <>
          <div className="text-sm text-gray-600 mb-2">
            Booking <strong>{booking.booking_number}</strong> reserved. Total due: <strong>₹{Number(booking.total).toLocaleString('en-IN')}</strong>
          </div>
          {error && <div className="text-xs text-coral mb-3">{error}</div>}
          <button onClick={payWithRazorpay} disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Loading…' : 'Pay with Razorpay'}
          </button>
        </>
      )}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
      <span>{label}</span>
      <span>₹{value.toLocaleString('en-IN')}</span>
    </div>
  );
}
