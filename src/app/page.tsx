import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import type { Destination, TravelPackage } from '@/lib/types';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: destinations }, { data: packages }] = await Promise.all([
    supabase
      .from('destinations')
      .select('id,slug,name,country,cover_image')
      .eq('status', 'published')
      .limit(8),
    supabase
      .from('travel_packages')
      .select('id,slug,title,base_price,duration_days,destinations(name,slug,cover_image)')
      .eq('status', 'published')
      .limit(6),
  ]);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-dark via-primary to-sky text-white py-20 px-5 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Plan, book, and travel — for real.
        </h1>
        <p className="text-white/80 max-w-xl mx-auto mb-6">
          Every destination, package, price, and booking on this page comes straight from our
          database — not hardcoded demo data.
        </p>
        <Link href="/destinations" className="btn bg-accent text-primary-dark hover:bg-accent-light">
          Explore Destinations
        </Link>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-14">
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Popular Destinations</h2>
        {!destinations?.length && (
          <EmptyState message="No destinations published yet. Add some from /admin/destinations." />
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {destinations?.map((d: Pick<Destination, 'id' | 'slug' | 'name' | 'country' | 'cover_image'>) => (
            <Link
              key={d.id}
              href={`/destinations/${d.slug}`}
              className="card overflow-hidden group"
            >
              <div className="relative h-32 w-full">
                {d.cover_image && (
                  <Image src={d.cover_image} alt={d.name} fill className="object-cover group-hover:scale-105 transition" />
                )}
              </div>
              <div className="p-3">
                <div className="font-bold text-sm text-gray-900">{d.name}</div>
                <div className="text-xs text-gray-500">{d.country}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-16">
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Featured Packages</h2>
        {!packages?.length && (
          <EmptyState message="No packages published yet. Add some from /admin (packages CRUD)." />
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
      </section>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-sm text-gray-400 border border-dashed border-gray-200 rounded-card p-8 text-center mb-6">
      {message}
    </div>
  );
}
