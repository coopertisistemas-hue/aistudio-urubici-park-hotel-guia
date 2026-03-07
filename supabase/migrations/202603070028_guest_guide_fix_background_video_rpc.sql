-- Migration: 028_guest_guide_fix_background_video_rpc.sql
-- Date: 2026-03-07
-- Purpose: fix ambiguous output references in resolve_background_video

BEGIN;

CREATE OR REPLACE FUNCTION guest_guide.resolve_background_video(
    p_property_id UUID,
    p_locale VARCHAR DEFAULT 'pt-BR'
)
RETURNS TABLE (
    id UUID,
    video_url TEXT,
    thumbnail_url TEXT,
    title VARCHAR,
    is_sponsored BOOLEAN,
    sponsor_name VARCHAR,
    sponsor_logo_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH active_videos AS (
        SELECT
            bg.id AS video_id,
            bg.video_url,
            bg.thumbnail_url,
            bg.title,
            bg.is_sponsored,
            bg.sponsor_name,
            bg.sponsor_logo_url,
            bg.sort_order
        FROM guest_guide.background_videos bg
        WHERE bg.property_id = p_property_id
          AND bg.is_active = true
          AND bg.deleted_at IS NULL
        ORDER BY bg.is_sponsored DESC, bg.sort_order ASC
        LIMIT 1
    )
    SELECT
        av.video_id,
        COALESCE(av.video_url, dv.video_url) AS video_url,
        COALESCE(av.thumbnail_url, dv.thumbnail_url) AS thumbnail_url,
        COALESCE(av.title, dv.title) AS title,
        COALESCE(av.is_sponsored, false) AS is_sponsored,
        av.sponsor_name,
        av.sponsor_logo_url
    FROM active_videos av
    LEFT JOIN LATERAL (
        SELECT bg.video_url, bg.thumbnail_url, bg.title
        FROM guest_guide.background_videos bg
        WHERE bg.property_id = p_property_id
          AND bg.is_active = true
          AND bg.is_default = true
          AND bg.deleted_at IS NULL
        ORDER BY bg.sort_order ASC
        LIMIT 1
    ) dv ON true
    WHERE av.video_url IS NOT NULL
       OR dv.video_url IS NOT NULL;

    IF NOT FOUND THEN
        RETURN QUERY
        SELECT
            NULL::UUID,
            NULL::TEXT,
            NULL::TEXT,
            NULL::VARCHAR,
            false::BOOLEAN,
            NULL::VARCHAR,
            NULL::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql;

COMMIT;
