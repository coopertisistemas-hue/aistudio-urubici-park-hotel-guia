/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react';
import DetailLayout, { type DetailSection } from './DetailLayout';
import { getPage, mapBlocksToSections, type PageData, type CTABlock, trackPageView, trackCtaClick } from '../../services/guestGuideService';
import { usePropertyId, useLocale } from '../../contexts/TenantContext';

export interface DynamicDetailPageProps {
  /** The API slug for this page (e.g., 'sua-estadia/check-in') */
  apiSlug: string;
  /** Static fallback sections - used when API is unavailable */
  fallbackSections: DetailSection[];
  /** Page title */
  title: string;
  /** Subtitle shown in yellow */
  subtitle: string;
  /** Description paragraph */
  description: string;
  /** Back link URL */
  backTo: string;
  /** Back link label */
  backLabel?: string;
  /** Hero icon class (Remix Icon) */
  heroIcon?: string;
  /** Hero icon color (hex) */
  heroIconColor?: string;
  /** Container label above sections */
  containerLabel?: string;
  /** Container label icon */
  containerLabelIcon?: string;
}

export interface DynamicDetailPageResult {
  sections: DetailSection[];
  ctaBlocks: CTABlock[];
  isLoading: boolean;
  isUsingFallback: boolean;
  pageData: PageData | null;
}

/**
 * Hook for loading page data from the API with fallback
 * Uses tenant context for multi-tenant support
 */
export function useDynamicPage(apiSlug: string, fallbackSections: DetailSection[]): DynamicDetailPageResult {
  const [sections, setSections] = useState<DetailSection[]>(fallbackSections);
  const [ctaBlocks, setCtaBlocks] = useState<CTABlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [pageData, setPageData] = useState<PageData | null>(null);
  
  const propertyId = usePropertyId();
  const locale = useLocale();

  useEffect(() => {
    let mounted = true;

    async function loadPage() {
      setIsLoading(true);
      
      try {
        const data = await getPage(apiSlug, propertyId, locale);
        
        if (mounted) {
          if (data && data.blocks && data.blocks.length > 0) {
            // Use API data
            const { sections: mappedSections, ctaBlocks: mappedCtas } = mapBlocksToSections(data.blocks);
            setSections(mappedSections.length > 0 ? mappedSections : fallbackSections);
            setCtaBlocks(mappedCtas);
            setPageData(data);
            setIsUsingFallback(false);
            
            // Track page view
            trackPageView(apiSlug, data.id);
          } else {
            // API returned no data - use fallback
            setSections(fallbackSections);
            setCtaBlocks([]);
            setIsUsingFallback(true);
          }
        }
      } catch (error) {
        console.error(`[DynamicDetailPage] Error loading ${apiSlug}:`, error);
        if (mounted) {
          setSections(fallbackSections);
          setCtaBlocks([]);
          setIsUsingFallback(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      mounted = false;
    };
  }, [apiSlug, fallbackSections, propertyId, locale]);

  return { sections, ctaBlocks, isLoading, isUsingFallback, pageData };
}

/**
 * Render CTA blocks as afterSections content
 */
function renderCTABlocks(ctaBlocks: CTABlock[]) {
  if (ctaBlocks.length === 0) return null;

  return (
    <div className="space-y-3">
      {ctaBlocks.map((cta) => (
        <a
          key={cta.id}
          href={cta.url}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl transition-colors"
          onClick={() => trackCtaClick('dynamic', cta.url, 'dynamic')}
        >
          <i className="ri-phone-line text-lg" />
          {cta.label}
        </a>
      ))}
    </div>
  );
}

/**
 * Dynamic Detail Page component
 * Loads content from API with fallback to static content
 */
export default function DynamicDetailPage({
  apiSlug,
  fallbackSections,
  title,
  subtitle,
  description,
  backTo,
  backLabel = 'Voltar',
  heroIcon,
  heroIconColor,
  containerLabel,
  containerLabelIcon,
}: DynamicDetailPageProps) {
  const { sections, ctaBlocks, isLoading, isUsingFallback } = useDynamicPage(apiSlug, fallbackSections);

  // Show loading state - but don't block rendering (fallback is already set)
  if (isLoading) {
    return (
      <DetailLayout
        title={title}
        subtitle={subtitle}
        description={description}
        sections={fallbackSections}
        backTo={backTo}
        backLabel={backLabel}
        heroIcon={heroIcon}
        heroIconColor={heroIconColor}
        containerLabel={containerLabel}
        containerLabelIcon={containerLabelIcon}
      />
    );
  }

  return (
    <DetailLayout
      title={title}
      subtitle={subtitle}
      description={description}
      sections={sections}
      backTo={backTo}
      backLabel={backLabel}
      heroIcon={heroIcon}
      heroIconColor={heroIconColor}
      containerLabel={containerLabel}
      containerLabelIcon={containerLabelIcon}
      afterSections={renderCTABlocks(ctaBlocks)}
    />
  );
}
