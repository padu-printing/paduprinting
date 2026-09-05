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
  sort_order int default 0,
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
alter table public.faqs enable row level security;
alter table public.site_settings enable row level security;

-- ---------- RLS POLICIES ----------
-- Read: everyone (public anon key)
create policy "public read categories" on public.categories for select using (true);
create policy "public read products" on public.products for select using (true);
create policy "public read articles" on public.articles for select using (true);
create policy "public read article_categories" on public.article_categories for select using (true);
create policy "public read gallery" on public.gallery_items for select using (true);
create policy "public read faqs" on public.faqs for select using (true);
create policy "public read settings" on public.site_settings for select using (true);

-- Write: only authenticated users (admin)
create policy "auth write categories" on public.categories for all to authenticated using (true) with check (true);
create policy "auth write products" on public.products for all to authenticated using (true) with check (true);
create policy "auth write articles" on public.articles for all to authenticated using (true) with check (true);
create policy "auth write article_categories" on public.article_categories for all to authenticated using (true) with check (true);
create policy "auth write gallery" on public.gallery_items for all to authenticated using (true) with check (true);
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
create trigger set_faqs_updated_at before update on public.faqs
  for each row execute function public.set_updated_at();
create trigger set_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();
