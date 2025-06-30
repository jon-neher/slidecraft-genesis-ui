BEGIN;

-- Indexes to speed up slide template queries
CREATE INDEX idx_slide_templates_name ON public.slide_templates(name);

COMMIT;
