'use client';

import { useTransition } from 'react';
import { updateBookingStatusAction } from './actions';

const STATUSES = ['pending', 'payment_pending', 'confirmed', 'cancelled', 'completed', 'refunded'];

export default function BookingStatusSelect({ bookingId, currentStatus }: { bookingId: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentStatus}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateBookingStatusAction(bookingId, e.target.value))}
      className="text-xs border border-gray-200 rounded-lg px-2 py-1"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
