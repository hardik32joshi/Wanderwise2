import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { deleteHotelAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminHotelsPage() {
  const supabase = createClient();
  const { data: hotels } = await supabase.from('hotels').select('*, destinations(name)').order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Hotels</h1>
        <Link href="/admin/hotels/new" className="btn btn-primary">+ New Hotel</Link>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Destination</th><th className="text-left p-3">Rating</th><th className="text-left p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {hotels?.map((h: any) => (
              <tr key={h.id} className="border-t border-gray-50">
                <td className="p-3 font-semibold">{h.name}</td>
                <td className="p-3 text-gray-500">{h.destinations?.name}</td>
                <td className="p-3">★{h.rating}</td>
                <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${h.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{h.status}</span></td>
                <td className="p-3 text-right space-x-3">
                  <Link href={`/admin/hotels/${h.id}`} className="text-primary font-semibold">Edit</Link>
                  <form action={deleteHotelAction.bind(null, h.id)} className="inline"><button className="text-coral font-semibold">Delete</button></form>
                </td>
              </tr>
            ))}
            {!hotels?.length && <tr><td colSpan={5} className="p-6 text-center text-gray-400">No hotels yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
