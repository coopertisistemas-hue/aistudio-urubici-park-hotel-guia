-- Migration: 016_seed_uph_top_sticker.sql
-- Date: 2026-03-06
-- Purpose: Seed TopSticker messages for UPH
-- Note: Replace UUID placeholders with real property/org IDs

BEGIN;

-- ============================================
-- TOP STICKER MESSAGES FOR UPH
-- ============================================

-- Message 1: Breakfast time (rotating, regular priority)
INSERT INTO guest_guide.top_sticker_messages (
    property_id,
    org_id,
    status,
    display_mode,
    priority,
    valid_from,
    valid_until,
    sort_order,
    is_emergency
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'b729534c-753b-48b0-ab4f-0756cc1cd271',
    'active',
    'rotating',
    0,
    NULL,
    NULL,
    1,
    false
);

-- Message 2: No smoking (rotating, regular priority)
INSERT INTO guest_guide.top_sticker_messages (
    property_id,
    org_id,
    status,
    display_mode,
    priority,
    valid_from,
    valid_until,
    sort_order,
    is_emergency
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'b729534c-753b-48b0-ab4f-0756cc1cd271',
    'active',
    'rotating',
    0,
    NULL,
    NULL,
    2,
    false
);

-- Message 3: Wine menu (rotating, regular priority)
INSERT INTO guest_guide.top_sticker_messages (
    property_id,
    org_id,
    status,
    display_mode,
    priority,
    valid_from,
    valid_until,
    sort_order,
    is_emergency
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'b729534c-753b-48b0-ab4f-0756cc1cd271',
    'active',
    'rotating',
    0,
    NULL,
    NULL,
    3,
    false
);

-- ============================================
-- TOP STICKER LOCALES
-- ============================================

-- Message 1: Breakfast - Portuguese
INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'pt-BR', '☕', 'Café da manhã das 6h às 10h'
FROM guest_guide.top_sticker_messages
WHERE sort_order = 1 AND property_id = '22222222-2222-2222-2222-222222222222'
LIMIT 1;

-- Message 1: Breakfast - English
INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'en', '☕', 'Breakfast from 6 AM to 10 AM'
FROM guest_guide.top_sticker_messages
WHERE sort_order = 1 AND property_id = '22222222-2222-2222-2222-222222222222'
LIMIT 1;

-- Message 1: Breakfast - Spanish
INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'es', '☕', 'Desayuno de 6h a 10h'
FROM guest_guide.top_sticker_messages
WHERE sort_order = 1 AND property_id = '22222222-2222-2222-2222-222222222222'
LIMIT 1;

-- Message 1: Breakfast - German
INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'de', '☕', 'Frühstück von 6 Uhr bis 10 Uhr'
FROM guest_guide.top_sticker_messages
WHERE sort_order = 1 AND property_id = '22222222-2222-2222-2222-222222222222'
LIMIT 1;

-- Message 2: No smoking - Portuguese
INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'pt-BR', '🚭', 'Ambiente livre de fumo (áreas internas)'
FROM guest_guide.top_sticker_messages
WHERE sort_order = 2 AND property_id = '22222222-2222-2222-2222-222222222222'
LIMIT 1;

-- Message 2: No smoking - English
INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'en', '🚭', 'Smoke-free environment (indoor areas)'
FROM guest_guide.top_sticker_messages
WHERE sort_order = 2 AND property_id = '22222222-2222-2222-2222-222222222222'
LIMIT 1;

-- Message 2: No smoking - Spanish
INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'es', '🚭', 'Ambiente libre de humo (áreas interiores)'
FROM guest_guide.top_sticker_messages
WHERE sort_order = 2 AND property_id = '22222222-2222-2222-2222-222222222222'
LIMIT 1;

-- Message 2: No smoking - German
INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'de', '🚭', 'Rauchfreie Umgebung (Innenbereiche)'
FROM guest_guide.top_sticker_messages
WHERE sort_order = 2 AND property_id = '22222222-2222-2222-2222-222222222222'
LIMIT 1;

-- Message 3: Wine menu - Portuguese
INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'pt-BR', '🍷', 'Carta de vinhos disponível no restaurante'
FROM guest_guide.top_sticker_messages
WHERE sort_order = 3 AND property_id = '22222222-2222-2222-2222-222222222222'
LIMIT 1;

-- Message 3: Wine menu - English
INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'en', '🍷', 'Wine menu available at the restaurant'
FROM guest_guide.top_sticker_messages
WHERE sort_order = 3 AND property_id = '22222222-2222-2222-2222-222222222222'
LIMIT 1;

-- Message 3: Wine menu - Spanish
INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'es', '🍷', 'Carta de vinos disponible en el restaurante'
FROM guest_guide.top_sticker_messages
WHERE sort_order = 3 AND property_id = '22222222-2222-2222-2222-222222222222'
LIMIT 1;

-- Message 3: Wine menu - German
INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'de', '🍷', 'Weinkarte im Restaurant verfügbar'
FROM guest_guide.top_sticker_messages
WHERE sort_order = 3 AND property_id = '22222222-2222-2222-2222-222222222222'
LIMIT 1;

COMMIT;
