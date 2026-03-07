# PH2-SP1 - Pilot Operations & Observability

## Scope
- Add operational smoke validation script for staging edge endpoints.
- Add additive DB index migration for analytics/event query performance.
- Add phase runbook with tenant isolation checks.

## Out of scope
- API contract changes
- Architecture changes
- New product features

## Files changed
- `package.json`
- `scripts/ops/staging-smoke.mjs`
- `supabase/migrations/202603070029_guest_guide_event_observability_indexes.sql`
- `docs/operations/PH2_PILOT_OPERATIONS_RUNBOOK.md`
- `docs/qa/PH2_SP1_QA_REPORT.md`

## Definition of Done
- QA gates pass (`type-check`, `lint`, `build`).
- Smoke command available for staging runtime checks.
- Migration is additive and idempotent.
