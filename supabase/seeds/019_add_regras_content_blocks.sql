-- Add content blocks for regras-do-hotel subpages
-- Migration: 019_add_regras_content_blocks.sql
-- Date: 2026-03-07

BEGIN;

-- Proibições (fe22a386-9903-45bd-9774-cee22004ee3a)
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content, metadata, created_at, updated_at)
VALUES 
  ('fe22a386-9903-45bd-9774-cee22004ee3a', '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'pt-BR', 'text', 0, 'Respeito ao silencio', 'Evite ruidos excessivos, especialmente no periodo noturno, para o conforto de todos.', '{}', NOW(), NOW()),
  ('fe22a386-9903-45bd-9774-cee22004ee3a', '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'pt-BR', 'text', 1, 'Circulacao de visitantes', 'Visitantes devem respeitar as regras do hotel e permanecer nas areas permitidas.', '{}', NOW(), NOW()),
  ('fe22a386-9903-45bd-9774-cee22004ee3a', '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'pt-BR', 'text', 2, 'Seguranca', 'Nao e permitido realizar atividades que comprometam a seguranca do hotel, dos hospedes ou das instalacoes.', '{}', NOW(), NOW()),
  ('fe22a386-9903-45bd-9774-cee22004ee3a', '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'pt-BR', 'text', 3, 'Duvidas e excecoes', 'Em casos especificos, consulte a recepcao para orientacao.', '{}', NOW(), NOW());

-- Horario de Silencio (0d38174b-64e6-444a-9cf6-370628dee903)
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content, metadata, created_at, updated_at)
VALUES 
  ('0d38174b-64e6-444a-9cf6-370628dee903', '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'pt-BR', 'text', 0, 'Periodo de silencio', 'O periodo de silencio e das 22h as 7h. Pedimos colaboracao para manter o ambiente tranquillo.', '{}', NOW(), NOW()),
  ('0d38174b-64e6-444a-9cf6-370628dee903', '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'pt-BR', 'text', 1, 'Som ambiente', 'Evite som alto em areas comuns e quartos apos as 22h.', '{}', NOW(), NOW()),
  ('0d38174b-64e6-444a-9cf6-370628dee903', '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'pt-BR', 'text', 2, 'Excecoes', 'Em eventos especiais ou situacoes especiais, consulte a recepcao.', '{}', NOW(), NOW());

-- Visitantes (d5b25cba-573b-4c42-a2f7-046e47d341f7)
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content, metadata, created_at, updated_at)
VALUES 
  ('d5b25cba-573b-4c42-a2f7-046e47d341f7', '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'pt-BR', 'text', 0, 'Regras para visitantes', 'Visitantes sao bem-vindos nas areas comuns do hotel ate as 22h.', '{}', NOW(), NOW()),
  ('d5b25cba-573b-4c42-a2f7-046e47d341f7', '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'pt-BR', 'text', 1, 'Hospedagem de visitantes', 'Visitantes que desejam pernoitar devem realizar check-in na recepcao.', '{}', NOW(), NOW()),
  ('d5b25cba-573b-4c42-a2f7-046e47d341f7', '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'pt-BR', 'text', 2, 'Responsabilidade', 'O hospede titular e responsavel por seus visitantes.', '{}', NOW(), NOW());

-- Politica de Pets (5495ecc5-ad28-4c9e-bebe-6d47767c6b61)
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content, metadata, created_at, updated_at)
VALUES 
  ('5495ecc5-ad28-4c9e-bebe-6d47767c6b61', '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'pt-BR', 'text', 0, 'Politica de Pets', 'O hotel nao permite hospedagem de animais de estimacao, exceto em casos especiais mediante consulta previa.', '{}', NOW(), NOW()),
  ('5495ecc5-ad28-4c9e-bebe-6d47767c6b61', '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'pt-BR', 'text', 1, 'Animais de servico', 'Animais de servico sao bem-vindos. Necessary documentacao deve ser apresentada.', '{}', NOW(), NOW()),
  ('5495ecc5-ad28-4c9e-bebe-6d47767c6b61', '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'pt-BR', 'text', 2, 'Duvidas', 'Em caso de duvidas sobre a politica, consulte a recepcao.', '{}', NOW(), NOW());

-- Danos e Responsabilidade (fef797cf-f82c-491f-b3ee-656f7f1b4455)
INSERT INTO guest_guide.content_blocks (page_id, property_id, org_id, locale, block_type, block_order, title, content, metadata, created_at, updated_at)
VALUES 
  ('fef797cf-f82c-491f-b3ee-656f7f1b4455', '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'pt-BR', 'text', 0, 'Responsabilidade', 'O hospede e responsavel por danos causados ao quarto ou areas comuns durante sua hospedagem.', '{}', NOW(), NOW()),
  ('fef797cf-f82c-491f-b3ee-656f7f1b4455', '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'pt-BR', 'text', 1, 'Cobranca', 'Danos serao cobrados conforme avaliacao da equipe do hotel.', '{}', NOW(), NOW()),
  ('fef797cf-f82c-491f-b3ee-656f7f1b4455', '22222222-2222-2222-2222-222222222222', 'b729534c-753b-48b0-ab4f-0756cc1cd271', 'pt-BR', 'text', 2, 'Seguro', 'Consulte a recepcao sobre opcoes de seguro para sua viagem.', '{}', NOW(), NOW());

COMMIT;
