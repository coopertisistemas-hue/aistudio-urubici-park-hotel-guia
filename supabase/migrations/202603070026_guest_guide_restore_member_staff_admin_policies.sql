-- Migration: 026_guest_guide_restore_member_staff_admin_policies.sql
-- Date: 2026-03-07
-- Purpose: repair authenticated/staff/admin policy coverage removed by migration 025 while preserving strict anon property scoping

BEGIN;

-- home_configs
DROP POLICY IF EXISTS "home_configs_member_read" ON guest_guide.home_configs;
CREATE POLICY "home_configs_member_read"
ON guest_guide.home_configs FOR SELECT
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

DROP POLICY IF EXISTS "home_configs_admin_write" ON guest_guide.home_configs;
CREATE POLICY "home_configs_admin_write"
ON guest_guide.home_configs FOR ALL
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

DROP POLICY IF EXISTS "home_configs_staff_all" ON guest_guide.home_configs;
CREATE POLICY "home_configs_staff_all"
ON guest_guide.home_configs FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- pages
DROP POLICY IF EXISTS "pages_member_read" ON guest_guide.pages;
CREATE POLICY "pages_member_read"
ON guest_guide.pages FOR SELECT
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

DROP POLICY IF EXISTS "pages_admin_write" ON guest_guide.pages;
CREATE POLICY "pages_admin_write"
ON guest_guide.pages FOR ALL
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

DROP POLICY IF EXISTS "pages_staff_all" ON guest_guide.pages;
CREATE POLICY "pages_staff_all"
ON guest_guide.pages FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- page_routes
DROP POLICY IF EXISTS "page_routes_member_read" ON guest_guide.page_routes;
CREATE POLICY "page_routes_member_read"
ON guest_guide.page_routes FOR SELECT
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

DROP POLICY IF EXISTS "page_routes_admin_write" ON guest_guide.page_routes;
CREATE POLICY "page_routes_admin_write"
ON guest_guide.page_routes FOR ALL
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

DROP POLICY IF EXISTS "page_routes_staff_all" ON guest_guide.page_routes;
CREATE POLICY "page_routes_staff_all"
ON guest_guide.page_routes FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- navigation_nodes
DROP POLICY IF EXISTS "navigation_nodes_member_read" ON guest_guide.navigation_nodes;
CREATE POLICY "navigation_nodes_member_read"
ON guest_guide.navigation_nodes FOR SELECT
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

DROP POLICY IF EXISTS "navigation_nodes_admin_write" ON guest_guide.navigation_nodes;
CREATE POLICY "navigation_nodes_admin_write"
ON guest_guide.navigation_nodes FOR ALL
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

DROP POLICY IF EXISTS "navigation_nodes_staff_all" ON guest_guide.navigation_nodes;
CREATE POLICY "navigation_nodes_staff_all"
ON guest_guide.navigation_nodes FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- tags
DROP POLICY IF EXISTS "tags_member_read" ON guest_guide.tags;
CREATE POLICY "tags_member_read"
ON guest_guide.tags FOR SELECT
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

DROP POLICY IF EXISTS "tags_admin_write" ON guest_guide.tags;
CREATE POLICY "tags_admin_write"
ON guest_guide.tags FOR ALL
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

DROP POLICY IF EXISTS "tags_staff_all" ON guest_guide.tags;
CREATE POLICY "tags_staff_all"
ON guest_guide.tags FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- page_tags
DROP POLICY IF EXISTS "page_tags_member_read" ON guest_guide.page_tags;
CREATE POLICY "page_tags_member_read"
ON guest_guide.page_tags FOR SELECT
USING (EXISTS (SELECT 1 FROM public.is_org_member(org_id)));

DROP POLICY IF EXISTS "page_tags_admin_write" ON guest_guide.page_tags;
CREATE POLICY "page_tags_admin_write"
ON guest_guide.page_tags FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_org_admin(org_id)))
WITH CHECK (EXISTS (SELECT 1 FROM public.is_org_admin(org_id)));

DROP POLICY IF EXISTS "page_tags_staff_all" ON guest_guide.page_tags;
CREATE POLICY "page_tags_staff_all"
ON guest_guide.page_tags FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- contacts
DROP POLICY IF EXISTS "contacts_member_read" ON guest_guide.contacts;
CREATE POLICY "contacts_member_read"
ON guest_guide.contacts FOR SELECT
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

DROP POLICY IF EXISTS "contacts_admin_write" ON guest_guide.contacts;
CREATE POLICY "contacts_admin_write"
ON guest_guide.contacts FOR ALL
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

DROP POLICY IF EXISTS "contacts_staff_all" ON guest_guide.contacts;
CREATE POLICY "contacts_staff_all"
ON guest_guide.contacts FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- partners
DROP POLICY IF EXISTS "partners_member_read" ON guest_guide.partners;
CREATE POLICY "partners_member_read"
ON guest_guide.partners FOR SELECT
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

DROP POLICY IF EXISTS "partners_admin_write" ON guest_guide.partners;
CREATE POLICY "partners_admin_write"
ON guest_guide.partners FOR ALL
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

DROP POLICY IF EXISTS "partners_staff_all" ON guest_guide.partners;
CREATE POLICY "partners_staff_all"
ON guest_guide.partners FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- partner_schedules
DROP POLICY IF EXISTS "partner_schedules_member_read" ON guest_guide.partner_schedules;
CREATE POLICY "partner_schedules_member_read"
ON guest_guide.partner_schedules FOR SELECT
USING (EXISTS (SELECT 1 FROM public.is_org_member(org_id)));

DROP POLICY IF EXISTS "partner_schedules_admin_write" ON guest_guide.partner_schedules;
CREATE POLICY "partner_schedules_admin_write"
ON guest_guide.partner_schedules FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_org_admin(org_id)))
WITH CHECK (EXISTS (SELECT 1 FROM public.is_org_admin(org_id)));

