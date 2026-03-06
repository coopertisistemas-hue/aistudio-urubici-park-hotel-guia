-- Migration: 010_seed_uph_i18n_and_partners.sql
-- Date: 2026-03-06
-- Purpose: Seed de i18n e parceiros UPH

BEGIN;

-- ============================================
-- 1. TRADUCOES PARA PÁGINAS PRINCIPAIS
-- ============================================

-- Page Routes em outros idiomas - Home
INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'en', 'home', 'Welcome' 
FROM guest_guide.pages p WHERE p.slug = 'home' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'es', 'inicio', 'Bienvenido' 
FROM guest_guide.pages p WHERE p.slug = 'home' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'de', 'startseite', 'Willkommen' 
FROM guest_guide.pages p WHERE p.slug = 'home' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

-- Sua Estadia
INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'en', 'your-stay', 'Your Stay' 
FROM guest_guide.pages p WHERE p.slug = 'sua-estadia' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'es', 'tu-estancia', 'Tu Estancia' 
FROM guest_guide.pages p WHERE p.slug = 'sua-estadia' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'de', 'ihr-aufenthalt', 'Ihr Aufenthalt' 
FROM guest_guide.pages p WHERE p.slug = 'sua-estadia' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

-- Regras do Hotel
INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'en', 'hotel-rules', 'Hotel Rules' 
FROM guest_guide.pages p WHERE p.slug = 'regras-do-hotel' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'es', 'reglas-del-hotel', 'Reglas del Hotel' 
FROM guest_guide.pages p WHERE p.slug = 'regras-do-hotel' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'de', 'hotel-regeln', 'Hotelregeln' 
FROM guest_guide.pages p WHERE p.slug = 'regras-do-hotel' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

-- Café & Gastronomia
INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'en', 'dining', 'Dining & Gastronomy' 
FROM guest_guide.pages p WHERE p.slug = 'cafe-gastronomia' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'es', 'gastronomia', 'Gastronomía' 
FROM guest_guide.pages p WHERE p.slug = 'cafe-gastronomia' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'de', 'gastronomie', 'Gastronomie' 
FROM guest_guide.pages p WHERE p.slug = 'cafe-gastronomia' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

-- Lazer & Estrutura
INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'en', 'facilities', 'Leisure & Facilities' 
FROM guest_guide.pages p WHERE p.slug = 'lazer-estrutura' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'es', 'estructura', 'Estructura y Ocio' 
FROM guest_guide.pages p WHERE p.slug = 'lazer-estrutura' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'de', 'einrichtungen', 'Freizeit & Einrichtungen' 
FROM guest_guide.pages p WHERE p.slug = 'lazer-estrutura' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

-- Eventos & Corporativo
INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'en', 'events-corporate', 'Events & Corporate' 
FROM guest_guide.pages p WHERE p.slug = 'eventos-corporativo' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'es', 'eventos-corporativo', 'Eventos y Corporativo' 
FROM guest_guide.pages p WHERE p.slug = 'eventos-corporativo' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'de', 'veranstaltungen', 'Veranstaltungen & Business' 
FROM guest_guide.pages p WHERE p.slug = 'eventos-corporativo' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

-- Links Úteis
INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'en', 'useful-links', 'Useful Links' 
FROM guest_guide.pages p WHERE p.slug = 'links-uteis' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'es', 'enlaces-utiles', 'Enlaces Útiles' 
FROM guest_guide.pages p WHERE p.slug = 'links-uteis' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'de', 'nützliche-links', 'Nützliche Links' 
FROM guest_guide.pages p WHERE p.slug = 'links-uteis' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

-- Clima
INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'en', 'weather', 'Weather' 
FROM guest_guide.pages p WHERE p.slug = 'clima' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'es', 'clima', 'Clima' 
FROM guest_guide.pages p WHERE p.slug = 'clima' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO guest_guide.page_routes (page_id, property_id, org_id, locale, slug, title)
SELECT p.id, p.property_id, p.org_id, 'de', 'wetter', 'Wetter' 
FROM guest_guide.pages p WHERE p.slug = 'clima' AND p.property_id = '22222222-2222-2222-2222-222222222222'
ON CONFLICT (page_id, locale) DO NOTHING;

-- ============================================
-- 2. CONTENT BLOCKS COM TRADUÇÃO
-- ============================================

