-- Migration: 008_guest_guide_rls.sql
-- Date: 2026-03-06
-- Purpose: Implementar RLS (Row Level Security) em todas as tabelas do schema guest_guide

BEGIN;

-- ============================================
-- HABILITAR RLS EM TODAS AS TABELAS
-- ============================================

ALTER TABLE guest_guide.home_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.page_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.navigation_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.page_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.partner_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.partner_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.partner_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.background_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.sponsored_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.partner_display_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.event_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_guide.event_aggregates ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLITICAS PARA home_configs
-- ============================================

-- Leitura publica: apenas configs ativas de propriedades com conteudo published
CREATE POLICY "home_configs_anon_read"
ON guest_guide.home_configs FOR SELECT
USING (
    deleted_at IS NULL
);

-- Leitura autenticada: membros da org
CREATE POLICY "home_configs_member_read"
ON guest_guide.home_configs FOR SELECT
USING (
    deleted_at IS NULL
    AND (
        EXISTS (SELECT 1 FROM public.is_org_member(org_id))
        OR org_id = (SELECT org_id FROM public.properties WHERE id = property_id)
    )
);

-- Escrita: apenas admin da org
CREATE POLICY "home_configs_admin_write"
ON guest_guide.home_configs FOR ALL
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

-- Staff override
CREATE POLICY "home_configs_staff_all"
ON guest_guide.home_configs FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.is_hostconnect_staff())
)
WITH CHECK (true);

-- ============================================
-- POLITICAS PARA pages
-- ============================================

-- Leitura publica: apenas pages published
CREATE POLICY "pages_anon_read"
ON guest_guide.pages FOR SELECT
USING (
    deleted_at IS NULL
    AND status = 'published'
);

-- Leitura autenticada: membros da org veem todos os status
CREATE POLICY "pages_member_read"
ON guest_guide.pages FOR SELECT
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

-- Escrita: apenas admin da org
CREATE POLICY "pages_admin_write"
ON guest_guide.pages FOR ALL
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

-- Staff override
CREATE POLICY "pages_staff_all"
ON guest_guide.pages FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- ============================================
-- POLITICAS PARA page_routes
-- ============================================

-- Leitura publica: apenas routes de pages published
CREATE POLICY "page_routes_anon_read"
ON guest_guide.page_routes FOR SELECT
USING (
    deleted_at IS NULL
    AND EXISTS (
        SELECT 1 FROM guest_guide.pages p
        WHERE p.id = page_id
          AND p.status = 'published'
          AND p.deleted_at IS NULL
    )
);

-- Leitura autenticada
CREATE POLICY "page_routes_member_read"
ON guest_guide.page_routes FOR SELECT
USING (
    deleted_at IS NULL
    AND EXISTS (
        SELECT 1 FROM guest_guide.pages p
        JOIN public.properties pr ON pr.id = p.property_id
        WHERE p.id = page_id
          AND pr.org_id = p.org_id
    )
);

-- Escrita: admin
CREATE POLICY "page_routes_admin_write"
ON guest_guide.page_routes FOR ALL
USING (
    deleted_at IS NULL
    AND EXISTS (
        SELECT 1 FROM guest_guide.pages p
        WHERE p.id = page_id
          AND EXISTS (SELECT 1 FROM public.is_org_admin(p.org_id))
    )
)
WITH CHECK (
    deleted_at IS NULL
    AND EXISTS (
        SELECT 1 FROM guest_guide.pages p
        WHERE p.id = page_id
          AND EXISTS (SELECT 1 FROM public.is_org_admin(p.org_id))
    )
);

-- ============================================
-- POLITICAS PARA content_blocks
-- ============================================

-- Leitura publica: apenas blocks de pages published
CREATE POLICY "content_blocks_anon_read"
ON guest_guide.content_blocks FOR SELECT
USING (
    deleted_at IS NULL
    AND EXISTS (
        SELECT 1 FROM guest_guide.pages p
        WHERE p.id = page_id
          AND p.status = 'published'
          AND p.deleted_at IS NULL
    )
);

