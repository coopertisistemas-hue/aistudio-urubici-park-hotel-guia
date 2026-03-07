-- Migration: 020_add_partner_tenant_columns_and_rls.sql
-- Date: 2026-03-07
-- Purpose: Add tenant columns to partner_schedules and partner_media, fix RLS policies

BEGIN;

-- ============================================
-- ADD TENANT COLUMNS TO partner_schedules
-- ============================================

ALTER TABLE guest_guide.partner_schedules 
ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_partner_schedules_property_id ON guest_guide.partner_schedules(property_id);
CREATE INDEX IF NOT EXISTS idx_partner_schedules_org_id ON guest_guide.partner_schedules(org_id);

-- Populate tenant columns from parent partner
UPDATE guest_guide.partner_schedules ps
SET 
    property_id = p.property_id,
    org_id = p.org_id
FROM guest_guide.partners p
WHERE ps.partner_id = p.id
  AND ps.property_id IS NULL;

-- Make columns NOT NULL after population
ALTER TABLE guest_guide.partner_schedules 
ALTER COLUMN property_id SET NOT NULL,
ALTER COLUMN org_id SET NOT NULL;

-- ============================================
-- ADD TENANT COLUMNS TO partner_media
-- ============================================

ALTER TABLE guest_guide.partner_media 
ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_partner_media_property_id ON guest_guide.partner_media(property_id);
CREATE INDEX IF NOT EXISTS idx_partner_media_org_id ON guest_guide.partner_media(org_id);

-- Populate tenant columns from parent partner
UPDATE guest_guide.partner_media pm
SET 
    property_id = p.property_id,
    org_id = p.org_id
FROM guest_guide.partners p
WHERE pm.partner_id = p.id
  AND pm.property_id IS NULL;

-- Make columns NOT NULL after population
ALTER TABLE guest_guide.partner_media 
ALTER COLUMN property_id SET NOT NULL,
ALTER COLUMN org_id SET NOT NULL;

-- ============================================
-- FIX RLS POLICIES FOR partner_schedules
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "partner_schedules_anon_read" ON guest_guide.partner_schedules;
DROP POLICY IF EXISTS "partner_schedules_member_read" ON guest_guide.partner_schedules;
DROP POLICY IF EXISTS "partner_schedules_admin_write" ON guest_guide.partner_schedules;

-- Anon read: only schedules of active partners
CREATE POLICY "partner_schedules_anon_read"
ON guest_guide.partner_schedules FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM guest_guide.partners p
        WHERE p.id = partner_id
          AND p.is_active = true
          AND p.deleted_at IS NULL
    )
);

-- Member read: schedules within same org
CREATE POLICY "partner_schedules_member_read"
ON guest_guide.partner_schedules FOR SELECT
USING (
    EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

-- Admin write: org admins only
CREATE POLICY "partner_schedules_admin_write"
ON guest_guide.partner_schedules FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
    EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

-- ============================================
-- FIX RLS POLICIES FOR partner_media
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "partner_media_anon_read" ON guest_guide.partner_media;
DROP POLICY IF EXISTS "partner_media_member_read" ON guest_guide.partner_media;
DROP POLICY IF EXISTS "partner_media_admin_write" ON guest_guide.partner_media;

-- Anon read: only media of active partners
CREATE POLICY "partner_media_anon_read"
ON guest_guide.partner_media FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM guest_guide.partners p
        WHERE p.id = partner_id
          AND p.is_active = true
          AND p.deleted_at IS NULL
    )
);

-- Member read: media within same org
CREATE POLICY "partner_media_member_read"
ON guest_guide.partner_media FOR SELECT
USING (
    EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

-- Admin write: org admins only
CREATE POLICY "partner_media_admin_write"
ON guest_guide.partner_media FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
    EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

COMMIT;
