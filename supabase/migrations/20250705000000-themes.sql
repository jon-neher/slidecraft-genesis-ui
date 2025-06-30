BEGIN;

-- Table to store brand themes
CREATE TABLE public.themes (
    theme_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    css TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
