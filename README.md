
 # WanderWise v2 — Travel Booking Platform

A real, database-backed travel marketplace: destinations, packages, hotels,
activities, bookings, coupons, reviews, wishlists, and a full admin panel —
built on Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase
(Postgres, Auth, RLS) + Razorpay.

This is a genuine rebuild of the original single-file `travel-portal.html`
v1 project into a production-structured application. Every button here
either performs a real database operation or is clearly documented as
needing an external API key you provide.

See also: `DATABASE.md`, `API.md`, `DEPLOYMENT.md`.

---

## What's implemented vs. what needs your API keys

**Fully working out of the box** (once Supabase is connected):
destinations, packages, hotels, activities, bookings, coupons (server-
validated), wishlists, reviews (tied to completed bookings), notifications,
newsletter, and a role-gated admin panel with real CRUD for all content
types plus booking status management.

**Wired up completely, but needs your credentials to go live:**
- **Payments (Razorpay)** — real order creation + signature verification +
  webhook handler are implemented in `src/lib/payments/razorpay.ts` and
  `src/app/api/payments/*`. Without `RAZORPAY_KEY_ID`/`SECRET` set, the
  "Pay with Razorpay" button tells the customer payments aren't configured
  yet and leaves their booking as `pending` rather than faking success.
- **Email (Resend)** — not yet wired into a route; add `RESEND_API_KEY`
  and see the note in `API.md` for where to add the send call.
- **Maps (Mapbox)**, **Weather (OpenWeather)**, **AI trip assistant
  (Anthropic)** — not yet built as UI in this pass; the destination pages
  have the lat/lng and season data ready for a map/weather widget.

---

## 1. Prerequisites

- Node.js 18.18+ and npm
- A free [Supabase](https://supabase.com) project
- (Optional, for real payments) A [Razorpay](https://razorpay.com) account

## 2. Install

```bash
npm install
cp .env.example .env.local
```

## 3. Set up Supabase

1. Create a project at supabase.com.
2. Project Settings → API → copy the **Project URL** and **anon public**
   key into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Project Settings → API → copy the **service_role** key into
   `SUPABASE_SERVICE_ROLE_KEY`. **Never** put this in a `NEXT_PUBLIC_*`
   variable or ship it to the browser — it bypasses RLS entirely.
4. SQL Editor → New query → paste the entire contents of
   `supabase/schema.sql` → Run. This creates every table, RLS policy, and
   helper function (see `DATABASE.md` for the full breakdown).
5. Optional but recommended for a working demo: SQL Editor → New query →
   paste `supabase/seed.sql` → Run. This adds the same 12 destinations,
   11 packages, and 6 activities the original v1 site shipped with, so
   your homepage isn't empty on first run.

## 4. Make yourself an admin

1. Run the app (`npm run dev`) and sign up normally at `/signup` with
   your own email.
2. Back in Supabase's SQL Editor, run:
   ```sql
   update public.profiles set role = 'super_admin'
   where id = (select id from auth.users where email = 'YOUR_EMAIL@example.com');
   ```
3. Sign out and back in, then visit `/admin` — you now have full access to
   every CRUD screen (Destinations, Packages, Hotels, Activities, Bookings,
   Coupons, Newsletter).

## 5. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 6. Set up Razorpay (optional, for real payments)

1. Sign up at razorpay.com, switch to **Test Mode**.
2. Settings → API Keys → generate a key pair → put them in `.env.local`
   as `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
3. Settings → Webhooks → add `https://yourdomain.com/api/payments/webhook`,
   subscribe to `payment.captured` and `payment.failed`, and copy the
   webhook secret into `RAZORPAY_WEBHOOK_SECRET`.
4. Test card numbers: see Razorpay's [test card docs](https://razorpay.com/docs/payments/payments/test-card-details/).

Until these are set, booking still works end-to-end (reserve → pending
booking created in the database) — only the final payment step is gated.

## 7. Deploy

See `DEPLOYMENT.md` for Vercel + Supabase deployment steps.

## 8. Admin panel URL structure

```
/admin                 → stats overview
/admin/destinations    → list, /new, /[id] edit
/admin/packages        → list, /new, /[id] edit (+ package cover image)
/admin/hotels          → list, /new, /[id] edit (+ room management)
/admin/activities      → list, /new, /[id] edit
/admin/bookings        → list, filter by status, change status inline
/admin/coupons         → list, /new, /[id] edit
/admin/newsletter      → subscriber list
```

Access is enforced two ways: `src/middleware.ts` redirects non-admins away
from `/admin/*`, and every table's Row Level Security policy independently
blocks non-staff roles from reading/writing admin-only data — so even a
direct API call bypassing the UI is still rejected by Postgres itself.

## 9. Known limitations

- Maps, weather, blog, invoices/PDF, AI assistant, and email sending are
  not yet implemented in this pass (architecture is ready for them — see
  `API.md`).
- Review eligibility requires a booking with `status = 'completed'`; there's
  no automated job yet to flip `confirmed` bookings to `completed` after
  the travel date passes (add a Supabase cron function calling
  `update bookings set status='completed' where status='confirmed' and travel_date < now()`).
- No automated test suite; testing so far is manual + a verified
  `npm run build` (all 26 routes compile and prerender successfully).
- No rate limiting on Route Handlers yet — add a service like Upstash if
  going to production with real traffic.
