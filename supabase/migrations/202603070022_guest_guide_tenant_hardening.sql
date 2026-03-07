-- Migration: 022_guest_guide_tenant_hardening.sql
-- Date: 2026-03-07
-- Purpose: tighten property-scoped anon access and harden analytics idempotency

BEGIN;

-- Extract requested property context from request headers for anon/property-scoped reads.
CREATE OR REPLACE FUNCTION guest_guide.requested_property_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF((current_setting('request.headers', true)::json ->> 'x-property-id'), '')::uuid;
$$;

-- ==========================
-- Anon property-scoped reads
-- ==========================

DROP POLICY IF EXISTS "home_configs_anon_read" ON guest_guide.home_configs;
CREATE POLICY "home_configs_anon_read"
ON guest_guide.home_configs FOR SELECT
USING (
  deleted_at IS NULL
  AND property_id = guest_guide.requested_property_id()
);

DROP POLICY IF EXISTS "pages_anon_read" ON guest_guide.pages;
CREATE POLICY "pages_anon_read"
ON guest_guide.pages FOR SELECT
USING (
  deleted_at IS NULL
  AND status = 'published'
  AND property_id = guest_guide.requested_property_id()
);

DROP POLICY IF EXISTS "page_routes_anon_read" ON guest_guide.page_routes;
CREATE POLICY "page_routes_anon_read"
ON guest_guide.page_routes FOR SELECT
USING (
  deleted_at IS NULL
  AND property_id = guest_guide.requested_property_id()
  AND EXISTS (
    SELECT 1 FROM guest_guide.pages p
    WHERE p.id = page_id
      AND p.status = 'published'
      AND p.deleted_at IS NULL
      AND p.property_id = guest_guide.requested_property_id()
  )
);

DROP POLICY IF EXISTS "navigation_nodes_anon_read" ON guest_guide.navigation_nodes;
CREATE POLICY "navigation_nodes_anon_read"
ON guest_guide.navigation_nodes FOR SELECT
USING (
  deleted_at IS NULL
  AND is_visible = true
  AND property_id = guest_guide.requested_property_id()
  AND (
    page_id IS NULL
    OR EXISTS (
      SELECT 1 FROM guest_guide.pages p
      WHERE p.id = page_id
        AND p.status = 'published'
        AND p.deleted_at IS NULL
        AND p.property_id = guest_guide.requested_property_id()
    )
  )
);

DROP POLICY IF EXISTS "tags_anon_read" ON guest_guide.tags;
CREATE POLICY "tags_anon_read"
ON guest_guide.tags FOR SELECT
USING (
  deleted_at IS NULL
  AND property_id = guest_guide.requested_property_id()
);

DROP POLICY IF EXISTS "page_tags_anon_read" ON guest_guide.page_tags;
CREATE POLICY "page_tags_anon_read"
ON guest_guide.page_tags FOR SELECT
USING (
  property_id = guest_guide.requested_property_id()
  AND EXISTS (
    SELECT 1 FROM guest_guide.pages p
    WHERE p.id = page_id
      AND p.status = 'published'
      AND p.deleted_at IS NULL
      AND p.property_id = guest_guide.requested_property_id()
  )
);

DROP POLICY IF EXISTS "contacts_anon_read" ON guest_guide.contacts;
CREATE POLICY "contacts_anon_read"
ON guest_guide.contacts FOR SELECT
USING (
  deleted_at IS NULL
  AND property_id = guest_guide.requested_property_id()
);

DROP POLICY IF EXISTS "partners_anon_read" ON guest_guide.partners;
CREATE POLICY "partners_anon_read"
ON guest_guide.partners FOR SELECT
USING (
  deleted_at IS NULL
  AND is_active = true
  AND property_id = guest_guide.requested_property_id()
);

DROP POLICY IF EXISTS "partner_schedules_anon_read" ON guest_guide.partner_schedules;
CREATE POLICY "partner_schedules_anon_read"
ON guest_guide.partner_schedules FOR SELECT
USING (
  property_id = guest_guide.requested_property_id()
  AND EXISTS (
    SELECT 1 FROM guest_guide.partners p
    WHERE p.id = partner_id
      AND p.is_active = true
      AND p.deleted_at IS NULL
      AND p.property_id = guest_guide.requested_property_id()
  )
);

