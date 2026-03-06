-- Migration: 009_seed_uph_base_content.sql
-- Date: 2026-03-06
-- Purpose: Seed base de conteudo UPH - home config, pages e navegacao

BEGIN;

-- NOTA: Execute apenas apos ter um property_id valido para UPH
-- Substitua os UUIDs abaixo conforme necessidade do ambiente

-- ============================================
-- ASSUMINDO: property_id = '22222222-2222-2222-2222-222222222222' (substitua pelo ID real do UPH)
-- ASSUMINDO: org_id = 'b729534c-753b-48b0-ab4f-0756cc1cd271' (substitua pelo ID real da org)
-- ============================================

-- 1. Home Config para UPH
INSERT INTO guest_guide.home_configs (
    property_id,
    org_id,
    locale,
    title,
    subtitle,
    background_video_url,
    background_video_fallback_url,
    logo_url,
    primary_color,
    secondary_color,
    show_weather,
    show_partners
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'b729534c-753b-48b0-ab4f-0756cc1cd271',
    'pt-BR',
    'Urubici Park Hotel',
    'Hospedagem Premium, experiência única na Serra.',
    'https://example.com/videos/uph-background.mp4',
    'https://example.com/videos/uph-fallback.mp4',
    'https://public.readdy.ai/ai/img_res/90171d99-2a4d-411b-855c-8e594b40cefb.png',
    '#24577A',
    '#6B4E8A',
    true,
    true
) ON CONFLICT (property_id, locale) WHERE deleted_at IS NULL DO NOTHING;

-- 2. Paginacao Principal
INSERT INTO guest_guide.pages (property_id, org_id, title, slug, description, template, status) VALUES
-- Paginas principais
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Home', 'home', 'Página inicial do guia do hóspede', 'home', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Sua Estadia', 'sua-estadia', 'Check-in, Check-out, Wi-Fi e informações essenciais', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Regras do Hotel', 'regras-do-hotel', 'Silêncio, visitantes, responsabilidades e normas', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Café & Gastronomia', 'cafe-gastronomia', 'Café da manhã e Restaurante Pimenta Rosa (parceiro)', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Lazer & Estrutura', 'lazer-estrutura', 'Salão de jogos, estacionamento e carregamento elétrico', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Eventos & Corporativo', 'eventos-corporativo', 'Auditório e informações para eventos', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Links Úteis', 'links-uteis', 'Portal Urubici e site oficial', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Clima', 'clima', 'Previsão do tempo em Urubici', 'weather', 'published');

-- Sub-paginas - Sua Estadia
INSERT INTO guest_guide.pages (property_id, org_id, title, slug, description, template, status) VALUES
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Check-in', 'sua-estadia/check-in', 'Informações sobre check-in', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Check-out', 'sua-estadia/check-out', 'Informações sobre check-out', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Wi-Fi', 'sua-estadia/wi-fi', 'Informações de Wi-Fi', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Limpeza e Enxoval', 'sua-estadia/limpeza-e-enxoval', 'Serviço de limpeza e troca de enxoval', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Late Check-out', 'sua-estadia/late-check-out', 'Solicitação de late check-out', 'default', 'published');

-- Sub-paginas - Regras do Hotel
INSERT INTO guest_guide.pages (property_id, org_id, title, slug, description, template, status) VALUES
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Visitantes', 'regras-do-hotel/visitantes', 'Política de visitantes', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Proibições', 'regras-do-hotel/proibicoes', 'Regras e proibições do hotel', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Política de Pets', 'regras-do-hotel/politica-de-pets', 'Política para animais de estimação', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Horário de Silêncio', 'regras-do-hotel/horario-de-silencio', 'Horários de silêncio', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Danos e Responsabilidade', 'regras-do-hotel/danos-e-responsabilidade', 'Política de danos e responsabilidades', 'default', 'published');

-- Sub-paginas - Café & Gastronomia
INSERT INTO guest_guide.pages (property_id, org_id, title, slug, description, template, status) VALUES
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Café da Manhã', 'cafe-gastronomia/cafe-da-manha', 'Informações sobre o café da manhã', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Restaurante Pimenta Rosa', 'restaurante-pimenta-rosa', 'Restaurante parceiro Pimenta Rosa', 'partner', 'published');

