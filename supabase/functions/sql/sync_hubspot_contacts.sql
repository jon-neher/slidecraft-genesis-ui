create or replace function public.sync_hubspot_contacts(p_portal text)
returns void language plpgsql security definer as $$
declare last_ts  timestamptz := (
        select hs_timestamp
          from hubspot_sync_cursors
         where portal_id = p_portal
           and object_type = 'contacts');
begin
  perform net.http_post(  -- pg_net call
    url  := '/hubspot_fetch_contacts?portal_id='||p_portal||
             '&after='||coalesce(last_ts::text,''),
    headers := json_build_object()
  );
end $$;
