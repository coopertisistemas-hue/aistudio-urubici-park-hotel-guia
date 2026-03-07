import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DetailLayout, { type DetailSection } from './DetailLayout';
import { getPage, mapBlocksToSections, type PageData, type CTABlock, trackPageView, trackCtaClick } from '../../services/guestGuideService';
import { useTenant, usePropertyId, useLocale } from '../../contexts/TenantContext';

/**
 * Maps URL patterns to parent page info for back navigation
 * This enables DynamicPage to infer context for unmapped routes
 */
const ROUTE_MAPPING: Record<string, { backTo: string; backLabel: string; subtitle: string }> = {
  'sua-estadia': { backTo: '/', backLabel: 'Voltar para Início', subtitle: 'Sua Estadia' },
  'sua-estadia/check-in': { backTo: '/sua-estadia', backLabel: 'Voltar para Sua Estadia', subtitle: 'Sua Estadia' },
  'sua-estadia/check-out': { backTo: '/sua-estadia', backLabel: 'Voltar para Sua Estadia', subtitle: 'Sua Estadia' },
  'sua-estadia/limpeza-e-enxoval': { backTo: '/sua-estadia', backLabel: 'Voltar para Sua Estadia', subtitle: 'Sua Estadia' },
  'sua-estadia/late-check-out': { backTo: '/sua-estadia', backLabel: 'Voltar para Sua Estadia', subtitle: 'Sua Estadia' },
  'sua-estadia/wi-fi': { backTo: '/sua-estadia', backLabel: 'Voltar para Sua Estadia', subtitle: 'Sua Estadia' },
  'cafe-gastronomia': { backTo: '/', backLabel: 'Voltar para Início', subtitle: 'Café & Gastronomia' },
  'cafe-gastronomia/cafe-da-manha': { backTo: '/cafe-gastronomia', backLabel: 'Voltar para Café & Gastronomia', subtitle: 'Café & Gastronomia' },
  'lazer-estrutura': { backTo: '/', backLabel: 'Voltar para Início', subtitle: 'Lazer & Estrutura' },
  'lazer-estrutura/estacionamento': { backTo: '/lazer-estrutura', backLabel: 'Voltar para Lazer & Estrutura', subtitle: 'Lazer & Estrutura' },
  'lazer-estrutura/carregamento-eletrico': { backTo: '/lazer-estrutura', backLabel: 'Voltar para Lazer & Estrutura', subtitle: 'Lazer & Estrutura' },
  'links-uteis': { backTo: '/', backLabel: 'Voltar para Início', subtitle: 'Links Úteis' },
  'links-uteis/emergencias': { backTo: '/links-uteis', backLabel: 'Voltar para Links Úteis', subtitle: 'Links Úteis' },
  'links-uteis/localizacao': { backTo: '/links-uteis', backLabel: 'Voltar para Links Úteis', subtitle: 'Links Úteis' },
  'regras-do-hotel': { backTo: '/', backLabel: 'Voltar para Início', subtitle: 'Regras do Hotel' },
  'regras-do-hotel/proibicoes': { backTo: '/regras-do-hotel', backLabel: 'Voltar para Regras do Hotel', subtitle: 'Regras do Hotel' },
  'regras-do-hotel/horario-de-silencio': { backTo: '/regras-do-hotel', backLabel: 'Voltar para Regras do Hotel', subtitle: 'Regras do Hotel' },
  'regras-do-hotel/visitantes': { backTo: '/regras-do-hotel', backLabel: 'Voltar para Regras do Hotel', subtitle: 'Regras do Hotel' },
  'regras-do-hotel/danos-e-responsabilidade': { backTo: '/regras-do-hotel', backLabel: 'Voltar para Regras do Hotel', subtitle: 'Regras do Hotel' },
  'regras-do-hotel/politica-de-pets': { backTo: '/regras-do-hotel', backLabel: 'Voltar para Regras do Hotel', subtitle: 'Regras do Hotel' },
  'eventos-corporativo': { backTo: '/', backLabel: 'Voltar para Início', subtitle: 'Eventos & Corporativo' },
  'eventos-corporativo/auditorio': { backTo: '/eventos-corporativo', backLabel: 'Voltar para Eventos & Corporativo', subtitle: 'Eventos & Corporativo' },
};

/**
 * Get route mapping for a given slug
 */
function getRouteMapping(slug: string) {
  // Try exact match first
  if (ROUTE_MAPPING[slug]) {
    return ROUTE_MAPPING[slug];
  }
  
  // Try parent path match
  const segments = slug.split('/');
  if (segments.length > 1) {
    const parentPath = segments.slice(0, -1).join('/');
    if (ROUTE_MAPPING[parentPath]) {
      return {
        ...ROUTE_MAPPING[parentPath],
        backTo: `/${parentPath}`,
        backLabel: `Voltar para ${ROUTE_MAPPING[parentPath].subtitle}`,
      };
    }
  }
  
  // Default fallback
  return { backTo: '/', backLabel: 'Voltar para Início', subtitle: '' };
}

