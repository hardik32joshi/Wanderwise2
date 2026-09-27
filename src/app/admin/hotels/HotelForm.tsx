import { createClient } from '@/lib/supabase/server';
import { saveHotelAction } from './actions';
import { addRoomAction, deleteRoomAction } from './rooms-actions';

export default async function HotelForm({ hotel, id }: { hotel?: any; id: string | null }) {
  const supabase = createClient();
  const { data: destinations } = await supabase.from('destinations').select('id,name').order('name');
  const h = hotel ?? {};
  const action = saveHotelAction.bind(null, id);

  const rooms = id ? (await supabase.from('hotel_rooms').select('*').eq('hotel_id', id)).data : [];

  return (
    <div className="max-w-2xl space-y-10">
      <form action={action} className="space-y-4">
        <Field label="Name" name="name" defaultValue={h.name} required />
        <div>
          <label className="text-xs font-semibold block mb-1">Destination</label>
          <select name="destination_id" defaultValue={h.destination_id} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Select destination…</option>
            {destinations?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <TextArea label="Description" name="description" defaultValue={h.description} />
        <Field label="Image URLs (comma-separated)" name="images" defaultValue={h.images?.join(', ')} />
        <Field label="Address" name="address" defaultValue={h.address} />
        <Field label="Rating (0-5)" name="rating" type="number" defaultValue={h.rating ?? 0} />
        <Field label="Amenities (comma-separated)" name="amenities" defaultValue={h.amenities?.join(', ')} />
        <TextArea label="Policies" name="policies" defaultValue={h.policies} />
        <div>
          <label className="text-xs font-semibold block mb-1">Status</label>
          <select name="status" defaultValue={h.status ?? 'draft'} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
          </select>
        </div>
        <button className="btn btn-primary">Save Hotel</button>
      </form>

      {id && (
        <div>
          <h2 className="font-bold mb-3">Rooms</h2>
          <div className="space-y-2 mb-4">
            {rooms?.map((r: any) => (
              <div key={r.id} className="card p-3 flex justify-between items-center text-sm">
                <div>{r.room_type} · capacity {r.capacity} · ₹{Number(r.price).toLocaleString('en-IN')} · {r.available_quantity} available</div>
                <form action={deleteRoomAction.bind(null, r.id, id)}><button className="text-coral text-xs font-semibold">Remove</button></form>
              </div>
            ))}
            {!rooms?.length && <p className="text-sm text-gray-400">No rooms yet.</p>}
          </div>
          <form action={addRoomAction.bind(null, id)} className="flex gap-2 flex-wrap">
            <input name="room_type" placeholder="Room type" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input name="capacity" type="number" placeholder="Capacity" defaultValue={2} className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-24" />
            <input name="price" type="number" placeholder="Price" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-28" />
            <input name="available_quantity" type="number" placeholder="Qty" defaultValue={1} className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-20" />
            <button className="btn btn-outline">+ Add Room</button>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, name, defaultValue, required, type }: any) {
  return <div><label className="text-xs font-semibold block mb-1">{label}</label><input name={name} type={type ?? 'text'} defaultValue={defaultValue ?? ''} required={required} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /></div>;
}
function TextArea({ label, name, defaultValue }: any) {
  return <div><label className="text-xs font-semibold block mb-1">{label}</label><textarea name={name} defaultValue={defaultValue ?? ''} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /></div>;
}
