/**
 * guestGuideService.ts
 *
 * ⚠️  DEPRECATED — This file exists for backward compatibility only.
 * Please import directly from 'guestGuideApi.ts' for new code.
 *
 * This file re-exports all functionality from guestGuideApi.ts to maintain
 * compatibility with existing imports during the migration period.
 */

export {
  // Core API functions
  getHomeConfig,
  getPage,
  listPartners,
  trackEvent,
  getIndexPages,
  // Tracking helpers
  trackPageView,
  trackCtaClick,
  trackPartnerView,
  trackVideoEvent,
  // Utilities
  createIdempotencyKey,
  getSessionId,
  EventTypes,
  // Content mapping
  mapBlocksToSections,
  // Constants
  DEFAULT_PROPERTY_ID,
  DEFAULT_LOCALE,
  // Types
  type ContentBlock,
  type PageData,
  type HomeConfig,
  type HomeConfigData,
  type Partner,
  type PartnerData,
  type PartnersResponse,
  type PartnerSchedule,
  type PartnerPromotion,
  type IndexPageData,
  type ChildPage,
  type TrackEventRequest,
  type TrackEventResponse,
  type Locale,
  type VideoInfo,
  type NavigationItem,
  type StickerItem,
  type EventType,
  type CTABlock,
  type DetailSection,
} from './guestGuideApi';
