# Integration Architecture

This project exposes a HubSpot integration that runs in both Node and Deno environments.
The reusable handlers live in `src/server/` and are imported by thin wrappers under
`supabase/functions/` when deployed as Supabase Edge Functions.

## Environment Variables

The HubSpot client relies on the following variables which are read in `src/server/config.ts`:

- `HUBSPOT_CLIENT_ID` – OAuth client id of the HubSpot app. When deploying
  edge functions, supply this value using `supabase secrets set`.
- `HUBSPOT_CLIENT_SECRET` – OAuth client secret used when exchanging and refreshing tokens.
- `HUBSPOT_APP_SECRET` – Secret used to validate webhook signatures.
- `SUPABASE_URL` – Base URL of the Supabase instance.
- `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_SERVICE_KEY`) – Service role key used by server code.

## Extending to Other CRMs

All HubSpot logic such as token refresh, webhook handling and search resides in
modules under `src/server/`. These modules are runtime agnostic and only depend on
the configuration file. Additional CRM providers can reuse the same pattern:
create a new set of handlers implementing the required operations and expose them
via your preferred runtime (Edge Function or Express route). Because the Supabase
and OAuth utilities are shared, most of the supporting code can be reused when
adding future integrations.

## Blueprint Examples

A minimal blueprint JSON is provided in `examples/blueprint_minimal.json`. This
file demonstrates the expected field format and is used by automated schema
tests.
