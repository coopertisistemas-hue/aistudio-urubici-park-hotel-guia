# PH1A Sprint 2 - Edge Function and Schema Alignment

Date: 2026-03-07
Branch: codex/phase-1a-pilot-readiness-fixes

## Scope
- Enforced explicit `guest_guide` schema profile in all Guest Guide edge functions.
- Updated `get_page` to always load page metadata from `pages` after route resolution.
- Updated `get_index_pages` to prefer `pages.parent_id` hierarchy and keep legacy prefix fallback for compatibility.
- Updated `get_home_config` to use DB helper functions for background video and locale-valid stickers.
- Updated `track_event` to use DB-side `guest_guide.track_event` RPC path with idempotency behavior.

## Files Changed
- supabase/functions/get_home_config/index.ts
- supabase/functions/get_page/index.ts
- supabase/functions/get_index_pages/index.ts
- supabase/functions/list_partners/index.ts
- supabase/functions/track_event/index.ts

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
- Edge-function runtime smoke not executed in deployed Supabase environment in this sprint.
- Validation performed through static code path checks and gate success.
