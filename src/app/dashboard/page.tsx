import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const statusColor: Record<string, string> = {
  confirmed: 'bg-green-50 text-green-700',
  completed: 'bg-blue-50 text-blue-700',
  pending: 'bg-amber-50 text-amber-700',
  payment_pending: 'bg-amber-50 text-amber-700',
  cancelled: 'bg-red-50 text-red-700',
  refunded: 'bg-gray-100 text-gray-600',
};

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: bookings }, { data: notifications }, { data: profile }] = await Promise.all([
    supabase
      .from('bookings')
      .select('*, travel_packages(title,slug)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
    supabase.from('profiles').select('*').eq('id', user.id).single(),
  ]);

  const upcoming = bookings?.filter((b) => ['pending', 'payment_pending', 'confirmed'].includes(b.status)) ?? [];
  const past = bookings?.filter((b) => ['completed', 'cancelled', 'refunded'].includes(b.status)) ?? [];
  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl font-bold mb-1">Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}</h1>
      <p className="text-gray-500 text-sm mb-8">{user.email}</p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="font-bold text-lg mb-3">Upcoming Trips</h2>
            {!upcoming.length && <p className="text-sm text-gray-400">No upcoming trips. Browse /packages to book one.</p>}
            <div className="space-y-3">
              {upcoming.map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-3">Past Trips</h2>
            {!past.length && <p className="text-sm text-gray-400">No past trips yet.</p>}
            <div className="space-y-3">
              {past.map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))}
            </div>
          </section>
        </div>

        <aside>
          <div className="card p-4">
            <div className="font-bold text-sm mb-3">Notifications {unreadCount > 0 && <span className="ml-1 text-xs bg-coral text-white rounded-full px-2 py-0.5">{unreadCount}</span>}</div>
            {!notifications?.length && <p className="text-xs text-gray-400">No notifications yet.</p>}
            <div className="space-y-2">
              {notifications?.map((n) => (
                <div key={n.id} className={`text-xs p-2 rounded-lg ${n.is_read ? 'bg-gray-50' : 'bg-primary/5'}`}>
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-gray-500">{n.message}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: any }) {
  return (
    <div className="card p-4 flex items-center justify-between">
      <div>
        <div className="font-bold text-sm">{booking.travel_packages?.title ?? 'Package'}</div>
        <div className="text-xs text-gray-500">Ref {booking.booking_number} · {booking.travelers_count} travelers · {booking.travel_date}</div>
      </div>
      <div className="text-right">
        <div className="font-bold">₹{Number(booking.total).toLocaleString('en-IN')}</div>
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${statusColor[booking.status] ?? 'bg-gray-100 text-gray-600'}`}>
          {booking.status}
        </span>
      </div>
    </div>
  );
}
