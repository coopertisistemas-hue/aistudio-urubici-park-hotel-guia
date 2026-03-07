# PH2-SP3 - Analytics Integrity

## Goal
Validate and harden end-to-end analytics integrity for pilot operation flows, without changing architecture or frontend behavior.

## Implemented
1. Tracking pipeline compatibility update (additive):
   - `track_event` now accepts `video_play` in addition to existing `video_start`/`video_complete`.
2. Service layer typing update (additive):
   - `EventTypes` includes `VIDEO_PLAY`.
   - `trackVideoEvent` accepts `video_play`.

## Flow coverage validation
- Homepage: `trackPageView('home')` is emitted in `src/pages/home/page.tsx`.
- Index pages: `trackPageView(indexSlug, parentId?)` is emitted in `src/components/feature/DynamicIndexPage.tsx`.
- Detail pages: `trackPageView(slug, pageId)` is emitted in:
  - `src/components/feature/DynamicDetailPage.tsx`
  - `src/components/feature/DynamicPage.tsx`
- CTA buttons: `trackCtaClick(...)` is emitted in:
  - `src/components/feature/DynamicDetailPage.tsx`
  - `src/components/feature/DynamicPage.tsx`
- Partner pages:
  - No dedicated partner page component is currently mounted in router.
  - `partner_view` is supported in API/service/edge and can be validated through runtime event writes when partner UI is enabled.

## Verification queries
```sql
SELECT event_type, count(*)
FROM guest_guide.event_log
GROUP BY event_type
ORDER BY event_type;
```

```sql
SELECT property_id, event_type, count(*)
FROM guest_guide.event_log
WHERE created_at >= now() - interval '1 day'
GROUP BY property_id, event_type
ORDER BY property_id, event_type;
```

```sql
SELECT id, property_id, org_id, event_type, metadata, created_at
FROM guest_guide.event_log
WHERE event_type IN ('page_view', 'cta_click', 'partner_view', 'video_play', 'video_start', 'video_complete')
ORDER BY created_at DESC
LIMIT 100;
```
