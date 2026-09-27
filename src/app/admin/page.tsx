import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const supabase = createClient();

  const [{ count: destCount }, { count: pkgCount }, { count: bookingCount }, { data: bookingsForRevenue }, { count: userCount }] = await Promise.all([
    supabase.from('destinations').select('*', { count: 'exact', head: true }),
    supabase.from('travel_packages').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('total').eq('status', 'confirmed'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ]);

  const revenue = bookingsForRevenue?.reduce((sum, b) => sum + Number(b.total), 0) ?? 0;

  const stats = [
    { label: 'Total Revenue', value: `₹${revenue.toLocaleString('en-IN')}` },
    { label: 'Total Bookings', value: bookingCount ?? 0 },
    { label: 'Total Customers', value: userCount ?? 0 },
    { label: 'Destinations', value: destCount ?? 0 },
    { label: 'Active Packages', value: pkgCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="text-2xl font-extrabold">{s.value}</div>
            <div className="text-xs text-gray-500 font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
