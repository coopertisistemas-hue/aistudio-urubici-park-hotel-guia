-- Migration: 024_guest_guide_policy_reset_and_anon_scope.sql
-- Date: 2026-03-07
-- Purpose: remove legacy permissive anon policies and enforce property-scoped anon access

BEGIN;

CREATE OR REPLACE FUNCTION guest_guide.requested_property_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF((current_setting('request.headers', true)::json ->> 'x-property-id'), '')::uuid;
$$;

DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'guest_guide'
      AND cmd = 'SELECT'
      AND 'anon' = ANY(roles)
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
  END LOOP;
END
$$;

DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'guest_guide'
      AND tablename = 'event_log'
      AND cmd = 'INSERT'
      AND 'anon' = ANY(roles)
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
  END LOOP;
END
$$;

DROP POLICY IF EXISTS "home_configs_anon_read" ON guest_guide.home_configs;
DROP POLICY IF EXISTS "pages_anon_read" ON guest_guide.pages;
DROP POLICY IF EXISTS "page_routes_anon_read" ON guest_guide.page_routes;
DROP POLICY IF EXISTS "navigation_nodes_anon_read" ON guest_guide.navigation_nodes;
DROP POLICY IF EXISTS "tags_anon_read" ON guest_guide.tags;
DROP POLICY IF EXISTS "page_tags_anon_read" ON guest_guide.page_tags;
DROP POLICY IF EXISTS "contacts_anon_read" ON guest_guide.contacts;
DROP POLICY IF EXISTS "partners_anon_read" ON guest_guide.partners;
DROP POLICY IF EXISTS "partner_schedules_anon_read" ON guest_guide.partner_schedules;
DROP POLICY IF EXISTS "partner_media_anon_read" ON guest_guide.partner_media;
DROP POLICY IF EXISTS "partner_promotions_anon_read" ON guest_guide.partner_promotions;
DROP POLICY IF EXISTS "background_videos_anon_read" ON guest_guide.background_videos;
DROP POLICY IF EXISTS "sponsored_slots_anon_read" ON guest_guide.sponsored_slots;
DROP POLICY IF EXISTS "partner_display_configs_anon_read" ON guest_guide.partner_display_configs;
DROP POLICY IF EXISTS "top_sticker_messages_anon_read" ON guest_guide.top_sticker_messages;
DROP POLICY IF EXISTS "top_sticker_locales_anon_read" ON guest_guide.top_sticker_locales;
DROP POLICY IF EXISTS "event_log_insert_anon" ON guest_guide.event_log;

CREATE POLICY "home_configs_anon_read"
ON guest_guide.home_configs FOR SELECT
USING (deleted_at IS NULL AND property_id = guest_guide.requested_property_id());

CREATE POLICY "pages_anon_read"
ON guest_guide.pages FOR SELECT
USING (
  deleted_at IS NULL
  AND status = 'published'
  AND property_id = guest_guide.requested_property_id()
);

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

CREATE POLICY "tags_anon_read"
ON guest_guide.tags FOR SELECT
USING (deleted_at IS NULL AND property_id = guest_guide.requested_property_id());

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

CREATE POLICY "contacts_anon_read"
ON guest_guide.contacts FOR SELECT
USING (deleted_at IS NULL AND property_id = guest_guide.requested_property_id());

CREATE POLICY "partners_anon_read"
ON guest_guide.partners FOR SELECT
USING (
  deleted_at IS NULL
  AND is_active = true
  AND property_id = guest_guide.requested_property_id()
);

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

CREATE POLICY "partner_promotions_anon_read"
ON guest_guide.partner_promotions FOR SELECT
USING (
  deleted_at IS NULL
  AND is_active = true
  AND property_id = guest_guide.requested_property_id()
  AND (valid_from IS NULL OR valid_from <= NOW())
  AND (valid_until IS NULL OR valid_until >= NOW())
);

CREATE POLICY "background_videos_anon_read"
ON guest_guide.background_videos FOR SELECT
USING (
  deleted_at IS NULL
  AND is_active = true
  AND property_id = guest_guide.requested_property_id()
);

CREATE POLICY "sponsored_slots_anon_read"
ON guest_guide.sponsored_slots FOR SELECT
USING (
  deleted_at IS NULL
  AND is_active = true
  AND property_id = guest_guide.requested_property_id()
  AND (valid_from IS NULL OR valid_from <= NOW())
  AND (valid_until IS NULL OR valid_until >= NOW())
);

CREATE POLICY "partner_display_configs_anon_read"
ON guest_guide.partner_display_configs FOR SELECT
USING (deleted_at IS NULL AND property_id = guest_guide.requested_property_id());

CREATE POLICY "top_sticker_messages_anon_read"
ON guest_guide.top_sticker_messages FOR SELECT
USING (
  deleted_at IS NULL
  AND status = 'active'
  AND property_id = guest_guide.requested_property_id()
  AND (valid_from IS NULL OR valid_from <= NOW())
  AND (valid_until IS NULL OR valid_until >= NOW())
);

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

CREATE POLICY "event_log_insert_anon"
ON guest_guide.event_log FOR INSERT
WITH CHECK (
  property_id IS NOT NULL
  AND org_id IS NOT NULL
  AND org_id = guest_guide.get_org_id_from_property(property_id)
);

COMMIT;
