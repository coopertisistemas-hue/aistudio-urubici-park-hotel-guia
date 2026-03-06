-- Migration: 003_create_guest_guide_partner_tables.sql
-- Date: 2026-03-06
-- Purpose: Criar tabelas de parceiros e recomendacoes

BEGIN;

-- 1. Tabela de parceiros
CREATE TABLE guest_guide.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    website_url TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    category VARCHAR(50),
    partner_type VARCHAR(50) DEFAULT 'recommended',
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(property_id, slug)
);

-- 2. Tabela de horarios de funcionamento dos parceiros
CREATE TABLE guest_guide.partner_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES guest_guide.partners(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de midias dos parceiros
CREATE TABLE guest_guide.partner_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES guest_guide.partners(id) ON DELETE CASCADE,
    media_type VARCHAR(20) NOT NULL,
    url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de promocoes dos parceiros (para o Guest Guide)
CREATE TABLE guest_guide.partner_promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    partner_id UUID REFERENCES guest_guide.partners(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    discount_code VARCHAR(50),
    discount_value VARCHAR(100),
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE guest_guide.partners IS 'Parceiros e recomendacoes de servicos';
COMMENT ON TABLE guest_guide.partner_schedules IS 'Horarios de funcionamento dos parceiros';
COMMENT ON TABLE guest_guide.partner_media IS 'Midias (fotos/videos) dos parceiros';
COMMENT ON TABLE guest_guide.partner_promotions IS 'Promocoes disponiveis para hospedes';

COMMIT;
