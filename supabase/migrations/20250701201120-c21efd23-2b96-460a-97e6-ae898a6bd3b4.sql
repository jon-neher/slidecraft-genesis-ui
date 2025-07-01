-- Enhanced OAuth state security with timestamp validation and cleanup
ALTER TABLE public.hubspot_oauth_states 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '1 hour');

-- Create index for efficient cleanup of expired states
CREATE INDEX IF NOT EXISTS idx_hubspot_oauth_states_expires_at ON public.hubspot_oauth_states(expires_at);

-- Create function to cleanup expired OAuth states
CREATE OR REPLACE FUNCTION public.cleanup_expired_oauth_states()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM public.hubspot_oauth_states 
  WHERE expires_at < now();
$$;

-- Add RLS policy to prevent access to expired states
DROP POLICY IF EXISTS "user access expired states" ON public.hubspot_oauth_states;
CREATE POLICY "user access valid states" 
ON public.hubspot_oauth_states
FOR ALL 
USING (
  (auth.jwt() ->> 'sub'::text) = user_id 
  AND expires_at > now()
)
WITH CHECK (
  (auth.jwt() ->> 'sub'::text) = user_id 
  AND expires_at > now()
);

-- Add security event logging table
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on security events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Only service role can insert security events
CREATE POLICY "Service role can insert security events"
ON public.security_events
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Users can only view their own security events
CREATE POLICY "Users can view their own security events"
ON public.security_events
FOR SELECT
USING (user_id = auth.jwt() ->> 'sub');

-- Add enhanced rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, endpoint, window_start)
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can manage rate limits
CREATE POLICY "Service role can manage rate limits"
ON public.rate_limits
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');