import { useState, useEffect } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { trackPageView } from '../../services/guestGuideService';

/**
 * Dynamic Home Page
 * Loads configuration and content from API based on tenant
 * Fully multi-tenant: uses tenant context for property_id and locale
 */
export default function DynamicHome() {
  const { config, isLoading: tenantLoading } = useTenant();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Track home page view
    if (!tenantLoading && config) {
      trackPageView('home');
    }
  }, [tenantLoading, config]);

  useEffect(() => {
    if (!tenantLoading) {
      setIsLoading(false);
    }
  }, [tenantLoading]);

  if (isLoading || tenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a5276] to-[#0d2f47]">
        <div className="text-white text-center">
          <i className="ri-loader-4-line text-4xl animate-spin mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Use config from tenant context
  const title = config?.title || 'Guest Guide';
  const subtitle = config?.subtitle || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a5276] to-[#0d2f47]">
      <div className="text-white text-center p-8">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-xl mb-4">{subtitle}</p>}
        <p className="text-white/70">Guest Guide carregado</p>
        <div className="mt-8 text-sm text-white/50">
          <p>Property ID: {config?.propertyId}</p>
          <p>Locale: {config?.locale}</p>
        </div>
      </div>
    </div>
  );
}
