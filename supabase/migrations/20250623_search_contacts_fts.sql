CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE hubspot_contacts_cache
  ADD COLUMN IF NOT EXISTS search_vector tsvector
             GENERATED ALWAYS AS
             (to_tsvector('simple',
                coalesce(properties->>'firstname','') || ' ' ||
                coalesce(properties->>'lastname','')  || ' ' ||
                coalesce(properties->>'email','')))
             STORED;

CREATE INDEX IF NOT EXISTS contacts_cache_trgm
  ON hubspot_contacts_cache USING gin (search_vector);
