# DATABASE.md

Full schema lives in `supabase/schema.sql`. This is a map of what's there
and why, not a copy of the SQL.

## Roles

`profiles.role` is one of: `customer`, `travel_agent`, `content_manager`,
`admin`, `super_admin`. A row is auto-created in `profiles` for every new
`auth.users` signup via the `handle_new_user()` trigger.

Two helper functions drive almost every RLS policy:
- `is_staff()` → true for `content_manager`, `admin`, `super_admin`
- `is_admin()` → true for `admin`, `super_admin`

## Content tables (public read when published, staff write)

`destinations` → `destination_images`, `destination_tags`
`travel_packages` → `package_images`, `package_days`
`hotels` → `hotel_rooms`
`activities` → `activity_images`
`blog_posts` (+ `blog_categories`, `blog_tags`, `blog_post_tags`)

All of these use a `status` column (`draft` / `published` / `archived`).
Public/anon users can only `select` rows where `status = 'published'`;
staff can see and write everything regardless of status.

## Commerce tables

- `bookings` — one row per booking, auto-generates a human-readable
  `booking_number` like `WW-2026-000001` via a sequence + default expression.
  Status flows: `pending → payment_pending → confirmed → completed`, with
  `cancelled`/`refunded` as side branches.
- `booking_travelers`, `booking_items` — line items under a booking.
- `coupons` / `coupon_usage` — coupons are validated **only** through the
  `validate_coupon(code, subtotal)` SQL function, which checks active
  status, date window, minimum purchase, global usage limit, and
  per-user limit, then returns the discount amount. The client/server
  action never computes the discount itself — this closes the obvious
  "edit the JS and give yourself 100% off" hole.
- `payments` / `payment_transactions` — customers can only ever `select`
  their own payment rows. There is intentionally **no insert/update policy**
  for `authenticated`/`anon` on `payments` — only server code using the
  service-role key (after verifying a Razorpay signature) can write to it.
  This is what makes "don't trust the frontend payment-success response"
  actually true at the database level, not just in application code.

## User tables

`wishlists`, `reviews` (+`review_images`), `notifications`, `support_tickets`.

Notably, `reviews` can only be inserted if it references a `booking_id`
that belongs to the reviewer **and** has `status = 'completed'` — enforced
in the RLS `with check` clause, not just hidden in the UI. This is the
actual mechanism behind "Verified Traveler" badges.

## Everything is indexed for its obvious query pattern

`status`, `destination_id`, `user_id`, foreign keys used in joins, etc. all
have `create index if not exists` statements — see the schema for the
full list.

## Extending the schema safely

`schema.sql` is idempotent (every `create table` uses `if not exists`,
every enum-create is wrapped in `do $$ ... exception when duplicate_object
then null; end $$;`), so you can re-run the whole file after adding a new
table/policy without dropping existing data.
