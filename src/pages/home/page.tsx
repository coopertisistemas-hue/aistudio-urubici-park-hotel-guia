import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageFooter from '../../components/feature/PageFooter';
import QuickShortcuts, { type ShortcutItem } from '../../components/QuickShortcuts';
import TopSticker from '../../components/TopSticker';
import { getHomeConfig, trackPageView, type HomeConfigData } from '../../services/guestGuideService';
import { useLocale, usePropertyId } from '../../contexts/TenantContext';

const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  {
    icon: 'ri-hotel-line',
    label: 'Stay',
    to: '/sua-estadia',
    color: 'bg-blue-500/20',
    borderColor: 'border-blue-400/30',
    iconColor: 'text-blue-300',
  },
  {
    icon: 'ri-restaurant-line',
    label: 'Dining',
    to: '/cafe-gastronomia',
    color: 'bg-orange-500/20',
    borderColor: 'border-orange-400/30',
    iconColor: 'text-orange-300',
  },
  {
    icon: 'ri-gamepad-line',
    label: 'Leisure',
    to: '/lazer-estrutura',
    color: 'bg-green-500/20',
    borderColor: 'border-green-400/30',
    iconColor: 'text-green-300',
  },
  {
    icon: 'ri-links-line',
    label: 'Links',
    to: '/links-uteis',
    color: 'bg-yellow-500/20',
    borderColor: 'border-yellow-400/30',
    iconColor: 'text-yellow-300',
  },
];

const DEFAULT_STICKERS = [
  { icon: 'i', text: 'Check property-specific updates with the front desk.' },
  { icon: 'i', text: 'Use the guide to find stay information and useful contacts.' },
];

const DEFAULT_NAV_CARDS = [
  { title: 'Stay', description: 'Check-in, check-out, Wi-Fi and room support', link: '/sua-estadia', icon: 'ri-hotel-line', color: 'bg-blue-500/20' },
  { title: 'Dining', description: 'Restaurant and breakfast information', link: '/cafe-gastronomia', icon: 'ri-restaurant-line', color: 'bg-orange-500/20' },
  { title: 'Leisure', description: 'Hotel structure and leisure areas', link: '/lazer-estrutura', icon: 'ri-gamepad-line', color: 'bg-green-500/20' },
  { title: 'Useful Links', description: 'Contacts, location and emergency info', link: '/links-uteis', icon: 'ri-links-line', color: 'bg-yellow-500/20' },
];

function isExternalLink(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export default function DynamicHomePage() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [homeConfig, setHomeConfig] = useState<HomeConfigData | null>(null);

  const propertyId = usePropertyId();
  const locale = useLocale();

  useEffect(() => {
    let mounted = true;

    async function loadHomeConfig() {
      setIsLoading(true);

      try {
        const config = await getHomeConfig(propertyId, locale);
        if (mounted) {
          setHomeConfig(config || null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadHomeConfig();
    void trackPageView('home');

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      mounted = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }, [propertyId, locale]);

  const stickers = useMemo(
    () => (homeConfig?.stickers?.map((item) => ({ icon: item.icon, text: item.text })) || DEFAULT_STICKERS),
    [homeConfig]
  );

  const shortcuts = useMemo(
    () => homeConfig?.navigation?.map((nav, index) => {
      const colors = [
        { color: 'bg-blue-500/20', borderColor: 'border-blue-400/30', iconColor: 'text-blue-300' },
        { color: 'bg-purple-500/20', borderColor: 'border-purple-400/30', iconColor: 'text-purple-300' },
        { color: 'bg-orange-500/20', borderColor: 'border-orange-400/30', iconColor: 'text-orange-300' },
        { color: 'bg-red-500/20', borderColor: 'border-red-400/30', iconColor: 'text-red-300' },
        { color: 'bg-cyan-500/20', borderColor: 'border-cyan-400/30', iconColor: 'text-cyan-300' },
        { color: 'bg-yellow-500/20', borderColor: 'border-yellow-400/30', iconColor: 'text-yellow-300' },
      ];
      const palette = colors[index % colors.length];
      return {
        icon: nav.icon || 'ri-file-list-line',
        label: nav.label,
        to: isExternalLink(nav.url) ? undefined : nav.url,
        href: isExternalLink(nav.url) ? nav.url : undefined,
        ...palette,
      } as ShortcutItem;
    }) || DEFAULT_SHORTCUTS,
    [homeConfig]
  );

  const guideCards = useMemo(
    () => (homeConfig?.navigation?.length
      ? homeConfig.navigation.map((nav) => ({
          title: nav.label,
          description: '',
          link: nav.url,
          icon: nav.icon || 'ri-file-list-line',
          color: 'bg-blue-500/20',
        }))
      : DEFAULT_NAV_CARDS),
    [homeConfig]
  );

  const pageTitle = homeConfig?.title || t('heroTitle');
  const pageSubtitle = homeConfig?.subtitle || t('heroSubtitle');
  const mapUrl = homeConfig?.map_url || null;

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-b from-[#1a5276] to-[#0d2f47]" />
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="text-white text-center">
            <i className="ri-loader-4-line text-4xl animate-spin mb-4" />
            <p>Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#1a5276]/95 backdrop-blur-md shadow-lg' : ''}`}>
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {homeConfig?.logo_url && (
              <img src={homeConfig.logo_url} alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
            )}
            <span className="text-white font-bold text-lg">{pageTitle}</span>
          </div>
          {mapUrl ? (
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">
              <i className="ri-map-pin-line text-xl" />
            </a>
          ) : (
            <span className="text-white/30">
              <i className="ri-map-pin-line text-xl" />
            </span>
          )}
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto pt-20 pb-8">
        <div className="px-4">
          <TopSticker messages={stickers} />
        </div>

        <div className="px-4 mt-3 mb-3 text-center">
          <h2 className="text-white font-bold text-3xl mb-2 drop-shadow-2xl leading-tight">
            {pageTitle}
          </h2>
          <h3 className="text-blue-100 font-bold text-2xl mb-3 drop-shadow-xl">
            {pageSubtitle}
          </h3>
          <p className="text-white/90 text-base drop-shadow-lg leading-relaxed max-w-sm mx-auto">
            {t('heroDescription')}
          </p>
        </div>

        <QuickShortcuts items={shortcuts} />

        <div className="px-4 mb-6">
          <div className="px-4 mb-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 drop-shadow-md">
              <i className="ri-compass-discover-line text-yellow-400" />
              {t('exploreGuide')}
            </h3>
          </div>

          {guideCards.map((card) => {
            const cardContent = (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/25 shadow-xl overflow-hidden hover:bg-white/15 transition-colors">
                <div className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                    <i className={`${card.icon} text-white text-xl`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-base">{card.title}</h4>
                    {card.description ? <p className="text-white/70 text-sm">{card.description}</p> : null}
                  </div>
                  <i className="ri-arrow-right-line text-white/40" />
                </div>
              </div>
            );

            if (isExternalLink(card.link)) {
              return (
                <a key={card.title} href={card.link} target="_blank" rel="noopener noreferrer" className="block mb-3">
                  {cardContent}
                </a>
              );
            }

            return (
              <Link key={card.title} to={card.link} className="block mb-3">
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>

      <PageFooter />
    </div>
  );
}
