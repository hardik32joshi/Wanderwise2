import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 60;

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: { q?: string; sort?: string };
}) {
  const supabase = createClient();
  let query = supabase
    .from('travel_packages')
    .select('id,slug,title,base_price,duration_days,destinations(name,cover_image)')
    .eq('status', 'published');

  if (searchParams.q) query = query.ilike('title', `%${searchParams.q}%`);
  if (searchParams.sort === 'price_asc') query = query.order('base_price', { ascending: true });
  else if (searchParams.sort === 'price_desc') query = query.order('base_price', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  const { data: packages, error } = await query;

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl font-bold mb-6">Travel Packages</h1>

      <form className="flex flex-wrap gap-3 mb-8" action="/packages">
        <input name="q" defaultValue={searchParams.q} placeholder="Search packages…" className="border border-gray-200 rounded-lg px-4 py-2 text-sm flex-1 min-w-[200px]" />
        <select name="sort" defaultValue={searchParams.sort ?? ''} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <button className="btn btn-primary">Search</button>
      </form>

      {error && <p className="text-coral text-sm">Could not load packages: {error.message}</p>}
      {!packages?.length && !error && <p className="text-gray-400 text-sm">No packages match.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {packages?.map((p: any) => (
          <Link key={p.id} href={`/packages/${p.slug}`} className="card overflow-hidden group">
            <div className="relative h-40 w-full">
              {p.destinations?.cover_image && (
                <Image src={p.destinations.cover_image} alt={p.title} fill className="object-cover group-hover:scale-105 transition" />
              )}
            </div>
            <div className="p-4">
              <div className="font-bold text-gray-900">{p.title}</div>
              <div className="text-xs text-gray-500 mb-2">{p.destinations?.name} · {p.duration_days} days</div>
              <div className="font-extrabold text-primary-dark">₹{Number(p.base_price).toLocaleString('en-IN')}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
