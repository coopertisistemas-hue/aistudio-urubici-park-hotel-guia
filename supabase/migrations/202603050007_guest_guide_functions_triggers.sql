-- Migration: 007_guest_guide_functions_triggers.sql
-- Date: 2026-03-06
-- Purpose: Criar funcoes e triggers de consistencia multi-tenant

BEGIN;

-- ============================================
-- FUNCOES DE CONSISTENCIA
-- ============================================

-- Funcao para obter org_id a partir de property_id
CREATE OR REPLACE FUNCTION guest_guide.get_org_id_from_property(p_property_id UUID)
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT org_id FROM public.properties WHERE id = p_property_id);
END;
$$ LANGUAGE plpgsql STABLE;

-- Funcao para validar consistencia org_id/property_id
CREATE OR REPLACE FUNCTION guest_guide.validate_org_property_consistency()
RETURNS TRIGGER AS $$
DECLARE
    v_property_org_id UUID;
BEGIN
    IF NEW.property_id IS NOT NULL THEN
        v_property_org_id := guest_guide.get_org_id_from_property(NEW.property_id);
        IF NEW.org_id IS NULL THEN
            NEW.org_id := v_property_org_id;
        ELSIF NEW.org_id <> v_property_org_id THEN
            RAISE EXCEPTION 'Inconsistent org_id: property belongs to org %, but value is %', v_property_org_id, NEW.org_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funcao para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION guest_guide.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funcao para definir published_at quando status muda para published
CREATE OR REPLACE FUNCTION guest_guide.set_published_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND OLD.status <> 'published' THEN
        NEW.published_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funcao para resolucao de video com fallback
CREATE OR REPLACE FUNCTION guest_guide.resolve_background_video(p_property_id UUID, p_locale VARCHAR DEFAULT 'pt-BR')
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
        SELECT id, video_url, thumbnail_url, title, is_sponsored, sponsor_name, sponsor_logo_url
        FROM guest_guide.background_videos
        WHERE property_id = p_property_id
          AND is_active = true
          AND deleted_at IS NULL
        ORDER BY is_sponsored DESC, sort_order ASC
        LIMIT 1
    )
    SELECT 
        v.id,
        COALESCE(v.video_url, dv.video_url) AS video_url,
        COALESCE(v.thumbnail_url, dv.thumbnail_url) AS thumbnail_url,
        COALESCE(v.title, dv.title) AS title,
        COALESCE(v.is_sponsored, false) AS is_sponsored,
        v.sponsor_name,
        v.sponsor_logo_url
    FROM active_videos v
    LEFT JOIN LATERAL (
        SELECT video_url, thumbnail_url, title
        FROM guest_guide.background_videos
        WHERE property_id = p_property_id
          AND is_active = true
          AND is_default = true
          AND deleted_at IS NULL
        ORDER BY sort_order ASC
        LIMIT 1
    ) dv ON true
    WHERE v.video_url IS NOT NULL
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

