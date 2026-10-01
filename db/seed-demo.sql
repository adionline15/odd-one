-- Odd-One MVP demo observation seed
-- Run this once in the Supabase SQL Editor.
-- Re-running it replaces only this demo observation.

delete from public.observations
where metadata ->> 'seed' = 'odd-one-demo';

insert into public.observations (
  location,
  observation_type,
  source,
  observed_at,
  confidence,
  status,
  metadata
)
values (
  gis.st_setsrid(gis.st_makepoint(77.2090, 28.6139), 4326)::gis.geography,
  'surface_condition',
  'user',
  now(),
  0.95,
  'approved',
  jsonb_build_object(
    'seed', 'odd-one-demo',
    'note', 'MVP demo observation'
  )
);
