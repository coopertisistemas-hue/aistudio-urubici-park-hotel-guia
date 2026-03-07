# PH1A Sprint 3 - Tenant and Analytics Hardening

Date: 2026-03-07
Branch: codex/phase-1a-pilot-readiness-fixes

## Scope
- Added hardening migration for property-scoped anon reads using request header context.
- Tightened weak RLS clauses that previously accepted `property_id IS NOT NULL`.
- Added event dedup cleanup + unique idempotency index on `(property_id, idempotency_key)`.
- Tightened event insert policy to enforce `org_id` consistency against `property_id`.

## Files Changed
- supabase/migrations/202603070022_guest_guide_tenant_hardening.sql

## QA Evidence
Commands executed in repo root:
- npm run type-check
- npm run lint
- npm run build

Results:
- type-check: PASS
- lint: PASS
- build: PASS

## Runtime Validation
- No live Supabase migration apply executed in this sprint.
- Validation performed via migration review + application gate success.
