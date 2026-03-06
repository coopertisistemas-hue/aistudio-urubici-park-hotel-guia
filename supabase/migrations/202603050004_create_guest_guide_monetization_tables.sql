-- Migration: 004_create_guest_guide_monetization_tables.sql
-- Date: 2026-03-06
-- Purpose: Criar tabelas de monetizacao (videos patrocinados, featured slots)

BEGIN;

-- 1. Tabela de videos de background
CREATE TABLE guest_guide.background_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    title VARCHAR(255),
    description TEXT,
    is_sponsored BOOLEAN DEFAULT false,
    sponsor_name VARCHAR(255),
    sponsor_logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    play_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 2. Tabela de slots patrocinados (parceiros em destaque)
CREATE TABLE guest_guide.sponsored_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    slot_type VARCHAR(50) NOT NULL,
    partner_id UUID REFERENCES guest_guide.partners(id) ON DELETE SET NULL,
    title VARCHAR(255),
    description TEXT,
    image_url TEXT,
    cta_label VARCHAR(100),
    cta_url TEXT,
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 3. Tabela de configuracao de exibicao de parceiros
CREATE TABLE guest_guide.partner_display_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    category VARCHAR(50),
    layout VARCHAR(50) DEFAULT 'grid',
    items_per_row INTEGER DEFAULT 3,
    show_description BOOLEAN DEFAULT true,
    show_logo BOOLEAN DEFAULT true,
    show_schedule BOOLEAN DEFAULT false,
    max_items INTEGER,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(property_id, category)
);

COMMENT ON TABLE guest_guide.background_videos IS 'Videos de background (inclui patrocinados)';
COMMENT ON TABLE guest_guide.sponsored_slots IS 'Slots patrocinados na interface';
COMMENT ON TABLE guest_guide.partner_display_configs IS 'Configuracao de visualizacao de parceiros por categoria';

COMMIT;
