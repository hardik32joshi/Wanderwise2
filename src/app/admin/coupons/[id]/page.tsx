import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CouponForm from '../CouponForm';

export const dynamic = 'force-dynamic';

export default async function EditCouponPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: coupon } = await supabase.from('coupons').select('*').eq('id', params.id).single();
  if (!coupon) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Edit Coupon</h1>
      <CouponForm coupon={coupon} id={params.id} />
    </div>
  );
}
