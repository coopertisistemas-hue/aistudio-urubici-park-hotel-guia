-- Migration: 017_guest_guide_sticker_functions.sql
-- Date: 2026-03-06
-- Purpose: Add helper functions for TopSticker retrieval

BEGIN;

-- ============================================
-- GET ACTIVE STICKERS FOR PROPERTY
-- ============================================

CREATE OR REPLACE FUNCTION guest_guide.get_active_stickers(
    p_property_id UUID,
    p_locale VARCHAR DEFAULT 'pt-BR'
)
RETURNS TABLE (
    id UUID,
    icon VARCHAR,
    text TEXT,
    display_mode VARCHAR,
    priority INTEGER,
    cta_url TEXT,
    cta_label VARCHAR,
    is_emergency BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH active_messages AS (
        SELECT 
            m.id,
            m.display_mode,
            m.priority,
            m.sort_order,
            m.cta_url,
            m.cta_label,
            m.is_emergency,
            l.icon,
            l.text,
            ROW_NUMBER() OVER (
                PARTITION BY m.id 
                ORDER BY 
                    CASE l.locale 
                        WHEN p_locale THEN 1 
                        WHEN 'pt-BR' THEN 2 
                        ELSE 3 
                    END
            ) AS locale_rank
        FROM guest_guide.top_sticker_messages m
        LEFT JOIN guest_guide.top_sticker_locales l ON l.message_id = m.id
        WHERE m.property_id = p_property_id
          AND m.deleted_at IS NULL
          AND m.status = 'active'
          AND (m.valid_from IS NULL OR m.valid_from <= NOW())
          AND (m.valid_until IS NULL OR m.valid_until >= NOW())
    )
    SELECT 
        am.id,
        am.icon,
        am.text,
        am.display_mode,
        am.priority,
        am.cta_url,
        am.cta_label,
        am.is_emergency
    FROM active_messages am
    WHERE am.locale_rank = 1
    ORDER BY am.priority DESC, am.sort_order;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- GET EMERGENCY STICKERS ONLY
-- ============================================

CREATE OR REPLACE FUNCTION guest_guide.get_emergency_stickers(
    p_property_id UUID,
    p_locale VARCHAR DEFAULT 'pt-BR'
)
RETURNS TABLE (
    id UUID,
    icon VARCHAR,
    text TEXT,
    cta_url TEXT,
    cta_label VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    WITH emergency_messages AS (
        SELECT 
            m.id,
            m.cta_url,
            m.cta_label,
            l.icon,
            l.text,
            ROW_NUMBER() OVER (
                PARTITION BY m.id 
                ORDER BY 
                    CASE l.locale 
                        WHEN p_locale THEN 1 
                        WHEN 'pt-BR' THEN 2 
                        ELSE 3 
                    END
            ) AS locale_rank
        FROM guest_guide.top_sticker_messages m
        LEFT JOIN guest_guide.top_sticker_locales l ON l.message_id = m.id
        WHERE m.property_id = p_property_id
          AND m.deleted_at IS NULL
          AND m.status = 'active'
          AND m.is_emergency = true
          AND (m.valid_from IS NULL OR m.valid_from <= NOW())
          AND (m.valid_until IS NULL OR m.valid_until >= NOW())
    )
    SELECT 
        em.id,
        em.icon,
        em.text,
        em.cta_url,
        em.cta_label
    FROM emergency_messages em
    WHERE em.locale_rank = 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- GET STICKERS FOR HOME CONFIG
-- Combines regular + emergency with proper precedence
-- ============================================

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
    WITH combined_stickers AS (
        -- Emergency stickers (highest priority)
        SELECT 
            m.id,
            l.icon,
            l.text,
            m.is_emergency,
            m.cta_url,
            m.cta_label,
            0 AS sort_priority
        FROM guest_guide.top_sticker_messages m
        LEFT JOIN guest_guide.top_sticker_locales l ON l.message_id = m.id
        WHERE m.property_id = p_property_id
          AND m.deleted_at IS NULL
          AND m.status = 'active'
          AND m.is_emergency = true
          AND (m.valid_from IS NULL OR m.valid_from <= NOW())
          AND (m.valid_until IS NULL OR m.valid_until >= NOW())
        
        UNION ALL
        
        -- Regular rotating stickers
        SELECT 
            m.id,
            l.icon,
            l.text,
            m.is_emergency,
            m.cta_url,
            m.cta_label,
            1 AS sort_priority
        FROM guest_guide.top_sticker_messages m
        LEFT JOIN guest_guide.top_sticker_locales l ON l.message_id = m.id
        WHERE m.property_id = p_property_id
          AND m.deleted_at IS NULL
          AND m.status = 'active'
          AND m.is_emergency = false
          AND m.display_mode = 'rotating'
          AND (m.valid_from IS NULL OR m.valid_from <= NOW())
          AND (m.valid_until IS NULL OR m.valid_until >= NOW())
    ),
    locale_ranked AS (
        SELECT 
            cs.*,
            ROW_NUMBER() OVER (
                PARTITION BY cs.id 
                ORDER BY 
                    CASE cs.locale_rank_inner 
                        WHEN 1 THEN 1 
                        WHEN 2 THEN 2 
                        ELSE 3 
                    END
            ) AS final_rank
        FROM (
            SELECT 
                cs.*,
                ROW_NUMBER() OVER (
                    PARTITION BY cs.id 
                    ORDER BY 
                        CASE 
                            WHEN l.locale = p_locale THEN 1 
                            WHEN l.locale = 'pt-BR' THEN 2 
                            ELSE 3 
                        END
                ) AS locale_rank_inner
            FROM combined_stickers cs
            LEFT JOIN LATERAL (
                SELECT locale FROM guest_guide.top_sticker_locales 
                WHERE message_id = cs.id
            ) l ON true
        ) cs
    )
    SELECT 
        lr.id,
        lr.icon,
        lr.text,
        lr.is_emergency,
        lr.cta_url,
        lr.cta_label
    FROM locale_ranked lr
    WHERE lr.final_rank = 1
    ORDER BY lr.sort_priority, lr.is_emergency DESC;
END;
$$ LANGUAGE plpgsql STABLE;

COMMIT;
