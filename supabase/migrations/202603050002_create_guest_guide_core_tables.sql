-- Migration: 002_create_guest_guide_core_tables.sql
-- Date: 2026-03-06
-- Purpose: Criar tabelas core do guest_guide (navegacao, paginas, blocos de conteudo)

BEGIN;

-- 1. Tabela de configuracao do Guest Guide por propriedade
CREATE TABLE guest_guide.home_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    locale VARCHAR(5) DEFAULT 'pt-BR',
    title TEXT NOT NULL,
    subtitle TEXT,
    background_video_url TEXT,
    background_video_fallback_url TEXT,
    logo_url TEXT,
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    show_weather BOOLEAN DEFAULT true,
    show_partners BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 2. Tabela de paginas
CREATE TABLE guest_guide.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    meta_title TEXT,
    meta_description TEXT,
    cover_image_url TEXT,
    template VARCHAR(50) DEFAULT 'default',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 3. Tabela de rotas (slug por locale)
CREATE TABLE guest_guide.page_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES guest_guide.pages(id) ON DELETE CASCADE,
    locale VARCHAR(5) NOT NULL DEFAULT 'pt-BR',
    slug VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(page_id, locale)
);

-- 4. Tabela de blocos de conteudo (ordenados)
CREATE TABLE guest_guide.content_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES guest_guide.pages(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    locale VARCHAR(5) NOT NULL DEFAULT 'pt-BR',
    block_type VARCHAR(50) NOT NULL,
    block_order INTEGER NOT NULL DEFAULT 0,
    title TEXT,
    content TEXT,
    image_url TEXT,
    video_url TEXT,
    cta_label TEXT,
    cta_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 5. Tabela de navegacao (menu tree)
CREATE TABLE guest_guide.navigation_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    parent_id UUID REFERENCES guest_guide.navigation_nodes(id) ON DELETE CASCADE,
    page_id UUID REFERENCES guest_guide.pages(id) ON DELETE SET NULL,
    locale VARCHAR(5) NOT NULL DEFAULT 'pt-BR',
    label VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    icon VARCHAR(100),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 6. Tabela de tags
CREATE TABLE guest_guide.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    color VARCHAR(7),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(property_id, slug)
);

-- 7. Tabela de paginas_tags (relacionamento many-to-many)
CREATE TABLE guest_guide.page_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES guest_guide.pages(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES guest_guide.tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(page_id, tag_id)
);

-- 8. Tabela de contatos/utilidades
CREATE TABLE guest_guide.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    contact_type VARCHAR(50) NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    is_emergency BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE guest_guide.home_configs IS 'Configuracoes da home do Guest Guide por propriedade';
COMMENT ON TABLE guest_guide.pages IS 'Paginas do Guest Guide';
COMMENT ON TABLE guest_guide.page_routes IS 'Rotas/localizacao das paginas';
COMMENT ON TABLE guest_guide.content_blocks IS 'Blocos de conteudo ordenados por pagina';
COMMENT ON TABLE guest_guide.navigation_nodes IS 'Arvore de navegacao do menu';
COMMENT ON TABLE guest_guide.tags IS 'Tags para categorizacao de paginas';
COMMENT ON TABLE guest_guide.page_tags IS 'Relacionamento many-to-many entre paginas e tags';
COMMENT ON TABLE guest_guide.contacts IS 'Contatos e utilidades ( emergencia, servicos, etc)';

COMMIT;
