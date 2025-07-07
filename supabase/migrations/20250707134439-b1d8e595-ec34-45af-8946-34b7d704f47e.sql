-- Create a simple function to extract user ID from JWT for edge functions
CREATE OR REPLACE FUNCTION public.auth_jwt_sub()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT auth.jwt() ->> 'sub';
$$;