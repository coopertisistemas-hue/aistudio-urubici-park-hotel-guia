-- Migration: 027_guest_guide_staging_runtime_repairs.sql
-- Date: 2026-03-07
-- Purpose: repair staging runtime mismatches and disable unsafe direct anon table reads

BEGIN;

ALTER TABLE guest_guide.pages
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES guest_guide.pages(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_guest_guide_pages_parent_id
ON guest_guide.pages(parent_id)
WHERE parent_id IS NOT NULL;

CREATE OR REPLACE FUNCTION guest_guide.get_stickers_for_home(
    p_property_id UUID,
    p_locale VARCHAR DEFAULT 'pt-BR'
)
RETURNS TABLE (
    id UUID,
    icon VARCHAR,
    text TEXT,
    is_emergency BOOLEAN,
    cta_url TEXT,
    cta_label VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    WITH ranked_locales AS (
        SELECT
            m.id AS message_id,
            l.icon,
            l.text,
            m.is_emergency,
            m.cta_url,
            m.cta_label,
            m.priority,
            m.sort_order,
            ROW_NUMBER() OVER (
                PARTITION BY m.id
                ORDER BY
                    CASE
                        WHEN l.locale = p_locale THEN 1
                        WHEN l.locale = 'pt-BR' THEN 2
                        ELSE 3
                    END,
                    l.id
            ) AS locale_rank
        FROM guest_guide.top_sticker_messages m
        JOIN guest_guide.top_sticker_locales l
          ON l.message_id = m.id
        WHERE m.property_id = p_property_id
          AND m.deleted_at IS NULL
          AND m.status = 'active'
          AND (m.valid_from IS NULL OR m.valid_from <= NOW())
          AND (m.valid_until IS NULL OR m.valid_until >= NOW())
    )
    SELECT
        rl.message_id,
        COALESCE(rl.icon, 'i')::VARCHAR,
        rl.text,
        rl.is_emergency,
        rl.cta_url,
        rl.cta_label
    FROM ranked_locales rl
    WHERE rl.locale_rank = 1
    ORDER BY rl.is_emergency DESC, rl.priority DESC, rl.sort_order ASC, rl.message_id;
END;
$$ LANGUAGE plpgsql STABLE;

REVOKE SELECT ON TABLE
    guest_guide.home_configs,
    guest_guide.pages,
    guest_guide.page_routes,
    guest_guide.content_blocks,
    guest_guide.navigation_nodes,
    guest_guide.tags,
    guest_guide.page_tags,
    guest_guide.contacts,
    guest_guide.partners,
    guest_guide.partner_schedules,
    guest_guide.partner_media,
    guest_guide.partner_promotions,
    guest_guide.background_videos,
    guest_guide.sponsored_slots,
    guest_guide.partner_display_configs,
    guest_guide.top_sticker_messages,
    guest_guide.top_sticker_locales
FROM anon;

COMMIT;
