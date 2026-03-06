-- Migration: 001_create_guest_guide_schema.sql
-- Date: 2026-03-06
-- Purpose: Criar schema guest_guide

BEGIN;

CREATE SCHEMA IF NOT EXISTS guest_guide;

COMMENT ON SCHEMA guest_guide IS 'Schema para o modulo Guest Guide - guia dinamico multi-tenant';

COMMIT;
