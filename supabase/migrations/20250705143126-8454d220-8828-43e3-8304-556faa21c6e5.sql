-- Fix presentations_revisions.created_by column type for Clerk integration
-- Change from uuid to text to match Clerk user IDs

BEGIN;

-- Drop existing RLS policies that reference the column
DROP POLICY IF EXISTS "presentations_revisions_insert_owner" ON public.presentations_revisions;
DROP POLICY IF EXISTS "presentations_revisions_update_owner" ON public.presentations_revisions;
DROP POLICY IF EXISTS "presentations_revisions_delete_owner" ON public.presentations_revisions;

-- Change the column type from uuid to text
ALTER TABLE public.presentations_revisions 
ALTER COLUMN created_by TYPE text;

-- Recreate RLS policies with correct Clerk authentication
CREATE POLICY "presentations_revisions_insert_owner" 
ON public.presentations_revisions 
FOR INSERT 
WITH CHECK (created_by = (auth.jwt() ->> 'sub'));

CREATE POLICY "presentations_revisions_update_owner" 
ON public.presentations_revisions 
FOR UPDATE 
USING (created_by = (auth.jwt() ->> 'sub'));

CREATE POLICY "presentations_revisions_delete_owner" 
ON public.presentations_revisions 
FOR DELETE 
USING (created_by = (auth.jwt() ->> 'sub'));

COMMENT ON COLUMN public.presentations_revisions.created_by IS 'Clerk user ID (text format)';

COMMIT;