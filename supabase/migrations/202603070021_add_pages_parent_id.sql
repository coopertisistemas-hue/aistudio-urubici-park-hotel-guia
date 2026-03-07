-- Migration: 021_add_pages_parent_id.sql
-- Date: 2026-03-07
-- Purpose: Add parent_id column to pages for explicit hierarchy support

BEGIN;

-- ============================================
-- ADD parent_id COLUMN TO pages
-- ============================================

ALTER TABLE guest_guide.pages 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES guest_guide.pages(id) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON guest_guide.pages(parent_id);

-- Add comment
COMMENT ON COLUMN guest_guide.pages.parent_id IS 'Reference to parent page for hierarchical structure';

-- ============================================
-- POPULATE HIERARCHY BASED ON SLUG PREFIX
-- ============================================

-- Example: 'sua-estadia/check-in' → parent_id = 'sua-estadia' page

WITH parent_pages AS (
    SELECT 
        id,
        property_id,
        slug
    FROM guest_guide.pages
    WHERE deleted_at IS NULL
      AND status = 'published'
),
slug_hierarchy AS (
    SELECT 
        child.id as child_id,
        child.property_id,
        child.slug as child_slug,
        -- Extract parent slug (everything before the last slash)
        CASE 
            WHEN child.slug LIKE '%/%' THEN 
                SUBSTRING(child.slug FROM 1 FOR LENGTH(child.slug) - POSITION('/' IN REVERSE(child.slug)))
            ELSE NULL
        END as parent_slug
    FROM guest_guide.pages child
    WHERE child.deleted_at IS NULL
      AND child.slug LIKE '%/%'
)
UPDATE guest_guide.pages
SET parent_id = parent_pages.id
FROM slug_hierarchy
JOIN parent_pages ON parent_pages.slug = slug_hierarchy.parent_slug
                AND parent_pages.property_id = slug_hierarchy.property_id
WHERE guest_guide.pages.id = slug_hierarchy.child_id
  AND guest_guide.pages.parent_id IS NULL;

-- ============================================
-- UPDATE RLS POLICIES FOR pages
-- ============================================

-- Parent read policy: allow reading parent pages when accessing child
-- This is implicitly handled by the existing policies since parents
-- are also pages with their own visibility rules

-- Add trigger to validate parent_id is from same property/org
CREATE OR REPLACE FUNCTION guest_guide.validate_page_parent()
RETURNS TRIGGER AS $$
BEGIN
    -- If parent_id is set, verify it's from the same property and org
    IF NEW.parent_id IS NOT NULL THEN
        DECLARE
            parent_property_id UUID;
            parent_org_id UUID;
        BEGIN
            SELECT property_id, org_id 
            INTO parent_property_id, parent_org_id
            FROM guest_guide.pages
            WHERE id = NEW.parent_id;
            
            IF parent_property_id IS NULL THEN
                RAISE EXCEPTION 'Parent page not found';
            END IF;
            
            IF parent_property_id != NEW.property_id OR parent_org_id != NEW.org_id THEN
                RAISE EXCEPTION 'Parent page must belong to the same property and organization';
            END IF;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS validate_page_parent_trigger ON guest_guide.pages;
CREATE TRIGGER validate_page_parent_trigger
    BEFORE INSERT OR UPDATE ON guest_guide.pages
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.validate_page_parent();

COMMIT;
