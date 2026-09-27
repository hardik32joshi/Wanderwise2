import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ActivityForm from '../ActivityForm';

export const dynamic = 'force-dynamic';

export default async function EditActivityPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: activity } = await supabase.from('activities').select('*').eq('id', params.id).single();
  if (!activity) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Edit Activity</h1>
      <ActivityForm activity={activity} id={params.id} />
    </div>
  );
}
