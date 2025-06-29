BEGIN;

ALTER TABLE public.blueprints
  ADD COLUMN goal TEXT NOT NULL DEFAULT '',
  ADD COLUMN audience TEXT NOT NULL DEFAULT '',
  ADD COLUMN section_sequence TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN theme TEXT NOT NULL DEFAULT '',
  ADD COLUMN slide_library TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN extra_metadata JSONB NOT NULL DEFAULT '{}';

CREATE INDEX idx_blueprints_theme ON public.blueprints(theme);
CREATE INDEX idx_blueprints_section_sequence ON public.blueprints USING GIN(section_sequence);

COMMIT;
