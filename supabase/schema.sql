-- ============================================================
-- WanderWise v2 — Production relational schema
-- Run in Supabase SQL Editor on a NEW project (or a project
-- where you're okay dropping the old generic user_data table).
-- Safe to re-run: everything uses "if not exists" / "or replace".
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- ENUM TYPES
-- ------------------------------------------------------------
do $$ begin
  create type user_role as enum ('customer','travel_agent','content_manager','admin','super_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_status as enum ('draft','published','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type booking_status as enum ('pending','payment_pending','confirmed','cancelled','completed','refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pending','success','failed','refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type discount_type as enum ('percentage','fixed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type wishlist_item_type as enum ('destination','package','hotel','activity');
exception when duplicate_object then null; end $$;

do $$ begin
  create type booking_item_type as enum ('package','hotel_room','activity');
exception when duplicate_object then null; end $$;

do $$ begin
  create type ticket_status as enum ('open','in_progress','closed');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------
-- HELPER: updated_at trigger
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- PROFILES (1 row per auth.users, holds role + public info)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  avatar_url  text,
  role        user_role not null default 'customer',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role-check helper used throughout RLS policies below
create or replace function public.current_role()
returns user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('admin','super_admin','content_manager') from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('admin','super_admin') from public.profiles where id = auth.uid()), false);
$$;

alter table public.profiles enable row level security;
create policy "profiles: self select" on public.profiles for select using (auth.uid() = id);
create policy "profiles: staff select all" on public.profiles for select using (public.is_staff());
create policy "profiles: self update" on public.profiles for update using (auth.uid() = id);
create policy "profiles: admin update all" on public.profiles for update using (public.is_admin());

-- ------------------------------------------------------------
-- DESTINATIONS
-- ------------------------------------------------------------
create table if not exists public.destinations (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,
  name          text not null,
  country       text not null default 'India',
  state         text,
  description   text,
  cover_image   text,
  latitude      numeric(9,6),
  longitude     numeric(9,6),
  best_season   text,
  climate       text,
  currency      text default 'INR',
  language      text,
  visa_info     text,
  safety_info   text,
  food_info     text,
  hidden_gems   text[] default '{}',
  attractions   text[] default '{}',
  travel_tips   text[] default '{}',
  status        content_status not null default 'draft',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_destinations_status on public.destinations(status);
create index if not exists idx_destinations_slug on public.destinations(slug);

drop trigger if exists trg_destinations_updated on public.destinations;
create trigger trg_destinations_updated before update on public.destinations
  for each row execute function public.set_updated_at();

create table if not exists public.destination_images (
  id             uuid primary key default uuid_generate_v4(),
  destination_id uuid not null references public.destinations(id) on delete cascade,
  url            text not null,
  alt            text,
  sort_order     int not null default 0
);

create table if not exists public.destination_tags (
  destination_id uuid not null references public.destinations(id) on delete cascade,
  tag            text not null,
  primary key (destination_id, tag)
);

alter table public.destinations enable row level security;
alter table public.destination_images enable row level security;
alter table public.destination_tags enable row level security;

create policy "destinations: public read published" on public.destinations for select using (status = 'published' or public.is_staff());
create policy "destinations: staff write" on public.destinations for insert with check (public.is_staff());
create policy "destinations: staff update" on public.destinations for update using (public.is_staff());
create policy "destinations: staff delete" on public.destinations for delete using (public.is_staff());

create policy "destination_images: public read" on public.destination_images for select using (true);
create policy "destination_images: staff write" on public.destination_images for all using (public.is_staff()) with check (public.is_staff());

create policy "destination_tags: public read" on public.destination_tags for select using (true);
create policy "destination_tags: staff write" on public.destination_tags for all using (public.is_staff()) with check (public.is_staff());

-- ------------------------------------------------------------
-- TRAVEL PACKAGES
-- ------------------------------------------------------------
create table if not exists public.travel_packages (
  id                  uuid primary key default uuid_generate_v4(),
  slug                text unique not null,
  destination_id      uuid not null references public.destinations(id) on delete cascade,
  title               text not null,
  description         text,
  duration_days       int not null default 1,
  base_price          numeric(10,2) not null default 0,
  max_travelers       int not null default 10,
  inclusions          text[] default '{}',
  exclusions          text[] default '{}',
  cancellation_policy text,
  status              content_status not null default 'draft',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists idx_packages_status on public.travel_packages(status);
create index if not exists idx_packages_destination on public.travel_packages(destination_id);

drop trigger if exists trg_packages_updated on public.travel_packages;
create trigger trg_packages_updated before update on public.travel_packages
  for each row execute function public.set_updated_at();

create table if not exists public.package_images (
  id          uuid primary key default uuid_generate_v4(),
  package_id  uuid not null references public.travel_packages(id) on delete cascade,
  url         text not null,
  alt         text,
  sort_order  int not null default 0
);

create table if not exists public.package_days (
  id           uuid primary key default uuid_generate_v4(),
  package_id   uuid not null references public.travel_packages(id) on delete cascade,
  day_number   int not null,
  time         text,
  activity     text not null,
  location     text,
  duration     text,
  description  text,
  extra_price  numeric(10,2) default 0,
  sort_order   int not null default 0
);
create index if not exists idx_package_days_package on public.package_days(package_id, day_number);

alter table public.travel_packages enable row level security;
alter table public.package_images enable row level security;
alter table public.package_days enable row level security;

create policy "packages: public read published" on public.travel_packages for select using (status = 'published' or public.is_staff());
create policy "packages: staff write" on public.travel_packages for insert with check (public.is_staff());
create policy "packages: staff update" on public.travel_packages for update using (public.is_staff());
create policy "packages: staff delete" on public.travel_packages for delete using (public.is_staff());

create policy "package_images: public read" on public.package_images for select using (true);
create policy "package_images: staff write" on public.package_images for all using (public.is_staff()) with check (public.is_staff());

create policy "package_days: public read" on public.package_days for select using (true);
create policy "package_days: staff write" on public.package_days for all using (public.is_staff()) with check (public.is_staff());

-- ------------------------------------------------------------
-- HOTELS
-- ------------------------------------------------------------
create table if not exists public.hotels (
  id             uuid primary key default uuid_generate_v4(),
  destination_id uuid not null references public.destinations(id) on delete cascade,
  name           text not null,
  description    text,
  images         text[] default '{}',
  address        text,
  latitude       numeric(9,6),
  longitude      numeric(9,6),
  rating         numeric(2,1) default 0,
  amenities      text[] default '{}',
  policies       text,
  status         content_status not null default 'draft',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists idx_hotels_destination on public.hotels(destination_id);

drop trigger if exists trg_hotels_updated on public.hotels;
create trigger trg_hotels_updated before update on public.hotels
  for each row execute function public.set_updated_at();

create table if not exists public.hotel_rooms (
  id                 uuid primary key default uuid_generate_v4(),
  hotel_id           uuid not null references public.hotels(id) on delete cascade,
  room_type          text not null,
  capacity           int not null default 2,
  price              numeric(10,2) not null default 0,
  available_quantity int not null default 0,
  amenities          text[] default '{}'
);

alter table public.hotels enable row level security;
alter table public.hotel_rooms enable row level security;

create policy "hotels: public read published" on public.hotels for select using (status = 'published' or public.is_staff());
create policy "hotels: staff write" on public.hotels for all using (public.is_staff()) with check (public.is_staff());

create policy "hotel_rooms: public read" on public.hotel_rooms for select using (true);
create policy "hotel_rooms: staff write" on public.hotel_rooms for all using (public.is_staff()) with check (public.is_staff());

-- ------------------------------------------------------------
-- ACTIVITIES
-- ------------------------------------------------------------
create table if not exists public.activities (
  id                  uuid primary key default uuid_generate_v4(),
  slug                text unique not null,
  destination_id      uuid not null references public.destinations(id) on delete cascade,
  title               text not null,
  description         text,
  location            text,
  duration            text,
  price               numeric(10,2) not null default 0,
  capacity            int not null default 20,
  availability_status text not null default 'available',
  cancellation_policy text,
  status              content_status not null default 'draft',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists idx_activities_destination on public.activities(destination_id);

drop trigger if exists trg_activities_updated on public.activities;
create trigger trg_activities_updated before update on public.activities
  for each row execute function public.set_updated_at();

create table if not exists public.activity_images (
  id           uuid primary key default uuid_generate_v4(),
  activity_id  uuid not null references public.activities(id) on delete cascade,
  url          text not null,
  sort_order   int not null default 0
);

alter table public.activities enable row level security;
alter table public.activity_images enable row level security;

create policy "activities: public read published" on public.activities for select using (status = 'published' or public.is_staff());
create policy "activities: staff write" on public.activities for all using (public.is_staff()) with check (public.is_staff());

create policy "activity_images: public read" on public.activity_images for select using (true);
create policy "activity_images: staff write" on public.activity_images for all using (public.is_staff()) with check (public.is_staff());

-- ------------------------------------------------------------
-- COUPONS (created before bookings since bookings references it)
-- ------------------------------------------------------------
create table if not exists public.coupons (
  id             uuid primary key default uuid_generate_v4(),
  code           text unique not null,
  description    text,
  discount_type  discount_type not null,
  discount_value numeric(10,2) not null,
  min_purchase   numeric(10,2) default 0,
  max_discount   numeric(10,2),
  starts_at      timestamptz default now(),
  expires_at     timestamptz,
  usage_limit    int,
  per_user_limit int default 1,
  status         text not null default 'active',
  created_at     timestamptz not null default now()
);

alter table public.coupons enable row level security;
-- Anyone can look up an active coupon by code (needed to validate at checkout);
-- full listing/management is staff-only via the "public read" policy still
-- requiring an exact code match is enforced in application code, not RLS.
create policy "coupons: public read active" on public.coupons for select using (status = 'active');
create policy "coupons: staff write" on public.coupons for all using (public.is_staff()) with check (public.is_staff());

-- ------------------------------------------------------------
-- BOOKINGS
-- ------------------------------------------------------------
create sequence if not exists public.booking_number_seq start 1;

create table if not exists public.bookings (
  id               uuid primary key default uuid_generate_v4(),
  booking_number   text unique not null default (
    'WW-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.booking_number_seq')::text, 6, '0')
  ),
  user_id          uuid not null references auth.users(id) on delete cascade,
  package_id       uuid references public.travel_packages(id),
  status           booking_status not null default 'pending',
  travel_date      date,
  travelers_count  int not null default 1,
  subtotal         numeric(10,2) not null default 0,
  discount         numeric(10,2) not null default 0,
  taxes            numeric(10,2) not null default 0,
  total            numeric(10,2) not null default 0,
  coupon_id        uuid references public.coupons(id),
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists idx_bookings_user on public.bookings(user_id);
create index if not exists idx_bookings_status on public.bookings(status);

drop trigger if exists trg_bookings_updated on public.bookings;
create trigger trg_bookings_updated before update on public.bookings
  for each row execute function public.set_updated_at();

create table if not exists public.booking_travelers (
  id              uuid primary key default uuid_generate_v4(),
  booking_id      uuid not null references public.bookings(id) on delete cascade,
  full_name       text not null,
  age             int,
  gender          text,
  id_proof_type   text,
  id_proof_number text
);

create table if not exists public.booking_items (
  id           uuid primary key default uuid_generate_v4(),
  booking_id   uuid not null references public.bookings(id) on delete cascade,
  item_type    booking_item_type not null,
  item_id      uuid not null,
  item_name    text not null,
  quantity     int not null default 1,
  unit_price   numeric(10,2) not null default 0,
  total_price  numeric(10,2) not null default 0
);

alter table public.bookings enable row level security;
alter table public.booking_travelers enable row level security;
alter table public.booking_items enable row level security;

create policy "bookings: own select" on public.bookings for select using (auth.uid() = user_id or public.is_staff());
create policy "bookings: own insert" on public.bookings for insert with check (auth.uid() = user_id);
create policy "bookings: own update" on public.bookings for update using (auth.uid() = user_id or public.is_staff());
create policy "bookings: staff delete" on public.bookings for delete using (public.is_staff());

create policy "booking_travelers: via booking" on public.booking_travelers for select using (
  exists (select 1 from public.bookings b where b.id = booking_id and (b.user_id = auth.uid() or public.is_staff()))
);
create policy "booking_travelers: insert via booking" on public.booking_travelers for insert with check (
  exists (select 1 from public.bookings b where b.id = booking_id and b.user_id = auth.uid())
);
create policy "booking_travelers: staff manage" on public.booking_travelers for all using (public.is_staff()) with check (public.is_staff());

create policy "booking_items: via booking" on public.booking_items for select using (
  exists (select 1 from public.bookings b where b.id = booking_id and (b.user_id = auth.uid() or public.is_staff()))
);
create policy "booking_items: insert via booking" on public.booking_items for insert with check (
  exists (select 1 from public.bookings b where b.id = booking_id and b.user_id = auth.uid())
);
create policy "booking_items: staff manage" on public.booking_items for all using (public.is_staff()) with check (public.is_staff());

create table if not exists public.coupon_usage (
  id          uuid primary key default uuid_generate_v4(),
  coupon_id   uuid not null references public.coupons(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  booking_id  uuid references public.bookings(id) on delete set null,
  used_at     timestamptz not null default now()
);
alter table public.coupon_usage enable row level security;
create policy "coupon_usage: own select" on public.coupon_usage for select using (auth.uid() = user_id or public.is_staff());
create policy "coupon_usage: own insert" on public.coupon_usage for insert with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- PAYMENTS (Razorpay-shaped; see src/lib/payments/razorpay.ts)
-- ------------------------------------------------------------
create table if not exists public.payments (
  id                  uuid primary key default uuid_generate_v4(),
  booking_id          uuid not null references public.bookings(id) on delete cascade,
  amount              numeric(10,2) not null,
  currency            text not null default 'INR',
  method              text,
  status              payment_status not null default 'pending',
  provider            text not null default 'razorpay',
  provider_order_id   text,
  provider_payment_id text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists idx_payments_booking on public.payments(booking_id);

drop trigger if exists trg_payments_updated on public.payments;
create trigger trg_payments_updated before update on public.payments
  for each row execute function public.set_updated_at();

create table if not exists public.payment_transactions (
  id           uuid primary key default uuid_generate_v4(),
  payment_id   uuid not null references public.payments(id) on delete cascade,
  event_type   text not null,
  raw_payload  jsonb,
  created_at   timestamptz not null default now()
);

alter table public.payments enable row level security;
alter table public.payment_transactions enable row level security;

create policy "payments: via booking" on public.payments for select using (
  exists (select 1 from public.bookings b where b.id = booking_id and (b.user_id = auth.uid() or public.is_staff()))
);
-- Payments are only ever written by the server (service_role key, from an
-- API route/webhook that has verified the Razorpay signature) — no insert/
-- update policy is granted to anon/authenticated, so RLS blocks the client
-- from ever marking its own payment "success".
create policy "payments: staff manage" on public.payments for all using (public.is_staff()) with check (public.is_staff());

create policy "payment_transactions: staff only" on public.payment_transactions for select using (public.is_staff());

-- ------------------------------------------------------------
-- WISHLISTS
-- ------------------------------------------------------------
create table if not exists public.wishlists (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  item_type  wishlist_item_type not null,
  item_id    uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);
alter table public.wishlists enable row level security;
create policy "wishlists: own all" on public.wishlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- REVIEWS
-- ------------------------------------------------------------
create table if not exists public.reviews (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  booking_id  uuid references public.bookings(id) on delete set null,
  item_type   wishlist_item_type not null,
  item_id     uuid not null,
  rating      int not null check (rating between 1 and 5),
  title       text,
  comment     text,
  status      text not null default 'pending', -- pending | approved | hidden
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_reviews_item on public.reviews(item_type, item_id);

drop trigger if exists trg_reviews_updated on public.reviews;
create trigger trg_reviews_updated before update on public.reviews
  for each row execute function public.set_updated_at();

create table if not exists public.review_images (
  id         uuid primary key default uuid_generate_v4(),
  review_id  uuid not null references public.reviews(id) on delete cascade,
  url        text not null
);

alter table public.reviews enable row level security;
alter table public.review_images enable row level security;

create policy "reviews: public read approved" on public.reviews for select using (status = 'approved' or auth.uid() = user_id or public.is_staff());
-- A review can only be inserted if it references a booking that (a) belongs
-- to the reviewer and (b) is completed — this is what "verified traveler"
-- means in practice, enforced by the database, not just a UI badge.
create policy "reviews: insert if own completed booking" on public.reviews for insert with check (
  auth.uid() = user_id and (
    booking_id is null and public.is_staff() -- staff can seed reviews if ever needed
    or exists (
      select 1 from public.bookings b
      where b.id = booking_id and b.user_id = auth.uid() and b.status = 'completed'
    )
  )
);
create policy "reviews: own update while pending" on public.reviews for update using (auth.uid() = user_id and status = 'pending');
create policy "reviews: staff moderate" on public.reviews for update using (public.is_staff());
create policy "reviews: staff delete" on public.reviews for delete using (public.is_staff());

create policy "review_images: read with review" on public.review_images for select using (
  exists (select 1 from public.reviews r where r.id = review_id and (r.status = 'approved' or r.user_id = auth.uid() or public.is_staff()))
);
create policy "review_images: insert own" on public.review_images for insert with check (
  exists (select 1 from public.reviews r where r.id = review_id and r.user_id = auth.uid())
);

-- ------------------------------------------------------------
-- NOTIFICATIONS
-- ------------------------------------------------------------
create table if not exists public.notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  type       text not null,
  title      text not null,
  message    text,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_notifications_user on public.notifications(user_id, is_read);

alter table public.notifications enable row level security;
create policy "notifications: own select" on public.notifications for select using (auth.uid() = user_id);
create policy "notifications: own update (mark read)" on public.notifications for update using (auth.uid() = user_id);
create policy "notifications: staff insert" on public.notifications for insert with check (public.is_staff() or auth.uid() = user_id);

-- ------------------------------------------------------------
-- SUPPORT TICKETS
-- ------------------------------------------------------------
create table if not exists public.support_tickets (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  subject    text not null,
  message    text not null,
  status     ticket_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_tickets_updated on public.support_tickets;
create trigger trg_tickets_updated before update on public.support_tickets
  for each row execute function public.set_updated_at();

alter table public.support_tickets enable row level security;
create policy "tickets: own select" on public.support_tickets for select using (auth.uid() = user_id or public.is_staff());
create policy "tickets: own insert" on public.support_tickets for insert with check (auth.uid() = user_id);
create policy "tickets: staff update" on public.support_tickets for update using (public.is_staff());

-- ------------------------------------------------------------
-- BLOG
-- ------------------------------------------------------------
create table if not exists public.blog_categories (
  id    uuid primary key default uuid_generate_v4(),
  name  text not null,
  slug  text unique not null
);

create table if not exists public.blog_posts (
  id               uuid primary key default uuid_generate_v4(),
  slug             text unique not null,
  title            text not null,
  excerpt          text,
  content          text,
  cover_image      text,
  category_id      uuid references public.blog_categories(id),
  author_id        uuid references auth.users(id),
  status           content_status not null default 'draft',
  published_at     timestamptz,
  meta_title       text,
  meta_description text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists idx_blog_posts_status on public.blog_posts(status);

drop trigger if exists trg_blog_posts_updated on public.blog_posts;
create trigger trg_blog_posts_updated before update on public.blog_posts
  for each row execute function public.set_updated_at();

create table if not exists public.blog_tags (
  id    uuid primary key default uuid_generate_v4(),
  name  text not null,
  slug  text unique not null
);

create table if not exists public.blog_post_tags (
  post_id  uuid not null references public.blog_posts(id) on delete cascade,
  tag_id   uuid not null references public.blog_tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_tags enable row level security;
alter table public.blog_post_tags enable row level security;

create policy "blog_categories: public read" on public.blog_categories for select using (true);
create policy "blog_categories: staff write" on public.blog_categories for all using (public.is_staff()) with check (public.is_staff());

create policy "blog_posts: public read published" on public.blog_posts for select using (status = 'published' or public.is_staff());
create policy "blog_posts: staff write" on public.blog_posts for all using (public.is_staff()) with check (public.is_staff());

create policy "blog_tags: public read" on public.blog_tags for select using (true);
create policy "blog_tags: staff write" on public.blog_tags for all using (public.is_staff()) with check (public.is_staff());

create policy "blog_post_tags: public read" on public.blog_post_tags for select using (true);
create policy "blog_post_tags: staff write" on public.blog_post_tags for all using (public.is_staff()) with check (public.is_staff());

-- ------------------------------------------------------------
-- NEWSLETTER (kept from v1)
-- ------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id         bigint generated always as identity primary key,
  email      text not null unique,
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
create policy "newsletter: anyone can subscribe" on public.newsletter_subscribers for insert with check (true);
create policy "newsletter: staff read" on public.newsletter_subscribers for select using (public.is_staff());

-- ------------------------------------------------------------
-- COUPON VALIDATION RPC — server-trusted discount calculation.
-- The client NEVER computes the discount itself; it calls this.
-- ------------------------------------------------------------
create or replace function public.validate_coupon(p_code text, p_subtotal numeric)
returns table (valid boolean, message text, discount_amount numeric, coupon_id uuid)
language plpgsql security definer set search_path = public as $$
declare
  c public.coupons%rowtype;
  uses_by_user int;
  total_uses int;
  amount numeric;
begin
  select * into c from public.coupons where code = upper(p_code) and status = 'active';
  if not found then
    return query select false, 'Invalid or inactive coupon code', 0::numeric, null::uuid; return;
  end if;
  if c.starts_at is not null and now() < c.starts_at then
    return query select false, 'This coupon is not active yet', 0::numeric, null::uuid; return;
  end if;
  if c.expires_at is not null and now() > c.expires_at then
    return query select false, 'This coupon has expired', 0::numeric, null::uuid; return;
  end if;
  if p_subtotal < coalesce(c.min_purchase, 0) then
    return query select false, format('Minimum purchase of ₹%s required', c.min_purchase), 0::numeric, null::uuid; return;
  end if;
  if c.usage_limit is not null then
    select count(*) into total_uses from public.coupon_usage where coupon_id = c.id;
    if total_uses >= c.usage_limit then
      return query select false, 'This coupon has reached its usage limit', 0::numeric, null::uuid; return;
    end if;
  end if;
  if auth.uid() is not null and c.per_user_limit is not null then
    select count(*) into uses_by_user from public.coupon_usage where coupon_id = c.id and user_id = auth.uid();
    if uses_by_user >= c.per_user_limit then
      return query select false, 'You have already used this coupon', 0::numeric, null::uuid; return;
    end if;
  end if;

  if c.discount_type = 'percentage' then
    amount := p_subtotal * (c.discount_value / 100);
    if c.max_discount is not null and amount > c.max_discount then amount := c.max_discount; end if;
  else
    amount := c.discount_value;
  end if;

  return query select true, 'Coupon applied', amount, c.id;
end;
$$;
grant execute on function public.validate_coupon(text, numeric) to anon, authenticated;

-- ------------------------------------------------------------
-- LAST STEP — make yourself an admin after you sign up once:
-- ------------------------------------------------------------
-- update public.profiles set role = 'super_admin' where id = (
--   select id from auth.users where email = 'YOUR_EMAIL@example.com'
-- );
