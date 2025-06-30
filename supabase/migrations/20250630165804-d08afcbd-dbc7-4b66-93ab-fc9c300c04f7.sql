
-- Create section_templates table referenced in decks_render.ts
CREATE TABLE public.section_templates (
  section_id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  default_templates TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create themes table referenced in decks_render.ts  
CREATE TABLE public.themes (
  theme_id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  css TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert some default section templates
INSERT INTO public.section_templates (section_id, name, description, default_templates) VALUES
('intro', 'Introduction', 'Opening slide section', '{"intro-template-1", "intro-template-2"}'),
('solution', 'Solution', 'Solution presentation section', '{"solution-template-1"}'),
('problem', 'Problem', 'Problem statement section', '{"problem-template-1"}'),
('conclusion', 'Conclusion', 'Closing section', '{"conclusion-template-1"}');

-- Insert some default themes
INSERT INTO public.themes (theme_id, name, description, css) VALUES
('default', 'Default Theme', 'Standard presentation theme', '.reveal { font-family: Arial, sans-serif; } h1, h2 { color: #333; }'),
('brand', 'Brand Theme', 'Company branded theme', '.brand { background: linear-gradient(45deg, #1e3a8a, #3b82f6); color: white; }'),
('minimal', 'Minimal Theme', 'Clean minimal design', '.minimal { background: white; color: #374151; font-family: system-ui; }');

-- Add RLS policies for section_templates (public read)
ALTER TABLE public.section_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Section templates are viewable by everyone" ON public.section_templates FOR SELECT USING (true);

-- Add RLS policies for themes (public read)  
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Themes are viewable by everyone" ON public.themes FOR SELECT USING (true);
