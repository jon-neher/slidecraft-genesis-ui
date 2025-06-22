
-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create enums with idempotent handling
DO $$ BEGIN
    CREATE TYPE presentation_status_enum AS ENUM ('pending', 'in_progress', 'complete', 'failed');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE plan_status_enum AS ENUM ('pending', 'complete', 'failed');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE slide_status_enum AS ENUM ('pending', 'in_progress', 'complete', 'failed');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create presentations table
CREATE TABLE IF NOT EXISTS public.presentations (
    presentation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    context JSONB,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    generation_status presentation_status_enum NOT NULL DEFAULT 'pending',
    generated_file_url TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create slide_templates table
CREATE TABLE IF NOT EXISTS public.slide_templates (
    template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    prompt_template TEXT NOT NULL,
    output_schema JSONB NOT NULL,
    md_template TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create presentation_plans table
CREATE TABLE IF NOT EXISTS public.presentation_plans (
    plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    presentation_id UUID NOT NULL REFERENCES public.presentations(presentation_id) ON DELETE CASCADE,
    plan_json JSONB,
    status plan_status_enum NOT NULL DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create slide_generations table
CREATE TABLE IF NOT EXISTS public.slide_generations (
    generation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    presentation_id UUID NOT NULL REFERENCES public.presentations(presentation_id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES public.slide_templates(template_id),
    slide_index INT NOT NULL,
    raw_output JSONB,
    parsed_content JSONB,
    md_rendered TEXT,
    generation_status slide_status_enum NOT NULL DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(presentation_id, slide_index)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_presentations_user_status ON public.presentations(user_id, generation_status);
CREATE INDEX IF NOT EXISTS idx_slide_generations_presentation_status ON public.slide_generations(presentation_id, generation_status);

-- Enable Row Level Security on all tables
ALTER TABLE public.presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slide_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presentation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slide_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for presentations table (with proper UUID casting)
CREATE POLICY "presentations_select_for_owner" ON public.presentations
    FOR SELECT USING ((auth.jwt() ->> 'sub')::uuid = user_id);

CREATE POLICY "presentations_insert_for_owner" ON public.presentations
    FOR INSERT WITH CHECK ((auth.jwt() ->> 'sub')::uuid = user_id);

CREATE POLICY "presentations_update_for_owner" ON public.presentations
    FOR UPDATE USING ((auth.jwt() ->> 'sub')::uuid = user_id);

CREATE POLICY "presentations_delete_for_owner" ON public.presentations
    FOR DELETE USING ((auth.jwt() ->> 'sub')::uuid = user_id);

-- RLS Policies for slide_templates table (public read, authenticated write)
CREATE POLICY "slide_templates_public_select" ON public.slide_templates
    FOR SELECT TO public USING (true);

CREATE POLICY "slide_templates_authenticated_insert" ON public.slide_templates
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "slide_templates_authenticated_update" ON public.slide_templates
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "slide_templates_authenticated_delete" ON public.slide_templates
    FOR DELETE TO authenticated USING (true);

-- RLS Policies for presentation_plans table (with proper UUID casting)
CREATE POLICY "presentation_plans_select_for_owner" ON public.presentation_plans
    FOR SELECT USING (
        (auth.jwt() ->> 'sub')::uuid = (
            SELECT user_id FROM public.presentations 
            WHERE presentation_id = presentation_plans.presentation_id
        )
    );

CREATE POLICY "presentation_plans_insert_for_owner" ON public.presentation_plans
    FOR INSERT WITH CHECK (
        (auth.jwt() ->> 'sub')::uuid = (
            SELECT user_id FROM public.presentations 
            WHERE presentation_id = presentation_plans.presentation_id
        )
    );

CREATE POLICY "presentation_plans_update_for_owner" ON public.presentation_plans
    FOR UPDATE USING (
        (auth.jwt() ->> 'sub')::uuid = (
            SELECT user_id FROM public.presentations 
            WHERE presentation_id = presentation_plans.presentation_id
        )
    );

CREATE POLICY "presentation_plans_delete_for_owner" ON public.presentation_plans
    FOR DELETE USING (
        (auth.jwt() ->> 'sub')::uuid = (
            SELECT user_id FROM public.presentations 
            WHERE presentation_id = presentation_plans.presentation_id
        )
    );

-- RLS Policies for slide_generations table (with proper UUID casting)
CREATE POLICY "slide_generations_select_for_owner" ON public.slide_generations
    FOR SELECT USING (
        (auth.jwt() ->> 'sub')::uuid = (
            SELECT user_id FROM public.presentations 
            WHERE presentation_id = slide_generations.presentation_id
        )
    );

CREATE POLICY "slide_generations_insert_for_owner" ON public.slide_generations
    FOR INSERT WITH CHECK (
        (auth.jwt() ->> 'sub')::uuid = (
            SELECT user_id FROM public.presentations 
            WHERE presentation_id = slide_generations.presentation_id
        )
    );

CREATE POLICY "slide_generations_update_for_owner" ON public.slide_generations
    FOR UPDATE USING (
        (auth.jwt() ->> 'sub')::uuid = (
            SELECT user_id FROM public.presentations 
            WHERE presentation_id = slide_generations.presentation_id
        )
    );

CREATE POLICY "slide_generations_delete_for_owner" ON public.slide_generations
    FOR DELETE USING (
        (auth.jwt() ->> 'sub')::uuid = (
            SELECT user_id FROM public.presentations 
            WHERE presentation_id = slide_generations.presentation_id
        )
    );

-- Grant minimal privileges to authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.presentations TO authenticated;
GRANT ALL ON public.slide_templates TO authenticated;
GRANT ALL ON public.presentation_plans TO authenticated;
GRANT ALL ON public.slide_generations TO authenticated;

-- Grant select access to public for slide_templates (as per policy)
GRANT SELECT ON public.slide_templates TO public;

-- Comments for documentation
COMMENT ON TABLE public.presentations IS 'Stores presentation requests and metadata';
COMMENT ON TABLE public.slide_templates IS 'Template definitions for slide generation';
COMMENT ON TABLE public.presentation_plans IS 'Generated presentation plans with slide lists';
COMMENT ON TABLE public.slide_generations IS 'Individual slide generation results and content';

COMMENT ON COLUMN public.presentations.context IS 'JSONB containing customer info, use case, and modifiers';
COMMENT ON COLUMN public.slide_templates.prompt_template IS 'LLM prompt with mustache placeholders';
COMMENT ON COLUMN public.slide_templates.output_schema IS 'JSON Schema for validation of LLM output';
COMMENT ON COLUMN public.slide_templates.md_template IS 'Mustache/Jinja template for rendering Markdown';
COMMENT ON COLUMN public.presentation_plans.plan_json IS 'Generated plan with slide titles and structure';
