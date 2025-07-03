-- Add foreign key relationships and improve HubSpot table structure
-- First drop all policies that depend on profiles.id column

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

-- Now we can safely alter the column type
ALTER TABLE public.profiles ALTER COLUMN id TYPE TEXT;

-- Recreate the policies with TEXT comparison
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete their own profile" ON public.profiles
    FOR DELETE USING (id = (auth.jwt() ->> 'sub'));

-- Add foreign key from hubspot_tokens to profiles
ALTER TABLE public.hubspot_tokens 
ADD CONSTRAINT hubspot_tokens_portal_id_fkey 
FOREIGN KEY (portal_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign keys from other HubSpot tables to hubspot_tokens
ALTER TABLE public.hubspot_contacts_cache 
ADD CONSTRAINT hubspot_contacts_cache_portal_id_fkey 
FOREIGN KEY (portal_id) REFERENCES public.hubspot_tokens(portal_id) ON DELETE CASCADE;

ALTER TABLE public.hubspot_events_raw 
ADD CONSTRAINT hubspot_events_raw_portal_id_fkey 
FOREIGN KEY (portal_id) REFERENCES public.hubspot_tokens(portal_id) ON DELETE CASCADE;

ALTER TABLE public.hubspot_sync_cursors 
ADD CONSTRAINT hubspot_sync_cursors_portal_id_fkey 
FOREIGN KEY (portal_id) REFERENCES public.hubspot_tokens(portal_id) ON DELETE CASCADE;

-- Add foreign key from hubspot_oauth_states to profiles
ALTER TABLE public.hubspot_oauth_states 
ADD CONSTRAINT hubspot_oauth_states_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add performance indexes on foreign key columns
CREATE INDEX IF NOT EXISTS idx_hubspot_tokens_portal_id ON public.hubspot_tokens(portal_id);
CREATE INDEX IF NOT EXISTS idx_hubspot_contacts_cache_portal_id ON public.hubspot_contacts_cache(portal_id);
CREATE INDEX IF NOT EXISTS idx_hubspot_events_raw_portal_id ON public.hubspot_events_raw(portal_id);
CREATE INDEX IF NOT EXISTS idx_hubspot_sync_cursors_portal_id ON public.hubspot_sync_cursors(portal_id);
CREATE INDEX IF NOT EXISTS idx_hubspot_oauth_states_user_id ON public.hubspot_oauth_states(user_id);

-- Add index on expires_at for efficient cleanup of expired OAuth states
CREATE INDEX IF NOT EXISTS idx_hubspot_oauth_states_expires_at ON public.hubspot_oauth_states(expires_at);