-- Enable telemetry extensions and create logs table
create extension if not exists pg_cron;
create extension if not exists pg_net;

create table if not exists public.function_logs (
  id         bigserial primary key,
  time       timestamptz default now(),
  fn         text,
  status     int,
  latency_ms numeric,
  portal_id  text,
  hs_status  text
);

-- Optional retention (30 days)
create or replace function public.purge_old_logs()
returns void language plpgsql as $$
  delete from public.function_logs
   where time < now() - interval '30 days';
$$;
select cron.schedule('daily_log_purge', '0 3 * * *', $$select public.purge_old_logs();$$);

-- Every minute: if >10 HubSpot 429s in the past minute, email alert
select cron.schedule(
  job_name := 'hubspot_429_alert',
  schedule := '* * * * *',
  command  := $$
    do $$
    declare v_bursts int;
    begin
      select count(*) into v_bursts
        from public.function_logs
       where hs_status = '429'
         and time > now() - interval '1 minute';
      if v_bursts > 10 then
        perform net.http_post(
          url := 'mailto:jonnehermusic@gmail.com',
          headers := jsonb_build_object('Content-Type','application/json'),
          body := jsonb_build_object('text',
            format('\ud83d\udea8 %s HubSpot 429s hit in the last minute', v_bursts))
        );
      end if;
    end $$;
  $$);
