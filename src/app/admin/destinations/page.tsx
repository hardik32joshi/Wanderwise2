import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { deleteDestinationAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminDestinationsPage({ searchParams }: { searchParams: { q?: string } }) {
  const supabase = createClient();
  let query = supabase.from('destinations').select('*').order('created_at', { ascending: false });
  if (searchParams.q) query = query.ilike('name', `%${searchParams.q}%`);
  const { data: destinations } = await query;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Destinations</h1>
        <Link href="/admin/destinations/new" className="btn btn-primary">+ New Destination</Link>
      </div>

      <form className="mb-4" action="/admin/destinations">
        <input name="q" defaultValue={searchParams.q} placeholder="Search…" className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64" />
      </form>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Country</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3"></th>
            </tr>
          </thead>
          <tbody>
            {destinations?.map((d) => (
              <tr key={d.id} className="border-t border-gray-50">
                <td className="p-3 font-semibold">{d.name}</td>
                <td className="p-3 text-gray-500">{d.country}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${d.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {d.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-3">
                  <Link href={`/admin/destinations/${d.id}`} className="text-primary font-semibold">Edit</Link>
                  <form action={deleteDestinationAction.bind(null, d.id)} className="inline">
                    <button className="text-coral font-semibold">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {!destinations?.length && (
              <tr><td colSpan={4} className="p-6 text-center text-gray-400">No destinations yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
