-- Run in Supabase SQL Editor. All access to private tables is via server-side service role.
create table if not exists public.bookings (
 id uuid primary key default gen_random_uuid(), week_date date not null,
 number integer not null check(number between 1 and 100),
 full_name text not null check(char_length(full_name) between 3 and 120),
 phone text not null check(phone ~ '^05[0-9]{8}$'),
 created_at timestamptz not null default now(), cancelled_at timestamptz,
 constraint unique_number_per_week unique(week_date,number) deferrable initially immediate
);
-- Partial indexes enforce uniqueness only for active bookings.
alter table public.bookings drop constraint if exists unique_number_per_week;
create unique index if not exists active_week_number on public.bookings(week_date,number) where cancelled_at is null;
create unique index if not exists active_week_phone on public.bookings(week_date,phone) where cancelled_at is null;
create index if not exists bookings_week on public.bookings(week_date);
create table if not exists public.booking_settings (id integer primary key default 1 check(id=1), mode text not null default 'auto' check(mode in ('auto','open','closed')));
insert into public.booking_settings(id,mode) values(1,'auto') on conflict(id) do nothing;
alter table public.bookings enable row level security;
alter table public.booking_settings enable row level security;
revoke all on public.bookings from anon, authenticated;
revoke all on public.booking_settings from anon, authenticated;
-- Database clock is authoritative for booking window; forced open applies only to current booking week.
create or replace function public.reserve_number(p_name text,p_phone text,p_number integer)
returns table(booking_id uuid, booking_week date, booked_number integer, booked_name text)
language plpgsql security definer set search_path=public as $$
declare local_now timestamp; target_date date; mode_value text; new_id uuid;
begin
 local_now:=now() at time zone 'Asia/Riyadh';
 target_date:=local_now::date+((8-extract(isodow from local_now)::int)%7);
 select mode into mode_value from booking_settings where id=1;
 if mode_value='closed' or (mode_value='auto' and not (extract(isodow from local_now) in (6,7) or (extract(isodow from local_now)=1 and local_now::time < time '16:00'))) then
  raise exception 'BOOKING_CLOSED' using errcode='P0001';
 end if;
 if p_number not between 1 and 100 or p_phone !~ '^05[0-9]{8}$' or char_length(trim(p_name)) not between 3 and 120 then
  raise exception 'INVALID_INPUT' using errcode='P0001';
 end if;
 insert into bookings(week_date,number,full_name,phone) values(target_date,p_number,trim(p_name),p_phone) returning id into new_id;
 return query select new_id,target_date,p_number,trim(p_name);
exception when unique_violation then raise exception 'ALREADY_BOOKED_OR_PHONE_USED' using errcode='P0001';
end;$$;
revoke all on function public.reserve_number(text,text,integer) from public,anon,authenticated;
