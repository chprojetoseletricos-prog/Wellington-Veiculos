create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

alter function public.current_role() set schema private;
alter function private.current_role() set search_path = '';
revoke all on function private.current_role() from public;
grant execute on function private.current_role() to anon, authenticated;

create or replace function public.has_role(allowed public.user_role[])
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(private.current_role() = any(allowed), false);
$$;

create or replace function public.show_sold_vehicles()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce((
    select (value #>> '{}')::boolean
    from public.site_settings
    where key = 'show_sold_vehicles'
  ), false);
$$;

alter function public.set_updated_at() set search_path = '';
alter function public.can_manage_settings() set search_path = '';
alter function public.can_manage_content() set search_path = '';
alter function public.can_manage_vehicles() set search_path = '';
alter function public.can_access_crm() set search_path = '';

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.touch_conversation() from public, anon, authenticated;
revoke all on function public.log_vehicle_status_change() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;

revoke all on function public.has_role(public.user_role[]) from public;
revoke all on function public.can_manage_settings() from public;
revoke all on function public.can_manage_content() from public;
revoke all on function public.can_manage_vehicles() from public;
revoke all on function public.can_access_crm() from public;
revoke all on function public.show_sold_vehicles() from public;

grant execute on function public.has_role(public.user_role[]) to anon, authenticated;
grant execute on function public.can_manage_settings() to anon, authenticated;
grant execute on function public.can_manage_content() to anon, authenticated;
grant execute on function public.can_manage_vehicles() to anon, authenticated;
grant execute on function public.can_access_crm() to anon, authenticated;
grant execute on function public.show_sold_vehicles() to anon, authenticated;

create index if not exists activity_logs_actor_idx on public.activity_logs(actor_id);
create index if not exists conversations_assigned_to_idx on public.conversations(assigned_to);
create index if not exists conversations_vehicle_idx on public.conversations(vehicle_id);
create index if not exists launch_images_launch_idx on public.launch_images(launch_id);
create index if not exists launches_created_by_idx on public.launches(created_by);
create index if not exists launches_vehicle_idx on public.launches(vehicle_id);
create index if not exists leads_assigned_to_idx on public.leads(assigned_to);
create index if not exists leads_vehicle_idx on public.leads(vehicle_id);
create index if not exists site_settings_updated_by_idx on public.site_settings(updated_by);
create index if not exists vehicle_views_visitor_idx on public.vehicle_views(visitor_id);
create index if not exists vehicles_brand_idx on public.vehicles(brand_id);
create index if not exists vehicles_category_idx on public.vehicles(category_id);
create index if not exists vehicles_created_by_idx on public.vehicles(created_by);
create index if not exists vehicles_model_idx on public.vehicles(model_id);
create index if not exists vehicles_updated_by_idx on public.vehicles(updated_by);
create index if not exists whatsapp_clicks_visitor_idx on public.whatsapp_clicks(visitor_id);
create index if not exists whatsapp_clicks_number_idx on public.whatsapp_clicks(whatsapp_number_id);
