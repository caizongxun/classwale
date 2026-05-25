-- Migration: 校園美食地圖 schema
-- 可重複執行（idempotent）

-- 1. shops / spots 表：儲存店家資訊
create table if not exists public.spots (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  description text,
  address text,
  lat double precision,
  lng double precision,
  avg_rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists spots_name_idx on public.spots (name);
create index if not exists spots_location_idx on public.spots (lat, lng);

-- 2. reviews 表：針對某店家的使用者評論
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid not null references public.spots(id) on delete cascade,
  anon_id text not null,
  rating smallint not null check (rating between 1 and 5),
  content text,
  created_at timestamptz not null default now()
);

create index if not exists reviews_spot_id_idx on public.reviews (spot_id);

-- 3. RLS：允許任何人讀取 spots & reviews，寫入 reviews 透過 RPC（避免直接更新 avg_rating）
alter table public.spots enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "anyone can read spots" on public.spots;
create policy "anyone can read spots"
  on public.spots for select
  using (true);

drop policy if exists "anyone can read reviews" on public.reviews;
create policy "anyone can read reviews"
  on public.reviews for select
  using (true);

drop policy if exists "anyone can insert reviews" on public.reviews;
create policy "anyone can insert reviews"
  on public.reviews for insert
  with check (true);

-- 4. RPC：新增 review 並更新 spots 的 avg_rating 與 review_count（原子性）
create or replace function public.add_review_and_update_rating(
  s_id uuid,
  anon text,
  r integer,
  body text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  total numeric;
  cnt integer;
begin
  insert into public.reviews (spot_id, anon_id, rating, content)
  values (s_id, anon, r, body);

  select coalesce(sum(rating),0), count(*) into total, cnt
    from public.reviews where spot_id = s_id;

  update public.spots
    set avg_rating = round((total::numeric / cnt)::numeric, 2),
        review_count = cnt
    where id = s_id;
end;
$$;

revoke all on function public.add_review_and_update_rating(uuid, text, integer, text) from public;
grant execute on function public.add_review_and_update_rating(uuid, text, integer, text) to anon, authenticated;

comment on function public.add_review_and_update_rating is 'Insert review then recalc avg_rating + review_count';

-- 5. sample seed
insert into public.spots (name, category, description, address)
values ('範例小吃店', '小吃', '校園內人氣小吃', '校園路 1 號')
on conflict do nothing;
