// Guest Guide API Service
// Connects to Supabase Edge Functions for dynamic content
// Multi-tenant: property_id and locale are passed as parameters

const SUPABASE_PROJECT_REF = 'oravqykjpgqoiidqnfja';
const SUPABASE_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co`;

// Default property (UPH - pilot tenant)
export const DEFAULT_PROPERTY_ID = '22222222-2222-2222-2222-222222222222';
export const DEFAULT_LOCALE = 'pt-BR';

// ─── Types ────────────────────────────────────────────────────────────────────

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

export interface HomeConfigData {
  id: string;
  title: string;
  subtitle: string | null;
  logo_url: string | null;
  background_video: {
    id: string;
    url: string;
    thumbnail_url: string | null;
    title: string | null;
    is_sponsored: boolean;
    sponsor_name: string | null;
  } | null;
  primary_color: string | null;
  secondary_color: string | null;
  show_weather: boolean;
  show_partners: boolean;
  navigation: Array<{
    id: string;
    label: string;
    url: string;
    icon: string | null;
  }>;
  stickers: Array<{
    id: string;
    icon: string;
    text: string;
  }>;
}

export interface PartnerData {
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
  schedules: Array<{
    day_of_week: number;
    open_time: string | null;
    close_time: string | null;
    is_closed: boolean;
    notes: string | null;
  }>;
  promotions: Array<{
    title: string;
    description: string | null;
    discount_code: string | null;
    discount_value: string | null;
  }>;
}

// ─── API Functions ───────────────────────────────────────────────────────────

/**
 * Fetch a page by slug from the Guest Guide API
 * Falls back to null if the API is unavailable
 * @param slug - Page slug (e.g., 'sua-estadia/check-in')
 * @param locale - Locale code (default: 'pt-BR')
 * @param propertyId - Property ID (default: DEFAULT_PROPERTY_ID)
 */
export async function getPage(
  slug: string, 
  locale: string = DEFAULT_LOCALE,
  propertyId: string = DEFAULT_PROPERTY_ID
): Promise<PageData | null> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/get_page`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        property_id: propertyId,
        slug,
        locale,
      }),
    });

    if (!response.ok) {
      console.warn(`[GuestGuide] getPage failed for ${slug}:`, response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.error) {
      console.warn(`[GuestGuide] getPage error for ${slug}:`, data.error);
      return null;
    }

    return data as PageData;
  } catch (error) {
    console.error(`[GuestGuide] getPage exception for ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch home configuration from the Guest Guide API
 * Falls back to null if the API is unavailable
 * @param locale - Locale code (default: 'pt-BR')
 * @param propertyId - Property ID (default: DEFAULT_PROPERTY_ID)
 */
export async function getHomeConfig(
  locale: string = DEFAULT_LOCALE,
  propertyId: string = DEFAULT_PROPERTY_ID
): Promise<HomeConfigData | null> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/get_home_config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        property_id: propertyId,
        locale,
      }),
    });

    if (!response.ok) {
      console.warn('[GuestGuide] getHomeConfig failed:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.error) {
      console.warn('[GuestGuide] getHomeConfig error:', data.error);
      return null;
    }

    return data as HomeConfigData;
  } catch (error) {
    console.error('[GuestGuide] getHomeConfig exception:', error);
    return null;
  }
}

/**
 * Fetch partners from the Guest Guide API
 * Falls back to empty array if the API is unavailable
 * @param category - Optional category filter
 * @param featuredOnly - Only return featured partners
 * @param locale - Locale code
 * @param propertyId - Property ID
 */
export async function listPartners(
  category?: string,
  featuredOnly: boolean = false,
  locale: string = DEFAULT_LOCALE,
  propertyId: string = DEFAULT_PROPERTY_ID
): Promise<PartnerData[]> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/list_partners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        property_id: propertyId,
        locale,
        category,
        featured_only: featuredOnly,
      }),
    });

    if (!response.ok) {
      console.warn('[GuestGuide] listPartners failed:', response.status);
      return [];
    }

    const data = await response.json();
    
    if (data.error) {
      console.warn('[GuestGuide] listPartners error:', data.error);
      return [];
    }

    return data.partners || [];
  } catch (error) {
    console.error('[GuestGuide] listPartners exception:', error);
    return [];
  }
}

/**
 * Track an event to the Guest Guide API
 * Silently fails if the API is unavailable (fire-and-forget)
 * @param eventType - Type of event (e.g., 'page_view', 'cta_click')
 * @param eventLabel - Optional label for the event
 * @param metadata - Optional metadata
 * @param propertyId - Property ID
 */
export async function trackEvent(
  eventType: string,
  eventLabel?: string,
  metadata?: Record<string, unknown>,
  propertyId: string = DEFAULT_PROPERTY_ID
): Promise<boolean> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/track_event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        property_id: propertyId,
        event_type: eventType,
        event_label: eventLabel,
        metadata,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('[GuestGuide] trackEvent exception:', error);
    return false;
  }
}

// ─── Content Block Mapping ─────────────────────────────────────────────────

export interface CTABlock {
  id: string;
  title: string;
  content: string;
  url: string;
  label: string;
}

/**
 * Maps API content blocks to DetailSection format
 * Also extracts CTA blocks separately for afterSections
 */
export function mapBlocksToSections(blocks: ContentBlock[]): {
  sections: Array<{
    icon: string;
    title: string;
    text: string;
  }>;
  ctaBlocks: CTABlock[];
} {
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

  const sortedBlocks = [...blocks].sort((a, b) => a.block_order - b.block_order);
  
  const sections = sortedBlocks
    .filter(b => b.block_type !== 'cta')
    .map((block) => ({
      icon: blockTypeToIcon[block.block_type] || 'ri-text',
      title: block.title || '',
      text: block.content || '',
    }));

  const ctaBlocks = sortedBlocks
    .filter(b => b.block_type === 'cta' && (b.metadata?.url || b.cta_url))
    .map((block) => ({
      id: block.id,
      title: block.title || '',
      content: block.content || '',
      url: (block.metadata?.url as string) || block.cta_url || '',
      label: (block.metadata?.label as string) || block.cta_label || 'Acessar',
    }));

  return { sections, ctaBlocks };
}

/**
 * Index page child entry
 */
export interface IndexChildPage {
  slug: string;
  title: string;
  description: string | null;
  template: string;
}

/**
 * Index page data
 */
export interface IndexPageData {
  parent: {
    slug: string;
    title: string;
    description: string | null;
  } | null;
  children: IndexChildPage[];
}

/**
 * Fetch index page data (parent + child pages)
 * Uses URL prefix matching to find children
 * @param slug - Parent page slug (e.g., 'sua-estadia')
 * @param locale - Locale code
 * @param propertyId - Property ID
 */
export async function getIndexPages(
  slug: string,
  locale: string = DEFAULT_LOCALE,
  propertyId: string = DEFAULT_PROPERTY_ID
): Promise<IndexPageData | null> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/get_index_pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        property_id: propertyId,
        slug,
        locale,
      }),
    });

    if (!response.ok) {
      console.warn(`[GuestGuide] getIndexPages failed for ${slug}:`, response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.error) {
      console.warn(`[GuestGuide] getIndexPages error for ${slug}:`, data.error);
      return null;
    }

    return data as IndexPageData;
  } catch (error) {
    console.error(`[GuestGuide] getIndexPages exception for ${slug}:`, error);
    return null;
  }
}
