import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PackageForm from '../PackageForm';

export const dynamic = 'force-dynamic';

export default async function EditPackagePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: pkg } = await supabase.from('travel_packages').select('*, package_images(url,sort_order)').eq('id', params.id).single();
  if (!pkg) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Edit Package</h1>
      <PackageForm pkg={pkg} id={params.id} />
    </div>
  );
}
