-- Migration: 013_guest_guide_top_sticker.sql
-- Date: 2026-03-06
-- Purpose: Create TopSticker tables for dynamic notification bar content
-- Replaces: Hardcoded TopSticker messages in frontend

BEGIN;

-- ============================================
-- TOP STICKER MESSAGES
-- ============================================

CREATE TABLE guest_guide.top_sticker_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
    display_mode VARCHAR(20) DEFAULT 'rotating' CHECK (display_mode IN ('rotating', 'pinned')),
    priority INTEGER DEFAULT 0,
    page_id UUID REFERENCES guest_guide.pages(id) ON DELETE SET NULL,
    partner_id UUID REFERENCES guest_guide.partners(id) ON DELETE SET NULL,
    cta_url TEXT,
    cta_label VARCHAR(100),
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    sort_order INTEGER DEFAULT 0,
    is_emergency BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE guest_guide.top_sticker_messages IS 'TopSticker notification messages - replaces hardcoded frontend messages';

-- ============================================
-- TOP STICKER LOCALES (translations)
-- ============================================

CREATE TABLE guest_guide.top_sticker_locales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES guest_guide.top_sticker_messages(id) ON DELETE CASCADE,
    locale VARCHAR(5) NOT NULL DEFAULT 'pt-BR',
    icon VARCHAR(50),
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, locale)
);

COMMENT ON TABLE guest_guide.top_sticker_locales IS 'Localized content for TopSticker messages';

-- ============================================
-- INDEXES
-- ============================================

-- top_sticker_messages indexes
CREATE INDEX idx_top_sticker_property_id ON guest_guide.top_sticker_messages(property_id);
CREATE INDEX idx_top_sticker_org_id ON guest_guide.top_sticker_messages(org_id);
CREATE INDEX idx_top_sticker_status ON guest_guide.top_sticker_messages(status) WHERE status = 'active';
CREATE INDEX idx_top_sticker_priority ON guest_guide.top_sticker_messages(priority DESC, sort_order);
CREATE INDEX idx_top_sticker_validity ON guest_guide.top_sticker_messages(valid_from, valid_until) 
    WHERE status = 'active' AND deleted_at IS NULL;

-- top_sticker_locales indexes
CREATE INDEX idx_top_sticker_locales_message_id ON guest_guide.top_sticker_locales(message_id);
CREATE INDEX idx_top_sticker_locales_locale ON guest_guide.top_sticker_locales(locale);

-- ============================================
-- CONSTRAINTS
-- ============================================

-- Ensure valid_from < valid_until
ALTER TABLE guest_guide.top_sticker_messages
ADD CONSTRAINT chk_sticker_valid_dates 
CHECK (valid_from IS NULL OR valid_until IS NULL OR valid_from <= valid_until);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON COLUMN guest_guide.top_sticker_messages.status IS 'Message lifecycle: draft (editing), active (showing), archived (hidden)';
COMMENT ON COLUMN guest_guide.top_sticker_messages.display_mode IS 'rotating: cycles through messages; pinned: shows single message';
COMMENT ON COLUMN guest_guide.top_sticker_messages.priority IS 'Higher priority messages shown first, regardless of sort_order';
COMMENT ON COLUMN guest_guide.top_sticker_messages.page_id IS 'Optional: link sticker to a page for deep-linking';
COMMENT ON COLUMN guest_guide.top_sticker_messages.partner_id IS 'Optional: link sticker to a partner for monetization';
COMMENT ON COLUMN guest_guide.top_sticker_messages.valid_from IS 'Activation start time (NULL = always active when published)';
COMMENT ON COLUMN guest_guide.top_sticker_messages.valid_until IS 'Activation end time (NULL = always active when published)';
COMMENT ON COLUMN guest_guide.top_sticker_messages.is_emergency IS 'Emergency messages shown even when weather data fails';

COMMENT ON COLUMN guest_guide.top_sticker_locales.icon IS 'Emoji or icon class (e.g., ☕, 🚭, 🍷)';
COMMENT ON COLUMN guest_guide.top_sticker_locales.text IS 'Message text content';

COMMIT;
