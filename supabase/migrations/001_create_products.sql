-- Products table for Jewels by Kayaa
create table if not exists public.products (
  id            text primary key default gen_random_uuid()::text,
  name          text not null,
  price         numeric(10, 2) not null check (price >= 0),
  category      text not null check (category in ('Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Anklets')),
  description   text not null default '',
  tags          text[] not null default '{}',
  image         text not null default '',
  image_alt     text,
  featured      boolean not null default false,
  is_new        boolean not null default false,
  is_best_seller boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at on every row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

-- Enable Row Level Security
alter table public.products enable row level security;

-- Allow anyone to read products (public storefront)
create policy "Public read" on public.products
  for select using (true);

-- Allow authenticated users (your admin) to insert/update/delete
create policy "Authenticated write" on public.products
  for all using (auth.role() = 'authenticated');
