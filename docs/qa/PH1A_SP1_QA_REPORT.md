# PH1A Sprint 1 - Frontend Contract and Gate Stabilization

Date: 2026-03-07
Branch: codex/phase-1a-pilot-readiness-fixes

## Scope
- Fixed frontend/service signature mismatches.
- Corrected tracking API usage in dynamic components.
- Removed conflicting home background video mounting by consolidating on AppShell background.
- Fixed home fallback nav rendering and ReviewCarousel props.
- Made shared header/footer tenant-aware for title/subtitle/logo.

## Files Changed
- src/services/guestGuideApi.ts
- src/contexts/TenantContext.tsx
- src/contexts/LanguageContext.tsx
- src/components/feature/DynamicPage.tsx
- src/components/feature/DynamicDetailPage.tsx
- src/components/feature/DynamicHome.tsx
- src/components/feature/DynamicIndexPage.tsx
- src/pages/home/page.tsx
- src/components/feature/AppShell.tsx
- src/components/feature/VideoBackground.tsx
- src/components/feature/PageHeader.tsx
- src/components/feature/PageFooter.tsx
- src/components/TopSticker.tsx
- src/router/config.tsx

## QA Evidence
Commands executed in repo root:
- npm run type-check
- npm run lint
- npm run build

Results:
- type-check: PASS
- lint: PASS
- build: PASS

## Runtime Validation
- Static validation only in this sprint (compile/lint/build gates).
- No additional browser runtime walkthrough executed in this sprint.
