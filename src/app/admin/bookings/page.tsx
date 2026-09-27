import { createClient } from '@/lib/supabase/server';
import BookingStatusSelect from './BookingStatusSelect';

export const dynamic = 'force-dynamic';

const STATUSES = ['pending', 'payment_pending', 'confirmed', 'cancelled', 'completed', 'refunded'];

export default async function AdminBookingsPage({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = createClient();
  let query = supabase
    .from('bookings')
    .select('*, travel_packages(title), profiles(full_name)')
    .order('created_at', { ascending: false });
  if (searchParams.status) query = query.eq('status', searchParams.status);
  const { data: bookings } = await query;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">All Bookings</h1>

      <div className="flex gap-2 mb-4 flex-wrap text-xs">
        <a href="/admin/bookings" className={`px-3 py-1.5 rounded-full border ${!searchParams.status ? 'bg-primary text-white border-primary' : 'border-gray-200'}`}>All</a>
        {STATUSES.map((s) => (
          <a key={s} href={`/admin/bookings?status=${s}`} className={`px-3 py-1.5 rounded-full border ${searchParams.status === s ? 'bg-primary text-white border-primary' : 'border-gray-200'}`}>{s}</a>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr><th className="text-left p-3">Ref</th><th className="text-left p-3">Customer</th><th className="text-left p-3">Package</th><th className="text-left p-3">Travelers</th><th className="text-left p-3">Total</th><th className="text-left p-3">Status</th></tr>
          </thead>
          <tbody>
            {bookings?.map((b: any) => (
              <tr key={b.id} className="border-t border-gray-50">
                <td className="p-3 font-semibold">{b.booking_number}</td>
                <td className="p-3">{b.profiles?.full_name ?? '—'}</td>
                <td className="p-3 text-gray-500">{b.travel_packages?.title ?? '—'}</td>
                <td className="p-3">{b.travelers_count}</td>
                <td className="p-3 font-semibold">₹{Number(b.total).toLocaleString('en-IN')}</td>
                <td className="p-3">
                  <BookingStatusSelect bookingId={b.id} currentStatus={b.status} />
                </td>
              </tr>
            ))}
            {!bookings?.length && <tr><td colSpan={6} className="p-6 text-center text-gray-400">No bookings match.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
