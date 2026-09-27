import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 60;

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: { q?: string; country?: string };
}) {
  const supabase = createClient();
  let query = supabase.from('destinations').select('*').eq('status', 'published');

  if (searchParams.q) {
    query = query.ilike('name', `%${searchParams.q}%`);
  }
  if (searchParams.country) {
    query = query.eq('country', searchParams.country);
  }

  const { data: destinations, error } = await query.order('name');
  const { data: countryRows } = await supabase
    .from('destinations')
    .select('country')
    .eq('status', 'published');
  const countries = Array.from(new Set(countryRows?.map((r) => r.country) ?? []));

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl font-bold mb-6">Destinations</h1>

      <form className="flex flex-wrap gap-3 mb-8" action="/destinations">
        <input
          name="q"
          defaultValue={searchParams.q}
          placeholder="Search destinations…"
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm flex-1 min-w-[200px]"
        />
        <select name="country" defaultValue={searchParams.country ?? ''} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button className="btn btn-primary">Search</button>
      </form>

      {error && <p className="text-coral text-sm mb-4">Could not load destinations: {error.message}</p>}
      {!destinations?.length && !error && (
        <p className="text-gray-400 text-sm">No destinations match your search.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {destinations?.map((d) => (
          <Link key={d.id} href={`/destinations/${d.slug}`} className="card overflow-hidden group">
            <div className="relative h-32 w-full">
              {d.cover_image && (
                <Image src={d.cover_image} alt={d.name} fill className="object-cover group-hover:scale-105 transition" />
              )}
            </div>
            <div className="p-3">
              <div className="font-bold text-sm text-gray-900">{d.name}</div>
              <div className="text-xs text-gray-500">{d.country} · {d.best_season}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
