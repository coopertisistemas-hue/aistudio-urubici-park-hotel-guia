# PH3-SP2 - SEO and AI Discoverability

## Scope
- Validate metadata baseline for crawler discoverability.
- Add dynamic metadata fallback mechanism in `index.html`.
- Add JSON-LD `LodgingBusiness` schema.

## Changes
- Updated `index.html` with:
  - `<title>` fallback
  - `meta description`
  - OpenGraph tags (`og:title`, `og:description`, `og:url`, `og:image`, `og:site_name`, `og:locale`)
  - Twitter cards (`twitter:title`, `twitter:description`, `twitter:image`, `twitter:card`)
  - JSON-LD script (`LodgingBusiness`)
  - Runtime fallback script using optional `window.__GUEST_GUIDE_META__`

## Compatibility
- No API or edge contract changes.
- No frontend functional flow changes.
- Additive metadata/document-only impact.