-- Sua Estadia - Check-in content
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT 
    p.id,
    p.property_id,
    p.org_id,
    'en',
    'text',
    0,
    'Check-in',
    'Check-in starts at 2:00 PM. Please present your ID and booking confirmation at reception.'
FROM guest_guide.pages p
WHERE p.slug = 'sua-estadia/check-in'
ON CONFLICT DO NOTHING;

INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT 
    p.id,
    p.property_id,
    p.org_id,
    'es',
    'text',
    0,
    'Check-in',
    'El check-in comienza a las 2:00 PM. Por favor presente su identificación y confirmación de reserva en recepción.'
FROM guest_guide.pages p
WHERE p.slug = 'sua-estadia/check-in'
ON CONFLICT DO NOTHING;

INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT 
    p.id,
    p.property_id,
    p.org_id,
    'de',
    'text',
    0,
    'Check-in',
    'Check-in beginnt um 14:00 Uhr. Bitte legen Sie Ihren Ausweis und die Buchungsbestätigung an der Rezeption vor.'
FROM guest_guide.pages p
WHERE p.slug = 'sua-estadia/check-in'
ON CONFLICT DO NOTHING;

-- Sua Estadia - Check-out content
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT 
    p.id,
    p.property_id,
    p.org_id,
    'en',
    'text',
    0,
    'Check-out',
    'Check-out is until 11:00 AM. Late check-out available upon request (subject to availability).'
FROM guest_guide.pages p
WHERE p.slug = 'sua-estadia/check-out'
ON CONFLICT DO NOTHING;

INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT 
    p.id,
    p.property_id,
    p.org_id,
    'es',
    'text',
    0,
    'Check-out',
    'El check-out es hasta las 11:00 AM. Late check-out disponible bajo solicitud (sujeto a disponibilidad).'
FROM guest_guide.pages p
WHERE p.slug = 'sua-estadia/check-out'
ON CONFLICT DO NOTHING;

INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT 
    p.id,
    p.property_id,
    p.org_id,
    'de',
    'text',
    0,
    'Check-out',
    'Check-out ist bis 11:00 Uhr. Spätes Check-out auf Anfrage verfügbar (nach Verfügbarkeit).'
FROM guest_guide.pages p
WHERE p.slug = 'sua-estadia/check-out'
ON CONFLICT DO NOTHING;

-- Wi-Fi content
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content, metadata)
SELECT 
    p.id,
    p.property_id,
    p.org_id,
    'en',
    'text',
    0,
    'Wi-Fi',
    'Free high-speed Wi-Fi available throughout the hotel.',
    '{"network": "UrubiciPark_Guest", "password": "available at reception"}'::jsonb
FROM guest_guide.pages p
WHERE p.slug = 'sua-estadia/wi-fi'
ON CONFLICT DO NOTHING;

INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content, metadata)
SELECT 
    p.id,
    p.property_id,
    p.org_id,
    'es',
    'text',
    0,
    'Wi-Fi',
    'Wi-Fi de alta velocidad gratuito disponible en todo el hotel.',
    '{"network": "UrubiciPark_Guest", "password": "disponible en recepción"}'::jsonb
FROM guest_guide.pages p
WHERE p.slug = 'sua-estadia/wi-fi'
ON CONFLICT DO NOTHING;

INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content, metadata)
SELECT 
    p.id,
    p.property_id,
    p.org_id,
    'de',
    'text',
    0,
    'WLAN',
    'Kostenloses Highspeed-WLAN im gesamten Hotel verfügbar.',
    '{"network": "UrubiciPark_Guest", "password": "erhältlich an der Rezeption"}'::jsonb
FROM guest_guide.pages p
WHERE p.slug = 'sua-estadia/wi-fi'
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. PARCEIROS
-- ============================================

INSERT INTO guest_guide.partners (
    property_id,
    org_id,
    name,
    slug,
    description,
    logo_url,
    cover_image_url,
    website_url,
    phone,
    email,
    address,
    category,
    partner_type,
    is_featured,
    is_active,
    sort_order
) VALUES
-- Restaurante Pimenta Rosa (parceiro principal)
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271',
 'Restaurante Pimenta Rosa', 'restaurante-pimenta-rosa',
 'Restaurante gourmet especializado em culinária serrana com ingredientes locais.',
 'https://example.com/images/pimenta-rosa-logo.png',
 'https://example.com/images/pimenta-rosa-cover.jpg',
 'https://www.pimentarosa.com.br',
 '+554733120400',
 'reservas@pimentarosa.com.br',
 'Rua Principal, 100 - Centro, Urubici SC',
 'gastronomia',
 'partner',
 true,
 true,
 1),

