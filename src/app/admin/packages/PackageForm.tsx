import { createClient } from '@/lib/supabase/server';
import { savePackageAction } from './actions';

export default async function PackageForm({ pkg, id }: { pkg?: any; id: string | null }) {
  const supabase = createClient();
  const { data: destinations } = await supabase.from('destinations').select('id,name').order('name');
  const action = savePackageAction.bind(null, id);
  const p = pkg ?? {};
  const coverImage = p.package_images?.[0]?.url;

  return (
    <form action={action} className="space-y-4 max-w-2xl">
      <Field label="Title" name="title" defaultValue={p.title} required />
      <div>
        <label className="text-xs font-semibold block mb-1">Destination</label>
        <select name="destination_id" defaultValue={p.destination_id} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">Select destination…</option>
          {destinations?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>
      <Field label="Cover image URL" name="cover_image" defaultValue={coverImage} />
      <TextArea label="Description" name="description" defaultValue={p.description} />
      <div className="grid grid-cols-3 gap-4">
        <Field label="Duration (days)" name="duration_days" type="number" defaultValue={p.duration_days ?? 1} />
        <Field label="Base price (₹)" name="base_price" type="number" defaultValue={p.base_price ?? 0} />
        <Field label="Max travelers" name="max_travelers" type="number" defaultValue={p.max_travelers ?? 10} />
      </div>
      <Field label="Inclusions (comma-separated)" name="inclusions" defaultValue={p.inclusions?.join(', ')} />
      <Field label="Exclusions (comma-separated)" name="exclusions" defaultValue={p.exclusions?.join(', ')} />
      <TextArea label="Cancellation policy" name="cancellation_policy" defaultValue={p.cancellation_policy} />
      <div>
        <label className="text-xs font-semibold block mb-1">Status</label>
        <select name="status" defaultValue={p.status ?? 'draft'} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <button className="btn btn-primary">Save Package</button>
    </form>
  );
}

function Field({ label, name, defaultValue, required, type }: any) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1">{label}</label>
      <input name={name} type={type ?? 'text'} defaultValue={defaultValue ?? ''} required={required} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
    </div>
  );
}
function TextArea({ label, name, defaultValue }: any) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1">{label}</label>
      <textarea name={name} defaultValue={defaultValue ?? ''} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
    </div>
  );
}