-- Funcao para track_event com idempotencia
CREATE OR REPLACE FUNCTION guest_guide.track_event(
    p_property_id UUID,
    p_event_type VARCHAR,
    p_event_category VARCHAR DEFAULT NULL,
    p_event_label VARCHAR DEFAULT NULL,
    p_entity_type VARCHAR DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL,
    p_user_session_id VARCHAR DEFAULT NULL,
    p_idempotency_key VARCHAR DEFAULT NULL,
    p_referrer_url TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
    v_org_id UUID;
BEGIN
    -- Obter org_id a partir da property
    v_org_id := guest_guide.get_org_id_from_property(p_property_id);
    
    -- Verificar idempotencia
    IF p_idempotency_key IS NOT NULL THEN
        SELECT id INTO v_event_id
        FROM guest_guide.event_log
        WHERE property_id = p_property_id
          AND idempotency_key = p_idempotency_key
        LIMIT 1;
        
        IF v_event_id IS NOT NULL THEN
            RETURN v_event_id;
        END IF;
    END IF;
    
    -- Inserir evento
    INSERT INTO guest_guide.event_log (
        property_id,
        org_id,
        event_type,
        event_category,
        event_label,
        entity_type,
        entity_id,
        user_session_id,
        idempotency_key,
        referrer_url,
        user_agent,
        metadata
    ) VALUES (
        p_property_id,
        v_org_id,
        p_event_type,
        p_event_category,
        p_event_label,
        p_entity_type,
        p_entity_id,
        p_user_session_id,
        p_idempotency_key,
        p_referrer_url,
        p_user_agent,
        p_metadata
    )
    RETURNING id INTO v_event_id;
    
    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: consistency check para home_configs
CREATE TRIGGER trg_home_configs_org_consistency
    BEFORE INSERT OR UPDATE ON guest_guide.home_configs
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.validate_org_property_consistency();

-- Trigger: updated_at para home_configs
CREATE TRIGGER trg_home_configs_updated_at
    BEFORE UPDATE ON guest_guide.home_configs
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.set_updated_at();

-- Trigger: consistency check para pages
CREATE TRIGGER trg_pages_org_consistency
    BEFORE INSERT OR UPDATE ON guest_guide.pages
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.validate_org_property_consistency();

-- Trigger: updated_at para pages
CREATE TRIGGER trg_pages_updated_at
    BEFORE UPDATE ON guest_guide.pages
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.set_updated_at();

-- Trigger: published_at para pages
CREATE TRIGGER trg_pages_published_at
    BEFORE UPDATE ON guest_guide.pages
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.set_published_at();

-- Trigger: updated_at para page_routes
CREATE TRIGGER trg_page_routes_updated_at
    BEFORE UPDATE ON guest_guide.page_routes
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.set_updated_at();

-- Trigger: consistency check para content_blocks
CREATE TRIGGER trg_content_blocks_org_consistency
    BEFORE INSERT OR UPDATE ON guest_guide.content_blocks
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.validate_org_property_consistency();

-- Trigger: updated_at para content_blocks
CREATE TRIGGER trg_content_blocks_updated_at
    BEFORE UPDATE ON guest_guide.content_blocks
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.set_updated_at();

-- Trigger: consistency check para navigation_nodes
CREATE TRIGGER trg_navigation_org_consistency
    BEFORE INSERT OR UPDATE ON guest_guide.navigation_nodes
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.validate_org_property_consistency();

-- Trigger: updated_at para navigation_nodes
CREATE TRIGGER trg_navigation_updated_at
    BEFORE UPDATE ON guest_guide.navigation_nodes
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.set_updated_at();

-- Trigger: consistency check para tags
CREATE TRIGGER trg_tags_org_consistency
    BEFORE INSERT OR UPDATE ON guest_guide.tags
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.validate_org_property_consistency();

-- Trigger: updated_at para tags
CREATE TRIGGER trg_tags_updated_at
    BEFORE UPDATE ON guest_guide.tags
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.set_updated_at();

-- Trigger: consistency check para contacts
CREATE TRIGGER trg_contacts_org_consistency
    BEFORE INSERT OR UPDATE ON guest_guide.contacts
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.validate_org_property_consistency();

-- Trigger: updated_at para contacts
CREATE TRIGGER trg_contacts_updated_at
    BEFORE UPDATE ON guest_guide.contacts
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.set_updated_at();

-- Trigger: consistency check para partners
CREATE TRIGGER trg_partners_org_consistency
    BEFORE INSERT OR UPDATE ON guest_guide.partners
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.validate_org_property_consistency();

-- Trigger: updated_at para partners
CREATE TRIGGER trg_partners_updated_at
    BEFORE UPDATE ON guest_guide.partners
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.set_updated_at();

-- Trigger: updated_at para partner_promotions
CREATE TRIGGER trg_partner_promotions_updated_at
    BEFORE UPDATE ON guest_guide.partners
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.set_updated_at();

-- Trigger: consistency check para background_videos
CREATE TRIGGER trg_background_videos_org_consistency
    BEFORE INSERT OR UPDATE ON guest_guide.background_videos
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.validate_org_property_consistency();

-- Trigger: updated_at para background_videos
CREATE TRIGGER trg_background_videos_updated_at
    BEFORE UPDATE ON guest_guide.background_videos
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.set_updated_at();

-- Trigger: consistency check para sponsored_slots
CREATE TRIGGER trg_sponsored_slots_org_consistency
    BEFORE INSERT OR UPDATE ON guest_guide.sponsored_slots
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.validate_org_property_consistency();

-- Trigger: updated_at para sponsored_slots
CREATE TRIGGER trg_sponsored_slots_updated_at
    BEFORE UPDATE ON guest_guide.sponsored_slots
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.set_updated_at();

-- Trigger: consistency check para partner_display_configs
CREATE TRIGGER trg_partner_display_configs_org_consistency
    BEFORE INSERT OR UPDATE ON guest_guide.partner_display_configs
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.validate_org_property_consistency();

-- Trigger: updated_at para partner_display_configs
CREATE TRIGGER trg_partner_display_configs_updated_at
    BEFORE UPDATE ON guest_guide.partner_display_configs
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.set_updated_at();

-- Trigger: updated_at para event_aggregates
CREATE TRIGGER trg_event_aggregates_updated_at
    BEFORE UPDATE ON guest_guide.event_aggregates
    FOR EACH ROW
    EXECUTE FUNCTION guest_guide.set_updated_at();

COMMIT;
