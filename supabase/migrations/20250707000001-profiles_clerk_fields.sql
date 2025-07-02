-- Add Clerk fields to existing profiles table
ALTER TABLE public.profiles
  ADD COLUMN avatar_url TEXT,
  ADD COLUMN metadata JSONB;

-- Ensure updated_at timestamp updates on change
CREATE OR REPLACE FUNCTION public.update_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_timestamp();
