-- ============================================================
-- PADU Printing CMS - Supabase Database Schema
-- Jalankan script ini di Supabase: SQL Editor -> New query -> Run
-- ============================================================

-- ---------- CATEGORIES ----------
create table if not exists public.categories (
  id bigint generated always as identity primary key,
  slug text unique not null,
  name text not null,
  description text default '',
  icon text default '',
  image text default '',
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- PRODUCTS ----------
create table if not exists public.products (
  id bigint generated always as identity primary key,
  slug text unique not null,
  name text not null,
  category_slug text not null,
  description text default '',
  short_description text default '',
  image text default '',
  gallery jsonb default '[]'::jsonb,
  base_price numeric default 0,
  production_time text default '',
  variant_groups jsonb default '[]'::jsonb,
  price_tiers jsonb default '[]'::jsonb,
  specifications jsonb default '[]'::jsonb,
  is_best_seller boolean default false,
  click_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- ARTICLES ----------
create table if not exists public.articles (
  id bigint generated always as identity primary key,
  slug text unique not null,
  title text not null,
  excerpt text default '',
  content text default '',
  cover_image text default '',
  image_alt text default '',
  date text default '',
  author text default '',
  category text default '',
  meta_title text default '',
  meta_description text default '',
  focus_keyword text default '',
  tags jsonb default '[]'::jsonb,
  seo_score int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- ARTICLE CATEGORIES ----------
create table if not exists public.article_categories (
  id bigint generated always as identity primary key,
  slug text unique not null,
  name text not null,
  description text default '',
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- GALLERY (HASIL CETAK) ----------
create table if not exists public.gallery_items (
  id bigint generated always as identity primary key,
  title text not null,
  image text default '',
  tall boolean default false,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- TRUSTED BRANDS (DIPERCAYA OLEH) ----------
create table if not exists public.trusted_brands (
  id bigint generated always as identity primary key,
  name text not null,
  logo text default '',
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- HERO SLIDESHOW ----------
create table if not exists public.hero_slides (
  id bigint generated always as identity primary key,
  image text not null,
  alt text default '',
  link text default '',
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- FAQS ----------
create table if not exists public.faqs (
  id bigint generated always as identity primary key,
  question text not null,
  answer text default '',
  category text default '',
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- SITE SETTINGS ----------
create table if not exists public.site_settings (
  key text primary key,
  value text default '',
  updated_at timestamptz default now()
);

-- ---------- ENABLE RLS (manual, so admin auth can restrict writes) ----------
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.articles enable row level security;
alter table public.article_categories enable row level security;
alter table public.gallery_items enable row level security;
alter table public.trusted_brands enable row level security;
alter table public.hero_slides enable row level security;
alter table public.faqs enable row level security;
alter table public.site_settings enable row level security;

-- ---------- RLS POLICIES ----------
-- Read: everyone (public anon key)
create policy "public read categories" on public.categories for select using (true);
create policy "public read products" on public.products for select using (true);
create policy "public read articles" on public.articles for select using (true);
create policy "public read article_categories" on public.article_categories for select using (true);
create policy "public read gallery" on public.gallery_items for select using (true);
create policy "public read trusted_brands" on public.trusted_brands for select using (true);
create policy "public read hero_slides" on public.hero_slides for select using (true);
create policy "public read faqs" on public.faqs for select using (true);
create policy "public read settings" on public.site_settings for select using (true);

-- Write: only authenticated users (admin)
create policy "auth write categories" on public.categories for all to authenticated using (true) with check (true);
create policy "auth write products" on public.products for all to authenticated using (true) with check (true);
create policy "auth write articles" on public.articles for all to authenticated using (true) with check (true);
create policy "auth write article_categories" on public.article_categories for all to authenticated using (true) with check (true);
create policy "auth write gallery" on public.gallery_items for all to authenticated using (true) with check (true);
create policy "auth write trusted_brands" on public.trusted_brands for all to authenticated using (true) with check (true);
create policy "auth write hero_slides" on public.hero_slides for all to authenticated using (true) with check (true);
create policy "auth write faqs" on public.faqs for all to authenticated using (true) with check (true);
create policy "auth write settings" on public.site_settings for all to authenticated using (true) with check (true);

-- ---------- AUTO UPDATE UPDATED_AT ----------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();
create trigger set_products_updated_at before update on public.products
  for each row execute function public.set_updated_at();
create trigger set_articles_updated_at before update on public.articles
  for each row execute function public.set_updated_at();
create trigger set_article_categories_updated_at before update on public.article_categories
  for each row execute function public.set_updated_at();
create trigger set_gallery_items_updated_at before update on public.gallery_items
  for each row execute function public.set_updated_at();
create trigger set_trusted_brands_updated_at before update on public.trusted_brands
  for each row execute function public.set_updated_at();
create trigger set_hero_slides_updated_at before update on public.hero_slides
  for each row execute function public.set_updated_at();
create trigger set_faqs_updated_at before update on public.faqs
  for each row execute function public.set_updated_at();
create trigger set_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------- PAGEVIEWS (KUNJUNGAN WEBSITE) ----------
create table if not exists public.pageviews (
  id bigint generated always as identity primary key,
  visitor_id text not null,
  path text not null default '/',
  referrer text default '',
  user_agent text default '',
  created_at timestamptz default now()
);

create index if not exists pageviews_created_at_idx on public.pageviews (created_at desc);

alter table public.pageviews enable row level security;

-- Pencatatan kunjungan: siapa pun boleh insert (anon key publik).
create policy "anon insert pageviews" on public.pageviews for insert to anon with check (true);
-- Dashboard: hanya pengguna terautentikasi (admin) yang bisa membaca.
create policy "auth read pageviews" on public.pageviews for select to authenticated using (true);
create policy "auth write pageviews" on public.pageviews for all to authenticated using (true) with check (true);

-- ============================================================
-- EVENT / BARCODE TIKET
-- Catatan: BACAAN hanya lewat RPC verify_ticket (security definer),
-- kode tiket tidak bocor ke publik walau RLS "related".
-- ============================================================

-- ======================
-- MIGRASI (buang & buat ulang — skema v2)
-- ======================
drop table if exists public.ticket_scans;
drop table if exists public.tickets;
drop table if exists public.ticket_events;

create table if not exists public.ticket_events (
  id bigint generated always as identity primary key,
  prefix text not null,                -- kode event manual, mis. 'BFV'
  name text not null,
  date_start date not null,            -- tanggal mulai event
  date_end date not null,              -- tanggal selesai event (multi-day)
  open_time time not null default '00:00',    -- jam buka barcode per hari
  close_time time not null default '23:59',   -- jam tutup barcode per hari
  venue text default '',
  ticket_count int default 0,
  status text default 'enabled',       -- 'enabled' | 'disabled'
  background text default '',          -- URL gambar WebP utk halaman /event
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists ticket_events_prefix_key on public.ticket_events (prefix);

create table if not exists public.tickets (
  id bigint generated always as identity primary key,
  event_id bigint not null references public.ticket_events (id) on delete cascade,
  event_prefix text not null,          -- snapshot prefix event saat generate
  code text unique not null,           -- nomor pendek "BFV-90977" (isi QR & cetak)
  internal_id text unique not null,    -- 20 char acak, anti-duplikat internal
  scan_count int default 0,
  created_at timestamptz default now()
);

create table if not exists public.ticket_scans (
  id bigint generated always as identity primary key,
  event_id bigint not null,
  ticket_id bigint not null,
  scanned_at timestamptz default now()
);

create index if not exists tickets_event_id_idx on public.tickets (event_id);
create index if not exists tickets_code_idx on public.tickets (code);
create index if not exists ticket_scans_ticket_id_idx on public.ticket_scans (ticket_id);

-- Perlu pgcrypto untuk gen_random_bytes (biasanya sudah aktif).
create extension if not exists pgcrypto;

alter table public.ticket_events enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_scans enable row level security;

-- Admin (authenticated) mengelola semua tabel. Tanpa policy public read,
-- jadi kode tiket tidak bisa dibaca publik.
create policy "auth write ticket_events" on public.ticket_events for all to authenticated using (true) with check (true);
create policy "auth write tickets" on public.tickets for all to authenticated using (true) with check (true);
create policy "auth write ticket_scans" on public.ticket_scans for all to authenticated using (true) with check (true);

create trigger set_events_updated_at before update on public.ticket_events
  for each row execute function public.set_updated_at();

-- Verifikasi tiket. p_now dikirim sebagai timestamptz (UTC) lalu dikonversi ke
-- WIB di dalam RPC agar tidak ada mismatch zona waktu. Kehabisan kuota
-- (scan_count >= 3) dicek di statement update yang sama -> increment atomik.
create or replace function public.verify_ticket(p_code text, p_now timestamptz)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ticket_id bigint;
  v_event_id bigint;
  v_event_prefix text;
  v_event_name text;
  v_date_start date;
  v_date_end date;
  v_open_time time;
  v_close_time time;
  v_event_background text;
  v_status text;
  v_scan_count int;
  v_cur_date date;
  v_cur_time time;
begin
  select (p_now at time zone 'Asia/Jakarta')::date,
         (p_now at time zone 'Asia/Jakarta')::time
    into v_cur_date, v_cur_time;

  select t.id, t.event_id, e.prefix, e.name, e.date_start, e.date_end,
         e.open_time, e.close_time, e.background, e.status, t.scan_count
    into v_ticket_id, v_event_id, v_event_prefix, v_event_name,
         v_date_start, v_date_end, v_open_time, v_close_time,
         v_event_background, v_status, v_scan_count
    from public.tickets t
    join public.ticket_events e on e.id = t.event_id
   where t.code = p_code
   limit 1;

  if v_event_id is null then
    return json_build_object('status', 'not_found');
  end if;

  if v_status = 'disabled' then
    return json_build_object('status', 'disabled', 'background', v_event_background);
  end if;

  if v_cur_date < v_date_start then
    return json_build_object(
      'status', 'inactive',
      'event_prefix', v_event_prefix,
      'event_name', v_event_name,
      'event_date', to_char(v_date_start, 'YYYY-MM-DD'),
      'date_end', to_char(v_date_end, 'YYYY-MM-DD'),
      'background', v_event_background,
      'scan_count', v_scan_count,
      'reason', 'before_event'
    );
  end if;

  if v_cur_date > v_date_end then
    return json_build_object(
      'status', 'expired',
      'event_prefix', v_event_prefix,
      'event_name', v_event_name,
      'event_date', to_char(v_date_start, 'YYYY-MM-DD'),
      'date_end', to_char(v_date_end, 'YYYY-MM-DD'),
      'background', v_event_background,
      'scan_count', v_scan_count,
      'reason', 'after_event'
    );
  end if;

  if v_cur_time < v_open_time then
    return json_build_object(
      'status', 'inactive',
      'event_prefix', v_event_prefix,
      'event_name', v_event_name,
      'event_date', to_char(v_date_start, 'YYYY-MM-DD'),
      'date_end', to_char(v_date_end, 'YYYY-MM-DD'),
      'open_time', v_open_time,
      'close_time', v_close_time,
      'background', v_event_background,
      'scan_count', v_scan_count,
      'reason', 'before_hours'
    );
  end if;

  if v_cur_time > v_close_time then
    return json_build_object(
      'status', 'expired',
      'event_prefix', v_event_prefix,
      'event_name', v_event_name,
      'event_date', to_char(v_date_start, 'YYYY-MM-DD'),
      'date_end', to_char(v_date_end, 'YYYY-MM-DD'),
      'open_time', v_open_time,
      'close_time', v_close_time,
      'background', v_event_background,
      'scan_count', v_scan_count,
      'reason', 'after_hours'
    );
  end if;

  update public.tickets
     set scan_count = scan_count + 1
   where code = p_code
     and scan_count < 3
   returning scan_count into v_scan_count;

  if v_scan_count is null then
    select t.scan_count into v_scan_count from public.tickets t where t.code = p_code;
    return json_build_object(
      'status', 'exhausted',
      'event_prefix', v_event_prefix,
      'event_name', v_event_name,
      'event_date', to_char(v_date_start, 'YYYY-MM-DD'),
      'date_end', to_char(v_date_end, 'YYYY-MM-DD'),
      'open_time', v_open_time,
      'close_time', v_close_time,
      'background', v_event_background,
      'scan_count', v_scan_count
    );
  end if;

  insert into public.ticket_scans (event_id, ticket_id) values (v_event_id, v_ticket_id);

  return json_build_object(
    'status', 'valid',
    'event_prefix', v_event_prefix,
    'event_name', v_event_name,
    'event_date', to_char(v_date_start, 'YYYY-MM-DD'),
    'date_end', to_char(v_date_end, 'YYYY-MM-DD'),
    'open_time', v_open_time,
    'close_time', v_close_time,
    'background', v_event_background,
    'scan_count', v_scan_count
  );
end;
$$;

grant execute on function public.verify_ticket(text, timestamptz) to anon, authenticated;
