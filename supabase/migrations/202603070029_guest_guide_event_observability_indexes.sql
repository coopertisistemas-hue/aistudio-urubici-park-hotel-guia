-- Migration: 029_guest_guide_event_observability_indexes.sql
-- Date: 2026-03-07
-- Purpose: Improve query performance for pilot operations and observability dashboards

BEGIN;

CREATE INDEX IF NOT EXISTS idx_event_log_property_created_desc
  ON guest_guide.event_log (property_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_event_log_property_event_created_desc
  ON guest_guide.event_log (property_id, event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_event_aggregates_property_period_desc
  ON guest_guide.event_aggregates (property_id, period_type, period_start DESC);

COMMIT;
