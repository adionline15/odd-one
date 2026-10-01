-- Odd-One road intelligence foundation
-- Run this in Supabase SQL Editor after enabling PostGIS in the `gis` schema.
-- Supabase recommends keeping PostGIS outside `public`. See:
-- https://supabase.com/docs/guides/database/extensions/postgis

create extension if not exists postgis with schema gis;

create type public.observation_type as enum (
  'missing_road',
  'new_road',
  'road_closure',
  'construction',
  'surface_condition',
  'access_restriction',
  'map_mismatch'
);

create type public.observation_source as enum (
  'user',
  'dashcam',
  'satellite',
  'osm',
  'government',
  'news',
  'ai'
);

create type public.observation_status as enum (
  'pending',
  'approved',
  'rejected'
);

create table if not exists public.observations (
  id uuid primary key default gen_random_uuid(),
  location gis.geography(POINT, 4326) not null,
  observation_type public.observation_type not null,
  source public.observation_source not null,
  observed_at timestamptz not null,
  submitted_at timestamptz not null default now(),
  confidence numeric(4,3) not null check (confidence >= 0 and confidence <= 1),
  status public.observation_status not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists observations_location_gist
  on public.observations using gist (location);

create index if not exists observations_status_observed_at
  on public.observations (status, observed_at desc);

create index if not exists observations_approved_location
  on public.observations using gist (location)
  where status = 'approved';

create index if not exists observations_type_status
  on public.observations (observation_type, status);

create index if not exists observations_approved_observed_at
  on public.observations (observed_at desc)
  where status = 'approved';

create index if not exists observations_source_status
  on public.observations (source, status);

create index if not exists observations_reviewed_at
  on public.observations (reviewed_at desc)
  where reviewed_at is not null;

create index if not exists observations_submitted_at
  on public.observations (submitted_at desc);

create index if not exists observations_metadata_gin
  on public.observations using gin (metadata);

comment on table public.observations is 'Verified road intelligence observations; only approved rows are publicly readable.';
comment on column public.observations.observed_at is 'Timestamp when the road condition or map event was observed.';
comment on column public.observations.submitted_at is 'Timestamp when the observation entered the system.';
comment on column public.observations.confidence is 'Normalized confidence score from 0 to 1.';

alter table public.observations enable row level security;

drop policy if exists "approved observations are public" on public.observations;
create policy "approved observations are public"
  on public.observations
  for select
  to anon, authenticated
  using (status = 'approved');

drop policy if exists "authenticated users can submit observations" on public.observations;
create policy "authenticated users can submit observations"
  on public.observations
  for insert
  to authenticated
  with check (
    status = 'pending'
    and created_by = auth.uid()
  );

create or replace function public.submit_observation(
  p_lat double precision,
  p_lon double precision,
  p_observation_type public.observation_type,
  p_source public.observation_source,
  p_observed_at timestamptz,
  p_confidence numeric,
  p_metadata jsonb default '{}'::jsonb
)
returns public.observations
language plpgsql
security definer
set search_path = public, gis
as $$
declare
  result public.observations;
begin
  if p_lat < -90 or p_lat > 90 or p_lon < -180 or p_lon > 180 then
    raise exception 'Invalid coordinates';
  end if;

  if p_confidence < 0 or p_confidence > 1 then
    raise exception 'Invalid confidence';
  end if;

  if jsonb_typeof(coalesce(p_metadata, '{}'::jsonb)) <> 'object' then
    raise exception 'Observation metadata must be an object';
  end if;

  if octet_length(coalesce(p_metadata, '{}'::jsonb)::text) > 8000 then
    raise exception 'Observation metadata is too large';
  end if;

  insert into public.observations (
    location,
    observation_type,
    source,
    observed_at,
    confidence,
    metadata,
    created_by,
    status
  )
  values (
    gis.st_setsrid(gis.st_makepoint(p_lon, p_lat), 4326)::gis.geography,
    p_observation_type,
    p_source,
    p_observed_at,
    p_confidence,
    coalesce(p_metadata, '{}'::jsonb),
    auth.uid(),
    'pending'
  )
  returning * into result;

  return result;
end;
$$;

revoke execute on function public.submit_observation(
  double precision,
  double precision,
  public.observation_type,
  public.observation_source,
  timestamptz,
  numeric,
  jsonb
) from public, anon, authenticated;

grant execute on function public.submit_observation(
  double precision,
  double precision,
  public.observation_type,
  public.observation_source,
  timestamptz,
  numeric,
  jsonb
) to service_role;

create or replace function public.approved_observations_in_view(
  p_min_lat double precision,
  p_min_lon double precision,
  p_max_lat double precision,
  p_max_lon double precision,
  p_limit integer default 500
)
returns table (
  id uuid,
  latitude double precision,
  longitude double precision,
  observation_type public.observation_type,
  source public.observation_source,
  observed_at timestamptz,
  confidence numeric,
  metadata jsonb
)
language sql
security definer
set search_path = public, gis
as $$
  select
    o.id,
    gis.st_y(o.location::gis.geometry),
    gis.st_x(o.location::gis.geometry),
    o.observation_type,
    o.source,
    o.observed_at,
    o.confidence,
    o.metadata
  from public.observations o
  where o.status = 'approved'
    and o.location operator(gis.&&)
      gis.st_setsrid(
        gis.st_makebox2d(
          gis.st_point(p_min_lon, p_min_lat),
          gis.st_point(p_max_lon, p_max_lat)
        ),
        4326
      )::gis.geography
  order by o.observed_at desc
  limit least(greatest(p_limit, 1), 500);
$$;

comment on function public.approved_observations_in_view(double precision, double precision, double precision, double precision, integer)
  is 'Returns approved observations intersecting a geographic viewport, newest first.';

revoke execute on function public.approved_observations_in_view(
  double precision,
  double precision,
  double precision,
  double precision,
  integer
) from public, anon, authenticated;

grant execute on function public.approved_observations_in_view(
  double precision,
  double precision,
  double precision,
  double precision,
  integer
) to service_role;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists observations_updated_at on public.observations;
create trigger observations_updated_at
before update on public.observations
for each row execute function public.set_updated_at();
