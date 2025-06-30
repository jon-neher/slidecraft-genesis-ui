BEGIN;

-- Indexes to speed up blueprint queries
CREATE INDEX idx_blueprints_is_default ON public.blueprints(is_default);
CREATE INDEX idx_blueprints_goal ON public.blueprints(goal);

COMMIT;