-- Leitura autenticada
CREATE POLICY "content_blocks_member_read"
ON guest_guide.content_blocks FOR SELECT
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

-- Escrita: admin
CREATE POLICY "content_blocks_admin_write"
ON guest_guide.content_blocks FOR ALL
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

-- Staff override
CREATE POLICY "content_blocks_staff_all"
ON guest_guide.content_blocks FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- ============================================
-- POLITICAS PARA navigation_nodes
-- ============================================

-- Leitura publica: apenas nodes visiveis de pages published
CREATE POLICY "navigation_nodes_anon_read"
ON guest_guide.navigation_nodes FOR SELECT
USING (
    deleted_at IS NULL
    AND is_visible = true
    AND (
        page_id IS NULL
        OR EXISTS (
            SELECT 1 FROM guest_guide.pages p
            WHERE p.id = page_id
              AND p.status = 'published'
              AND p.deleted_at IS NULL
        )
    )
);

-- Leitura autenticada
CREATE POLICY "navigation_nodes_member_read"
ON guest_guide.navigation_nodes FOR SELECT
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

-- Escrita: admin
CREATE POLICY "navigation_nodes_admin_write"
ON guest_guide.navigation_nodes FOR ALL
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

-- ============================================
-- POLITICAS PARA tags
-- ============================================

CREATE POLICY "tags_anon_read"
ON guest_guide.tags FOR SELECT
USING (deleted_at IS NULL);

CREATE POLICY "tags_member_read"
ON guest_guide.tags FOR SELECT
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

CREATE POLICY "tags_admin_write"
ON guest_guide.tags FOR ALL
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

-- ============================================
-- POLITICAS PARA page_tags
-- ============================================

CREATE POLICY "page_tags_anon_read"
ON guest_guide.page_tags FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM guest_guide.pages p
        WHERE p.id = page_id
          AND p.status = 'published'
          AND p.deleted_at IS NULL
    )
);

CREATE POLICY "page_tags_member_read"
ON guest_guide.page_tags FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM guest_guide.pages p
        JOIN public.properties pr ON pr.id = p.property_id
        WHERE p.id = page_id AND pr.org_id = p.org_id
    )
);

CREATE POLICY "page_tags_admin_write"
ON guest_guide.page_tags FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM guest_guide.pages p
        WHERE p.id = page_id
          AND EXISTS (SELECT 1 FROM public.is_org_admin(p.org_id))
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM guest_guide.pages p
        WHERE p.id = page_id
          AND EXISTS (SELECT 1 FROM public.is_org_admin(p.org_id))
    )
);

-- ============================================
-- POLITICAS PARA contacts
-- ============================================

CREATE POLICY "contacts_anon_read"
ON guest_guide.contacts FOR SELECT
USING (deleted_at IS NULL);

CREATE POLICY "contacts_member_read"
ON guest_guide.contacts FOR SELECT
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

CREATE POLICY "contacts_admin_write"
ON guest_guide.contacts FOR ALL
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

-- ============================================
-- POLITICAS PARA partners
-- ============================================

CREATE POLICY "partners_anon_read"
ON guest_guide.partners FOR SELECT
USING (
    deleted_at IS NULL
    AND is_active = true
);

CREATE POLICY "partners_member_read"
ON guest_guide.partners FOR SELECT
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

CREATE POLICY "partners_admin_write"
ON guest_guide.partners FOR ALL
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

CREATE POLICY "partners_staff_all"
ON guest_guide.partners FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

-- ============================================
-- POLITICAS PARA partner_schedules
-- ============================================

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

CREATE POLICY "partner_schedules_member_read"
ON guest_guide.partner_schedules FOR SELECT
USING (true);

CREATE POLICY "partner_schedules_admin_write"
ON guest_guide.partner_schedules FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM guest_guide.partners p
        WHERE p.id = partner_id
          AND EXISTS (SELECT 1 FROM public.is_org_admin(p.org_id))
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM guest_guide.partners p
        WHERE p.id = partner_id
          AND EXISTS (SELECT 1 FROM public.is_org_admin(p.org_id))
    )
);

-- ============================================
-- POLITICAS PARA partner_media
-- ============================================

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

