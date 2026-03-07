/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getHomeConfig, type HomeConfigData, type Locale } from '../services/guestGuideService';

export interface TenantConfig {
  propertyId: string;
  orgId: string;
  locale: Locale;
  title: string;
  subtitle: string | null;
  logoUrl: string | null;
  backgroundVideoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  showWeather: boolean;
  showPartners: boolean;
}

interface TenantContextValue {
  config: TenantConfig | null;
  isLoading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
}

const DEFAULT_PROPERTY_ID = '22222222-2222-2222-2222-222222222222'; // UPH (pilot)
const DEFAULT_LOCALE = 'pt-BR';

const TenantContext = createContext<TenantContextValue | null>(null);

/**
 * Tenant Provider - manages multi-tenant configuration
 * Loads configuration from API based on property_id
 */
export function TenantProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadConfig() {
    setIsLoading(true);
    setError(null);

    // Get property_id from URL query param or use default
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('property') || 
                       localStorage.getItem('guestguide_property_id') || 
                       DEFAULT_PROPERTY_ID;
    
    const locale = (urlParams.get('locale') || 
                   localStorage.getItem('guestguide_locale') || 
                   DEFAULT_LOCALE) as Locale;

    // Persist selection
    localStorage.setItem('guestguide_property_id', propertyId);
    localStorage.setItem('guestguide_locale', locale);

    try {
      const homeConfig = await getHomeConfig(propertyId, locale);
      
      if (homeConfig) {
        setConfig({
          propertyId,
          orgId: '', // Will be added to API response if needed
          locale,
          title: homeConfig.title,
          subtitle: homeConfig.subtitle,
          logoUrl: homeConfig.logo_url,
          backgroundVideoUrl: homeConfig.background_video?.url || null,
          primaryColor: homeConfig.primary_color,
          secondaryColor: homeConfig.secondary_color,
          showWeather: homeConfig.show_weather,
          showPartners: homeConfig.show_partners,
        });
      } else {
        // Fallback to default UPH config if API fails
        setConfig({
          propertyId,
          orgId: 'b729534c-753b-48b0-ab4f-0756cc1cd271',
          locale,
          title: 'Urubici Park Hotel',
          subtitle: 'Hospedagem Premium',
          logoUrl: null,
          backgroundVideoUrl: null,
          primaryColor: '#24577A',
          secondaryColor: '#6B4E8A',
          showWeather: true,
          showPartners: true,
        });
      }
    } catch (err) {
      console.error('[TenantProvider] Failed to load config:', err);
      setError('Failed to load tenant configuration');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <TenantContext.Provider value={{ config, isLoading, error, refreshConfig: loadConfig }}>
      {children}
    </TenantContext.Provider>
  );
}

/**
 * Hook to access tenant configuration
 */
export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

/**
 * Hook to get current property ID
 */
export function usePropertyId(): string {
  const { config } = useTenant();
  return config?.propertyId || DEFAULT_PROPERTY_ID;
}

/**
 * Hook to get current locale
 */
export function useLocale(): Locale {
  const { config } = useTenant();
  return (config?.locale || DEFAULT_LOCALE) as Locale;
}

/**
 * Tenant branding configuration
 */
export interface TenantBranding {
  primaryColor: string;
  secondaryColor: string;
  primaryColorHex: string;
  secondaryColorHex: string;
  logoUrl: string | null;
  title: string;
  subtitle: string | null;
}

/**
 * Get comprehensive branding configuration
 */
export function useTenantBranding(): TenantBranding {
  const { config } = useTenant();
  
  return {
    primaryColor: config?.primaryColor || '#24577A',
    secondaryColor: config?.secondaryColor || '#6B4E8A',
    primaryColorHex: config?.primaryColor?.replace('#', '') || '24577A',
    secondaryColorHex: config?.secondaryColor?.replace('#', '') || '6B4E8A',
    logoUrl: config?.logoUrl || null,
    title: config?.title || 'Guest Guide',
    subtitle: config?.subtitle || null,
  };
}

/**
 * Get CSS custom properties for tenant branding (for inline styles)
 */
export function useCssBranding(): Record<string, string> {
  const { config } = useTenant();
  
  return {
    '--primary-color': config?.primaryColor || '#24577A',
    '--secondary-color': config?.secondaryColor || '#6B4E8A',
  };
}
