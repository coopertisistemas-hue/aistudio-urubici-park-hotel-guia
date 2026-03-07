-- Migration: 030_guest_guide_reporting_views.sql
-- Date: 2026-03-07
-- Purpose: Add property-scoped reporting views and KPI summary RPC for pilot operations

BEGIN;

CREATE OR REPLACE VIEW guest_guide.v_page_views_daily AS
SELECT
  el.property_id,
  el.org_id,
  date_trunc('day', el.created_at) AS day,
  COALESCE(
    NULLIF(el.metadata ->> 'page_slug', ''),
    NULLIF(el.event_label, ''),
    NULLIF(el.entity_id::text, ''),
    'unknown'
  ) AS page_key,
  COUNT(*)::bigint AS views
FROM guest_guide.event_log el
WHERE el.event_type = 'page_view'
GROUP BY
  el.property_id,
  el.org_id,
  date_trunc('day', el.created_at),
  COALESCE(
    NULLIF(el.metadata ->> 'page_slug', ''),
    NULLIF(el.event_label, ''),
    NULLIF(el.entity_id::text, ''),
    'unknown'
  );

CREATE OR REPLACE VIEW guest_guide.v_top_pages AS
SELECT
  el.property_id,
  el.org_id,
  COALESCE(
    NULLIF(el.metadata ->> 'page_slug', ''),
    NULLIF(el.event_label, ''),
    NULLIF(el.entity_id::text, ''),
    'unknown'
  ) AS page_key,
  COUNT(*)::bigint AS views
FROM guest_guide.event_log el
WHERE el.event_type = 'page_view'
GROUP BY
  el.property_id,
  el.org_id,
  COALESCE(
    NULLIF(el.metadata ->> 'page_slug', ''),
    NULLIF(el.event_label, ''),
    NULLIF(el.entity_id::text, ''),
    'unknown'
  )
ORDER BY views DESC;

CREATE OR REPLACE VIEW guest_guide.v_cta_clicks AS
SELECT
  el.property_id,
  el.org_id,
  date_trunc('day', el.created_at) AS day,
  COALESCE(NULLIF(el.event_category, ''), 'unknown') AS cta_type,
  COALESCE(NULLIF(el.event_label, ''), 'unknown') AS cta_target,
  COUNT(*)::bigint AS clicks
FROM guest_guide.event_log el
WHERE el.event_type = 'cta_click'
GROUP BY
  el.property_id,
  el.org_id,
  date_trunc('day', el.created_at),
  COALESCE(NULLIF(el.event_category, ''), 'unknown'),
  COALESCE(NULLIF(el.event_label, ''), 'unknown');

CREATE OR REPLACE VIEW guest_guide.v_partner_views AS
SELECT
  el.property_id,
  el.org_id,
  date_trunc('day', el.created_at) AS day,
  COALESCE(NULLIF(el.entity_id::text, ''), NULLIF(el.event_label, ''), 'unknown') AS partner_key,
  COUNT(*)::bigint AS views
FROM guest_guide.event_log el
WHERE el.event_type = 'partner_view'
GROUP BY
  el.property_id,
  el.org_id,
  date_trunc('day', el.created_at),
  COALESCE(NULLIF(el.entity_id::text, ''), NULLIF(el.event_label, ''), 'unknown');

CREATE OR REPLACE VIEW guest_guide.v_video_interactions AS
SELECT
  el.property_id,
  el.org_id,
  date_trunc('day', el.created_at) AS day,
  el.event_type AS interaction_type,
  COALESCE(NULLIF(el.entity_id::text, ''), NULLIF(el.event_label, ''), 'unknown') AS video_key,
  COUNT(*)::bigint AS interactions
FROM guest_guide.event_log el
WHERE el.event_type IN ('video_play', 'video_start', 'video_complete', 'video_impression')
GROUP BY
  el.property_id,
  el.org_id,
  date_trunc('day', el.created_at),
  el.event_type,
  COALESCE(NULLIF(el.entity_id::text, ''), NULLIF(el.event_label, ''), 'unknown');

CREATE OR REPLACE FUNCTION guest_guide.get_kpi_summary(p_property_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_today_start TIMESTAMPTZ;
  v_page_views_today BIGINT;
  v_cta_clicks_today BIGINT;
  v_partner_views_today BIGINT;
  v_video_plays_today BIGINT;
  v_top_pages JSONB;
BEGIN
  v_today_start := date_trunc('day', now());

  SELECT COUNT(*)::bigint
  INTO v_page_views_today
  FROM guest_guide.event_log
  WHERE property_id = p_property_id
    AND event_type = 'page_view'
    AND created_at >= v_today_start;

  SELECT COUNT(*)::bigint
  INTO v_cta_clicks_today
  FROM guest_guide.event_log
  WHERE property_id = p_property_id
    AND event_type = 'cta_click'
    AND created_at >= v_today_start;

  SELECT COUNT(*)::bigint
  INTO v_partner_views_today
  FROM guest_guide.event_log
  WHERE property_id = p_property_id
    AND event_type = 'partner_view'
    AND created_at >= v_today_start;

  SELECT COUNT(*)::bigint
  INTO v_video_plays_today
  FROM guest_guide.event_log
  WHERE property_id = p_property_id
    AND event_type IN ('video_play', 'video_start')
    AND created_at >= v_today_start;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'page', page_key,
        'views', views
      )
      ORDER BY views DESC
    ),
    '[]'::jsonb
  )
  INTO v_top_pages
  FROM (
    SELECT
      COALESCE(
        NULLIF(metadata ->> 'page_slug', ''),
        NULLIF(event_label, ''),
        NULLIF(entity_id::text, ''),
        'unknown'
      ) AS page_key,
      COUNT(*)::bigint AS views
    FROM guest_guide.event_log
    WHERE property_id = p_property_id
      AND event_type = 'page_view'
    GROUP BY COALESCE(
      NULLIF(metadata ->> 'page_slug', ''),
      NULLIF(event_label, ''),
      NULLIF(entity_id::text, ''),
      'unknown'
    )
    ORDER BY views DESC
    LIMIT 5
  ) ranked_pages;

  RETURN jsonb_build_object(
    'page_views_today', COALESCE(v_page_views_today, 0),
    'top_pages', COALESCE(v_top_pages, '[]'::jsonb),
    'cta_clicks_today', COALESCE(v_cta_clicks_today, 0),
    'partner_views_today', COALESCE(v_partner_views_today, 0),
    'video_plays_today', COALESCE(v_video_plays_today, 0)
  );
END;
$$;

GRANT SELECT ON guest_guide.v_page_views_daily TO anon, authenticated, service_role;
GRANT SELECT ON guest_guide.v_top_pages TO anon, authenticated, service_role;
GRANT SELECT ON guest_guide.v_cta_clicks TO anon, authenticated, service_role;
GRANT SELECT ON guest_guide.v_partner_views TO anon, authenticated, service_role;
GRANT SELECT ON guest_guide.v_video_interactions TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION guest_guide.get_kpi_summary(UUID) TO anon, authenticated, service_role;

COMMIT;
