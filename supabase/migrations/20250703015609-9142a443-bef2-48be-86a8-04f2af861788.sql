-- Fix Clerk User ID type mismatch by changing uuid columns to text

-- Update presentations_generated table
ALTER TABLE public.presentations_generated ALTER COLUMN user_id TYPE text;

-- Update blueprints table  
ALTER TABLE public.blueprints ALTER COLUMN user_id TYPE text;

-- Update presentation_plans RLS policies to use text comparison
DROP POLICY IF EXISTS "presentation_plans_select_for_owner" ON public.presentation_plans;
DROP POLICY IF EXISTS "presentation_plans_insert_for_owner" ON public.presentation_plans;
DROP POLICY IF EXISTS "presentation_plans_update_for_owner" ON public.presentation_plans;
DROP POLICY IF EXISTS "presentation_plans_delete_for_owner" ON public.presentation_plans;

CREATE POLICY "presentation_plans_select_for_owner" ON public.presentation_plans
    FOR SELECT USING (
        (auth.jwt() ->> 'sub') = (
            SELECT user_id::text 
            FROM presentations_generated 
            WHERE presentation_id = presentation_plans.presentation_id
        )
    );

CREATE POLICY "presentation_plans_insert_for_owner" ON public.presentation_plans
    FOR INSERT WITH CHECK (
        (auth.jwt() ->> 'sub') = (
            SELECT user_id::text 
            FROM presentations_generated 
            WHERE presentation_id = presentation_plans.presentation_id
        )
    );

CREATE POLICY "presentation_plans_update_for_owner" ON public.presentation_plans
    FOR UPDATE USING (
        (auth.jwt() ->> 'sub') = (
            SELECT user_id::text 
            FROM presentations_generated 
            WHERE presentation_id = presentation_plans.presentation_id
        )
    );

CREATE POLICY "presentation_plans_delete_for_owner" ON public.presentation_plans
    FOR DELETE USING (
        (auth.jwt() ->> 'sub') = (
            SELECT user_id::text 
            FROM presentations_generated 
            WHERE presentation_id = presentation_plans.presentation_id
        )
    );

-- Update slide_generations RLS policies to use text comparison
DROP POLICY IF EXISTS "slide_generations_select_for_owner" ON public.slide_generations;
DROP POLICY IF EXISTS "slide_generations_insert_for_owner" ON public.slide_generations;
DROP POLICY IF EXISTS "slide_generations_update_for_owner" ON public.slide_generations;
DROP POLICY IF EXISTS "slide_generations_delete_for_owner" ON public.slide_generations;

CREATE POLICY "slide_generations_select_for_owner" ON public.slide_generations
    FOR SELECT USING (
        (auth.jwt() ->> 'sub') = (
            SELECT user_id::text 
            FROM presentations_generated 
            WHERE presentation_id = slide_generations.presentation_id
        )
    );

CREATE POLICY "slide_generations_insert_for_owner" ON public.slide_generations
    FOR INSERT WITH CHECK (
        (auth.jwt() ->> 'sub') = (
            SELECT user_id::text 
            FROM presentations_generated 
            WHERE presentation_id = slide_generations.presentation_id
        )
    );

CREATE POLICY "slide_generations_update_for_owner" ON public.slide_generations
    FOR UPDATE USING (
        (auth.jwt() ->> 'sub') = (
            SELECT user_id::text 
            FROM presentations_generated 
            WHERE presentation_id = slide_generations.presentation_id
        )
    );

CREATE POLICY "slide_generations_delete_for_owner" ON public.slide_generations
    FOR DELETE USING (
        (auth.jwt() ->> 'sub') = (
            SELECT user_id::text 
            FROM presentations_generated 
            WHERE presentation_id = slide_generations.presentation_id
        )
    );

-- Update presentations_generated RLS policies to use text comparison  
DROP POLICY IF EXISTS "presentations_select_for_owner" ON public.presentations_generated;
DROP POLICY IF EXISTS "presentations_insert_for_owner" ON public.presentations_generated;
DROP POLICY IF EXISTS "presentations_update_for_owner" ON public.presentations_generated;
DROP POLICY IF EXISTS "presentations_delete_for_owner" ON public.presentations_generated;

CREATE POLICY "presentations_select_for_owner" ON public.presentations_generated
    FOR SELECT USING (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "presentations_insert_for_owner" ON public.presentations_generated
    FOR INSERT WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "presentations_update_for_owner" ON public.presentations_generated
    FOR UPDATE USING (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "presentations_delete_for_owner" ON public.presentations_generated
    FOR DELETE USING (user_id = (auth.jwt() ->> 'sub'));

-- Update blueprints RLS policies to use text comparison
DROP POLICY IF EXISTS "Users can view their own blueprints and defaults" ON public.blueprints;
DROP POLICY IF EXISTS "Users can create their own blueprints" ON public.blueprints;
DROP POLICY IF EXISTS "Users can update their own blueprints" ON public.blueprints;
DROP POLICY IF EXISTS "Users can delete their own blueprints" ON public.blueprints;

CREATE POLICY "Users can view their own blueprints and defaults" ON public.blueprints
    FOR SELECT USING (is_default = true OR user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can create their own blueprints" ON public.blueprints
    FOR INSERT WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update their own blueprints" ON public.blueprints
    FOR UPDATE USING (user_id = (auth.jwt() ->> 'sub') AND is_default = false);

CREATE POLICY "Users can delete their own blueprints" ON public.blueprints
    FOR DELETE USING (user_id = (auth.jwt() ->> 'sub') AND is_default = false);