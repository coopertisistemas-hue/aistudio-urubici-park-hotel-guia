# Sprint 0.3 — Schema Integrity Fixes

## Objectives

1. Add missing RLS protections for `partner_schedules` and `partner_media`
2. Add explicit page hierarchy support via `pages.parent_id`

## Changes Made

### Migration 020: Partner Tenant Columns and RLS

**File:** `supabase/migrations/202603070020_add_partner_tenant_columns_and_rls.sql`

#### Added Columns

**partner_schedules:**
- `property_id UUID NOT NULL` — references `public.properties(id)`
- `org_id UUID NOT NULL` — references `public.organizations(id)`

**partner_media:**
- `property_id UUID NOT NULL` — references `public.properties(id)`
- `org_id UUID NOT NULL` — references `public.organizations(id)`

#### Data Migration

Populated tenant columns from parent partner records:

```sql
UPDATE guest_guide.partner_schedules ps
SET 
    property_id = p.property_id,
    org_id = p.org_id
FROM guest_guide.partners p
WHERE ps.partner_id = p.id;
```

#### RLS Policies

**partner_schedules:**
- `partner_schedules_anon_read` — schedules of active partners
- `partner_schedules_member_read` — org member access
- `partner_schedules_admin_write` — org admin write access

**partner_media:**
- `partner_media_anon_read` — media of active partners
- `partner_media_member_read` — org member access
- `partner_media_admin_write` — org admin write access

All policies enforce:
- `org_id` scope via `is_org_member(org_id)`
- `property_id` scope via partner relationship

### Migration 021: Page Hierarchy

**File:** `supabase/migrations/202603070021_add_pages_parent_id.sql`

#### Added Column

```sql
ALTER TABLE guest_guide.pages 
ADD COLUMN parent_id UUID REFERENCES guest_guide.pages(id) ON DELETE SET NULL;
```

#### Hierarchy Population

Populated `parent_id` based on slug prefix:

```sql
-- Example: 'sua-estadia/check-in' → parent_id = page with slug 'sua-estadia'
UPDATE guest_guide.pages
SET parent_id = parent_pages.id
FROM (
    SELECT child.id, parent_pages.id as parent_id
    FROM guest_guide.pages child
    JOIN guest_guide.pages parent_pages 
        ON parent_pages.slug = SUBSTRING(child.slug FROM 1 FOR POSITION...)
    WHERE child.slug LIKE '%/%'
) AS hierarchy
WHERE guest_guide.pages.id = hierarchy.child_id;
```

#### Validation Trigger

Created `validate_page_parent()` trigger to ensure:
- Parent page exists
- Parent belongs to same `property_id` and `org_id`

## Tenant Isolation Verification

### Before

| Table | property_id | org_id | RLS |
|-------|-------------|--------|-----|
| partner_schedules | ❌ No | ❌ No | ❌ Over-permissive |
| partner_media | ❌ No | ❌ No | ❌ Over-permissive |
| pages | ✅ Yes | ✅ Yes | ✅ Correct |

### After

| Table | property_id | org_id | RLS |
|-------|-------------|--------|-----|
| partner_schedules | ✅ Yes | ✅ Yes | ✅ Enforced |
| partner_media | ✅ Yes | ✅ Yes | ✅ Enforced |
| pages | ✅ Yes | ✅ Yes | ✅ + Hierarchy |

## QA Validation

- ✓ Migration runs successfully
- ✓ RLS policies enforce tenant isolation
- ✓ pages.parent_id populated correctly
- ✓ Validation trigger prevents cross-tenant parent assignment

## Git Commit

```
feat(sp0.3): add pages.parent_id hierarchy and enforce RLS on partner tables
```
