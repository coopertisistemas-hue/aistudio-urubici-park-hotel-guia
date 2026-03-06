-- Migration: 014_guest_guide_top_sticker_rls.sql
-- Date: 2026-03-06
-- Purpose: Add RLS policies for TopSticker tables

BEGIN;

-- ============================================
-- ENABLE RLS
-- ============================================

ALTER TABLE guest_guide.top_sticker_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.top_sticker_locales ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TOP STICKER MESSAGES POLICIES
-- ============================================

-- Anon read: only active messages within validity window
CREATE POLICY "top_sticker_messages_anon_read"
ON guest_guide.top_sticker_messages FOR SELECT
USING (
    deleted_at IS NULL
    AND status = 'active'
    AND (valid_from IS NULL OR valid_from <= NOW())
    AND (valid_until IS NULL OR valid_until >= NOW())
);

-- Member read: see all messages for their property
CREATE POLICY "top_sticker_messages_member_read"
ON guest_guide.top_sticker_messages FOR SELECT
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

-- Admin write: full CRUD
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

-- Staff override
CREATE POLICY "top_sticker_messages_staff_all"
ON guest_guide.top_sticker_messages FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- ============================================
-- TOP STICKER LOCALES POLICIES
-- ============================================

-- Anon read: only locales of active messages
CREATE POLICY "top_sticker_locales_anon_read"
ON guest_guide.top_sticker_locales FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM guest_guide.top_sticker_messages m
        WHERE m.id = message_id
          AND m.deleted_at IS NULL
          AND m.status = 'active'
          AND (m.valid_from IS NULL OR m.valid_from <= NOW())
          AND (m.valid_until IS NULL OR m.valid_until >= NOW())
    )
);

-- Member read: see all locales
CREATE POLICY "top_sticker_locales_member_read"
ON guest_guide.top_sticker_locales FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM guest_guide.top_sticker_messages m
        JOIN public.properties p ON p.id = m.property_id
        WHERE m.id = message_id
          AND p.org_id = m.org_id
    )
);

-- Admin write: full CRUD
CREATE POLICY "top_sticker_locales_admin_write"
ON guest_guide.top_sticker_locales FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM guest_guide.top_sticker_messages m
        WHERE m.id = message_id
          AND EXISTS (SELECT 1 FROM public.is_org_admin(m.org_id))
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM guest_guide.top_sticker_messages m
        WHERE m.id = message_id
          AND EXISTS (SELECT 1 FROM public.is_org_admin(m.org_id))
    )
);

-- Staff override
CREATE POLICY "top_sticker_locales_staff_all"
ON guest_guide.top_sticker_locales FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

COMMIT;
