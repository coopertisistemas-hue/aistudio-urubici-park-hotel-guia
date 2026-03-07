-- Migration: 025_guest_guide_drop_permissive_select_policies.sql
-- Date: 2026-03-07
-- Purpose: remove any remaining permissive SELECT/INSERT policies and keep strict anon scope

BEGIN;

DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'guest_guide'
      AND tablename IN (
        'home_configs',
        'pages',
        'page_routes',
        'navigation_nodes',
        'tags',
        'page_tags',
        'contacts',
        'partners',
        'partner_schedules',
        'partner_media',
        'partner_promotions',
        'background_videos',
        'sponsored_slots',
        'partner_display_configs',
        'top_sticker_messages',
        'top_sticker_locales'
      )
      AND cmd IN ('SELECT', 'ALL')
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
      AND cmd IN ('INSERT', 'ALL')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
  END LOOP;
END
$$;

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
