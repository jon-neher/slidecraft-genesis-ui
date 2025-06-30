BEGIN;

CREATE TABLE public.section_templates (
    section_id TEXT PRIMARY KEY,
    purpose TEXT NOT NULL,
    default_templates TEXT[] NOT NULL,
    editable BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_section_templates_editable ON public.section_templates USING BTREE (editable);

COMMIT;
