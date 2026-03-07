# Pilot Go-Live Checklist

## Release Scope
- [ ] Release commit/tag approved
- [ ] Branch `codex/phase-1a-pilot-readiness-fixes` synced in CI/CD

## Database
- [ ] All migrations applied in order up to latest file
- [ ] `guest_guide` schema exposure validated
- [ ] Reporting view migration (`202603070030`) applied

## Edge Functions
- [ ] `get_home_config` deployed
- [ ] `get_page` deployed
- [ ] `get_index_pages` deployed
- [ ] `list_partners` deployed
- [ ] `track_event` deployed
- [ ] `get_kpi_summary` deployed

## Tenant and Seed
- [ ] Tenant seed executed for target property
- [ ] `property_id` verified in runtime headers and payload behavior
- [ ] No cross-tenant leakage in smoke checks

## Experience Validation
- [ ] Homepage validated (`get_home_config`)
- [ ] Dynamic detail page validated (`get_page`)
- [ ] Dynamic index page validated (`get_index_pages`)
- [ ] Partner listing validated (`list_partners`)
- [ ] Background video selection validated
- [ ] Stickers validated (locale + validity)

## Analytics Validation
- [ ] `track_event` writes valid rows
- [ ] Idempotency behavior confirmed
- [ ] KPI endpoint returns expected shape (`get_kpi_summary`)
- [ ] Event types verified: `page_view`, `cta_click`, `partner_view`, `video_play|video_start`, `video_complete`

## QA Gates
- [ ] `npm run type-check` PASS
- [ ] `npm run lint` PASS
- [ ] `npm run build` PASS

## Sign-off
- [ ] Technical sign-off
- [ ] Operations sign-off
- [ ] Pilot go-live approval
