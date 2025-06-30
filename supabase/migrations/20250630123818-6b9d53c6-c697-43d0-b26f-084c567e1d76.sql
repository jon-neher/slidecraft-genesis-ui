
-- Enable Row Level Security on all HubSpot tables and create comprehensive policies

-- hubspot_contacts_cache: Enable RLS and create policies
ALTER TABLE public.hubspot_contacts_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hubspot_contacts_cache_select" ON public.hubspot_contacts_cache
    FOR SELECT USING (portal_id = auth.jwt() ->> 'sub');

CREATE POLICY "hubspot_contacts_cache_insert" ON public.hubspot_contacts_cache
    FOR INSERT WITH CHECK (portal_id = auth.jwt() ->> 'sub');

CREATE POLICY "hubspot_contacts_cache_update" ON public.hubspot_contacts_cache
    FOR UPDATE USING (portal_id = auth.jwt() ->> 'sub');

CREATE POLICY "hubspot_contacts_cache_delete" ON public.hubspot_contacts_cache
    FOR DELETE USING (portal_id = auth.jwt() ->> 'sub');

-- hubspot_tokens: Enable RLS and create policies
ALTER TABLE public.hubspot_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hubspot_tokens_select" ON public.hubspot_tokens
    FOR SELECT USING (portal_id = auth.jwt() ->> 'sub');

CREATE POLICY "hubspot_tokens_insert" ON public.hubspot_tokens
    FOR INSERT WITH CHECK (portal_id = auth.jwt() ->> 'sub');

CREATE POLICY "hubspot_tokens_update" ON public.hubspot_tokens
    FOR UPDATE USING (portal_id = auth.jwt() ->> 'sub');

CREATE POLICY "hubspot_tokens_delete" ON public.hubspot_tokens
    FOR DELETE USING (portal_id = auth.jwt() ->> 'sub');

-- hubspot_sync_cursors: Enable RLS and create policies
ALTER TABLE public.hubspot_sync_cursors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hubspot_sync_cursors_select" ON public.hubspot_sync_cursors
    FOR SELECT USING (portal_id = auth.jwt() ->> 'sub');

CREATE POLICY "hubspot_sync_cursors_insert" ON public.hubspot_sync_cursors
    FOR INSERT WITH CHECK (portal_id = auth.jwt() ->> 'sub');

CREATE POLICY "hubspot_sync_cursors_update" ON public.hubspot_sync_cursors
    FOR UPDATE USING (portal_id = auth.jwt() ->> 'sub');

CREATE POLICY "hubspot_sync_cursors_delete" ON public.hubspot_sync_cursors
    FOR DELETE USING (portal_id = auth.jwt() ->> 'sub');

-- hubspot_events_raw: Enable RLS and create policies
ALTER TABLE public.hubspot_events_raw ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hubspot_events_raw_select" ON public.hubspot_events_raw
    FOR SELECT USING (portal_id = auth.jwt() ->> 'sub');

CREATE POLICY "hubspot_events_raw_insert" ON public.hubspot_events_raw
    FOR INSERT WITH CHECK (portal_id = auth.jwt() ->> 'sub');

CREATE POLICY "hubspot_events_raw_update" ON public.hubspot_events_raw
    FOR UPDATE USING (portal_id = auth.jwt() ->> 'sub');

CREATE POLICY "hubspot_events_raw_delete" ON public.hubspot_events_raw
    FOR DELETE USING (portal_id = auth.jwt() ->> 'sub');

-- hubspot_oauth_states: Enable RLS and create policies
ALTER TABLE public.hubspot_oauth_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hubspot_oauth_states_select" ON public.hubspot_oauth_states
    FOR SELECT USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "hubspot_oauth_states_insert" ON public.hubspot_oauth_states
    FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "hubspot_oauth_states_update" ON public.hubspot_oauth_states
    FOR UPDATE USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "hubspot_oauth_states_delete" ON public.hubspot_oauth_states
    FOR DELETE USING (user_id = auth.jwt() ->> 'sub');

-- Enable RLS on other core tables that should have been protected
ALTER TABLE public.presentations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "presentations_select" ON public.presentations
    FOR SELECT USING (user_id::text = auth.jwt() ->> 'sub');

CREATE POLICY "presentations_insert" ON public.presentations
    FOR INSERT WITH CHECK (user_id::text = auth.jwt() ->> 'sub');

CREATE POLICY "presentations_update" ON public.presentations
    FOR UPDATE USING (user_id::text = auth.jwt() ->> 'sub');

CREATE POLICY "presentations_delete" ON public.presentations
    FOR DELETE USING (user_id::text = auth.jwt() ->> 'sub');

-- Enable RLS on presentation_plans (inherits access through presentations)
ALTER TABLE public.presentation_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "presentation_plans_select" ON public.presentation_plans
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.presentations 
            WHERE presentation_id = presentation_plans.presentation_id 
            AND user_id::text = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "presentation_plans_insert" ON public.presentation_plans
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.presentations 
            WHERE presentation_id = presentation_plans.presentation_id 
            AND user_id::text = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "presentation_plans_update" ON public.presentation_plans
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.presentations 
            WHERE presentation_id = presentation_plans.presentation_id 
            AND user_id::text = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "presentation_plans_delete" ON public.presentation_plans
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.presentations 
            WHERE presentation_id = presentation_plans.presentation_id 
            AND user_id::text = auth.jwt() ->> 'sub'
        )
    );

-- Enable RLS on slide_generations (inherits access through presentations)
ALTER TABLE public.slide_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "slide_generations_select" ON public.slide_generations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.presentations 
            WHERE presentation_id = slide_generations.presentation_id 
            AND user_id::text = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "slide_generations_insert" ON public.slide_generations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.presentations 
            WHERE presentation_id = slide_generations.presentation_id 
            AND user_id::text = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "slide_generations_update" ON public.slide_generations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.presentations 
            WHERE presentation_id = slide_generations.presentation_id 
            AND user_id::text = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "slide_generations_delete" ON public.slide_generations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.presentations 
            WHERE presentation_id = slide_generations.presentation_id 
            AND user_id::text = auth.jwt() ->> 'sub'
        )
    );

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON public.profiles
    FOR SELECT USING (id::text = auth.jwt() ->> 'sub');

CREATE POLICY "profiles_insert" ON public.profiles
    FOR INSERT WITH CHECK (id::text = auth.jwt() ->> 'sub');

CREATE POLICY "profiles_update" ON public.profiles
    FOR UPDATE USING (id::text = auth.jwt() ->> 'sub');

CREATE POLICY "profiles_delete" ON public.profiles
    FOR DELETE USING (id::text = auth.jwt() ->> 'sub');
