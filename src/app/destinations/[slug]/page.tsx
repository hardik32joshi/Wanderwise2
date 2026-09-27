import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import WishlistButton from '@/components/WishlistButton';

export const revalidate = 60;

export default async function DestinationDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: destination } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!destination) notFound();

  const [{ data: packages }, { data: hotels }, { data: activities }, { data: reviews }] = await Promise.all([
    supabase.from('travel_packages').select('id,slug,title,base_price,duration_days').eq('destination_id', destination.id).eq('status', 'published'),
    supabase.from('hotels').select('id,name,rating,images').eq('destination_id', destination.id).eq('status', 'published'),
    supabase.from('activities').select('id,title,price,duration').eq('destination_id', destination.id).eq('status', 'published'),
    supabase.from('reviews').select('id,rating,title,comment,profiles(full_name)').eq('item_type', 'destination').eq('item_id', destination.id).eq('status', 'approved').limit(5),
  ]);

  return (
    <div>
      <div className="relative h-72 w-full">
        {destination.cover_image && (
          <Image src={destination.cover_image} alt={destination.name} fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="font-display text-4xl font-bold">{destination.name}</h1>
          <p className="text-white/80">{destination.country} · Best season: {destination.best_season}</p>
        </div>
        <div className="absolute top-6 right-6">
          <WishlistButton itemType="destination" itemId={destination.id} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-10 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <p className="text-gray-700 leading-relaxed">{destination.description}</p>

          <div>
            <h2 className="font-bold text-lg mb-3">Top Attractions</h2>
            <div className="flex flex-wrap gap-2">
              {destination.attractions?.map((a: string) => (
                <span key={a} className="text-xs bg-gray-100 rounded-full px-3 py-1">{a}</span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-3">Packages here</h2>
            {!packages?.length && <p className="text-sm text-gray-400">No packages published for this destination yet.</p>}
            <div className="grid sm:grid-cols-2 gap-4">
              {packages?.map((p) => (
                <Link key={p.id} href={`/packages/${p.slug}`} className="card p-4 hover:shadow-lg transition">
                  <div className="font-bold">{p.title}</div>
                  <div className="text-xs text-gray-500 mb-2">{p.duration_days} days</div>
                  <div className="font-extrabold text-primary-dark">₹{Number(p.base_price).toLocaleString('en-IN')}</div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-3">Activities</h2>
            {!activities?.length && <p className="text-sm text-gray-400">No activities published yet.</p>}
            <div className="flex flex-wrap gap-3">
              {activities?.map((a) => (
                <div key={a.id} className="card p-3 text-sm">
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-gray-500">{a.duration} · ₹{Number(a.price).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-3">Reviews</h2>
            {!reviews?.length && <p className="text-sm text-gray-400">No approved reviews yet.</p>}
            <div className="space-y-3">
              {reviews?.map((r: any) => (
                <div key={r.id} className="card p-4">
                  <div className="font-semibold text-sm">{'★'.repeat(r.rating)} {r.title}</div>
                  <div className="text-sm text-gray-600">{r.comment}</div>
                  <div className="text-xs text-gray-400 mt-1">— {r.profiles?.full_name ?? 'Traveler'} · Verified traveler</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-4 text-sm space-y-2">
            <InfoRow label="Currency" value={destination.currency} />
            <InfoRow label="Language" value={destination.language} />
            <InfoRow label="Visa" value={destination.visa_info} />
            <InfoRow label="Safety score" value={destination.safety_info} />
            <InfoRow label="Climate" value={destination.climate} />
          </div>
          {!!hotels?.length && (
            <div className="card p-4">
              <div className="font-bold text-sm mb-2">Hotels</div>
              {hotels.map((h) => (
                <div key={h.id} className="text-sm flex justify-between py-1 border-b border-gray-50 last:border-0">
                  <span>{h.name}</span>
                  <span className="text-gray-400">★{h.rating}</span>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
