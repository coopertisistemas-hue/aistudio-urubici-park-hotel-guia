-- Migration: 012_guest_guide_add_tenant_columns.sql
-- Date: 2026-03-06
-- Purpose: Add missing property_id and org_id columns to child tables
-- Issue: QA Report identified tenant isolation gaps

BEGIN;

-- ============================================
-- FIX: page_routes - Add tenant scope
-- ============================================

ALTER TABLE guest_guide.page_routes 
    ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES public.properties(id) ON DELETE RESTRICT,
    ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id) ON DELETE RESTRICT;

-- Populate from parent pages table
UPDATE guest_guide.page_routes pr
SET 
    property_id = p.property_id,
    org_id = p.org_id
FROM guest_guide.pages p
WHERE pr.page_id = p.id
  AND pr.property_id IS NULL;

-- Add constraints
ALTER TABLE guest_guide.page_routes 
    ALTER COLUMN property_id SET NOT NULL,
    ALTER COLUMN org_id SET NOT NULL;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_page_routes_property_id ON guest_guide.page_routes(property_id);
CREATE INDEX IF NOT EXISTS idx_page_routes_org_id ON guest_guide.page_routes(org_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_page_routes_property_locale_slug 
    ON guest_guide.page_routes(property_id, locale, slug) 
    WHERE deleted_at IS NULL;

-- ============================================
-- FIX: page_tags - Add tenant scope
-- ============================================

ALTER TABLE guest_guide.page_tags 
    ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES public.properties(id) ON DELETE RESTRICT,
    ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id) ON DELETE RESTRICT;

-- Populate from parent pages table
UPDATE guest_guide.page_tags pt
SET 
    property_id = p.property_id,
    org_id = p.org_id
FROM guest_guide.pages p
WHERE pt.page_id = p.id
  AND pt.property_id IS NULL;

-- Add constraints
ALTER TABLE guest_guide.page_tags 
    ALTER COLUMN property_id SET NOT NULL,
    ALTER COLUMN org_id SET NOT NULL;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_page_tags_property_id ON guest_guide.page_tags(property_id);
CREATE INDEX IF NOT EXISTS idx_page_tags_org_id ON guest_guide.page_tags(org_id);

-- ============================================
-- FIX: partner_schedules - Add tenant scope
-- ============================================

ALTER TABLE guest_guide.partner_schedules 
    ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES public.properties(id) ON DELETE RESTRICT,
    ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id) ON DELETE RESTRICT;

-- Populate from parent partners table
UPDATE guest_guide.partner_schedules ps
SET 
    property_id = p.property_id,
    org_id = p.org_id
FROM guest_guide.partners p
WHERE ps.partner_id = p.id
  AND ps.property_id IS NULL;

-- Add constraints
ALTER TABLE guest_guide.partner_schedules 
    ALTER COLUMN property_id SET NOT NULL,
    ALTER COLUMN org_id SET NOT NULL;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_partner_schedules_property_id ON guest_guide.partner_schedules(property_id);
CREATE INDEX IF NOT EXISTS idx_partner_schedules_org_id ON guest_guide.partner_schedules(org_id);

-- ============================================
-- FIX: partner_media - Add tenant scope
-- ============================================

ALTER TABLE guest_guide.partner_media 
    ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES public.properties(id) ON DELETE RESTRICT,
    ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id) ON DELETE RESTRICT;

-- Populate from parent partners table
UPDATE guest_guide.partner_media pm
SET 
    property_id = p.property_id,
    org_id = p.org_id
FROM guest_guide.partners p
WHERE pm.partner_id = p.id
  AND pm.property_id IS NULL;

-- Add constraints
ALTER TABLE guest_guide.partner_media 
    ALTER COLUMN property_id SET NOT NULL,
    ALTER COLUMN org_id SET NOT NULL;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_partner_media_property_id ON guest_guide.partner_media(property_id);
CREATE INDEX IF NOT EXISTS idx_partner_media_org_id ON guest_guide.partner_media(org_id);

COMMIT;
