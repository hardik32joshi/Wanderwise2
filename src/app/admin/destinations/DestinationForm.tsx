import { saveDestinationAction } from './actions';

export default function DestinationForm({ destination, id }: { destination?: any; id: string | null }) {
  const action = saveDestinationAction.bind(null, id);
  const d = destination ?? {};

  return (
    <form action={action} className="space-y-4 max-w-2xl">
      <Field label="Name" name="name" defaultValue={d.name} required />
      <Field label="Country" name="country" defaultValue={d.country ?? 'India'} />
      <Field label="Cover image URL" name="cover_image" defaultValue={d.cover_image} />
      <TextArea label="Description" name="description" defaultValue={d.description} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Best season" name="best_season" defaultValue={d.best_season} />
        <Field label="Climate" name="climate" defaultValue={d.climate} />
        <Field label="Currency" name="currency" defaultValue={d.currency ?? 'INR'} />
        <Field label="Language" name="language" defaultValue={d.language} />
        <Field label="Visa info" name="visa_info" defaultValue={d.visa_info} />
        <Field label="Safety score" name="safety_info" defaultValue={d.safety_info} />
      </div>
      <Field label="Food info" name="food_info" defaultValue={d.food_info} />
      <Field label="Attractions (comma-separated)" name="attractions" defaultValue={d.attractions?.join(', ')} />
      <Field label="Hidden gems (comma-separated)" name="hidden_gems" defaultValue={d.hidden_gems?.join(', ')} />
      <Field label="Travel tips (comma-separated)" name="travel_tips" defaultValue={d.travel_tips?.join(', ')} />

      <div>
        <label className="text-xs font-semibold block mb-1">Status</label>
        <select name="status" defaultValue={d.status ?? 'draft'} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <button className="btn btn-primary">Save Destination</button>
    </form>
  );
}

function Field({ label, name, defaultValue, required }: { label: string; name: string; defaultValue?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1">{label}</label>
      <input name={name} defaultValue={defaultValue ?? ''} required={required} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
    </div>
  );
}

function TextArea({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1">{label}</label>
      <textarea name={name} defaultValue={defaultValue ?? ''} rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
    </div>
  );
}
