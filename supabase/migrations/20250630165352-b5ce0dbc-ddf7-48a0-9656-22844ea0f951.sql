
-- Create blueprints table that's referenced in the server code
CREATE TABLE public.blueprints (
  blueprint_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  goal TEXT,
  audience TEXT,
  section_sequence TEXT[],
  theme TEXT,
  slide_library TEXT[],
  extra_metadata JSONB,
  blueprint JSONB
);

-- Add RLS policies for blueprints
ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own blueprints and defaults"
  ON public.blueprints
  FOR SELECT
  USING (is_default = true OR user_id::text = auth.jwt() ->> 'sub');

CREATE POLICY "Users can create their own blueprints"
  ON public.blueprints
  FOR INSERT
  WITH CHECK (user_id::text = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own blueprints"
  ON public.blueprints
  FOR UPDATE
  USING (user_id::text = auth.jwt() ->> 'sub' AND is_default = false);

CREATE POLICY "Users can delete their own blueprints"
  ON public.blueprints
  FOR DELETE
  USING (user_id::text = auth.jwt() ->> 'sub' AND is_default = false);
