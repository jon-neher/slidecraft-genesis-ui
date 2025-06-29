BEGIN;

-- Create blueprints table to store user and default deck blueprints
CREATE TABLE public.blueprints (
    blueprint_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    blueprint JSONB NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blueprints_user ON public.blueprints(user_id);

ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own blueprints and public defaults
CREATE POLICY "blueprints_select" ON public.blueprints
    FOR SELECT USING (is_default OR user_id = (auth.jwt() ->> 'sub')::uuid);

-- Allow inserting blueprints owned by the user
CREATE POLICY "blueprints_insert" ON public.blueprints
    FOR INSERT WITH CHECK (user_id = (auth.jwt() ->> 'sub')::uuid AND NOT is_default);

-- Allow updating own non-default blueprints
CREATE POLICY "blueprints_update" ON public.blueprints
    FOR UPDATE USING (user_id = (auth.jwt() ->> 'sub')::uuid AND NOT is_default);

-- Allow deleting own non-default blueprints
CREATE POLICY "blueprints_delete" ON public.blueprints
    FOR DELETE USING (user_id = (auth.jwt() ->> 'sub')::uuid AND NOT is_default);

GRANT USAGE, SELECT, INSERT, UPDATE, DELETE ON public.blueprints TO authenticated;
GRANT SELECT ON public.blueprints TO anon;

COMMENT ON TABLE public.blueprints IS 'Deck blueprints for generating presentations';

COMMIT;