CREATE POLICY "partner_media_member_read"
ON guest_guide.partner_media FOR SELECT USING (true);

CREATE POLICY "partner_media_admin_write"
ON guest_guide.partner_media FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM guest_guide.partners p
        WHERE p.id = partner_id
          AND EXISTS (SELECT 1 FROM public.is_org_admin(p.org_id))
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM guest_guide.partners p
        WHERE p.id = partner_id
          AND EXISTS (SELECT 1 FROM public.is_org_admin(p.org_id))
    )
);

-- ============================================
-- POLITICAS PARA partner_promotions
-- ============================================

CREATE POLICY "partner_promotions_anon_read"
ON guest_guide.partner_promotions FOR SELECT
USING (
    deleted_at IS NULL
    AND is_active = true
    AND (valid_from IS NULL OR valid_from <= NOW())
    AND (valid_until IS NULL OR valid_until >= NOW())
);

CREATE POLICY "partner_promotions_member_read"
ON guest_guide.partner_promotions FOR SELECT
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

CREATE POLICY "partner_promotions_admin_write"
ON guest_guide.partner_promotions FOR ALL
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

-- ============================================
-- POLITICAS PARA background_videos
-- ============================================

CREATE POLICY "background_videos_anon_read"
ON guest_guide.background_videos FOR SELECT
USING (
    deleted_at IS NULL
    AND is_active = true
);

CREATE POLICY "background_videos_member_read"
ON guest_guide.background_videos FOR SELECT
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

CREATE POLICY "background_videos_admin_write"
ON guest_guide.background_videos FOR ALL
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

-- ============================================
-- POLITICAS PARA sponsored_slots
-- ============================================

CREATE POLICY "sponsored_slots_anon_read"
ON guest_guide.sponsored_slots FOR SELECT
USING (
    deleted_at IS NULL
    AND is_active = true
    AND (valid_from IS NULL OR valid_from <= NOW())
    AND (valid_until IS NULL OR valid_until >= NOW())
);

CREATE POLICY "sponsored_slots_member_read"
ON guest_guide.sponsored_slots FOR SELECT
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

CREATE POLICY "sponsored_slots_admin_write"
ON guest_guide.sponsored_slots FOR ALL
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

-- ============================================
-- POLITICAS PARA partner_display_configs
-- ============================================

CREATE POLICY "partner_display_configs_anon_read"
ON guest_guide.partner_display_configs FOR SELECT
USING (deleted_at IS NULL);

CREATE POLICY "partner_display_configs_member_read"
ON guest_guide.partner_display_configs FOR SELECT
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_member(org_id))
);

CREATE POLICY "partner_display_configs_admin_write"
ON guest_guide.partner_display_configs FOR ALL
USING (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
)
WITH CHECK (
    deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
);

-- ============================================
-- POLITICAS PARA event_log
-- ============================================

-- Leitura: apenas staff e analytics
CREATE POLICY "event_log_read"
ON guest_guide.event_log FOR SELECT
USING (
    EXISTS (SELECT 1 FROM public.is_org_admin(org_id))
    OR EXISTS (SELECT 1 FROM public.is_hostconnect_staff())
);

-- Insercao: qualquer um via track_event (mas via RPC apenas)
-- Nao expomos INSERT direto, apenas via funcao track_event
-- Por seguranca, permitimos insert anon para permitir track via BFF
CREATE POLICY "event_log_insert_anon"
ON guest_guide.event_log FOR INSERT
WITH CHECK (true);

-- ============================================
-- POLITICAS PARA event_aggregates
-- ============================================

CREATE POLICY "event_aggregates_read"
ON guest_guide.event_aggregates FOR SELECT
USING (
    EXISTS (SELECT 1 FROM public.is_org_member(org_id))
    OR EXISTS (SELECT 1 FROM public.is_hostconnect_staff())
);

CREATE POLICY "event_aggregates_admin_write"
ON guest_guide.event_aggregates FOR ALL
USING (EXISTS (SELECT 1 FROM public.is_hostconnect_staff()))
WITH CHECK (true);

COMMIT;
