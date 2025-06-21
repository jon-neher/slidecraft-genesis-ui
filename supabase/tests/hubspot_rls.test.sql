CREATE EXTENSION IF NOT EXISTS pgtap;

BEGIN;
SET search_path TO public, pgtap;

SELECT plan(10);

-- Clean slate
DELETE FROM hubspot_contacts_cache;

-- user_A session
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"user_A"}', true);

SELECT lives_ok($$INSERT INTO hubspot_contacts_cache(portal_id, id, properties, updated_at)
                 VALUES ('user_A', 'A1', '{"firstname":"Alice"}', now())$$,
              'user_A can insert own row');

SELECT throws_ok($$INSERT INTO hubspot_contacts_cache(portal_id, id, properties, updated_at)
                   VALUES ('user_B', 'FAIL1', '{"firstname":"Mallory"}', now())$$,
                '42501', 'user_A cannot insert for user_B');

SELECT results_eq(
  $$SELECT portal_id FROM hubspot_contacts_cache ORDER BY id$$,
  $$VALUES ('user_A')$$,
  'user_A selects only own rows');

-- user_B session
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"user_B"}', true);

SELECT lives_ok($$INSERT INTO hubspot_contacts_cache(portal_id, id, properties, updated_at)
                 VALUES ('user_B', 'B1', '{"firstname":"Bob"}', now())$$,
              'user_B can insert own row');

SELECT throws_ok($$INSERT INTO hubspot_contacts_cache(portal_id, id, properties, updated_at)
                   VALUES ('user_A', 'FAIL2', '{"firstname":"Mallory"}', now())$$,
                '42501', 'user_B cannot insert for user_A');

SELECT results_eq(
  $$SELECT portal_id FROM hubspot_contacts_cache WHERE portal_id = 'user_B' ORDER BY id$$,
  $$VALUES ('user_B')$$,
  'user_B selects only own rows');

-- anonymous session
SET LOCAL ROLE anon;
SELECT set_config('request.jwt.claims', NULL, true);

SELECT throws_ok($$SELECT * FROM hubspot_contacts_cache$$, '42501', 'anon cannot select');

-- search_vector policy check
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"user_A"}', true);
SELECT lives_ok($$INSERT INTO hubspot_contacts_cache(portal_id, id, properties, updated_at)
                 VALUES ('user_A', 'A2', '{"firstname":"Alice","lastname":"Alpha"}', now())$$,
              'user_A insert second row');

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"user_B"}', true);
SELECT lives_ok($$INSERT INTO hubspot_contacts_cache(portal_id, id, properties, updated_at)
                 VALUES ('user_B', 'B2', '{"firstname":"Alice","lastname":"Beta"}', now())$$,
              'user_B insert second row');

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"user_A"}', true);
SELECT results_eq(
  $$SELECT id FROM hubspot_contacts_cache WHERE search_vector @@ plainto_tsquery('simple','Alice') ORDER BY id$$,
  $$VALUES ('A1'), ('A2')$$,
  'search_vector restricted to portal_id');

ROLLBACK;
