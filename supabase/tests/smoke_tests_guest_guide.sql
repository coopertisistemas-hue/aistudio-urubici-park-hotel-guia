-- ============================================
-- SQL SMOKE TESTS - Guest Guide V2
-- Execute apos aplicar migrations + RLS
-- ============================================

-- ============================================
-- TESTE 1: RLS ativo em todas as tabelas
-- ============================================
SELECT 
    schemaname, 
    tablename, 
    rowsecurity
FROM pg_tables
WHERE schemaname = 'guest_guide'
ORDER BY tablename;

-- Resultado esperado: todas as tabelas com rowsecurity = true

-- ============================================
-- TESTE 2: Verificar ausencia de conteudo draft para anon
-- ============================================
-- Execute com anon token
SELECT id, status, title
FROM guest_guide.pages
WHERE status <> 'published'
LIMIT 10;

-- Resultado esperado: 0 linhas (ou vazio)

-- ============================================
-- TESTE 3: Sanidade de escopo tenant
-- Verifica se property.org_id == row.org_id
-- ============================================
SELECT t.id, t.org_id, p.org_id as property_org_id
FROM guest_guide.pages t
JOIN public.properties p ON p.id = t.property_id
WHERE p.org_id <> t.org_id
LIMIT 10;

-- Resultado esperado: 0 linhas

-- ============================================
-- TESTE 4: Colisoes de slug por property
-- ============================================
SELECT property_id, slug, count(*)
FROM guest_guide.page_routes
GROUP BY property_id, slug
HAVING count(*) > 1;

-- Resultado esperado: 0 linhas

-- ============================================
-- TESTE 5: Policy count por tabela
-- ============================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'guest_guide'
ORDER BY tablename, policyname;

-- Resultado esperado: politicas para anon, member, admin, staff

-- ============================================
-- TESTE 6: Verificar video fallback
-- ============================================
SELECT 
    id,
    title,
    is_sponsored,
    is_default,
    is_active,
    video_url IS NOT NULL as has_url
FROM guest_guide.background_videos
WHERE property_id = '00000000-0000-0000-0000-000000000001'
ORDER BY is_default DESC, sort_order;

-- Resultado esperado: pelo menos 1 video default ativo

-- ============================================
-- TESTE 7: Verificar partners ativos
-- ============================================
SELECT 
    id,
    name,
    slug,
    category,
    is_active,
    is_featured
FROM guest_guide.partners
WHERE property_id = '00000000-0000-0000-0000-000000000001'
ORDER BY is_featured DESC, sort_order;

-- Resultado esperado: parceiros com is_active = true

-- ============================================
-- TESTE 8: Verificar navigation nodes visiveis
-- ============================================
SELECT 
    id,
    label,
    url,
    locale,
    is_visible,
    sort_order
FROM guest_guide.navigation_nodes
WHERE property_id = '00000000-0000-0000-0000-000000000001'
  AND locale = 'pt-BR'
  AND is_visible = true
ORDER BY sort_order;

-- Resultado esperado: itens de menu visiveis

-- ============================================
-- TESTE 9: Check idempotency key unique
-- ============================================
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'guest_guide'
  AND tablename = 'event_log'
  AND indexdef LIKE '%idempotency_key%';

-- Resultado esperado: indice partial em idempotency_key

-- ============================================
-- TESTE 10: Verificar constraints de FK
-- ============================================
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'guest_guide';

-- Resultado esperado: FKs para public.properties e public.organizations
