import { createClient } from '@/lib/supabase/server';
import { saveActivityAction } from './actions';

export default async function ActivityForm({ activity, id }: { activity?: any; id: string | null }) {
  const supabase = createClient();
  const { data: destinations } = await supabase.from('destinations').select('id,name').order('name');
  const a = activity ?? {};
  const action = saveActivityAction.bind(null, id);

  return (
    <form action={action} className="space-y-4 max-w-2xl">
      <Field label="Title" name="title" defaultValue={a.title} required />
      <div>
        <label className="text-xs font-semibold block mb-1">Destination</label>
        <select name="destination_id" defaultValue={a.destination_id} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">Select destination…</option>
          {destinations?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>
      <TextArea label="Description" name="description" defaultValue={a.description} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Location" name="location" defaultValue={a.location} />
        <Field label="Duration" name="duration" defaultValue={a.duration} placeholder="e.g. 2-3 hours" />
        <Field label="Price (₹)" name="price" type="number" defaultValue={a.price ?? 0} />
        <Field label="Capacity" name="capacity" type="number" defaultValue={a.capacity ?? 20} />
      </div>
      <TextArea label="Cancellation policy" name="cancellation_policy" defaultValue={a.cancellation_policy} />
      <div>
        <label className="text-xs font-semibold block mb-1">Status</label>
        <select name="status" defaultValue={a.status ?? 'draft'} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
        </select>
      </div>
      <button className="btn btn-primary">Save Activity</button>
    </form>
  );
}

function Field({ label, name, defaultValue, required, type, placeholder }: any) {
  return <div><label className="text-xs font-semibold block mb-1">{label}</label><input name={name} type={type ?? 'text'} placeholder={placeholder} defaultValue={defaultValue ?? ''} required={required} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /></div>;
}
function TextArea({ label, name, defaultValue }: any) {
  return <div><label className="text-xs font-semibold block mb-1">{label}</label><textarea name={name} defaultValue={defaultValue ?? ''} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /></div>;
}
