'use server';

import { createClient } from '@/lib/supabase/server';

export async function validateCouponAction(code: string, subtotal: number) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('validate_coupon', { p_code: code, p_subtotal: subtotal });
  if (error) return { valid: false, message: error.message, discount_amount: 0, coupon_id: null };
  return data?.[0] ?? { valid: false, message: 'No response from server', discount_amount: 0, coupon_id: null };
}

export async function createBookingAction(input: {
  packageId: string;
  travelDate: string;
  travelersCount: number;
  basePrice: number;
  couponCode?: string;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be signed in to book.' };

  const subtotal = input.basePrice * input.travelersCount;
  let discount = 0;
  let couponId: string | null = null;

  if (input.couponCode) {
    const { data: couponResult } = await supabase.rpc('validate_coupon', {
      p_code: input.couponCode,
      p_subtotal: subtotal,
    });
    const result = couponResult?.[0];
    if (result?.valid) {
      discount = Number(result.discount_amount);
      couponId = result.coupon_id;
    } else {
      return { error: result?.message ?? 'Invalid coupon' };
    }
  }

  const taxes = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + taxes;

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      package_id: input.packageId,
      status: 'pending',
      travel_date: input.travelDate,
      travelers_count: input.travelersCount,
      subtotal,
      discount,
      taxes,
      total,
      coupon_id: couponId,
    })
    .select()
    .single();

  if (bookingError) return { error: bookingError.message };

  await supabase.from('booking_items').insert({
    booking_id: booking.id,
    item_type: 'package',
    item_id: input.packageId,
    item_name: 'Package booking',
    quantity: input.travelersCount,
    unit_price: input.basePrice,
    total_price: subtotal,
  });

  if (couponId) {
    await supabase.from('coupon_usage').insert({ coupon_id: couponId, user_id: user.id, booking_id: booking.id });
  }

  return { booking };
}
