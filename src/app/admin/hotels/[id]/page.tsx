import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import HotelForm from '../HotelForm';

export const dynamic = 'force-dynamic';

export default async function EditHotelPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: hotel } = await supabase.from('hotels').select('*').eq('id', params.id).single();
  if (!hotel) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Edit Hotel</h1>
      <HotelForm hotel={hotel} id={params.id} />
    </div>
  );
}
