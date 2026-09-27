import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { deleteActivityAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminActivitiesPage() {
  const supabase = createClient();
  const { data: activities } = await supabase.from('activities').select('*, destinations(name)').order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Activities</h1>
        <Link href="/admin/activities/new" className="btn btn-primary">+ New Activity</Link>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr><th className="text-left p-3">Title</th><th className="text-left p-3">Destination</th><th className="text-left p-3">Price</th><th className="text-left p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {activities?.map((a: any) => (
              <tr key={a.id} className="border-t border-gray-50">
                <td className="p-3 font-semibold">{a.title}</td>
                <td className="p-3 text-gray-500">{a.destinations?.name}</td>
                <td className="p-3">₹{Number(a.price).toLocaleString('en-IN')}</td>
                <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${a.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{a.status}</span></td>
                <td className="p-3 text-right space-x-3">
                  <Link href={`/admin/activities/${a.id}`} className="text-primary font-semibold">Edit</Link>
                  <form action={deleteActivityAction.bind(null, a.id)} className="inline"><button className="text-coral font-semibold">Delete</button></form>
                </td>
              </tr>
            ))}
            {!activities?.length && <tr><td colSpan={5} className="p-6 text-center text-gray-400">No activities yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