interface DynamicPageProps {
  /** Override slug from URL params */
  overrideSlug?: string;
  /** Title for the page (used in fallback) */
  fallbackTitle?: string;
  /** Subtitle for the page */
  fallbackSubtitle?: string;
  /** Description for the page */
  fallbackDescription?: string;
  /** Hero icon class */
  fallbackHeroIcon?: string;
  /** Hero icon color */
  fallbackHeroIconColor?: string;
  /** Container label */
  fallbackContainerLabel?: string;
  /** Container label icon */
  fallbackContainerLabelIcon?: string;
  /** Back link URL */
  fallbackBackTo?: string;
  /** Back link label */
  fallbackBackLabel?: string;
}

/**
 * Dynamic Page Loader
 * Loads page content from API by slug (from URL or override)
 * Fully multi-tenant: uses tenant context for property_id and locale
 */
export default function DynamicPage({
  overrideSlug,
  fallbackTitle,
  fallbackSubtitle,
  fallbackDescription,
  fallbackHeroIcon,
  fallbackHeroIconColor = '#24577A',
  fallbackContainerLabel,
  fallbackContainerLabelIcon,
  fallbackBackTo: propBackTo,
  fallbackBackLabel: propBackLabel,
}: DynamicPageProps) {
  const params = useParams();
  const slug = overrideSlug || params['*'] || params.slug || 'home';
  
  const propertyId = usePropertyId();
  const locale = useLocale();
  const { config } = useTenant();
  
  // Get route mapping for fallback values
  const routeMapping = getRouteMapping(slug);
  const backTo = propBackTo || routeMapping.backTo;
  const backLabel = propBackLabel || routeMapping.backLabel;
  const defaultSubtitle = routeMapping.subtitle;
  
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [sections, setSections] = useState<DetailSection[]>([]);
  const [ctaBlocks, setCtaBlocks] = useState<CTABlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPage() {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getPage(slug, propertyId, locale);
        
        if (mounted) {
          if (data && data.blocks && data.blocks.length > 0) {
            const { sections: mappedSections, ctaBlocks: mappedCtas } = mapBlocksToSections(data.blocks);
            setPageData(data);
            setSections(mappedSections);
            setCtaBlocks(mappedCtas);
            
            // Track page view
            trackPageView(slug, data.id);
          } else {
            // Page not found in API - show 404-like state
            setError('Página não encontrada');
            setSections([]);
          }
        }
      } catch (err) {
        console.error(`[DynamicPage] Error loading ${slug}:`, err);
        if (mounted) {
          setError('Erro ao carregar página');
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
  }, [slug, propertyId, locale]);

  // Resolve fallback values
  const resolvedFallbackTitle = fallbackTitle || pageData?.title || slug.split('/').pop() || 'Página';
  const resolvedFallbackSubtitle = fallbackSubtitle || defaultSubtitle || config?.subtitle || '';
  const resolvedFallbackDescription = fallbackDescription || pageData?.description || '';

  // Loading state
  if (isLoading) {
    return (
      <DetailLayout
        title={resolvedFallbackTitle}
        subtitle={resolvedFallbackSubtitle}
        description={resolvedFallbackDescription}
        sections={[{ icon: 'ri-loader-4-line', title: 'Carregando...', text: 'Aguarde' }]}
        backTo={backTo}
        backLabel={backLabel}
        heroIcon={fallbackHeroIcon}
        heroIconColor={fallbackHeroIconColor}
        containerLabel={fallbackContainerLabel}
        containerLabelIcon={fallbackContainerLabelIcon}
      />
    );
  }

  // Error/not found state
  if (error || sections.length === 0) {
    return (
      <DetailLayout
        title={resolvedFallbackTitle}
        subtitle={resolvedFallbackSubtitle}
        description={resolvedFallbackDescription}
        sections={[
          { 
            icon: 'ri-error-warning-line', 
            title: error || 'Página não encontrada', 
            text: 'O conteúdo desta página não está disponível no momento.' 
          }
        ]}
        backTo={backTo}
        backLabel={backLabel}
        heroIcon={fallbackHeroIcon || 'ri-file-warning-line'}
        heroIconColor={fallbackHeroIconColor}
        containerLabel={fallbackContainerLabel}
        containerLabelIcon={fallbackContainerLabelIcon}
      />
    );
  }

  // Success - render with API data
  const title = pageData?.title || resolvedFallbackTitle;
  const subtitle = resolvedFallbackSubtitle || config?.subtitle || '';
  const description = pageData?.description || resolvedFallbackDescription;

  return (
    <DetailLayout
      title={title}
      subtitle={subtitle}
      description={description}
      sections={sections}
      backTo={backTo}
      backLabel={backLabel}
      heroIcon={fallbackHeroIcon}
      heroIconColor={fallbackHeroIconColor}
      containerLabel={fallbackContainerLabel || title}
      containerLabelIcon={fallbackContainerLabelIcon}
      afterSections={renderCTABlocks(ctaBlocks)}
    />
  );
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