-- Sub-paginas - Lazer & Estrutura
INSERT INTO guest_guide.pages (property_id, org_id, title, slug, description, template, status) VALUES
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Estacionamento', 'lazer-estrutura/estacionamento', 'Informações de estacionamento', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Carregamento Elétrico', 'lazer-estrutura/carregamento-eletrico', 'Estação de carregamento para veículos elétricos', 'default', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Salão de Jogos', 'salao-de-jogos', 'Salão de jogos e entretenimento', 'default', 'published');

-- Sub-paginas - Eventos
INSERT INTO guest_guide.pages (property_id, org_id, title, slug, description, template, status) VALUES
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Auditório', 'eventos-corporativo/auditorio', 'Informações sobre o auditório', 'default', 'published');

-- Sub-paginas - Links Úteis
INSERT INTO guest_guide.pages (property_id, org_id, title, slug, description, template, status) VALUES
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Localização', 'links-uteis/localizacao', 'Localização no Google Maps', 'location', 'published'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Emergências', 'links-uteis/emergencias', 'Números de emergência', 'emergency', 'published');

-- 3. Page Routes (slug por locale)
INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'pt-BR', p.slug, p.title 
FROM guest_guide.pages p
WHERE p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

-- 4. Content Blocks - Home Page
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content) 
SELECT 
    p.id,
    p.property_id,
    p.org_id,
    'pt-BR',
    'hero',
    0,
    'Bem-vindo ao Urubici Park Hotel',
    'Sua experiência premium na Serra Catarinense começa aqui.'
FROM guest_guide.pages p
WHERE p.slug = 'home';

-- 5. Navegacao Principal
INSERT INTO guest_guide.navigation_nodes (property_id, org_id, parent_id, page_id, locale, label, url, icon, sort_order, is_visible)
SELECT 
    p.property_id,
    p.org_id,
    NULL,
    p.id,
    'pt-BR',
    p.title,
    '/' || p.slug,
    CASE 
        WHEN p.slug = 'sua-estadia' THEN 'ri-hotel-line'
        WHEN p.slug = 'regras-do-hotel' THEN 'ri-file-list-3-line'
        WHEN p.slug = 'cafe-gastronomia' THEN 'ri-restaurant-line'
        WHEN p.slug = 'lazer-estrutura' THEN 'ri-billiards-line'
        WHEN p.slug = 'eventos-corporativo' THEN 'ri-presentation-line'
        WHEN p.slug = 'links-uteis' THEN 'ri-links-line'
        ELSE 'ri-file-line'
    END,
    ROW_NUMBER() OVER (ORDER BY p.created_at),
    true
FROM guest_guide.pages p
WHERE p.slug IN ('sua-estadia', 'regras-do-hotel', 'cafe-gastronomia', 'lazer-estrutura', 'eventos-corporativo', 'links-uteis')
  AND p.property_id = '22222222-2222-2222-2222-222222222222';

-- 6. Tags
INSERT INTO guest_guide.tags (property_id, org_id, name, slug, color) VALUES
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Essencial', 'essencial', '#24577A'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Lazer', 'lazer', '#4EA16C'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Gastronomia', 'gastronomia', '#C0622A'),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Serviços', 'servicos', '#6B4E8A');

-- 7. Contatos de Emergencia
INSERT INTO guest_guide.contacts (property_id, org_id, name, contact_type, value, description, icon, sort_order, is_emergency) VALUES
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Recepção', 'phone', '+554733120300', 'Recepção do hotel 24h', 'ri-phone-line', 1, false),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Emergência Policial', 'phone', '190', 'Polícia Militar', 'ri-shield-line', 1, true),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'SAMU', 'phone', '192', 'Serviço de Atendimento Móvel de Urgência', 'ri-heart-line', 2, true),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Bombeiros', 'phone', '193', 'Corpo de Bombeiros', 'ri-fire-line', 3, true),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Hospital Regional', 'phone', '+554732210200', 'Hospital de São Joaquim', 'ri-hospital-line', 4, true);

COMMIT;