DROP POLICY IF EXISTS "partner_media_anon_read" ON guest_guide.partner_media;
CREATE POLICY "partner_media_anon_read"
ON guest_guide.partner_media FOR SELECT
USING (
  property_id = guest_guide.requested_property_id()
  AND EXISTS (
    SELECT 1 FROM guest_guide.partners p
    WHERE p.id = partner_id
      AND p.is_active = true
      AND p.deleted_at IS NULL
      AND p.property_id = guest_guide.requested_property_id()
  )
);

DROP POLICY IF EXISTS "partner_promotions_anon_read" ON guest_guide.partner_promotions;
CREATE POLICY "partner_promotions_anon_read"
ON guest_guide.partner_promotions FOR SELECT
USING (
  deleted_at IS NULL
  AND is_active = true
  AND property_id = guest_guide.requested_property_id()
  AND (valid_from IS NULL OR valid_from <= NOW())
  AND (valid_until IS NULL OR valid_until >= NOW())
);

DROP POLICY IF EXISTS "background_videos_anon_read" ON guest_guide.background_videos;
CREATE POLICY "background_videos_anon_read"
ON guest_guide.background_videos FOR SELECT
USING (
  deleted_at IS NULL
  AND is_active = true
  AND property_id = guest_guide.requested_property_id()
);

DROP POLICY IF EXISTS "sponsored_slots_anon_read" ON guest_guide.sponsored_slots;
CREATE POLICY "sponsored_slots_anon_read"
ON guest_guide.sponsored_slots FOR SELECT
USING (
  deleted_at IS NULL
  AND is_active = true
  AND property_id = guest_guide.requested_property_id()
  AND (valid_from IS NULL OR valid_from <= NOW())
  AND (valid_until IS NULL OR valid_until >= NOW())
);

DROP POLICY IF EXISTS "partner_display_configs_anon_read" ON guest_guide.partner_display_configs;
CREATE POLICY "partner_display_configs_anon_read"
ON guest_guide.partner_display_configs FOR SELECT
USING (
  deleted_at IS NULL
  AND property_id = guest_guide.requested_property_id()
);

DROP POLICY IF EXISTS "top_sticker_messages_anon_read" ON guest_guide.top_sticker_messages;
CREATE POLICY "top_sticker_messages_anon_read"
ON guest_guide.top_sticker_messages FOR SELECT
USING (
  deleted_at IS NULL
  AND status = 'active'
  AND property_id = guest_guide.requested_property_id()
  AND (valid_from IS NULL OR valid_from <= NOW())
  AND (valid_until IS NULL OR valid_until >= NOW())
);

DROP POLICY IF EXISTS "top_sticker_locales_anon_read" ON guest_guide.top_sticker_locales;
CREATE POLICY "top_sticker_locales_anon_read"
ON guest_guide.top_sticker_locales FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM guest_guide.top_sticker_messages m
    WHERE m.id = message_id
      AND m.deleted_at IS NULL
      AND m.status = 'active'
      AND m.property_id = guest_guide.requested_property_id()
      AND (m.valid_from IS NULL OR m.valid_from <= NOW())
      AND (m.valid_until IS NULL OR m.valid_until >= NOW())
  )
);

-- ==========================
-- Analytics hardening
-- ==========================

WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY property_id, idempotency_key
           ORDER BY created_at ASC, id ASC
         ) AS rn
  FROM guest_guide.event_log
  WHERE idempotency_key IS NOT NULL
)
DELETE FROM guest_guide.event_log e
USING duplicates d
WHERE e.id = d.id
  AND d.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_event_log_property_idempotency_unique
ON guest_guide.event_log(property_id, idempotency_key)
WHERE idempotency_key IS NOT NULL;

DROP POLICY IF EXISTS "event_log_insert_anon" ON guest_guide.event_log;
CREATE POLICY "event_log_insert_anon"
ON guest_guide.event_log FOR INSERT
WITH CHECK (
  property_id IS NOT NULL
  AND org_id IS NOT NULL
  AND org_id = guest_guide.get_org_id_from_property(property_id)
);

COMMIT;