DROP POLICY IF EXISTS "partner_schedules_staff_all" ON guest_guide.partner_schedules;
CREATE POLICY "partner_schedules_staff_all"
ON guest_guide.partner_schedules FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- partner_media
DROP POLICY IF EXISTS "partner_media_member_read" ON guest_guide.partner_media;
CREATE POLICY "partner_media_member_read"
ON guest_guide.partner_media FOR SELECT
USING (EXISTS (SELECT 1 FROM public.is_org_member(org_id)));

DROP POLICY IF EXISTS "partner_media_admin_write" ON guest_guide.partner_media;
CREATE POLICY "partner_media_admin_write"
ON guest_guide.partner_media FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_org_admin(org_id)))
WITH CHECK (EXISTS (SELECT 1 FROM public.is_org_admin(org_id)));

DROP POLICY IF EXISTS "partner_media_staff_all" ON guest_guide.partner_media;
CREATE POLICY "partner_media_staff_all"
ON guest_guide.partner_media FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- partner_promotions
DROP POLICY IF EXISTS "partner_promotions_member_read" ON guest_guide.partner_promotions;
CREATE POLICY "partner_promotions_member_read"
ON guest_guide.partner_promotions FOR SELECT
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

DROP POLICY IF EXISTS "partner_promotions_admin_write" ON guest_guide.partner_promotions;
CREATE POLICY "partner_promotions_admin_write"
ON guest_guide.partner_promotions FOR ALL
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

DROP POLICY IF EXISTS "partner_promotions_staff_all" ON guest_guide.partner_promotions;
CREATE POLICY "partner_promotions_staff_all"
ON guest_guide.partner_promotions FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- background_videos
DROP POLICY IF EXISTS "background_videos_member_read" ON guest_guide.background_videos;
CREATE POLICY "background_videos_member_read"
ON guest_guide.background_videos FOR SELECT
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

DROP POLICY IF EXISTS "background_videos_admin_write" ON guest_guide.background_videos;
CREATE POLICY "background_videos_admin_write"
ON guest_guide.background_videos FOR ALL
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

DROP POLICY IF EXISTS "background_videos_staff_all" ON guest_guide.background_videos;
CREATE POLICY "background_videos_staff_all"
ON guest_guide.background_videos FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- sponsored_slots
DROP POLICY IF EXISTS "sponsored_slots_member_read" ON guest_guide.sponsored_slots;
CREATE POLICY "sponsored_slots_member_read"
ON guest_guide.sponsored_slots FOR SELECT
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

DROP POLICY IF EXISTS "sponsored_slots_admin_write" ON guest_guide.sponsored_slots;
CREATE POLICY "sponsored_slots_admin_write"
ON guest_guide.sponsored_slots FOR ALL
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

DROP POLICY IF EXISTS "sponsored_slots_staff_all" ON guest_guide.sponsored_slots;
CREATE POLICY "sponsored_slots_staff_all"
ON guest_guide.sponsored_slots FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- partner_display_configs
DROP POLICY IF EXISTS "partner_display_configs_member_read" ON guest_guide.partner_display_configs;
CREATE POLICY "partner_display_configs_member_read"
ON guest_guide.partner_display_configs FOR SELECT
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

DROP POLICY IF EXISTS "partner_display_configs_admin_write" ON guest_guide.partner_display_configs;
CREATE POLICY "partner_display_configs_admin_write"
ON guest_guide.partner_display_configs FOR ALL
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

DROP POLICY IF EXISTS "partner_display_configs_staff_all" ON guest_guide.partner_display_configs;
CREATE POLICY "partner_display_configs_staff_all"
ON guest_guide.partner_display_configs FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- top_sticker_messages
DROP POLICY IF EXISTS "top_sticker_messages_member_read" ON guest_guide.top_sticker_messages;
CREATE POLICY "top_sticker_messages_member_read"
ON guest_guide.top_sticker_messages FOR SELECT
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

DROP POLICY IF EXISTS "top_sticker_messages_admin_write" ON guest_guide.top_sticker_messages;
CREATE POLICY "top_sticker_messages_admin_write"
ON guest_guide.top_sticker_messages FOR ALL
USING (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
  deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

DROP POLICY IF EXISTS "top_sticker_messages_staff_all" ON guest_guide.top_sticker_messages;
CREATE POLICY "top_sticker_messages_staff_all"
ON guest_guide.top_sticker_messages FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- top_sticker_locales
DROP POLICY IF EXISTS "top_sticker_locales_member_read" ON guest_guide.top_sticker_locales;
CREATE POLICY "top_sticker_locales_member_read"
ON guest_guide.top_sticker_locales FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM guest_guide.top_sticker_messages message
    WHERE message.id = message_id
      AND EXISTS (SELECT 1 FROM public.is_org_member(message.org_id))
  )
);

DROP POLICY IF EXISTS "top_sticker_locales_admin_write" ON guest_guide.top_sticker_locales;
CREATE POLICY "top_sticker_locales_admin_write"
ON guest_guide.top_sticker_locales FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM guest_guide.top_sticker_messages message
    WHERE message.id = message_id
      AND EXISTS (SELECT 1 FROM public.is_org_admin(message.org_id))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM guest_guide.top_sticker_messages message
    WHERE message.id = message_id
      AND EXISTS (SELECT 1 FROM public.is_org_admin(message.org_id))
  )
);

DROP POLICY IF EXISTS "top_sticker_locales_staff_all" ON guest_guide.top_sticker_locales;
CREATE POLICY "top_sticker_locales_staff_all"
ON guest_guide.top_sticker_locales FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

COMMIT;
