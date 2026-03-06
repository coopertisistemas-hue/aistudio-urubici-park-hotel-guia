-- Migration: 006_guest_guide_constraints_indexes.sql
-- Date: 2026-03-06
-- Purpose: Criar constraints, indexes e chaves unicas

BEGIN;

-- ============================================
-- INDEXES PARA PERFORMANCE
-- ============================================

-- home_configs
CREATE INDEX idx_home_configs_property_id ON guest_guide.home_configs(property_id);
CREATE INDEX idx_home_configs_org_id ON guest_guide.home_configs(org_id);
CREATE INDEX idx_home_configs_locale ON guest_guide.home_configs(property_id, locale);

-- pages
CREATE INDEX idx_pages_property_id ON guest_guide.pages(property_id);
CREATE INDEX idx_pages_org_id ON guest_guide.pages(org_id);
CREATE INDEX idx_pages_slug ON guest_guide.pages(property_id, slug);
CREATE INDEX idx_pages_status ON guest_guide.pages(status) WHERE status = 'published';
CREATE INDEX idx_pages_property_status ON guest_guide.pages(property_id, status) WHERE status = 'published';

-- page_routes
CREATE INDEX idx_page_routes_page_id ON guest_guide.page_routes(page_id);
CREATE INDEX idx_page_routes_locale_slug ON guest_guide.page_routes(locale, slug);

-- content_blocks
CREATE INDEX idx_content_blocks_page_id ON guest_guide.content_blocks(page_id);
CREATE INDEX idx_content_blocks_property_id ON guest_guide.content_blocks(property_id);
CREATE INDEX idx_content_blocks_org_id ON guest_guide.content_blocks(org_id);
CREATE INDEX idx_content_blocks_locale ON guest_guide.content_blocks(locale);
CREATE INDEX idx_content_blocks_order ON guest_guide.content_blocks(page_id, block_order);

-- navigation_nodes
CREATE INDEX idx_navigation_property_id ON guest_guide.navigation_nodes(property_id);
CREATE INDEX idx_navigation_org_id ON guest_guide.navigation_nodes(org_id);
CREATE INDEX idx_navigation_parent ON guest_guide.navigation_nodes(parent_id);
CREATE INDEX idx_navigation_locale ON guest_guide.navigation_nodes(locale);
CREATE INDEX idx_navigation_sort ON guest_guide.navigation_nodes(property_id, sort_order) WHERE is_visible = true;

-- tags
CREATE INDEX idx_tags_property_id ON guest_guide.tags(property_id);
CREATE INDEX idx_tags_org_id ON guest_guide.tags(org_id);

-- page_tags
CREATE INDEX idx_page_tags_page_id ON guest_guide.page_tags(page_id);
CREATE INDEX idx_page_tags_tag_id ON guest_guide.page_tags(tag_id);

-- contacts
CREATE INDEX idx_contacts_property_id ON guest_guide.contacts(property_id);
CREATE INDEX idx_contacts_org_id ON guest_guide.contacts(org_id);
CREATE INDEX idx_contacts_type ON guest_guide.contacts(contact_type);

-- partners
CREATE INDEX idx_partners_property_id ON guest_guide.partners(property_id);
CREATE INDEX idx_partners_org_id ON guest_guide.partners(org_id);
CREATE INDEX idx_partners_slug ON guest_guide.partners(property_id, slug);
CREATE INDEX idx_partners_category ON guest_guide.partners(category);
CREATE INDEX idx_partners_type ON guest_guide.partners(partner_type);
CREATE INDEX idx_partners_active ON guest_guide.partners(is_active) WHERE is_active = true;

-- partner_schedules
CREATE INDEX idx_partner_schedules_partner_id ON guest_guide.partner_schedules(partner_id);
CREATE INDEX idx_partner_schedules_day ON guest_guide.partner_schedules(partner_id, day_of_week);

-- partner_media
CREATE INDEX idx_partner_media_partner_id ON guest_guide.partner_media(partner_id);

-- partner_promotions
CREATE INDEX idx_partner_promotions_property_id ON guest_guide.partner_promotions(property_id);
CREATE INDEX idx_partner_promotions_org_id ON guest_guide.partner_promotions(org_id);
CREATE INDEX idx_partner_promotions_active ON guest_guide.partner_promotions(is_active) WHERE is_active = true;
CREATE INDEX idx_partner_promotions_validity ON guest_guide.partner_promotions(valid_from, valid_until) WHERE is_active = true;

-- background_videos
CREATE INDEX idx_background_videos_property_id ON guest_guide.background_videos(property_id);
CREATE INDEX idx_background_videos_org_id ON guest_guide.background_videos(org_id);
CREATE INDEX idx_background_videos_active ON guest_guide.background_videos(is_active) WHERE is_active = true;

-- sponsored_slots
CREATE INDEX idx_sponsored_slots_property_id ON guest_guide.sponsored_slots(property_id);
CREATE INDEX idx_sponsored_slots_org_id ON guest_guide.sponsored_slots(org_id);
CREATE INDEX idx_sponsored_slots_active ON guest_guide.sponsored_slots(is_active) WHERE is_active = true;
CREATE INDEX idx_sponsored_slots_type ON guest_guide.sponsored_slots(slot_type);

-- partner_display_configs
CREATE INDEX idx_partner_display_configs_property_id ON guest_guide.partner_display_configs(property_id);

-- ============================================
-- CONSTRAINTS ADICIONAIS
-- ============================================

-- Garantir que apenas um video default por propriedade
CREATE UNIQUE INDEX idx_background_videos_default_per_property 
ON guest_guide.background_videos(property_id) 
WHERE is_default = true AND is_active = true AND deleted_at IS NULL;

-- Garantir slug unico por locale na tabela page_routes (via unique constraint ja coberto)
-- Garantir que home_config tenha apenas uma por locale por propriedade
CREATE UNIQUE INDEX idx_home_configs_locale_per_property 
ON guest_guide.home_configs(property_id, locale) 
WHERE deleted_at IS NULL;

-- Constraint: pages deve ter org_id consistente com property_id
ALTER TABLE guest_guide.pages 
ADD CONSTRAINT fk_pages_org_property 
FOREIGN KEY (property_id) REFERENCES public.properties(id);

-- Constraint: Garantir que navigation_nodes tenha page_id ou url
ALTER TABLE guest_guide.navigation_nodes 
ADD CONSTRAINT chk_navigation_has_target 
CHECK (page_id IS NOT NULL OR url IS NOT NULL);

-- Constraint: partner_promotions deve ter partner ou titulo proprio
ALTER TABLE guest_guide.partner_promotions 
ADD CONSTRAINT chk_promotion_has_content 
CHECK (partner_id IS NOT NULL OR title IS NOT NULL);

-- Trigger function para validar org_id = property.org_id
-- sera criado em 007

COMMIT;
