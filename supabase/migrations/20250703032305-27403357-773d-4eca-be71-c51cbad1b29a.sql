-- Enable real-time for the new tables
ALTER TABLE public.presentations_input REPLICA IDENTITY FULL;
ALTER TABLE public.presentation_jobs REPLICA IDENTITY FULL;

-- Add tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.presentations_input;
ALTER PUBLICATION supabase_realtime ADD TABLE public.presentation_jobs;