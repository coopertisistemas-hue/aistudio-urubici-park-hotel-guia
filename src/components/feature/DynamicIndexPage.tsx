import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import { getIndexPages, type IndexPageData } from '../../services/guestGuideService';
import { useTenant, usePropertyId, useLocale } from '../../contexts/TenantContext';

/**
 * Color mapping for index pages (can be made tenant-configurable later)
 */
const DEFAULT_COLORS: Record<string, { color: string; accentColor: string }> = {
  'sua-estadia': { color: '#24577A', accentColor: '#7BB3E0' },
  'cafe-gastronomia': { color: '#C6922F', accentColor: '#E8C878' },
  'lazer-estrutura': { color: '#4EA16C', accentColor: '#8FD4A8' },
  'links-uteis': { color: '#C27C2C', accentColor: '#E8A878' },
  'regras-do-hotel': { color: '#7E57C2', accentColor: '#C4A8E0' },
  'eventos-corporativo': { color: '#2A6B8A', accentColor: '#7EC8E8' },
  'default': { color: '#24577A', accentColor: '#7BB3E0' },
};

interface DynamicIndexPageProps {
  /** The index slug (e.g., 'sua-estadia') */
  indexSlug: string;
  /** Page title override */
  title?: string;
  /** Hero icon class */
  heroIcon?: string;
  /** Hero icon color */
  heroIconColor?: string;
  /** Back link URL */
  backTo?: string;
  /** Back link label */
  backLabel?: string;
  /** Static subcategories (fallback) */
  fallbackSubcategories?: Array<{
    icon: string;
    color: string;
    accentColor: string;
    title: string;
    tag: string;
    description: string;
    link: string;
    isReception?: boolean;
  }>;
}

/**
 * Dynamic Index Page
 * Loads index page data from API (parent + children)
 * Falls back to static subcategories if API fails
 */
export default function DynamicIndexPage({
  indexSlug,
  title,
  heroIcon,
  heroIconColor: propHeroIconColor,
  backTo = '/',
  backLabel = 'Voltar',
  fallbackSubcategories,
}: DynamicIndexPageProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [indexData, setIndexData] = useState<IndexPageData | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  
  const navigate = useNavigate();
  const propertyId = usePropertyId();
  const locale = useLocale();
  const { config } = useTenant();

  useEffect(() => {
    let mounted = true;

    async function loadIndex() {
      setIsLoading(true);
      
      try {
        const data = await getIndexPages(indexSlug, locale, propertyId);
        
        if (mounted) {
          if (data && data.children && data.children.length > 0) {
            setIndexData(data);
            setUseFallback(false);
          } else if (fallbackSubcategories) {
            setUseFallback(true);
          }
        }
      } catch (error) {
        console.error(`[DynamicIndexPage] Error loading ${indexSlug}:`, error);
        if (mounted) {
          setUseFallback(!!fallbackSubcategories);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadIndex();

    // Scroll handler
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      mounted = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fallbackSubcategories, indexSlug, propertyId, locale]);

  const colors = DEFAULT_COLORS[indexSlug] || DEFAULT_COLORS['default'];
  const heroColor = propHeroIconColor || colors.color;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <PageHeader isScrolled={false} backTo={backTo} backLabel={backLabel} />
        <div className="flex items-center justify-center h-64">
          <i className="ri-loader-4-line text-4xl animate-spin text-white" />
        </div>
      </div>
    );
  }

  // Use fallback if API failed
  if (useFallback && fallbackSubcategories) {
    return (
      <IndexPageContent
        title={title || indexSlug}
        subcategories={fallbackSubcategories}
        heroIcon={heroIcon}
        heroIconColor={heroColor}
        backTo={backTo}
        backLabel={backLabel}
        isScrolled={isScrolled}
      />
    );
  }

  // Dynamic content from API
  const pageTitle = title || indexData?.parent?.title || indexSlug;
  const children = indexData?.children || [];

  // Map children to subcategory format (limited - no colors from API yet)
  const dynamicSubcategories = children.map((child, index) => {
    const colorPair = Object.values(DEFAULT_COLORS)[index % 6];
    return {
      icon: 'ri-file-list-line',
      color: colorPair.color,
      accentColor: colorPair.accentColor,
      title: child.title,
      tag: '',
      description: child.description || '',
      link: '/' + child.slug,
    };
  });

  return (
    <IndexPageContent
      title={pageTitle}
      subcategories={dynamicSubcategories}
      heroIcon={heroIcon}
      heroIconColor={heroColor}
      backTo={backTo}
      backLabel={backLabel}
      isScrolled={isScrolled}
    />
  );
}

/**
 * Internal component for rendering index page content
 */
function IndexPageContent({
  title,
  subcategories,
  heroIcon,
  heroIconColor,
  backTo,
  backLabel,
  isScrolled,
}: {
  title: string;
  subcategories: Array<{
    icon: string;
    color: string;
    accentColor: string;
    title: string;
    tag: string;
    description: string;
    link: string;
    isReception?: boolean;
  }>;
  heroIcon?: string;
  heroIconColor: string;
  backTo: string;
  backLabel: string;
  isScrolled: boolean;
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PageHeader isScrolled={isScrolled} backTo={backTo} backLabel={backLabel} />

      <div className="relative z-10 max-w-md mx-auto pt-8 pb-16">
        {/* Hero */}
        <div className="px-4 mb-8 text-center">
          {heroIcon && (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
              style={{ backgroundColor: `${heroIconColor}b3` }}
            >
              <i className={`${heroIcon} text-white text-3xl`} />
            </div>
          )}
          <h2 className="text-white font-bold text-3xl mb-2 drop-shadow-2xl leading-tight">
            {title}
          </h2>
        </div>

        {/* Subcategories Grid */}
        <div className="px-4 space-y-3">
          {subcategories.map((item, index) => (
            <Link
              key={item.title}
              to={item.link}
              className="block"
            >
              <div
                className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/25 shadow-xl overflow-hidden hover:bg-white/15 transition-colors"
              >
                <div className="p-4 flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${item.color}99` }}
                  >
                    <i className={`${item.icon} text-white text-xl`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-bold text-base truncate">
                        {item.title}
                      </h3>
                      {item.tag && (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                          style={{ 
                            backgroundColor: `${item.accentColor}33`,
                            color: item.accentColor 
                          }}
                        >
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-white/70 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <i className="ri-arrow-right-line text-white/40 text-lg flex-shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <PageFooter />
    </div>
  );
}
