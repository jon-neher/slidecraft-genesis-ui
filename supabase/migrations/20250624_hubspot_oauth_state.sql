CREATE TABLE IF NOT EXISTS public.hubspot_oauth_states (
  state TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.hubspot_oauth_states ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user access" ON public.hubspot_oauth_states
  FOR ALL USING (auth.jwt() ->> 'sub' = user_id)
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);
