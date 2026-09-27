import { saveCouponAction } from './actions';

export default function CouponForm({ coupon, id }: { coupon?: any; id: string | null }) {
  const c = coupon ?? {};
  const action = saveCouponAction.bind(null, id);

  return (
    <form action={action} className="space-y-4 max-w-lg">
      <Field label="Code" name="code" defaultValue={c.code} required placeholder="GOA500" />
      <Field label="Description" name="description" defaultValue={c.description} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold block mb-1">Discount type</label>
          <select name="discount_type" defaultValue={c.discount_type ?? 'fixed'} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="fixed">Fixed (₹)</option>
            <option value="percentage">Percentage (%)</option>
          </select>
        </div>
        <Field label="Discount value" name="discount_value" type="number" defaultValue={c.discount_value ?? 0} required />
        <Field label="Minimum purchase (₹)" name="min_purchase" type="number" defaultValue={c.min_purchase ?? 0} />
        <Field label="Max discount cap (₹, optional)" name="max_discount" type="number" defaultValue={c.max_discount} />
        <Field label="Expires at" name="expires_at" type="date" defaultValue={c.expires_at?.slice(0, 10)} />
        <Field label="Total usage limit" name="usage_limit" type="number" defaultValue={c.usage_limit} />
        <Field label="Per-user limit" name="per_user_limit" type="number" defaultValue={c.per_user_limit ?? 1} />
      </div>
      <div>
        <label className="text-xs font-semibold block mb-1">Status</label>
        <select name="status" defaultValue={c.status ?? 'active'} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button className="btn btn-primary">Save Coupon</button>
    </form>
  );
}

function Field({ label, name, defaultValue, required, type, placeholder }: any) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1">{label}</label>
      <input name={name} type={type ?? 'text'} placeholder={placeholder} defaultValue={defaultValue ?? ''} required={required} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
    </div>
  );
}
