-- Migration: 011_seed_uph_home_video_default_and_sponsored_slots.sql
-- Date: 2026-03-06
-- Purpose: Seed de videos de background (inclui sponsored) e slots patrocinados

BEGIN;

-- ============================================
-- 1. VIDEOS DE BACKGROUND
-- ============================================

-- Video default (não patrocinado)
INSERT INTO guest_guide.background_videos (
    property_id,
    org_id,
    video_url,
    thumbnail_url,
    title,
    description,
    is_sponsored,
    sponsor_name,
    sponsor_logo_url,
    is_active,
    is_default,
    sort_order
) VALUES
('22222222-2222-2222-2222-222222222222', 
 'b729534c-753b-48b0-ab4f-0756cc1cd271',
 'https://example.com/videos/uph-paisagem-serra.mp4',
 'https://example.com/thumbnails/uph-paisagem-serra.jpg',
 'Vista da Serra Catarinense',
 'Panorâmica das montanhas de Urubici',
 false,
 NULL,
 NULL,
 true,
 true,
 1),

-- Video patrocinado (exemplo)
('22222222-2222-2222-2222-222222222222',
 'b729534c-753b-48b0-ab4f-0756cc1cd271',
 'https://example.com/videos/pimenta-rosa-promocao.mp4',
 'https://example.com/thumbnails/pimenta-rosa.jpg',
 'Restaurante Pimenta Rosa',
 'Conheça o melhor da gastronomia local',
 true,
 'Restaurante Pimenta Rosa',
 'https://example.com/logos/pimenta-rosa-logo.png',
 true,
 false,
 0),

-- Segundo video não patrocinado
('22222222-2222-2222-2222-222222222222',
 'b729534c-753b-48b0-ab4f-0756cc1cd271',
 'https://example.com/videos/uph-interior.mp4',
 'https://example.com/thumbnails/uph-interior.jpg',
 'Instalações do Hotel',
 'Conforto e aconchego em Urubici',
 false,
 NULL,
 NULL,
 true,
 false,
 2),

-- Video patrocinado 2 (exemplo)
('22222222-2222-2222-2222-222222222222',
 'b729534c-753b-48b0-ab4f-0756cc1cd271',
 'https://example.com/videos/urubici-adventures-trilha.mp4',
 'https://example.com/thumbnails/urubici-adventures.jpg',
 'Urubici Adventures',
 'Trilhas e ecoturismo na região',
 true,
 'Urubici Adventures',
 'https://example.com/logos/urubici-adventures-logo.png',
 true,
 false,
 0);

-- ============================================
-- 2. SLOTS PATROCINADOS (PARCEIROS EM DESTAQUE)
-- ============================================

