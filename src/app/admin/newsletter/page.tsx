import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminNewsletterPage() {
  const supabase = createClient();
  const { data: subscribers } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Newsletter Subscribers ({subscribers?.length ?? 0})</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr><th className="text-left p-3">Email</th><th className="text-left p-3">Subscribed</th></tr>
          </thead>
          <tbody>
            {subscribers?.map((s) => (
              <tr key={s.id} className="border-t border-gray-50">
                <td className="p-3">{s.email}</td>
                <td className="p-3 text-gray-500">{new Date(s.created_at).toLocaleString('en-IN')}</td>
              </tr>
            ))}
            {!subscribers?.length && <tr><td colSpan={2} className="p-6 text-center text-gray-400">No subscribers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
