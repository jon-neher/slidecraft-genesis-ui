-- HubSpot integration tables

-- Table to store OAuth tokens for each HubSpot portal
CREATE TABLE public.hubspot_tokens (
  portal_id TEXT PRIMARY KEY,
  access_token TEXT ENCRYPTED WITH vault,
  refresh_token TEXT ENCRYPTED WITH vault,
  expires_at TIMESTAMPTZ,
  scope TEXT[]
);

-- Comments for documentation
COMMENT ON TABLE public.hubspot_tokens IS 'Stores HubSpot OAuth tokens per portal';
COMMENT ON COLUMN public.hubspot_tokens.portal_id IS 'maps to Clerk user sub';
COMMENT ON COLUMN public.hubspot_tokens.access_token IS 'Encrypted access token';
COMMENT ON COLUMN public.hubspot_tokens.refresh_token IS 'Encrypted refresh token';
COMMENT ON COLUMN public.hubspot_tokens.expires_at IS 'Expiration time of access token';
COMMENT ON COLUMN public.hubspot_tokens.scope IS 'Granted OAuth scopes';

ALTER TABLE public.hubspot_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portal access" ON public.hubspot_tokens
  FOR ALL USING (portal_id = auth.jwt()->>'sub')
  WITH CHECK (portal_id = auth.jwt()->>'sub');

-- Raw events received from HubSpot webhooks
CREATE TABLE public.hubspot_events_raw (
  id BIGSERIAL PRIMARY KEY,
  portal_id TEXT,
  raw JSONB,
  received_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.hubspot_events_raw IS 'Stores raw webhook events from HubSpot';
COMMENT ON COLUMN public.hubspot_events_raw.portal_id IS 'Portal identifier';
COMMENT ON COLUMN public.hubspot_events_raw.raw IS 'Full webhook payload';
COMMENT ON COLUMN public.hubspot_events_raw.received_at IS 'Time the event was received';

ALTER TABLE public.hubspot_events_raw ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portal access" ON public.hubspot_events_raw
  FOR ALL USING (portal_id = auth.jwt()->>'sub')
  WITH CHECK (portal_id = auth.jwt()->>'sub');

-- Cache of HubSpot contacts
CREATE TABLE public.hubspot_contacts_cache (
  portal_id TEXT,
  id TEXT,
  properties JSONB,
  updated_at TIMESTAMPTZ,
  PRIMARY KEY (portal_id, id)
);

COMMENT ON TABLE public.hubspot_contacts_cache IS 'Cached HubSpot contact records';
COMMENT ON COLUMN public.hubspot_contacts_cache.portal_id IS 'Portal identifier';
COMMENT ON COLUMN public.hubspot_contacts_cache.id IS 'HubSpot contact id';
COMMENT ON COLUMN public.hubspot_contacts_cache.properties IS 'Contact properties from HubSpot';
COMMENT ON COLUMN public.hubspot_contacts_cache.updated_at IS 'Last time the record was updated';

ALTER TABLE public.hubspot_contacts_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portal access" ON public.hubspot_contacts_cache
  FOR ALL USING (portal_id = auth.jwt()->>'sub')
  WITH CHECK (portal_id = auth.jwt()->>'sub');

-- Sync cursors for incremental HubSpot imports
CREATE TABLE public.hubspot_sync_cursors (
  portal_id TEXT,
  object_type TEXT,
  hs_timestamp TIMESTAMPTZ,
  PRIMARY KEY (portal_id, object_type)
);

COMMENT ON TABLE public.hubspot_sync_cursors IS 'Tracks last sync timestamp per object type';
COMMENT ON COLUMN public.hubspot_sync_cursors.portal_id IS 'Portal identifier';
COMMENT ON COLUMN public.hubspot_sync_cursors.object_type IS 'Type of object being synced';
COMMENT ON COLUMN public.hubspot_sync_cursors.hs_timestamp IS 'Timestamp from HubSpot for last sync';

ALTER TABLE public.hubspot_sync_cursors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portal access" ON public.hubspot_sync_cursors
  FOR ALL USING (portal_id = auth.jwt()->>'sub')
  WITH CHECK (portal_id = auth.jwt()->>'sub');
