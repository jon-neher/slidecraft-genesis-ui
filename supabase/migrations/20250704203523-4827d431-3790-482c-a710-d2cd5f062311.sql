-- Enable real-time updates for presentations_generated table
ALTER TABLE public.presentations_generated REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.presentations_generated;