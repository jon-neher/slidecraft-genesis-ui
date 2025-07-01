-- Migration summary:
-- 1. Rename `presentations` to `presentations_generated`.
-- 2. Create `presentations_revisions` for versioned slide data.
-- 3. Add RLS so all auth users can read; only service role can modify
--    `presentations_generated`, while owners manage their revisions.
-- Manual follow-up: verify these policies in Supabase and update any
-- service role functions to write to the new table names.

BEGIN;

ALTER TABLE public.presentations RENAME TO presentations_generated;

CREATE TABLE public.presentations_revisions (
    presentation_id UUID NOT NULL REFERENCES public.presentations_generated(presentation_id),
    version INT NOT NULL,
    slides JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID NOT NULL,
    PRIMARY KEY (presentation_id, version)
);

ALTER TABLE public.presentations_generated ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presentations_revisions ENABLE ROW LEVEL SECURITY;

-- presentations_generated policies
CREATE POLICY presentations_generated_select_auth ON public.presentations_generated
    FOR SELECT TO authenticated USING (true);

CREATE POLICY presentations_generated_insert_service ON public.presentations_generated
    FOR INSERT TO authenticated WITH CHECK (auth.role() = 'service_role');

CREATE POLICY presentations_generated_update_service ON public.presentations_generated
    FOR UPDATE TO authenticated USING (auth.role() = 'service_role');

CREATE POLICY presentations_generated_delete_service ON public.presentations_generated
    FOR DELETE TO authenticated USING (auth.role() = 'service_role');

-- presentations_revisions policies
CREATE POLICY presentations_revisions_select_auth ON public.presentations_revisions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY presentations_revisions_insert_owner ON public.presentations_revisions
    FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY presentations_revisions_update_owner ON public.presentations_revisions
    FOR UPDATE TO authenticated USING (created_by = auth.uid());

CREATE POLICY presentations_revisions_delete_owner ON public.presentations_revisions
    FOR DELETE TO authenticated USING (created_by = auth.uid());

COMMENT ON TABLE public.presentations_generated IS 'Generated presentation metadata and status';
COMMENT ON TABLE public.presentations_revisions IS 'Versioned slide data for each presentation';

COMMIT;
