import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { deleteCouponAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminCouponsPage() {
  const supabase = createClient();
  const { data: coupons } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Coupons</h1>
        <Link href="/admin/coupons/new" className="btn btn-primary">+ New Coupon</Link>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr><th className="text-left p-3">Code</th><th className="text-left p-3">Discount</th><th className="text-left p-3">Min Purchase</th><th className="text-left p-3">Expires</th><th className="text-left p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {coupons?.map((c) => (
              <tr key={c.id} className="border-t border-gray-50">
                <td className="p-3 font-mono font-bold">{c.code}</td>
                <td className="p-3">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}</td>
                <td className="p-3">₹{Number(c.min_purchase).toLocaleString('en-IN')}</td>
                <td className="p-3 text-gray-500">{c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-IN') : '—'}</td>
                <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.status}</span></td>
                <td className="p-3 text-right space-x-3">
                  <Link href={`/admin/coupons/${c.id}`} className="text-primary font-semibold">Edit</Link>
                  <form action={deleteCouponAction.bind(null, c.id)} className="inline"><button className="text-coral font-semibold">Delete</button></form>
                </td>
              </tr>
            ))}
            {!coupons?.length && <tr><td colSpan={6} className="p-6 text-center text-gray-400">No coupons yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
