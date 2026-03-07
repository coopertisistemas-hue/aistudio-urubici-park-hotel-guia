-- Migration: 023_guest_guide_api_exposure.sql
-- Date: 2026-03-07
-- Purpose: expose guest_guide to PostgREST and grant API roles

BEGIN;

GRANT USAGE ON SCHEMA guest_guide TO anon, authenticated, service_role;

GRANT SELECT ON ALL TABLES IN SCHEMA guest_guide TO anon, authenticated, service_role;
GRANT INSERT ON TABLE guest_guide.event_log TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA guest_guide TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA guest_guide
GRANT SELECT ON TABLES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA guest_guide
GRANT EXECUTE ON FUNCTIONS TO anon, authenticated, service_role;

ALTER ROLE authenticator SET pgrst.db_schemas = 'public,storage,graphql_public,guest_guide';
NOTIFY pgrst, 'reload config';

COMMIT;
