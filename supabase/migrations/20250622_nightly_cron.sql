-- Nightly delta sync job and ensure hubspot_sync_cursors exists

-- Ensure table exists for tracking HubSpot sync cursors
create table if not exists public.hubspot_sync_cursors (
  portal_id   text,
  object_type text,
  hs_timestamp timestamptz,
  primary key (portal_id, object_type)
);

comment on table public.hubspot_sync_cursors is 'Tracks last sync timestamp per object type';
comment on column public.hubspot_sync_cursors.portal_id is 'Portal identifier';
comment on column public.hubspot_sync_cursors.object_type is 'Type of object being synced';
comment on column public.hubspot_sync_cursors.hs_timestamp is 'Timestamp from HubSpot for last sync';

-- Register nightly cron job
insert into supabase_functions.cron_jobs (
  name, schedule, command
) values (
  'hubspot_nightly_delta',
  '0 2 * * *',
  $$ select public.sync_hubspot_contacts(portal_id)
       from hubspot_tokens; $$
) on conflict (name) do update
  set schedule = excluded.schedule,
      command  = excluded.command;
