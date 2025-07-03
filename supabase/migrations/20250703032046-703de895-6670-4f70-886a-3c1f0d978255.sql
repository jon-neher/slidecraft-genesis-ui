-- Create presentations_input table to capture user requirements
CREATE TABLE public.presentations_input (
  input_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  context JSONB,
  template_preferences JSONB,
  audience_info JSONB,
  presentation_type TEXT,
  slide_count_preference INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Create presentation_jobs table for orchestration
CREATE TABLE public.presentation_jobs (
  job_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  input_id UUID NOT NULL REFERENCES public.presentations_input(input_id) ON DELETE CASCADE,
  presentation_id UUID REFERENCES public.presentations_generated(presentation_id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  processing_steps JSONB,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign keys to presentations_generated
ALTER TABLE public.presentations_generated 
ADD COLUMN input_id UUID REFERENCES public.presentations_input(input_id) ON DELETE SET NULL,
ADD COLUMN job_id UUID REFERENCES public.presentation_jobs(job_id) ON DELETE SET NULL;

-- Enable RLS on new tables
ALTER TABLE public.presentations_input ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presentation_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for presentations_input
CREATE POLICY "presentations_input_select_for_owner" 
ON public.presentations_input 
FOR SELECT 
USING (user_id = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "presentations_input_insert_for_owner" 
ON public.presentations_input 
FOR INSERT 
WITH CHECK (user_id = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "presentations_input_update_for_owner" 
ON public.presentations_input 
FOR UPDATE 
USING (user_id = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "presentations_input_delete_for_owner" 
ON public.presentations_input 
FOR DELETE 
USING (user_id = (auth.jwt() ->> 'sub'::text));

-- Create RLS policies for presentation_jobs
CREATE POLICY "presentation_jobs_select_for_owner" 
ON public.presentation_jobs 
FOR SELECT 
USING ((auth.jwt() ->> 'sub'::text) = (
  SELECT pi.user_id 
  FROM public.presentations_input pi 
  WHERE pi.input_id = presentation_jobs.input_id
));

CREATE POLICY "presentation_jobs_insert_for_owner" 
ON public.presentation_jobs 
FOR INSERT 
WITH CHECK ((auth.jwt() ->> 'sub'::text) = (
  SELECT pi.user_id 
  FROM public.presentations_input pi 
  WHERE pi.input_id = presentation_jobs.input_id
));

CREATE POLICY "presentation_jobs_update_for_owner" 
ON public.presentation_jobs 
FOR UPDATE 
USING ((auth.jwt() ->> 'sub'::text) = (
  SELECT pi.user_id 
  FROM public.presentations_input pi 
  WHERE pi.input_id = presentation_jobs.input_id
));

-- Add service role policies for job processing
CREATE POLICY "presentation_jobs_service_update" 
ON public.presentation_jobs 
FOR UPDATE 
USING (auth.role() = 'service_role'::text);

CREATE POLICY "presentations_input_service_update" 
ON public.presentations_input 
FOR UPDATE 
USING (auth.role() = 'service_role'::text);

-- Create indexes for performance
CREATE INDEX idx_presentations_input_user_id ON public.presentations_input(user_id);
CREATE INDEX idx_presentations_input_status ON public.presentations_input(status);
CREATE INDEX idx_presentation_jobs_input_id ON public.presentation_jobs(input_id);
CREATE INDEX idx_presentation_jobs_status ON public.presentation_jobs(status);
CREATE INDEX idx_presentation_jobs_created_at ON public.presentation_jobs(created_at);