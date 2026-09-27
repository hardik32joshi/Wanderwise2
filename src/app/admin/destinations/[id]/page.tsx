import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import DestinationForm from '../DestinationForm';

export const dynamic = 'force-dynamic';

export default async function EditDestinationPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: destination } = await supabase.from('destinations').select('*').eq('id', params.id).single();
  if (!destination) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Edit Destination</h1>
      <DestinationForm destination={destination} id={params.id} />
    </div>
  );
}
