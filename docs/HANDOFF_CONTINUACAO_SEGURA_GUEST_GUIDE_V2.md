# Continuacao Segura - Guest Guide V2

Data: 2026-03-06
Escopo: garantir retomada segura, previsivel e auditavel em outra maquina

## 1) Fonte oficial de contexto

Use este arquivo em conjunto com:
- `docs/HANDOFF_CONTEXTO_OPENCODE_GUEST_GUIDE_V2.md`
- `docs/db/host_connect_schema_dump.sql`

Regra: qualquer decisao nova deve manter compatibilidade com o modelo multi-tenant atual (`org_id` + `property_id`) e com os helpers de RLS existentes.

## 2) Guardrails obrigatorios (nao negociaveis)

- Nunca publicar conteudo `draft` para `anon`.
- Nunca permitir escrita cross-tenant (org/property diferente do contexto).
- Toda tabela de dominio novo deve ter `org_id` e `property_id`.
- Toda tabela nova deve ter RLS habilitado antes de abrir acesso de leitura/escrita.
- Toda insercao publica de evento deve passar por BFF (`track_event`) com validacao e idempotencia.
- Video patrocinado deve ter fallback garantido para video padrao do hotel.

## 3) Ordem de execucao recomendada (com gates)

### Gate A - Preparacao
1. Criar branch de trabalho.
2. Confirmar que nao existe migration concorrente para `guest_guide`.
3. Confirmar que a base alvo para desenvolvimento e STAGING.

Saida esperada:
- branch criada
- plano de migrations congelado

### Gate B - Modelo de dados
1. Criar migrations `001` a `007` (schema, tabelas, constraints/indexes, funcoes/triggers).
2. Revisar FKs tenant e checks de consistencia.
3. Revisar chaves unicas de slug/ordem.

Saida esperada:
- migrations SQL compiladas sem erro
- sem dependencia circular de FK

### Gate C - RLS
1. Implementar migration `008` com politicas por tabela.
2. Validar fluxos:
   - anon read apenas `published`
   - authenticated org member read interno
   - org admin CRUD
   - staff override apenas onde necessario

Saida esperada:
- sem bypass acidental
- politicas `USING` e `WITH CHECK` coerentes

### Gate D - Seed e paridade
1. Implementar `009` a `011` com conteudo inicial UPH.
2. Garantir paridade de rotas e conteudos principais com a SPA atual.
3. Garantir `locale fallback` para campos sem traducao.

Saida esperada:
- homepage e paginas chave renderizam por slug
- sem rota quebrada

### Gate E - BFF
1. Implementar `get_page`, `get_home_config`, `list_partners`, `track_event`.
2. Adicionar contratos JSON estaveis.
3. Aplicar cache e invalidacao minima segura.

Saida esperada:
- endpoints com resposta consistente e previsivel

## 4) Testes minimos de seguranca (SQL smoke tests)

Executar apos migrations + RLS:

```sql
-- 1) RLS ativo em todas as tabelas do schema novo
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'guest_guide'
order by tablename;
```

```sql
-- 2) Conferir ausencia de linhas publicas nao publicadas (exemplo para pages)
-- Rodar como anon token no cliente e verificar que draft nao aparece
select id, status
from guest_guide.pages
where status <> 'published';
```

```sql
-- 3) Sanidade de escopo tenant
-- Nao deve existir registro onde property org nao bate com org_id da linha
select t.id
from guest_guide.pages t
join public.properties p on p.id = t.property_id
where p.org_id <> t.org_id;
```

```sql
-- 4) Colisoes de slug por property
select property_id, slug, count(*)
from guest_guide.page_routes
group by property_id, slug
having count(*) > 1;
```

## 5) Riscos principais e mitigacao imediata

- Risco: policy duplicada/confusa como em tabelas legadas.
  - Mitigacao: 1 politica por operacao e por papel alvo; nomear com padrao consistente.

- Risco: drift entre `org_id` da linha e `property_id`.
  - Mitigacao: trigger de validacao + check em `WITH CHECK`.

- Risco: analytics inflado por reenvio do cliente.
  - Mitigacao: `idempotency_key` parcial unica por `property_id`.

- Risco: falta de fallback de traducao.
  - Mitigacao: fallback encadeado (`requested -> property default -> pt-BR`).

- Risco: quebra de UX por falta de video ativo.
  - Mitigacao: sempre retornar `background_video` resolvido com fallback.

## 6) Definition of Done por fase

- Fase schema: migrations aplicam limpo em banco vazio e em banco com estado atual.
- Fase RLS: cenarios anon/member/admin/staff validados.
- Fase seed: paridade funcional com SPA estatica para UPH.
- Fase BFF: contratos estaveis e cache headers aplicados.
- Fase admin: CRUD sem permitir cross-tenant.

## 7) Convencoes de naming (para evitar retrabalho)

- Schema: `guest_guide`
- Tabelas: plural snake_case (`pages`, `page_routes`, `content_blocks`)
- Chaves:
  - `id` UUID PK
  - `org_id`, `property_id` sempre presentes
- Timestamps: `created_at`, `updated_at`, opcional `deleted_at`
- Status: `draft|review|published|archived`

## 8) Proxima acao recomendada

Comecar direto por `20260305_001_create_guest_guide_schema.sql` ate `20260305_008_guest_guide_rls.sql`, e so depois abrir seed e BFF.
