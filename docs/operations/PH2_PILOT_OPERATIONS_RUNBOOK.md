# Phase 2 - Pilot Operations Runbook

## Objective
Operate Guest Guide V2 in staging/production with repeatable smoke validation and tenant-safe checks without changing API contracts.

## Preflight
1. Confirm linked Supabase project ref:
   - `Get-Content supabase/.temp/project-ref`
2. Confirm target property id is set:
   - `UPH_PROPERTY_ID` env var (defaults to `22222222-2222-2222-2222-222222222222`)
3. Confirm anon key is available:
   - `SUPABASE_ANON_KEY`

## Apply migration
1. Migration included in this sprint:
   - `supabase/migrations/202603070029_guest_guide_event_observability_indexes.sql`
2. Apply in staging using your standard Supabase deployment flow.

## Runtime smoke command
Run:

```bash
SUPABASE_PROJECT_REF=oravqykjpgqoiidqnfja \
SUPABASE_ANON_KEY=<staging_anon_key> \
UPH_PROPERTY_ID=22222222-2222-2222-2222-222222222222 \
UPH_LOCALE=pt-BR \
npm run ops:smoke:staging
```

The script validates:
- `get_home_config`
- `get_page`
- `get_index_pages`
- `list_partners`
- `track_event` + idempotency behavior

## Tenant isolation checks (SQL)
Run as read-only validations in staging:

```sql
-- No cross-tenant mismatch in event log
select e.id
from guest_guide.event_log e
join public.properties p on p.id = e.property_id
where e.org_id <> p.org_id
limit 20;
```

```sql
-- Last events for UPH only
select id, property_id, org_id, event_type, created_at
from guest_guide.event_log
where property_id = '22222222-2222-2222-2222-222222222222'
order by created_at desc
limit 20;
```

## Incident fallback
If smoke fails:
1. Capture failing endpoint + payload + status.
2. Roll back edge deployment to the previous known good bundle.
3. Keep DB migration if it is additive (this sprint is additive/index-only).
4. Open blocking issue with reproducible request sample.
