# PH2-SP2 - KPI & Reporting Layer

## Scope
- Add analytics reporting views derived from `guest_guide.event_log`.
- Add RPC `guest_guide.get_kpi_summary(p_property_id uuid)`.
- Add edge function `get_kpi_summary` using tenant header `x-property-id`.

## Implemented artifacts
- Migration: `supabase/migrations/202603070030_guest_guide_reporting_views.sql`
- Edge Function: `supabase/functions/get_kpi_summary/index.ts`
- QA report: `docs/qa/PH2_SP2_QA_REPORT.md`

## Rules compliance
- Additive and idempotent SQL (`CREATE OR REPLACE`, grants).
- No changes to existing edge contracts.
- No frontend behavior changes.
- No RLS changes.

## KPI contract
RPC output JSON:
- `page_views_today`
- `top_pages`
- `cta_clicks_today`
- `partner_views_today`
- `video_plays_today`
