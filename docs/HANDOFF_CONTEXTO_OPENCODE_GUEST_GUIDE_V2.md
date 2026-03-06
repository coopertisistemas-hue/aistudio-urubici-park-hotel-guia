# Handoff de Contexto - Guest Guide V2 (Host Connect)

Data: 2026-03-06
Projeto: Guia do Hospede - Urubici Park Hotel
Objetivo: Migrar SPA estatico React/Vite para modulo dinamico multi-tenant com Supabase + RLS-first.

## Estado Atual (o que ja foi feito)

### 1) Diagnostico do repo (frontend)
- Aplicacao atual e estaticamente roteada em `src/router/config.tsx`.
- Conteudo das paginas esta hardcoded em arrays/componentes:
  - `src/pages/home/page.tsx`
  - `src/pages/sua-estadia/page.tsx`
  - `src/pages/regras-do-hotel/page.tsx`
  - `src/pages/restaurante-pimenta-rosa/page.tsx`
- Template reutilizavel para paginas de detalhe em `src/components/feature/DetailLayout.tsx`.
- Video de fundo persistente no shell (`src/components/feature/AppShell.tsx`) com fontes estaticas em `src/components/feature/VideoBackground.tsx`.
- i18n ativo com `pt-BR`, `en`, `es`, `de`:
  - `src/contexts/LanguageContext.tsx`
  - `src/i18n/local/*/translation.ts`
  - Atualmente so parte pequena das strings esta traduzida; muitos textos seguem fixos em PT nas paginas.

### 2) Diagnostico do banco (schema dump)
Arquivo analisado: `docs/db/host_connect_schema_dump.sql`

Core multi-tenant identificado:
- `public.organizations` (tenant org)
- `public.org_members` (membership e roles)
- `public.properties` (escopo de propriedade)

Helpers RLS existentes e padrao atual:
- `public.is_org_admin(p_org_id uuid)`
- `public.is_org_member(p_org_id uuid)`
- `public.is_super_admin()`
- `public.is_hostconnect_staff()`
- `public.check_user_access(property_id)`

Padrao de consistencia de escopo ja usado no projeto:
- Triggers/funcoes para preencher/validar `org_id` com base em `property_id`.
- Ex.: `set_org_id_from_property()`, `enforce_booking_scope_consistency()`.

Tabelas de auditoria/eventos existentes:
- `public.audit_log` (auditoria interna staff)
- `public.reservation_orchestration_events` (ledger de eventos com idempotencia)
- `public.lead_timeline_events` existe, mas com politicas SP0A lock (nao reutilizar direto para analytics publico do guest guide).

Padroes CRUD observados no ecossistema Host Connect:
- CRUD direto com RLS.
- RPCs `SECURITY DEFINER` para fluxos sensiveis.
- Triggers para consistencia de escopo multi-tenant.
- Sem views publicas relevantes para reaproveitamento neste modulo.

### 3) Entrega tecnica ja produzida no chat
Foi entregue um relatorio tecnico completo com:
- analise do estado atual,
- proposta de arquitetura em schema dedicado `guest_guide`,
- plano de RLS,
- contratos de Edge Functions (`get_page`, `get_home_config`, `list_partners`, `track_event`),
- plano faseado de implementacao,
- checklist de QA,
- backlog de features priorizadas.

## Proposta Arquitetural Aprovada no Fluxo

### Schema alvo
- Criar schema dedicado: `guest_guide`.
- Garantir `org_id` + `property_id` em todas as tabelas de dominio.
- FK para `public.organizations(id)` e `public.properties(id)`.

### Dominios principais previstos
- Navegacao dinamica (taxonomy/tree nodes)
- Paginas por slug e templates
- Blocos de conteudo ordenados e localizados
- Parceiros/recomendacoes/tags/contatos/midia
- Monetizacao (featured/sponsored placements, video patrocinado + fallback)
- Analytics de eventos (page view, partner view, CTA click, video impression/start)

### Politica de acesso (RLS-first)
- `anon`: leitura apenas de conteudo publicado/ativo/publico.
- `authenticated`: leitura interna por `is_org_member(org_id)`.
- CRUD administrativo por `is_org_admin(org_id)` (com override staff quando aplicavel).
- `event_log`: insercao anon controlada via Edge Function + idempotencia.

## Proximos Passos (sequencia recomendada)

1. Criar migrations SQL iniciais do modulo (`guest_guide`).
2. Implementar constraints, indexes e triggers de consistencia multi-tenant.
3. Implementar RLS completo nas tabelas do modulo.
4. Seed inicial replicando o conteudo atual do UPH (paridade com SPA).
5. Implementar Edge Functions BFF:
   - `get_page`
   - `get_home_config`
   - `list_partners`
   - `track_event`
6. Instrumentar tracking no frontend.
7. Integrar CRUD no Host Connect Admin.

## Ordem sugerida de migrations

1. `20260305_001_create_guest_guide_schema.sql`
2. `20260305_002_create_guest_guide_core_tables.sql`
3. `20260305_003_create_guest_guide_partner_tables.sql`
4. `20260305_004_create_guest_guide_monetization_tables.sql`
5. `20260305_005_create_guest_guide_event_tables.sql`
6. `20260305_006_guest_guide_constraints_indexes.sql`
7. `20260305_007_guest_guide_functions_triggers.sql`
8. `20260305_008_guest_guide_rls.sql`
9. `20260305_009_seed_uph_base_content.sql`
10. `20260305_010_seed_uph_i18n_and_partners.sql`
11. `20260305_011_seed_uph_home_video_default_and_sponsored_slots.sql`

## Prompt de retomada (copiar no outro OpenCode)

"""
Continue exatamente do handoff em `docs/HANDOFF_CONTEXTO_OPENCODE_GUEST_GUIDE_V2.md`.

Contexto:
- Projeto: Guia do Hospede - Urubici Park Hotel no ecossistema Host Connect.
- Objetivo: migrar SPA estatico para modulo dinamico com Supabase (Postgres) e arquitetura RLS-first multi-tenant.
- Base de analise: `docs/db/host_connect_schema_dump.sql` + codigo atual em `src/`.

Tarefa agora:
1) Gerar as migrations SQL reais (001 a 008) para criar schema `guest_guide`, tabelas, constraints, indexes, triggers e RLS.
2) Gerar seed inicial (009 a 011) para paridade de conteudo com a SPA atual.
3) Propor estrutura de Edge Functions (arquivos e contratos) para `get_page`, `get_home_config`, `list_partners`, `track_event`.
4) Validar consistencia com os helpers existentes (`is_org_admin`, `is_org_member`, `is_super_admin`, `is_hostconnect_staff`).

Requisitos de seguranca:
- Nao quebrar isolamento tenant.
- Nao expor conteudo nao publicado para anon.
- Garantir fallback de video patrocinado para video padrao.
"""

## Observacoes de continuidade
- Nenhum commit foi criado nesta etapa.
- Nao houve alteracao de schema real no banco ainda (somente analise e planejamento).
- Este arquivo e o ponto oficial de continuidade para outra maquina.
