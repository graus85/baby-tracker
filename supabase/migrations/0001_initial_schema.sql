
create extension if not exists "pgcrypto";

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create table if not exists feeds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  time time with time zone not null,
  amount numeric,
  unit text check (unit in ('ml','oz')),
  method text check (method in ('breast','bottle')) not null,
  side text check (side in ('left','right')),
  duration_sec integer,
  milk_type text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table feeds enable row level security;
create policy feeds_sel on feeds for select using (auth.uid() = user_id);
create policy feeds_ins on feeds for insert with check (auth.uid() = user_id);
create policy feeds_upd on feeds for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy feeds_del on feeds for delete using (auth.uid() = user_id);
create index if not exists feeds_user_date on feeds(user_id, date);
create index if not exists feeds_user_updated_at on feeds(user_id, updated_at);
drop trigger if exists trg_feeds_updated_at on feeds;
create trigger trg_feeds_updated_at before update on feeds for each row execute function set_updated_at();

create table if not exists diapers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  time time with time zone not null,
  pee boolean not null,
  poop boolean not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table diapers enable row level security;
create policy diapers_sel on diapers for select using (auth.uid() = user_id);
create policy diapers_ins on diapers for insert with check (auth.uid() = user_id);
create policy diapers_upd on diapers for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy diapers_del on diapers for delete using (auth.uid() = user_id);
create index if not exists diapers_user_date on diapers(user_id, date);
create index if not exists diapers_user_updated_at on diapers(user_id, updated_at);
drop trigger if exists trg_diapers_updated_at on diapers;
create trigger trg_diapers_updated_at before update on diapers for each row execute function set_updated_at();

create table if not exists sleeps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  start_time time with time zone not null,
  end_time time with time zone not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sleeps_end_after_start check (end_time > start_time)
);
alter table sleeps enable row level security;
create policy sleeps_sel on sleeps for select using (auth.uid() = user_id);
create policy sleeps_ins on sleeps for insert with check (auth.uid() = user_id);
create policy sleeps_upd on sleeps for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy sleeps_del on sleeps for delete using (auth.uid() = user_id);
create index if not exists sleeps_user_date on sleeps(user_id, date);
create index if not exists sleeps_user_updated_at on sleeps(user_id, updated_at);
drop trigger if exists trg_sleeps_updated_at on sleeps;
create trigger trg_sleeps_updated_at before update on sleeps for each row execute function set_updated_at();

create table if not exists vitamins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  time time with time zone not null,
  name text not null,
  dose text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table vitamins enable row level security;
create policy vitamins_sel on vitamins for select using (auth.uid() = user_id);
create policy vitamins_ins on vitamins for insert with check (auth.uid() = user_id);
create policy vitamins_upd on vitamins for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy vitamins_del on vitamins for delete using (auth.uid() = user_id);
create index if not exists vitamins_user_date on vitamins(user_id, date);
create index if not exists vitamins_user_updated_at on vitamins(user_id, updated_at);
drop trigger if exists trg_vitamins_updated_at on vitamins;
create trigger trg_vitamins_updated_at before update on vitamins for each row execute function set_updated_at();

create table if not exists weights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  time time with time zone not null,
  kg numeric not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table weights enable row level security;
create policy weights_sel on weights for select using (auth.uid() = user_id);
create policy weights_ins on weights for insert with check (auth.uid() = user_id);
create policy weights_upd on weights for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy weights_del on weights for delete using (auth.uid() = user_id);
create index if not exists weights_user_date on weights(user_id, date);
create index if not exists weights_user_updated_at on weights(user_id, updated_at);
drop trigger if exists trg_weights_updated_at on weights;
create trigger trg_weights_updated_at before update on weights for each row execute function set_updated_at();

create table if not exists heights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  time time with time zone not null,
  cm numeric not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table heights enable row level security;
create policy heights_sel on heights for select using (auth.uid() = user_id);
create policy heights_ins on heights for insert with check (auth.uid() = user_id);
create policy heights_upd on heights for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy heights_del on heights for delete using (auth.uid() = user_id);
create index if not exists heights_user_date on heights(user_id, date);
create index if not exists heights_user_updated_at on heights(user_id, updated_at);
drop trigger if exists trg_heights_updated_at on heights;
create trigger trg_heights_updated_at before update on heights for each row execute function set_updated_at();

create table if not exists others (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  time time with time zone not null,
  note text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table others enable row level security;
create policy others_sel on others for select using (auth.uid() = user_id);
create policy others_ins on others for insert with check (auth.uid() = user_id);
create policy others_upd on others for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy others_del on others for delete using (auth.uid() = user_id);
create index if not exists others_user_date on others(user_id, date);
create index if not exists others_user_updated_at on others(user_id, updated_at);
drop trigger if exists trg_others_updated_at on others;
create trigger trg_others_updated_at before update on others for each row execute function set_updated_at();

drop view if exists v_day_data;
create or replace view v_day_data as
select
  t.user_id,
  t.date,
  jsonb_build_object(
    'feeds', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'date', f.date::text, 'time', f.time::text, 'amount', f.amount, 'unit', f.unit,
        'method', f.method, 'side', f.side, 'durationSec', f.duration_sec, 'milkType', f.milk_type, 'note', f.note
      ) order by f.time asc)
      from feeds f where f.user_id = t.user_id and f.date = t.date
    ), '[]'::jsonb),
    'diapers', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'date', d.date::text, 'time', d.time::text, 'pee', d.pee, 'poop', d.poop, 'note', d.note
      ) order by d.time asc)
      from diapers d where d.user_id = t.user_id and d.date = t.date
    ), '[]'::jsonb),
    'sleeps', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'date', s.date::text, 'start', s.start_time::text, 'end', s.end_time::text, 'note', s.note
      ) order by s.start_time asc)
      from sleeps s where s.user_id = t.user_id and s.date = t.date
    ), '[]'::jsonb),
    'vitamins', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', v.id, 'date', v.date::text, 'time', v.time::text, 'name', v.name, 'dose', v.dose, 'note', v.note
      ) order by v.time asc)
      from vitamins v where v.user_id = t.user_id and v.date = t.date
    ), '[]'::jsonb),
    'weights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'date', w.date::text, 'time', w.time::text, 'kg', w.kg, 'note', w.note
      ) order by w.time asc)
      from weights w where w.user_id = t.user_id and w.date = t.date
    ), '[]'::jsonb),
    'heights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', h.id, 'date', h.date::text, 'time', h.time::text, 'cm', h.cm, 'note', h.note
      ) order by h.time asc)
      from heights h where h.user_id = t.user_id and h.date = t.date
    ), '[]'::jsonb),
    'others', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'date', o.date::text, 'time', o.time::text, 'note', o.note
      ) order by o.time asc)
      from others o where o.user_id = t.user_id and o.date = t.date
    ), '[]'::jsonb)
  ) as data
from (
  select distinct user_id, date from feeds
  union select distinct user_id, date from diapers
  union select distinct user_id, date from sleeps
  union select distinct user_id, date from vitamins
  union select distinct user_id, date from weights
  union select distinct user_id, date from heights
  union select distinct user_id, date from others
) t;
