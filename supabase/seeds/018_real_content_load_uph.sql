-- Migration: 018_real_content_load_uph.sql
-- Date: 2026-03-06
-- Purpose: Load REAL CONTENT from current Guest Guide site for UPH
-- Source: Current static React pages from src/pages/*

BEGIN;

-- Property ID for UPH
-- org_id: b729534c-753b-48b0-ab4f-0756cc1cd271
-- property_id: 22222222-2222-2222-2222-222222222222

-- ============================================
-- 1. UPDATE HOME CONFIG WITH REAL VIDEO
-- ============================================

UPDATE guest_guide.home_configs
SET 
    background_video_url = 'https://www.dropbox.com/scl/fi/4ehdjudid9l7uwdnnz8z1/urubici-park-hotel-apresenta-o.mp4?rlkey=1cbsw7stm5qpwpuq7irfbw3to&st=nw959pl5&dl=1',
    background_video_fallback_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
WHERE property_id = '22222222-2222-2222-2222-222222222222'
AND locale = 'pt-BR';

-- ============================================
-- 2. UPDATE BACKGROUND VIDEOS WITH REAL DATA
-- ============================================

UPDATE guest_guide.background_videos
SET 
    video_url = 'https://www.dropbox.com/scl/fi/4ehdjudid9l7uwdnnz8z1/urubici-park-hotel-apresenta-o.mp4?rlkey=1cbsw7stm5qpwpuq7irfbw3to&st=nw959pl5&dl=1',
    thumbnail_url = 'https://images.unsplash.com/photo-1602002418816-5c0aeef426ae?w=800',
    title = 'Urubici Park Hotel - Apresentação',
    description = 'Conheça o Urubici Park Hotel, sua experiência premium na Serra Catarinense.'
WHERE property_id = '22222222-2222-2222-2222-222222222222'
AND is_default = true;

-- ============================================
-- 3. TOP STICKER MESSAGES - REAL CONTENT
-- ============================================

-- Clear existing sticker messages and reload
DELETE FROM guest_guide.top_sticker_locales;
DELETE FROM guest_guide.top_sticker_messages
WHERE property_id = '22222222-2222-2222-2222-222222222222';

-- Sticker 1: Breakfast
INSERT INTO guest_guide.top_sticker_messages (property_id, org_id, status, display_mode, priority, sort_order, is_emergency)
VALUES 
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'active', 'rotating', 0, 1, false);

INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'pt-BR', '☕', 'Café da manhã das 6h às 10h'
FROM guest_guide.top_sticker_messages
WHERE property_id = '22222222-2222-2222-2222-222222222222' AND sort_order = 1;

INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'en', '☕', 'Breakfast from 6 AM to 10 AM'
FROM guest_guide.top_sticker_messages
WHERE property_id = '22222222-2222-2222-2222-222222222222' AND sort_order = 1;

INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'es', '☕', 'Desayuno de 6h a 10h'
FROM guest_guide.top_sticker_messages
WHERE property_id = '22222222-2222-2222-2222-222222222222' AND sort_order = 1;

INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'de', '☕', 'Frühstück von 6 Uhr bis 10 Uhr'
FROM guest_guide.top_sticker_messages
WHERE property_id = '22222222-2222-2222-2222-222222222222' AND sort_order = 1;

-- Sticker 2: No smoking
INSERT INTO guest_guide.top_sticker_messages (property_id, org_id, status, display_mode, priority, sort_order, is_emergency)
VALUES 
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'active', 'rotating', 0, 2, false);

INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'pt-BR', '🚭', 'Ambiente livre de fumo (áreas internas)'
FROM guest_guide.top_sticker_messages
WHERE property_id = '22222222-2222-2222-2222-222222222222' AND sort_order = 2;

INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'en', '🚭', 'Smoke-free environment (indoor areas)'
FROM guest_guide.top_sticker_messages
WHERE property_id = '22222222-2222-2222-2222-222222222222' AND sort_order = 2;

INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'es', '🚭', 'Ambiente libre de humo (áreas interiores)'
FROM guest_guide.top_sticker_messages
WHERE property_id = '22222222-2222-2222-2222-222222222222' AND sort_order = 2;

INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'de', '🚭', 'Rauchfreie Umgebung (Innenbereiche)'
FROM guest_guide.top_sticker_messages
WHERE property_id = '22222222-2222-2222-2222-222222222222' AND sort_order = 2;

-- Sticker 3: Wine menu
INSERT INTO guest_guide.top_sticker_messages (property_id, org_id, status, display_mode, priority, sort_order, is_emergency)
VALUES 
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'active', 'rotating', 0, 3, false);

INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'pt-BR', '🍷', 'Carta de vinhos disponível no restaurante'
FROM guest_guide.top_sticker_messages
WHERE property_id = '22222222-2222-2222-2222-222222222222' AND sort_order = 3;

INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'en', '🍷', 'Wine menu available at the restaurant'
FROM guest_guide.top_sticker_messages
WHERE property_id = '22222222-2222-2222-2222-222222222222' AND sort_order = 3;

INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'es', '🍷', 'Carta de vinos disponible en el restaurante'
FROM guest_guide.top_sticker_messages
WHERE property_id = '22222222-2222-2222-2222-222222222222' AND sort_order = 3;

INSERT INTO guest_guide.top_sticker_locales (message_id, locale, icon, text)
SELECT id, 'de', '🍷', 'Weinkarte im Restaurant verfügbar'
FROM guest_guide.top_sticker_messages
WHERE property_id = '22222222-2222-2222-2222-222222222222' AND sort_order = 3;

-- ============================================
-- 4. CONTACTS - REAL EMERGENCY NUMBERS
-- ============================================

DELETE FROM guest_guide.contacts
WHERE property_id = '22222222-2222-2222-2222-222222222222';

INSERT INTO guest_guide.contacts (property_id, org_id, name, contact_type, value, description, icon, sort_order, is_emergency) VALUES
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Recepção Urubici Park Hotel', 'phone', '(54) 3312-0300', 'Recepção do hotel 24h', 'ri-phone-line', 1, false),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Polícia Militar', 'phone', '190', 'Polícia Militar de Santa Catarina', 'ri-police-car-line', 1, true),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'SAMU', 'phone', '192', 'Serviço de Atendimento Móvel de Urgência', 'ri-hospital-line', 2, true),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Bombeiros', 'phone', '193', 'Corpo de Bombeiros Militar', 'ri-fire-line', 3, true),
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Hospital Regional de São Joaquim', 'phone', '(54) 3221-0200', 'Hospital mais próximo de Urubici', 'ri-hospital-line', 4, true);

-- ============================================
-- 5. CONTENT BLOCKS - DETAILED PAGES
-- ============================================

-- Clear existing blocks
DELETE FROM guest_guide.content_blocks
WHERE property_id = '22222222-2222-2222-2222-222222222222';

-- Get page IDs
-- Check-in page
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 0, 'Horário', 'O horário de check-in pode variar conforme a ocupação. Em caso de dúvidas, confirme com a recepção.'
FROM guest_guide.pages WHERE slug = 'sua-estadia/check-in' AND property_id = '22222222-2222-2222-2222-222222222222';

INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 1, 'Documentos', 'Tenha seus documentos em mãos para agilizar o atendimento no check-in.'
FROM guest_guide.pages WHERE slug = 'sua-estadia/check-in' AND property_id = '22222222-2222-2222-2222-222222222222';

INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 2, 'Bagagens', 'Se precisar de apoio com bagagens, utilize a opção Chamar Recepção.'
FROM guest_guide.pages WHERE slug = 'sua-estadia/check-in' AND property_id = '22222222-2222-2222-2222-222222222222';

-- Check-out page
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 0, 'Horário', 'O check-out deve ser realizado até as 12h. Devolva as chaves na recepção ao sair.'
FROM guest_guide.pages WHERE slug = 'sua-estadia/check-out' AND property_id = '22222222-2222-2222-2222-222222222222';

INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 1, 'Late Check-out', 'Sujeito à disponibilidade e cobrança adicional. Solicite na recepção com antecedência.'
FROM guest_guide.pages WHERE slug = 'sua-estadia/check-out' AND property_id = '22222222-2222-2222-2222-222222222222';

-- Wi-Fi page
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content, metadata)
SELECT id, property_id, org_id, 'pt-BR', 'text', 0, 'Wi-Fi', 'Wi-Fi gratuito disponível em todas as áreas do hotel.', '{"network": "UrubiciPark_Guest", "password": "disponível na recepção"}'::jsonb
FROM guest_guide.pages WHERE slug = 'sua-estadia/wi-fi' AND property_id = '22222222-2222-2222-2222-222222222222';

-- Limpeza e Enxoval
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 0, 'Troca de Roupas', 'A troca de roupas de cama e banho é realizada a cada 2 dias durante sua estadia.'
FROM guest_guide.pages WHERE slug = 'sua-estadia/limpeza-e-enxoval' AND property_id = '22222222-2222-2222-2222-222222222222';

INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 1, 'Sustentabilidade', 'Para manter o conforto e contribuir com práticas sustentáveis, a troca de enxoval é realizada a cada 2 dias.'
FROM guest_guide.pages WHERE slug = 'sua-estadia/limpeza-e-enxoval' AND property_id = '22222222-2222-2222-2222-222222222222';

INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content, metadata)
SELECT id, property_id, org_id, 'pt-BR', 'cta', 2, 'Solicitar Troca Adicional', 'Se precisar de troca adicional, fale com a recepção.', '{"url": "tel:+554733120300", "label": "Ligar para Recepção"}'::jsonb
FROM guest_guide.pages WHERE slug = 'sua-estadia/limpeza-e-enxoval' AND property_id = '22222222-2222-2222-2222-222222222222';

-- Late Check-out
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 0, 'Late Check-out', 'Sujeito à disponibilidade do hotel. Solicite com antecedência na recepção. Pode haver cobrança adicional.'
FROM guest_guide.pages WHERE slug = 'sua-estadia/late-check-out' AND property_id = '22222222-2222-2222-2222-222222222222';

-- Restaurante Pimenta Rosa (Partner)
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 0, 'Horário de Funcionamento', 'Atendimento para jantar a partir das 18h30. O restaurante não abre às quartas-feiras.'
FROM guest_guide.pages WHERE slug = 'restaurante-pimenta-rosa' AND property_id = '22222222-2222-2222-2222-222222222222';

INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 1, 'Localização', 'O Restaurante Pimenta Rosa está localizado anexo ao Urubici Park Hotel, com acesso direto a partir da recepção do hotel.'
FROM guest_guide.pages WHERE slug = 'restaurante-pimenta-rosa' AND property_id = '22222222-2222-2222-2222-222222222222';

INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 2, 'Contato e Reservas', 'Reservas podem ser realizadas diretamente com o restaurante.'
FROM guest_guide.pages WHERE slug = 'restaurante-pimenta-rosa' AND property_id = '22222222-2222-2222-2222-222222222222';

-- Emergências page
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 0, 'Polícia', '190'
FROM guest_guide.pages WHERE slug = 'links-uteis/emergencias' AND property_id = '22222222-2222-2222-2222-222222222222';

INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 1, 'SAMU', '192'
FROM guest_guide.pages WHERE slug = 'links-uteis/emergencias' AND property_id = '22222222-2222-2222-2222-222222222222';

INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 2, 'Bombeiros', '193'
FROM guest_guide.pages WHERE slug = 'links-uteis/emergencias' AND property_id = '22222222-2222-2222-2222-222222222222';

INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 3, 'Apoio do Hotel', 'Para assistência interna, utilize a opção Chamar Recepção e disque o ramal 9 no telefone do quarto.'
FROM guest_guide.pages WHERE slug = 'links-uteis/emergencias' AND property_id = '22222222-2222-2222-2222-222222222222';

-- Estacionamento
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 0, 'Estacionamento', 'O hotel oferece estacionamento gratuito para hóspedes.'
FROM guest_guide.pages WHERE slug = 'lazer-estrutura/estacionamento' AND property_id = '22222222-2222-2222-2222-222222222222';

-- Carregamento Elétrico
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 0, 'Carregamento Elétrico', 'O hotel dispõe de estação de carregamento para veículos elétricos. Consulte a recepção para disponibilidade.'
FROM guest_guide.pages WHERE slug = 'lazer-estrutura/carregamento-eletrico' AND property_id = '22222222-2222-2222-2222-222222222222';

-- Salão de Jogos
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 0, 'Salão de Jogos', 'O hotel conta com salão de jogos com opções de entretenimento para todas as idades.'
FROM guest_guide.pages WHERE slug = 'salao-de-jogos' AND property_id = '22222222-2222-2222-2222-222222222222';

-- Café da Manhã
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 0, 'Café da Manhã', 'O café da manhã é servido das 6h às 10h, com opções variadas de pães, frutas, frios, ovos, cafés e sucos.'
FROM guest_guide.pages WHERE slug = 'cafe-gastronomia/cafe-da-manha' AND property_id = '22222222-2222-2222-2222-222222222222';

-- Auditório
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content)
SELECT id, property_id, org_id, 'pt-BR', 'text', 0, 'Auditório', 'O hotel possui auditório disponível para eventos e reuniões. Consulte condições e disponibilidade na recepção.'
FROM guest_guide.pages WHERE slug = 'eventos-corporativo/auditorio' AND property_id = '22222222-2222-2222-2222-222222222222';

-- Localização
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content, metadata)
SELECT id, property_id, org_id, 'pt-BR', 'map', 0, 'Localização', 'Urubici Park Hotel', '{"url": "https://www.google.com/maps/place/Urubici+Park+Hotel"}'::jsonb
FROM guest_guide.pages WHERE slug = 'links-uteis/localizacao' AND property_id = '22222222-2222-2222-2222-222222222222';

-- ============================================
-- 6. PARTNERS - REAL DATA
-- ============================================

DELETE FROM guest_guide.partners
WHERE property_id = '22222222-2222-2222-2222-222222222222';

-- Pimenta Rosa Restaurant (Featured Partner)
INSERT INTO guest_guide.partners (property_id, org_id, name, slug, description, logo_url, website_url, phone, email, address, category, partner_type, is_featured, is_active, sort_order) VALUES
('22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'Restaurante Pimenta Rosa', 'restaurante-pimenta-rosa', 'Restaurante gourmet especializado em culinária serrana com ingredientes locais. Aberto para jantar, fechado às quartas-feiras.', 'https://instagram.com/pimentarosaurubici', 'https://instagram.com/pimentarosaurubici', '+55 54 99690-2103', 'reservas@pimentarosa.com.br', 'Anexo ao Urubici Park Hotel', 'gastronomia', 'partner', true, true, 1);

-- Partner schedules
INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT id, 0, '18:30', '22:00', false, 'Jantar'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa';

INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT id, 1, '18:30', '22:00', false, 'Jantar'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa';

INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT id, 2, '18:30', '22:00', false, 'Jantar'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa';

INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT id, 3, NULL, NULL, true, 'Fechado'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa';

INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT id, 4, '18:30', '23:00', false, 'Jantar'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa';

INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT id, 5, '18:30', '23:00', false, 'Jantar'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa';

INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT id, 6, '12:00', '14:00', false, 'Almoço'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa';

INSERT INTO guest_guide.partner_schedules (partner_id, day_of_week, open_time, close_time, is_closed, notes)
SELECT id, 6, '18:30', '23:00', false, 'Jantar'
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa';

-- Partner Promotion
INSERT INTO guest_guide.partner_promotions (property_id, org_id, partner_id, title, description, discount_code, discount_value, valid_from, valid_until, is_active)
SELECT '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', id, '10% de desconto para hóspedes', 'Desconto especial para hóspedes do Urubici Park Hotel', 'UPH10', '10%', NOW(), NOW() + INTERVAL '2 years', true
FROM guest_guide.partners WHERE slug = 'restaurante-pimenta-rosa';

COMMIT;
