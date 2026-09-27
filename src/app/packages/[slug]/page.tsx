import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BookingForm from '@/components/BookingForm';

export const revalidate = 60;

export default async function PackageDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: pkg } = await supabase
    .from('travel_packages')
    .select('*, destinations(name,slug,cover_image), package_images(url,sort_order)')
    .eq('slug', params.slug)
    .single();

  if (!pkg) notFound();

  const { data: days } = await supabase
    .from('package_days')
    .select('*')
    .eq('package_id', pkg.id)
    .order('day_number');

  const cover = pkg.package_images?.sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.url ?? pkg.destinations?.cover_image;

  return (
    <div className="max-w-5xl mx-auto px-5 py-10 grid md:grid-cols-3 gap-10">
      <div className="md:col-span-2 space-y-8">
        <div className="relative h-64 w-full rounded-card overflow-hidden">
          {cover && <Image src={cover} alt={pkg.title} fill className="object-cover" priority />}
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">{pkg.title}</h1>
          <p className="text-gray-500 text-sm">{pkg.destinations?.name} · {pkg.duration_days} days</p>
          <p className="mt-4 text-gray-700">{pkg.description}</p>
        </div>

        {!!pkg.inclusions?.length && (
          <div>
            <h2 className="font-bold mb-2">Inclusions</h2>
            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
              {pkg.inclusions.map((i: string) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        )}

        {!!days?.length && (
          <div>
            <h2 className="font-bold mb-3">Day-by-day itinerary</h2>
            <div className="space-y-3">
              {days.map((d) => (
                <div key={d.id} className="card p-4">
                  <div className="font-semibold text-sm">Day {d.day_number}: {d.activity}</div>
                  <div className="text-xs text-gray-500">{d.time} · {d.location} · {d.duration}</div>
                  {d.description && <p className="text-sm text-gray-600 mt-1">{d.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <aside>
        <BookingForm packageId={pkg.id} basePrice={Number(pkg.base_price)} maxTravelers={pkg.max_travelers} />
      </aside>
    </div>
  );
}
