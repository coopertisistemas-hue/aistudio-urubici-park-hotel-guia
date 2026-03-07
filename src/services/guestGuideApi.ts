// Guest Guide API Service
// Connects to Supabase Edge Functions for dynamic content
// Multi-tenant: property_id and locale are passed as parameters

// Default property (UPH - pilot tenant)
export const DEFAULT_PROPERTY_ID = '22222222-2222-2222-2222-222222222222';
export const DEFAULT_LOCALE = 'pt-BR';

const SUPABASE_PROJECT_REF = 'oravqykjpgqoiidqnfja';
const SUPABASE_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co`;
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yYXZxeWtqcGdxb2lpZHFuZmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMjE1MjMsImV4cCI6MjA1NjU5NzUyM30.0-1r0f6z9qCkKZrWqMnZYhZV9z5z5z5z5z5z5z5z5z5';

// ─── Types ───────────────────────────────────────────────────────────────────

export type Locale = 'pt-BR' | 'en' | 'es' | 'de';

export interface ContentBlock {
  id: string;
  block_type: string;
  block_order: number;
  title: string | null;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  metadata: Record<string, unknown>;
}

export interface PageData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  template: string;
  blocks: ContentBlock[];
}

export interface VideoInfo {
  id: string;
  url: string;
  thumbnail_url: string | null;
  title: string | null;
  is_sponsored: boolean;
  sponsor_name: string | null;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  icon: string | null;
}

export interface StickerItem {
  id: string;
  icon: string;
  text: string;
}

export interface ContactItem {
  id: string;
  name: string;
  contact_type: string;
  value: string;
  description: string | null;
  icon: string | null;
}

export interface HomeConfig {
  id: string;
  title: string;
  subtitle: string | null;
  logo_url: string | null;
  background_video: VideoInfo | null;
  primary_color: string | null;
  secondary_color: string | null;
  show_weather: boolean;
  show_partners: boolean;
  navigation: NavigationItem[];
  stickers: StickerItem[];
  contacts: ContactItem[];
  map_url: string | null;
}

export interface PartnerSchedule {
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
  notes: string | null;
}

export interface PartnerPromotion {
  title: string;
  description: string | null;
  discount_code: string | null;
  discount_value: string | null;
}

export interface Partner {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  website_url: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  category: string | null;
  is_featured: boolean;
  schedules: PartnerSchedule[];
  promotions: PartnerPromotion[];
}

export interface PartnersResponse {
  partners: Partner[];
  total: number;
}

export interface TrackEventRequest {
  event_type: string;
  event_category?: string;
  event_label?: string;
  entity_type?: string;
  entity_id?: string;
  user_session_id?: string;
  idempotency_key?: string;
  referrer_url?: string;
  metadata?: Record<string, unknown>;
}

export interface TrackEventResponse {
  id: string;
  event_type: string;
  created_at: string;
  is_new: boolean;
}

export interface ChildPage {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  template: string;
}

export interface IndexPageData {
  parent: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
  } | null;
  children: ChildPage[];
}

// ─── Error Handling ──────────────────────────────────────────────────────────

interface GuestGuideApiErrorArgs {
  message: string;
  status?: number;
  data?: unknown;
}

function createGuestGuideApiError(args: GuestGuideApiErrorArgs): Error & { status?: number; data?: unknown } {
  const error = new Error(args.message) as Error & { status?: number; data?: unknown; name: string };
  error.name = 'GuestGuideApiError';
  error.status = args.status;
  error.data = args.data;
  return error;
}

// ─── Core API Function ───────────────────────────────────────────────────────

async function callEdgeFunction<T>(
  functionName: string,
  body: Record<string, unknown>,
  propertyId?: string
): Promise<T> {
  const resolvedPropertyId = propertyId || getPropertyId();
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/${functionName}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'x-property-id': resolvedPropertyId,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw createGuestGuideApiError({
      message: errorData.error || `HTTP error ${response.status}`,
      status: response.status,
      data: errorData
    });
  }

  return response.json();
}

// Helper to get property ID from URL or use default
function getPropertyId(): string {
  // In a real implementation, this would extract from URL or context
  // For now, return the default property ID
  return DEFAULT_PROPERTY_ID;
}

// ─── API Functions ───────────────────────────────────────────────────────────

export async function getHomeConfig(
  propertyId?: string,
  locale: Locale = 'pt-BR'
): Promise<HomeConfig> {
  return callEdgeFunction<HomeConfig>('get_home_config', { locale }, propertyId);
}

export async function getPage(
  slug: string,
  propertyId?: string,
  locale: Locale = 'pt-BR'
): Promise<PageData> {
  return callEdgeFunction<PageData>('get_page', { slug, locale }, propertyId);
}

export async function listPartners(
  options: {
    propertyId?: string;
    locale?: Locale;
    category?: string;
    featuredOnly?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<PartnersResponse> {
  const {
    propertyId,
    locale = 'pt-BR',
    category,
    featuredOnly = false,
    limit = 20,
    offset = 0,
  } = options;

  return callEdgeFunction<PartnersResponse>('list_partners', {
    locale,
    category,
    featured_only: featuredOnly,
    limit,
    offset,
  }, propertyId);
}

export async function trackEvent(
  eventData: Omit<TrackEventRequest, 'property_id'>,
  propertyId?: string
): Promise<TrackEventResponse> {
  return callEdgeFunction<TrackEventResponse>('track_event', eventData, propertyId);
}

export async function getIndexPages(
  slug: string,
  propertyId?: string,
  locale: Locale = 'pt-BR'
): Promise<IndexPageData> {
  return callEdgeFunction('get_index_pages', { slug, locale }, propertyId);
}

// ─── Utilities ───────────────────────────────────────────────────────────────

export function createIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function getSessionId(): string {
  const STORAGE_KEY = 'guest_guide_session';
  let sessionId = localStorage.getItem(STORAGE_KEY);
  
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(STORAGE_KEY, sessionId);
  }
  
  return sessionId;
}

export const EventTypes = {
  PAGE_VIEW: 'page_view',
  PARTNER_VIEW: 'partner_view',
  CTA_CLICK: 'cta_click',
  VIDEO_IMPRESSION: 'video_impression',
  VIDEO_PLAY: 'video_play',
  VIDEO_START: 'video_start',
  VIDEO_COMPLETE: 'video_complete',
  PROMOTION_VIEW: 'promotion_view',
  PROMOTION_CLICK: 'promotion_click',
  NAVIGATION_CLICK: 'navigation_click',
  SEARCH: 'search',
  CONTACT_CLICK: 'contact_click',
} as const;

export type EventType = (typeof EventTypes)[keyof typeof EventTypes];

export async function trackPageView(
  pageSlug: string,
  pageId?: string
): Promise<TrackEventResponse> {
  return trackEvent({
    event_type: EventTypes.PAGE_VIEW,
    entity_type: 'page',
    entity_id: pageId,
    idempotency_key: createIdempotencyKey(),
    referrer_url: window.location.href,
  });
}

export async function trackCtaClick(
  ctaType: string,
  target: string,
  pageSlug?: string,
  pageId?: string
): Promise<TrackEventResponse> {
  return trackEvent({
    event_type: EventTypes.CTA_CLICK,
    event_category: ctaType,
    event_label: target,
    entity_type: 'page',
    entity_id: pageId,
    idempotency_key: createIdempotencyKey(),
    referrer_url: window.location.href,
    metadata: { target, page_slug: pageSlug },
  });
}

export async function trackPartnerView(
  partnerId: string,
  partnerName: string
): Promise<TrackEventResponse> {
  return trackEvent({
    event_type: EventTypes.PARTNER_VIEW,
    entity_type: 'partner',
    entity_id: partnerId,
    event_label: partnerName,
    idempotency_key: createIdempotencyKey(),
    referrer_url: window.location.href,
  });
}

export async function trackVideoEvent(
  eventType: 'video_impression' | 'video_play' | 'video_start' | 'video_complete',
  videoId?: string,
  videoTitle?: string
): Promise<TrackEventResponse> {
  return trackEvent({
    event_type: eventType,
    entity_type: 'video',
    entity_id: videoId,
    event_label: videoTitle,
    idempotency_key: createIdempotencyKey(),
    referrer_url: window.location.href,
  });
}

// ─── Content Block Mapping Utilities ─────────────────────────────────────────

export interface CTABlock {
  id: string;
  label: string;
  title: string;
  url: string;
}

export interface DetailSection {
  icon: string;
  title: string;
  text: string;
  imageUrl?: string;
  badge?: string;
  badgeColor?: string;
}

const blockTypeToIcon: Record<string, string> = {
  text: 'ri-text',
  cta: 'ri-links-line',
  image: 'ri-image-line',
  video: 'ri-video-line',
  map: 'ri-map-pin-line',
  contact: 'ri-phone-line',
  schedule: 'ri-calendar-line',
  menu: 'ri-restaurant-line',
};

/**
 * Maps API content blocks to DetailSection format
 * Also extracts CTA blocks separately for afterSections
 */
export function mapBlocksToSections(
  blocks: ContentBlock[]
): { sections: DetailSection[]; ctaBlocks: CTABlock[] } {
  const sortedBlocks = [...blocks].sort((a, b) => a.block_order - b.block_order);

  const sections: DetailSection[] = sortedBlocks
    .filter(b => b.block_type !== 'cta')
    .map((block) => ({
      icon: blockTypeToIcon[block.block_type] || 'ri-text',
      title: block.title || '',
      text: block.content || '',
      imageUrl: block.image_url || undefined,
      badge: (block.metadata?.badge as string) || undefined,
      badgeColor: (block.metadata?.badge_color as string) || undefined,
    }));

  const ctaBlocks: CTABlock[] = sortedBlocks
    .filter(b => b.block_type === 'cta' && (b.metadata?.url || b.cta_url))
    .map((block) => ({
      id: block.id,
      title: block.title || '',
      label: (block.metadata?.label as string) || block.cta_label || 'Acessar',
      url: (block.metadata?.url as string) || block.cta_url || '',
    }));

  return { sections, ctaBlocks };
}

// Type alias for backward compatibility
export type HomeConfigData = HomeConfig;
export type PartnerData = Partner;