-- Slot para parceiro Pimenta Rosa (Hero)
INSERT INTO guest_guide.sponsored_slots (
    property_id,
    org_id,
    slot_type,
    partner_id,
    title,
    description,
    image_url,
    cta_label,
    cta_url,
    is_active,
    valid_from,
    valid_until,
    sort_order
) VALUES
('22222222-2222-2222-2222-222222222222',
 'b729534c-753b-48b0-ab4f-0756cc1cd271',
 'hero_banner',
 (SELECT id FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa' LIMIT 1),
 'Restaurante Pimenta Rosa',
 'Gastronomia premium com ingredientes locais',
 'https://example.com/images/pimenta-rosa-banner.jpg',
 'Reservar Mesa',
 'https://www.pimentarosa.com.br/reserva',
 true,
 NOW(),
 NOW() + INTERVAL '1 year',
 1),

-- Slot para parceiro Urubici Adventures
('22222222-2222-2222-2222-222222222222',
 'b729534c-753b-48b0-ab4f-0756cc1cd271',
 'hero_banner',
 (SELECT id FROM guest_guide.partners WHERE slug = 'urubici-adventures' LIMIT 1),
 'Urubici Adventures',
 'Experiências únicas de ecoturismo',
 'https://example.com/images/urubici-adventures-banner.jpg',
 'Agendar Tour',
 'https://www.urubiciadventures.com.br/tours',
 true,
 NOW(),
 NOW() + INTERVAL '1 year',
 2);

-- ============================================
-- 3. CONFIGURAÇÃO DE EXIBIÇÃO DE PARCEIROS
-- ============================================

INSERT INTO guest_guide.partner_display_configs (
    property_id,
    org_id,
    category,
    layout,
    items_per_row,
    show_description,
    show_logo,
    show_schedule,
    max_items,
    sort_order
) VALUES
-- Gastronomia
('22222222-2222-2222-2222-222222222222',
 'b729534c-753b-48b0-ab4f-0756cc1cd271',
 'gastronomia',
 'grid',
 2,
 true,
 true,
 true,
 10,
 1),

-- Turismo
('22222222-2222-2222-2222-222222222222',
 'b729534c-753b-48b0-ab4f-0756cc1cd271',
 'turismo',
 'grid',
 2,
 true,
 true,
 false,
 5,
 2),

-- Serviços
('22222222-2222-2222-2222-222222222222',
 'b729534c-753b-48b0-ab4f-0756cc1cd271',
 'servicos',
 'list',
 1,
 false,
 false,
 false,
 10,
 3);

-- ============================================
-- 4. NAVEGAÇÃO EM OUTROS IDIOMAS
-- ============================================

-- Navigation nodes em inglês
INSERT INTO guest_guide.navigation_nodes (property_id, org_id, page_id, locale, label, url, icon, sort_order, is_visible)
SELECT 
    p.property_id,
    p.org_id,
    p.id,
    'en',
    CASE 
        WHEN p.slug = 'sua-estadia' THEN 'Your Stay'
        WHEN p.slug = 'regras-do-hotel' THEN 'Hotel Rules'
        WHEN p.slug = 'cafe-gastronomia' THEN 'Dining'
        WHEN p.slug = 'lazer-estrutura' THEN 'Facilities'
        WHEN p.slug = 'eventos-corporativo' THEN 'Events'
        WHEN p.slug = 'links-uteis' THEN 'Useful Links'
    END,
    '/' || p.slug,
    n.icon,
    n.sort_order,
    true
FROM guest_guide.pages p
JOIN guest_guide.navigation_nodes n ON n.page_id = (SELECT id FROM guest_guide.pages WHERE slug = REPLACE(p.slug, '-', ' ') AND property_id = p.property_id LIMIT 1)
WHERE p.slug IN ('sua-estadia', 'regras-do-hotel', 'cafe-gastronomia', 'lazer-estrutura', 'eventos-corporativo', 'links-uteis')
  AND n.locale = 'pt-BR'
  AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT DO NOTHING;

-- Navigation nodes em espanhol
INSERT INTO guest_guide.navigation_nodes (property_id, org_id, page_id, locale, label, url, icon, sort_order, is_visible)
SELECT 
    p.property_id,
    p.org_id,
    p.id,
    'es',
    CASE 
        WHEN p.slug = 'sua-estadia' THEN 'Tu Estancia'
        WHEN p.slug = 'regras-do-hotel' THEN 'Reglas del Hotel'
        WHEN p.slug = 'cafe-gastronomia' THEN 'Gastronomía'
        WHEN p.slug = 'lazer-estrutura' THEN 'Estructura'
        WHEN p.slug = 'eventos-corporativo' THEN 'Eventos'
        WHEN p.slug = 'links-uteis' THEN 'Enlaces Útiles'
    END,
    '/' || p.slug,
    n.icon,
    n.sort_order,
    true
FROM guest_guide.pages p
JOIN guest_guide.navigation_nodes n ON n.page_id = (SELECT id FROM guest_guide.pages WHERE slug = REPLACE(p.slug, '-', ' ') AND property_id = p.property_id LIMIT 1)
WHERE p.slug IN ('sua-estadia', 'regras-do-hotel', 'cafe-gastronomia', 'lazer-estrutura', 'eventos-corporativo', 'links-uteis')
  AND n.locale = 'pt-BR'
  AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT DO NOTHING;

-- Navigation nodes em alemão
INSERT INTO guest_guide.navigation_nodes (property_id, org_id, page_id, locale, label, url, icon, sort_order, is_visible)
SELECT 
    p.property_id,
    p.org_id,
    p.id,
    'de',
    CASE 
        WHEN p.slug = 'sua-estadia' THEN 'Ihr Aufenthalt'
        WHEN p.slug = 'regras-do-hotel' THEN 'Hotelregeln'
        WHEN p.slug = 'cafe-gastronomia' THEN 'Gastronomie'
        WHEN p.slug = 'lazer-estrutura' THEN 'Einrichtungen'
        WHEN p.slug = 'eventos-corporativo' THEN 'Veranstaltungen'
        WHEN p.slug = 'links-uteis' THEN 'Nützliche Links'
    END,
    '/' || p.slug,
    n.icon,
    n.sort_order,
    true
FROM guest_guide.pages p
JOIN guest_guide.navigation_nodes n ON n.page_id = (SELECT id FROM guest_guide.pages WHERE slug = REPLACE(p.slug, '-', ' ') AND property_id = p.property_id LIMIT 1)
WHERE p.slug IN ('sua-estadia', 'regras-do-hotel', 'cafe-gastronomia', 'lazer-estrutura', 'eventos-corporativo', 'links-uteis')
  AND n.locale = 'pt-BR'
  AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. HOME CONFIG EM OUTROS IDIOMAS
-- ============================================

-- English
INSERT INTO guest_guide.home_configs (property_id, org_id, locale, title, subtitle, primary_color, secondary_color, show_weather, show_partners)
SELECT 
    property_id,
    org_id,
    'en',
    'Urubici Park Hotel',
    'Premium lodging, unique experience in the mountains.',
    primary_color,
    secondary_color,
    show_weather,
    show_partners
FROM guest_guide.home_configs
WHERE locale = 'pt-BR'
ON CONFLICT (property_id, locale) WHERE deleted_at IS NULL DO NOTHING;

-- Spanish
INSERT INTO guest_guide.home_configs (property_id, org_id, locale, title, subtitle, primary_color, secondary_color, show_weather, show_partners)
SELECT 
    property_id,
    org_id,
    'es',
    'Urubici Park Hotel',
    'Alojamiento premium, experiencia única en la sierra.',
    primary_color,
    secondary_color,
    show_weather,
    show_partners
FROM guest_guide.home_configs
WHERE locale = 'pt-BR'
ON CONFLICT (property_id, locale) WHERE deleted_at IS NULL DO NOTHING;

-- German
INSERT INTO guest_guide.home_configs (property_id, org_id, locale, title, subtitle, primary_color, secondary_color, show_weather, show_partners)
SELECT 
    property_id,
    org_id,
    'de',
    'Urubici Park Hotel',
    'Premium-Unterkunft, einzigartige Erfahrung in den Bergen.',
    primary_color,
    secondary_color,
    show_weather,
    show_partners
FROM guest_guide.home_configs
WHERE locale = 'pt-BR'
ON CONFLICT (property_id, locale) WHERE deleted_at IS NULL DO NOTHING;

COMMIT;
