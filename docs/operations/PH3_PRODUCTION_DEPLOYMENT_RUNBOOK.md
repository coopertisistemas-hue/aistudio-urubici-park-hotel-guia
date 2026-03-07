# PH3 Production Deployment Runbook

## Purpose
Deterministic production rollout flow for Guest Guide V2, preserving PH0-PH2 compatibility.

## 1) Migration Order
Apply all pending migrations in lexical order from:
- `supabase/migrations/202603050001_create_guest_guide_schema.sql`
- ...
- `supabase/migrations/202603070030_guest_guide_reporting_views.sql`

Operational rule:
1. Validate target project ref before apply (`supabase/.temp/project-ref`).
2. Apply migrations in sequence without skipping numbers.
3. Confirm each migration status before next step.

## 2) Edge Function Deployment
Deploy/update the following functions:
- `get_home_config`
- `get_page`
- `get_index_pages`
- `list_partners`
- `track_event`
- `get_kpi_summary`

Deployment rule:
1. Deploy from current release commit.
2. Validate function list in dashboard/CLI after deployment.

## 3) Environment Variables
Required at edge/runtime:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Required for operational smoke command:
- `SUPABASE_PROJECT_REF`
- `SUPABASE_ANON_KEY`
- `UPH_PROPERTY_ID`
- `UPH_LOCALE`

## 4) Schema Exposure Verification
Confirm `guest_guide` is exposed and grants are present:
- Migration `202603070023_guest_guide_api_exposure.sql` applied.
- `pgrst.db_schemas` contains `guest_guide`.
- `anon/authenticated/service_role` have expected usage/select/execute grants.

Suggested checks:
```sql
select nspname from pg_namespace where nspname = 'guest_guide';
```

```sql
select routine_name
from information_schema.routines
where routine_schema = 'guest_guide'
  and routine_name in ('track_event', 'get_kpi_summary');
```

## 5) Smoke Tests
Use operational command:
```bash
npm run ops:smoke:staging
```

Coverage must include:
- `get_home_config`
- `get_page`
- `get_index_pages`
- `list_partners`
- `track_event`
- `get_kpi_summary`

For `get_kpi_summary`, execute complementary call:
```bash
curl -X POST "https://${SUPABASE_PROJECT_REF}.supabase.co/functions/v1/get_kpi_summary" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "x-property-id: ${UPH_PROPERTY_ID}" \
  -d '{}'
```

Expected shape:
```json
{
  "kpi": {
    "page_views_today": 0,
    "top_pages": [],
    "cta_clicks_today": 0,
    "partner_views_today": 0,
    "video_plays_today": 0
  }
}
```

## 6) Rollback Notes
- Edge rollback: redeploy previous known-good function bundle.
- Database rollback: create forward-fix migration; do not mutate history.
- Keep compatibility with PH0-PH2 contracts.
