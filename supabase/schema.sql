create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id text primary key default gen_random_uuid()::text,
  location text not null,
  organization text not null,
  program text not null,
  phone text,
  toll_free text,
  text_only text,
  type text not null,
  status text not null default 'Unknown',
  population_categories text[] not null default '{}',
  service_categories text[] not null default '{}',
  more_info text not null default '',
  partnered boolean not null default true,
  updated_at_label text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.worker_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  organization_name text not null,
  organization_id text references public.organizations(id),
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved')),
  categories text[] not null default '{}',
  population_tags text[] not null default '{}',
  more_info text not null default '',
  created_at timestamptz not null default now()
);

alter table public.organizations enable row level security;
alter table public.worker_profiles enable row level security;

create or replace function public.prepare_organization_import()
returns trigger
language plpgsql
as $$
begin
  if new.population_categories is null or new.population_categories = '{}' then
    new.population_categories := array[new.type];
  end if;

  if new.service_categories is null or new.service_categories = '{}' then
    new.service_categories := array[new.type];
  end if;

  if new.more_info is null or new.more_info = '' then
    new.more_info := trim(both ' | ' from concat_ws(
      ' | ',
      case when nullif(new.phone, '') is not null then 'Phone: ' || new.phone end,
      case when nullif(new.toll_free, '') is not null then 'Toll free: ' || new.toll_free end,
      case when nullif(new.text_only, '') is not null then 'Text only: ' || new.text_only end
    ));
  end if;

  return new;
end;
$$;

drop trigger if exists prepare_organization_import on public.organizations;
create trigger prepare_organization_import
  before insert or update on public.organizations
  for each row
  execute function public.prepare_organization_import();

drop policy if exists "Anyone can read organizations" on public.organizations;
create policy "Anyone can read organizations"
  on public.organizations for select
  using (true);

drop policy if exists "Workers can update their organization" on public.organizations;
create policy "Workers can update their organization"
  on public.organizations for update
  using (
    exists (
      select 1
      from public.worker_profiles
      where worker_profiles.user_id = auth.uid()
        and worker_profiles.organization_id = organizations.id
        and worker_profiles.approval_status = 'approved'
    )
  )
  with check (
    exists (
      select 1
      from public.worker_profiles
      where worker_profiles.user_id = auth.uid()
        and worker_profiles.organization_id = organizations.id
        and worker_profiles.approval_status = 'approved'
    )
  );

drop policy if exists "Workers can read their profile" on public.worker_profiles;
create policy "Workers can read their profile"
  on public.worker_profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Workers can create their profile" on public.worker_profiles;
create policy "Workers can create their profile"
  on public.worker_profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Workers can update their profile" on public.worker_profiles;
create policy "Workers can update their profile"
  on public.worker_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
