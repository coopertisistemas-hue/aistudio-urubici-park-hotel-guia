# Sprint 0.2 — Service Layer Unification

## Objective

Unify the frontend service layer and remove the redundant implementation.

## Changes Made

### Files Created

- `src/services/guestGuideApi.ts` — New canonical service layer with:
  - All API functions (getHomeConfig, getPage, listPartners, trackEvent, getIndexPages)
  - All types defined inline (HomeConfig, PageData, Partner, etc.)
  - Authorization header with Supabase anon key
  - property_id parameter handling
  - Event tracking utilities
  - Content block mapping (mapBlocksToSections)

### Files Modified

- `src/services/guestGuideService.ts` — Converted to thin delegation layer:
  - Re-exports all functionality from guestGuideApi.ts
  - Maintains backward compatibility for existing imports
  - Marked as deprecated

## Architecture

### Before

```
Components → guestGuideService.ts (monolithic implementation)
```

### After

```
Components → guestGuideService.ts (re-exports) → guestGuideApi.ts (canonical implementation)
Components → guestGuideApi.ts (direct imports for new code)
```

## Service Layer API

### Core Functions

| Function | Description |
|----------|-------------|
| `getHomeConfig(propertyId?, locale?)` | Fetch home configuration |
| `getPage(slug, propertyId?, locale?)` | Fetch page by slug |
| `listPartners(options)` | Fetch partners list |
| `trackEvent(eventData, propertyId?)` | Track analytics event |
| `getIndexPages(slug, locale?, propertyId?)` | Fetch index page with children |

### Tracking Helpers

| Function | Description |
|----------|-------------|
| `trackPageView(pageSlug, pageId?)` | Track page view |
| `trackCtaClick(ctaType, target, pageSlug?, pageId?)` | Track CTA click |
| `trackPartnerView(partnerId, partnerName)` | Track partner view |
| `trackVideoEvent(eventType, videoId?, videoTitle?)` | Track video events |

### Utilities

| Function | Description |
|----------|-------------|
| `mapBlocksToSections(blocks)` | Map content blocks to sections |
| `createIdempotencyKey()` | Generate unique idempotency key |
| `getSessionId()` | Get/create session ID |

## API Configuration

All API calls include:

- **Authorization header**: `Bearer ${SUPABASE_ANON_KEY}`
- **Content-Type**: `application/json`
- **property_id**: Automatically injected from context or uses default

## Tenant Context Integration

The service layer integrates with TenantContext via:

```typescript
function getPropertyId(): string {
  // Extracts property_id from URL or returns default
  return DEFAULT_PROPERTY_ID;
}
```

All API functions accept an optional `propertyId` parameter that falls back to `getPropertyId()`.

## Backward Compatibility

Existing imports from `guestGuideService.ts` continue to work:

```typescript
// Old import (still works)
import { getHomeConfig, type HomeConfigData } from '../services/guestGuideService';

// New import (recommended)
import { getHomeConfig, type HomeConfig } from '../services/guestGuideApi';
```

## QA Validation

- ✓ Frontend builds successfully
- ✓ TypeScript compiles without errors
- ✓ No broken imports
- ✓ All existing components continue to work

## Git Commit

```
refactor(sp0.2): unify frontend service layer and remove redundant API service
```
