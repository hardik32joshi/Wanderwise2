# API.md

This app mostly talks to Supabase directly from Server Components / Server
Actions (no separate REST API layer needed — Postgres RLS is the real
authorization boundary). The few real HTTP endpoints:

## `POST /api/payments/create-order`
Body: `{ bookingId: string }`
- Loads the booking's `total` from the database (never trusts a client-sent
  amount), confirms the requester owns it, creates a Razorpay order, marks
  the booking `payment_pending`, and inserts a `pending` `payments` row.
- Returns `{ orderId, amount, currency, keyId }`, or `{ error }` if
  Razorpay isn't configured / booking isn't in a payable state.

## `POST /api/payments/verify`
Body: `{ bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature }`
- Recomputes the HMAC-SHA256 signature server-side
  (`verifyRazorpayPaymentSignature` in `src/lib/payments/razorpay.ts`) and
  only marks the booking `confirmed` / payment `success` if it matches.

## `POST /api/payments/webhook`
- Configure this URL in the Razorpay dashboard. Verifies
  `X-Razorpay-Signature` against `RAZORPAY_WEBHOOK_SECRET`, logs the raw
  event into `payment_transactions`, and updates `payments`/`bookings` on
  `payment.captured` / `payment.failed`. This is the reliable path — the
  browser-side `/verify` call can be interrupted by a closed tab, but
  Razorpay retries webhooks until they succeed.

## `GET /auth/callback`
Exchanges a Supabase auth code (from email verification links or Google
OAuth) for a session cookie, then redirects to `/dashboard`.

## Server Actions (not HTTP endpoints, but the equivalent of a mutation API)

| File | What it does |
|---|---|
| `src/app/packages/[slug]/actions.ts` | `validateCouponAction`, `createBookingAction` |
| `src/app/admin/destinations/actions.ts` | create/update/delete a destination |
| `src/app/admin/packages/actions.ts` | create/update/delete a package (+ cover image) |
| `src/app/admin/hotels/actions.ts` + `rooms-actions.ts` | hotel + room CRUD |
| `src/app/admin/activities/actions.ts` | activity CRUD |
| `src/app/admin/bookings/actions.ts` | admin booking status change (also creates a notification) |
| `src/app/admin/coupons/actions.ts` | coupon CRUD |

Every one of these runs on the server, uses the session-bound Supabase
client (`src/lib/supabase/server.ts`), and is still subject to RLS — an
admin action failing silently for a non-admin user is Postgres rejecting
the write, not just a hidden button.

## Not yet built (documented so it's easy to add later)

- **Email (Resend)** — add a `src/lib/email/resend.ts` following the same
  pattern as `razorpay.ts`, and call it from `/api/payments/verify` after
  a successful payment, and from `saveDestinationAction`-style places for
  admin notifications if wanted.
- **Maps (Mapbox)** — `destinations.latitude`/`longitude` and
  `hotels.latitude`/`longitude` are already in the schema; add a
  `<Map />` client component using `mapbox-gl` and drop it into
  `src/app/destinations/[slug]/page.tsx`.
- **Weather (OpenWeather)** — add `src/app/api/weather/route.ts` that
  fetches `https://api.openweathermap.org/data/2.5/weather` server-side
  (keep `OPENWEATHER_API_KEY` server-only) and call it from a client
  component on the destination page.
- **AI trip assistant** — add `src/app/api/ai/plan-trip/route.ts` that
  calls the Anthropic API server-side with `AI_API_KEY`, passing it real
  package/hotel/activity prices pulled from Supabase first so the model
  is asked to plan around real numbers, not invent them.
