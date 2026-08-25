create extension if not exists pgcrypto;

create type public.user_role as enum ('owner', 'admin', 'manager', 'sales', 'support');
create type public.vehicle_purpose as enum ('sale', 'rental', 'both');
create type public.vehicle_status as enum ('available', 'reserved', 'sold', 'rented', 'unavailable', 'archived');
create type public.conversation_status as enum ('open', 'pending', 'closed');
create type public.message_sender as enum ('visitor', 'admin');
create type public.lead_status as enum ('new', 'contacted', 'negotiation', 'won', 'lost');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  role public.user_role not null default 'support',
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  logo_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vehicle_models (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  name text not null,
  slug text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brand_id, slug)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  brand text not null,
  model text not null,
  version text not null,
  brand_id uuid references public.brands(id) on delete set null,
  model_id uuid references public.vehicle_models(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  manufacture_year integer not null check (manufacture_year between 1900 and 2100),
  model_year integer not null check (model_year between 1900 and 2100),
  price numeric(14,2) check (price is null or price >= 0),
  daily_price numeric(12,2) check (daily_price is null or daily_price >= 0),
  weekly_price numeric(12,2) check (weekly_price is null or weekly_price >= 0),
  monthly_price numeric(12,2) check (monthly_price is null or monthly_price >= 0),
  mileage integer not null default 0 check (mileage >= 0),
  fuel text not null,
  transmission text not null,
  color text not null,
  doors smallint not null default 4 check (doors between 2 and 5),
  engine text,
  power text,
  category text not null,
  purpose public.vehicle_purpose not null default 'sale',
  status public.vehicle_status not null default 'available',
  description text not null default '',
  location text not null default '',
  featured boolean not null default false,
  is_launch boolean not null default false,
  is_promotion boolean not null default false,
  show_price boolean not null default true,
  price_on_request boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vehicle_price_visibility check (not (show_price and price_on_request))
);

create table public.vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  url text not null,
  storage_path text,
  alt_text text,
  is_cover boolean not null default false,
  position integer not null default 0 check (position >= 0),
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create unique index vehicle_one_cover_idx on public.vehicle_images(vehicle_id) where is_cover;
create index vehicle_images_order_idx on public.vehicle_images(vehicle_id, position);

create table public.vehicle_features (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  name text not null,
  position integer not null default 0,
  unique (vehicle_id, name)
);

