-- Migration: 005_create_guest_guide_event_tables.sql
-- Date: 2026-03-06
-- Purpose: Criar tabelas de eventos/analytics do Guest Guide

BEGIN;

-- 1. Tabela principal de eventos (idempotente)
CREATE TABLE guest_guide.event_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    event_type VARCHAR(50) NOT NULL,
    event_category VARCHAR(50),
    event_label VARCHAR(255),
    entity_type VARCHAR(50),
    entity_id UUID,
    user_session_id VARCHAR(255),
    idempotency_key VARCHAR(255),
    referrer_url TEXT,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indices para event_log (performance)
CREATE INDEX idx_event_log_property_id ON guest_guide.event_log(property_id);
CREATE INDEX idx_event_log_org_id ON guest_guide.event_log(org_id);
CREATE INDEX idx_event_log_event_type ON guest_guide.event_log(event_type);
CREATE INDEX idx_event_log_created_at ON guest_guide.event_log(created_at);
CREATE INDEX idx_event_log_idempotency_key ON guest_guide.event_log(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- 3. Tabela de contadores agregados (cache friendly)
CREATE TABLE guest_guide.event_aggregates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    entity_type VARCHAR(50),
    entity_id UUID,
    event_type VARCHAR(50) NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    period_type VARCHAR(20) NOT NULL,
    count INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, entity_type, entity_id, event_type, period_start, period_type)
);

COMMENT ON TABLE guest_guide.event_log IS 'Log de eventos com suporte a idempotencia';
COMMENT ON TABLE guest_guide.event_aggregates IS 'Contadores agregados para cache e relatorios';

COMMIT;