-- Café Local
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271',
 'Café da Serra', 'cafe-da-serra',
 'Café artesanal com produtos regionais.',
 NULL, NULL,
 'https://www.cafedaserra.com.br',
 '+554733120500',
 'contato@cafedaserra.com.br',
 'Praça Central, Urubici SC',
 'gastronomia',
 'recommended',
 false,
 true,
 2),

-- Pizzaria
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271',
 'Pizzaria Forno à Lenha', 'pizzaria-forno-lenha',
 'Pizzas artesanais feitas em forno à lenha.',
 NULL, NULL,
 NULL,
 '+554733120600',
 NULL,
 'Av. Secundária, Urubici SC',
 'gastronomia',
 'recommended',
 false,
 true,
 3),

-- Guia Turístico
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271',
 'Urubici Adventures', 'urubici-adventures',
 'Guias turísticos especializados em trilhas e ecoturismo.',
 NULL, NULL,
 'https://www.urubiciadventures.com.br',
 '+554733120700',
 'contato@urubiciadventures.com.br',
 'Centro, Urubici SC',
 'turismo',
 'recommended',
 true,
 true,
 4),

-- Posto de Gasolina
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271',
 'Posto Shell Centro', 'posto-shell-centro',
 'Posto de combustível com conveniencia.',
 NULL, NULL,
 NULL,
 '+554733120800',
 NULL,
 'BR-282, Urubici SC',
 'servicos',
 'recommended',
 false,
 true,
 5),

-- Farmácia
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271',
 'Farmácia São João', 'farmacia-sao-joao',
 'Farmácia com delivery.',
 NULL, NULL,
 NULL,
 '+554733120900',
 NULL,
 'Centro, Urubici SC',
 'servicos',
 'recommended',
 false,
 true,
 6);

-- ============================================
-- 4. HORARIOS DOS PARCEIROS
-- ============================================

-- Restaurante Pimenta Rosa
INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT 
    id, 1, '18:00', '22:00', false, 'Jantar'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa'
ON CONFLICT DO NOTHING;

INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT 
    id, 2, '18:00', '22:00', false, 'Jantar'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa'
ON CONFLICT DO NOTHING;

INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT 
    id, 3, '18:00', '22:00', false, 'Jantar'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa'
ON CONFLICT DO NOTHING;

INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT 
    id, 4, '18:00', '22:00', false, 'Jantar'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa'
ON CONFLICT DO NOTHING;

INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT 
    id, 5, '18:00', '23:00', false, 'Jantar'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa'
ON CONFLICT DO NOTHING;

INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT 
    id, 6, '12:00', '14:00', false, 'Almoço'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa'
ON CONFLICT DO NOTHING;

INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT 
    id, 6, '18:00', '23:00', false, 'Jantar'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa'
ON CONFLICT DO NOTHING;

INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT 
    id, 0, '12:00', '14:00', false, 'Almoço'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa'
ON CONFLICT DO NOTHING;

INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT 
    id, 0, '18:00', '22:00', false, 'Jantar'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa'
ON CONFLICT DO NOTHING;

-- Farmácia
INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed)
SELECT id, 1, '07:00', '22:00', false
FROM guest_guide.partners WHERE slug = 'farmacia-sao-joao'
ON CONFLICT DO NOTHING;

INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed)
SELECT id, 2, '07:00', '22:00', false
FROM guest_guide.partners WHERE slug = 'farmacia-sao-joao'
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. PROMOÇÕES DOS PARCEIROS
-- ============================================

INSERT INTO guest_guide.partner_promotions (
    property_id,
    org_id,
    partner_id,
    title,
    description,
    discount_code,
    discount_value,
    valid_from,
    valid_until,
    is_active
)
SELECT 
    '22222222-2222-2222-2222-222222222222',
    'b729534c-753b-48b0-ab4f-0756cc1cd271',
    id,
    '10% de desconto para hóspedes',
    'Desconto especial para hóspedes do Urubici Park Hotel',
    'UPH10',
    '10%',
    NOW(),
    NOW() + INTERVAL '1 year',
    true
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa';

COMMIT;