create table public.launches (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  subtitle text,
  excerpt text,
  content text not null default '',
  cover_image_url text not null,
  video_url text,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  published_at timestamptz,
  featured boolean not null default false,
  active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.launch_images (
  id uuid primary key default gen_random_uuid(),
  launch_id uuid not null references public.launches(id) on delete cascade,
  url text not null,
  alt_text text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  desktop_image_url text not null,
  mobile_image_url text,
  cta_label text,
  cta_url text,
  active boolean not null default true,
  position integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint banner_date_range check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table public.visitors (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  phone text not null,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null references public.visitors(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  status public.conversation_status not null default 'open',
  assigned_to uuid references public.profiles(id) on delete set null,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_type public.message_sender not null,
  sender_id uuid,
  content text not null check (char_length(content) between 1 and 2000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  source text not null,
  status public.lead_status not null default 'new',
  notes text,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.whatsapp_numbers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  responsible text not null,
  number text not null,
  sector text not null check (sector in ('sales', 'rental', 'support')),
  default_message text not null default '',
  active boolean not null default true,
  is_primary boolean not null default false,
  priority integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index whatsapp_one_primary_idx on public.whatsapp_numbers(is_primary) where is_primary;

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  is_public boolean not null default true,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null unique,
  url text not null,
  active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vehicle_views (
  id bigint generated by default as identity primary key,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  visitor_id uuid references public.visitors(id) on delete set null,
  session_id text,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.whatsapp_clicks (
  id bigint generated by default as identity primary key,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  whatsapp_number_id uuid references public.whatsapp_numbers(id) on delete set null,
  visitor_id uuid references public.visitors(id) on delete set null,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.page_views (
  id bigint generated by default as identity primary key,
  path text not null,
  session_id text,
  referrer text,
  created_at timestamptz not null default now()
);

create table public.activity_logs (
  id bigint generated by default as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index vehicles_public_filter_idx on public.vehicles(status, purpose, brand, model_year, price);
create index vehicles_featured_idx on public.vehicles(featured, created_at desc) where featured;
create index conversations_queue_idx on public.conversations(status, last_message_at desc);
create index conversations_visitor_idx on public.conversations(visitor_id, created_at desc);
create index messages_conversation_idx on public.messages(conversation_id, created_at);
create index leads_pipeline_idx on public.leads(status, created_at desc);
create index vehicle_views_stats_idx on public.vehicle_views(vehicle_id, created_at desc);
create index whatsapp_clicks_stats_idx on public.whatsapp_clicks(vehicle_id, created_at desc);
create index activity_logs_recent_idx on public.activity_logs(created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(new.is_anonymous, false) then
    return new;
  end if;
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    'support'::public.user_role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.current_role()
returns public.user_role language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = auth.uid() and active = true;
$$;

create or replace function public.has_role(allowed public.user_role[])
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(public.current_role() = any(allowed), false);
$$;

create or replace function public.can_manage_settings()
returns boolean language sql stable as $$
  select public.has_role(array['owner','admin']::public.user_role[]);
$$;

create or replace function public.can_manage_content()
returns boolean language sql stable as $$
  select public.has_role(array['owner','admin','manager']::public.user_role[]);
$$;

create or replace function public.can_manage_vehicles()
returns boolean language sql stable as $$
  select public.has_role(array['owner','admin','manager','sales']::public.user_role[]);
$$;

create or replace function public.can_access_crm()
returns boolean language sql stable as $$
  select public.has_role(array['owner','admin','manager','sales','support']::public.user_role[]);
$$;

create or replace function public.show_sold_vehicles()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select (value #>> '{}')::boolean from public.site_settings where key = 'show_sold_vehicles'), false);
$$;

create or replace function public.touch_conversation()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.conversations set last_message_at = new.created_at, updated_at = now() where id = new.conversation_id;
  return new;
end;
$$;

create or replace function public.log_vehicle_status_change()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.status is distinct from new.status then
    insert into public.activity_logs(actor_id, action, entity_type, entity_id, metadata)
    values (auth.uid(), 'vehicle.status_changed', 'vehicle', new.id, jsonb_build_object('from', old.status, 'to', new.status, 'title', new.title));
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create trigger messages_touch_conversation after insert on public.messages for each row execute function public.touch_conversation();
create trigger vehicles_log_status after update on public.vehicles for each row execute function public.log_vehicle_status_change();

do $$
declare table_name text;
begin
  foreach table_name in array array['profiles','brands','vehicle_models','vehicles','launches','banners','visitors','conversations','leads','whatsapp_numbers','social_links']
  loop
    execute format('create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

alter table public.profiles enable row level security;
alter table public.brands enable row level security;
alter table public.vehicle_models enable row level security;
alter table public.categories enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_images enable row level security;
alter table public.vehicle_features enable row level security;
alter table public.launches enable row level security;
alter table public.launch_images enable row level security;
alter table public.banners enable row level security;
alter table public.visitors enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.leads enable row level security;
alter table public.whatsapp_numbers enable row level security;
alter table public.site_settings enable row level security;
alter table public.social_links enable row level security;
alter table public.vehicle_views enable row level security;
alter table public.whatsapp_clicks enable row level security;
alter table public.page_views enable row level security;
alter table public.activity_logs enable row level security;

create policy "profiles read self or admins" on public.profiles for select to authenticated using (id = auth.uid() or public.can_manage_settings());
create policy "owners manage profiles" on public.profiles for all to authenticated using (public.can_manage_settings()) with check (public.can_manage_settings());

create policy "public reads active brands" on public.brands for select using (active or public.can_manage_content());
create policy "content managers manage brands" on public.brands for all to authenticated using (public.can_manage_content()) with check (public.can_manage_content());
create policy "public reads active models" on public.vehicle_models for select using (active or public.can_manage_content());
create policy "content managers manage models" on public.vehicle_models for all to authenticated using (public.can_manage_content()) with check (public.can_manage_content());
create policy "public reads active categories" on public.categories for select using (active or public.can_manage_content());
create policy "content managers manage categories" on public.categories for all to authenticated using (public.can_manage_content()) with check (public.can_manage_content());

create policy "public reads visible vehicles" on public.vehicles for select using (status in ('available','reserved') or (status = 'sold' and public.show_sold_vehicles()) or public.can_manage_vehicles());
create policy "vehicle managers insert vehicles" on public.vehicles for insert to authenticated with check (public.can_manage_vehicles());
create policy "vehicle managers update vehicles" on public.vehicles for update to authenticated using (public.can_manage_vehicles()) with check (public.can_manage_vehicles());
create policy "owners delete vehicles" on public.vehicles for delete to authenticated using (public.has_role(array['owner','admin']::public.user_role[]));
create policy "public reads visible vehicle images" on public.vehicle_images for select using (exists(select 1 from public.vehicles v where v.id = vehicle_id));
create policy "vehicle managers manage images" on public.vehicle_images for all to authenticated using (public.can_manage_vehicles()) with check (public.can_manage_vehicles());
create policy "public reads visible features" on public.vehicle_features for select using (exists(select 1 from public.vehicles v where v.id = vehicle_id));
create policy "vehicle managers manage features" on public.vehicle_features for all to authenticated using (public.can_manage_vehicles()) with check (public.can_manage_vehicles());

create policy "public reads published launches" on public.launches for select using ((active and published_at <= now()) or public.can_manage_content());
create policy "content managers manage launches" on public.launches for all to authenticated using (public.can_manage_content()) with check (public.can_manage_content());
create policy "public reads launch images" on public.launch_images for select using (exists(select 1 from public.launches l where l.id = launch_id));
create policy "content managers manage launch images" on public.launch_images for all to authenticated using (public.can_manage_content()) with check (public.can_manage_content());
create policy "public reads active banners" on public.banners for select using ((active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now())) or public.can_manage_content());
create policy "content managers manage banners" on public.banners for all to authenticated using (public.can_manage_content()) with check (public.can_manage_content());

create policy "visitors read own profile" on public.visitors for select to authenticated using (auth_user_id = auth.uid() or public.can_access_crm());
create policy "visitors create own profile" on public.visitors for insert to authenticated with check (auth_user_id = auth.uid());
create policy "visitors update own profile" on public.visitors for update to authenticated using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());
create policy "crm manages visitors" on public.visitors for all to authenticated using (public.can_access_crm()) with check (public.can_access_crm());

create policy "participants read conversations" on public.conversations for select to authenticated using (public.can_access_crm() or exists(select 1 from public.visitors v where v.id = visitor_id and v.auth_user_id = auth.uid()));
create policy "visitors start conversations" on public.conversations for insert to authenticated with check (exists(select 1 from public.visitors v where v.id = visitor_id and v.auth_user_id = auth.uid()) and assigned_to is null and status = 'open');
create policy "crm updates conversations" on public.conversations for update to authenticated using (public.can_access_crm()) with check (public.can_access_crm());
create policy "admins delete conversations" on public.conversations for delete to authenticated using (public.has_role(array['owner','admin']::public.user_role[]));

create policy "participants read messages" on public.messages for select to authenticated using (public.can_access_crm() or exists(select 1 from public.conversations c join public.visitors v on v.id = c.visitor_id where c.id = conversation_id and v.auth_user_id = auth.uid()));
create policy "visitors send own messages" on public.messages for insert to authenticated with check (sender_type = 'visitor' and sender_id = auth.uid() and exists(select 1 from public.conversations c join public.visitors v on v.id = c.visitor_id where c.id = conversation_id and v.auth_user_id = auth.uid()));
create policy "crm sends admin messages" on public.messages for insert to authenticated with check (sender_type = 'admin' and sender_id = auth.uid() and public.can_access_crm());
create policy "participants mark messages read" on public.messages for update to authenticated using (public.can_access_crm() or exists(select 1 from public.conversations c join public.visitors v on v.id = c.visitor_id where c.id = conversation_id and v.auth_user_id = auth.uid())) with check (public.can_access_crm() or exists(select 1 from public.conversations c join public.visitors v on v.id = c.visitor_id where c.id = conversation_id and v.auth_user_id = auth.uid()));

create policy "public submits leads" on public.leads for insert to anon, authenticated with check (status = 'new' and assigned_to is null);
create policy "crm reads leads" on public.leads for select to authenticated using (public.can_access_crm());
create policy "crm updates leads" on public.leads for update to authenticated using (public.can_access_crm()) with check (public.can_access_crm());
create policy "admins delete leads" on public.leads for delete to authenticated using (public.has_role(array['owner','admin']::public.user_role[]));

create policy "public reads active whatsapp" on public.whatsapp_numbers for select using (active or public.can_manage_settings());
create policy "admins manage whatsapp" on public.whatsapp_numbers for all to authenticated using (public.can_manage_settings()) with check (public.can_manage_settings());
create policy "public reads public settings" on public.site_settings for select using (is_public or public.can_manage_settings());
create policy "admins manage settings" on public.site_settings for all to authenticated using (public.can_manage_settings()) with check (public.can_manage_settings());
create policy "public reads active social links" on public.social_links for select using (active or public.can_manage_settings());
create policy "admins manage social links" on public.social_links for all to authenticated using (public.can_manage_settings()) with check (public.can_manage_settings());

create policy "anyone records vehicle views" on public.vehicle_views for insert to anon, authenticated with check (true);
create policy "admins read vehicle views" on public.vehicle_views for select to authenticated using (public.can_access_crm());
create policy "anyone records whatsapp clicks" on public.whatsapp_clicks for insert to anon, authenticated with check (true);
create policy "admins read whatsapp clicks" on public.whatsapp_clicks for select to authenticated using (public.can_access_crm());
create policy "anyone records page views" on public.page_views for insert to anon, authenticated with check (true);
create policy "admins read page views" on public.page_views for select to authenticated using (public.can_access_crm());
create policy "admins read activity logs" on public.activity_logs for select to authenticated using (public.can_access_crm());
create policy "admins create activity logs" on public.activity_logs for insert to authenticated with check (public.can_access_crm() and actor_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vehicle-images', 'vehicle-images', true, 8388608, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "public reads vehicle storage" on storage.objects for select using (bucket_id = 'vehicle-images');
create policy "vehicle managers upload images" on storage.objects for insert to authenticated with check (bucket_id = 'vehicle-images' and public.can_manage_vehicles());
create policy "vehicle managers update images" on storage.objects for update to authenticated using (bucket_id = 'vehicle-images' and public.can_manage_vehicles()) with check (bucket_id = 'vehicle-images' and public.can_manage_vehicles());
create policy "vehicle managers delete images" on storage.objects for delete to authenticated using (bucket_id = 'vehicle-images' and public.can_manage_vehicles());

do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null;
end $$;

grant usage on schema public to anon, authenticated;
grant select on public.brands, public.vehicle_models, public.categories, public.vehicles, public.vehicle_images, public.vehicle_features, public.launches, public.launch_images, public.banners, public.whatsapp_numbers, public.site_settings, public.social_links to anon, authenticated;
grant select, insert, update on public.visitors, public.conversations, public.messages to authenticated;
grant insert on public.leads, public.vehicle_views, public.whatsapp_clicks, public.page_views to anon, authenticated;
grant all on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
