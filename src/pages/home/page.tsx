import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageFooter from '../../components/feature/PageFooter';
import QuickShortcuts, { type ShortcutItem } from '../../components/QuickShortcuts';
import TopSticker from '../../components/TopSticker';
import ReviewCarousel from '../../components/ReviewCarousel';
import { getHomeConfig, type HomeConfigData } from '../../services/guestGuideService';
import { usePropertyId, useLocale } from '../../contexts/TenantContext';

const REVIEW_URL = 'https://www.google.com/search?q=Urubici+Park+Hotel+avaliacoes';
const MAPS_URL = 'https://www.google.com/maps/place/Urubici+Park+Hotel';

// Default fallback data
const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  {
    icon: 'ri-phone-line',
    label: 'Chamar Recepção',
    to: '/sua-estadia',
    color: 'bg-blue-500/20',
    borderColor: 'border-blue-400/30',
    iconColor: 'text-blue-300',
  },
  {
    icon: 'ri-wifi-line',
    label: 'Wi-Fi',
    to: '/sua-estadia/wi-fi',
    color: 'bg-purple-500/20',
    borderColor: 'border-purple-400/30',
    iconColor: 'text-purple-300',
  },
  {
    icon: 'ri-cup-line',
    label: 'Café da Manhã',
    to: '/cafe-gastronomia/cafe-da-manha',
    color: 'bg-orange-500/20',
    borderColor: 'border-orange-400/30',
    iconColor: 'text-orange-300',
  },
  {
    icon: 'ri-restaurant-line',
    label: 'Restaurante',
    to: '/cafe-gastronomia',
    color: 'bg-red-500/20',
    borderColor: 'border-red-400/30',
    iconColor: 'text-red-300',
  },
  {
    icon: 'ri-sun-line',
    label: 'Clima',
    to: '/clima',
    color: 'bg-cyan-500/20',
    borderColor: 'border-cyan-400/30',
    iconColor: 'text-cyan-300',
  },
  {
    icon: 'ri-star-line',
    label: 'Avaliações',
    href: REVIEW_URL,
    color: 'bg-yellow-500/20',
    borderColor: 'border-yellow-400/30',
    iconColor: 'text-yellow-300',
  },
];

const DEFAULT_STICKERS = [
  { icon: '☕', text: 'Café da manhã das 6h às 10h' },
  { icon: '🚭', text: 'Ambiente livre de fumo (áreas internas)' },
  { icon: '🍷', text: 'Carta de vinhos disponível no restaurante' },
];

const DEFAULT_REVIEWS = [
  { name: 'Mariana S.', rating: '★★★★★', text: 'Atendimento excelente, quarto impecável e café da manhã muito bem servido. Voltaremos!' },
  { name: 'Carlos A.', rating: '★★★★★', text: 'Localização perfeita e equipe muito atenciosa. Experiência premium do início ao fim.' },
  { name: 'Fernanda R.', rating: '★★★★☆', text: 'Tudo ótimo. Sugestão: mais opções sem lactose no café. No geral, excelente!' },
  { name: 'João P.', rating: '★★★★★', text: 'Hotel lindo, cama confortável e silêncio à noite. Recomendo muito.' },
  { name: 'Patrícia M.', rating: '★★★★★', text: 'Check-in rápido, recepção prestativa e estrutura impecável. Nota 10.' },
];

/**
 * Dynamic Home Page
 * Loads configuration from API via get_home_config
 * Falls back to static content if API unavailable
 */
export default function DynamicHomePage() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [homeConfig, setHomeConfig] = useState<HomeConfigData | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  
  const propertyId = usePropertyId();
  const locale = useLocale();

  useEffect(() => {
    let mounted = true;

    async function loadHomeConfig() {
      setIsLoading(true);
      
      try {
        const config = await getHomeConfig(propertyId, locale);
        
        if (mounted) {
          if (config) {
            setHomeConfig(config);
            setUseFallback(false);
          } else {
            setUseFallback(true);
          }
        }
      } catch (error) {
        console.error('[DynamicHomePage] Error loading config:', error);
        if (mounted) {
          setUseFallback(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadHomeConfig();

    // Scroll handler
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      mounted = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }, [propertyId, locale]);

  // Get data from API or use fallback
  const stickers = (homeConfig?.stickers?.map(s => ({ icon: s.icon, text: s.text })) || DEFAULT_STICKERS);
  const shortcuts = homeConfig?.navigation?.map((nav, index) => {
    const colors = [
      { color: 'bg-blue-500/20', borderColor: 'border-blue-400/30', iconColor: 'text-blue-300' },
      { color: 'bg-purple-500/20', borderColor: 'border-purple-400/30', iconColor: 'text-purple-300' },
      { color: 'bg-orange-500/20', borderColor: 'border-orange-400/30', iconColor: 'text-orange-300' },
      { color: 'bg-red-500/20', borderColor: 'border-red-400/30', iconColor: 'text-red-300' },
      { color: 'bg-cyan-500/20', borderColor: 'border-cyan-400/30', iconColor: 'text-cyan-300' },
      { color: 'bg-yellow-500/20', borderColor: 'border-yellow-400/30', iconColor: 'text-yellow-300' },
    ];
    const c = colors[index % colors.length];
    return {
      icon: nav.icon || 'ri-file-list-line',
      label: nav.label,
      to: nav.url,
      ...c,
    } as ShortcutItem;
  }) || DEFAULT_SHORTCUTS;

  const pageTitle = homeConfig?.title || t('heroTitle');
  const pageSubtitle = homeConfig?.subtitle || t('heroSubtitle');
  const guideCards = (useFallback || !homeConfig?.navigation?.length)
    ? DEFAULT_NAV_CARDS
    : homeConfig.navigation.map((nav) => ({
      title: nav.label,
      description: '',
      link: nav.url,
      icon: nav.icon || 'ri-file-list-line',
      color: 'bg-blue-500/20',
    }));

  // Loading state
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
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#1a5276]/95 backdrop-blur-md shadow-lg' : ''}`}>
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {homeConfig?.logo_url && (
              <img src={homeConfig.logo_url} alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
            )}
            <span className="text-white font-bold text-lg">{pageTitle}</span>
          </div>
          <Link to={MAPS_URL} target="_blank" className="text-white/80 hover:text-white">
            <i className="ri-map-pin-line text-xl" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-md mx-auto pt-20 pb-8">
        {/* Top Sticker */}
        <div className="px-4">
          <TopSticker messages={stickers} />
        </div>

        {/* Hero */}
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

        {/* Quick Shortcuts */}
        <QuickShortcuts items={shortcuts} />

        {/* Guide Cards */}
        <div className="px-4 mb-6">
          <div className="px-4 mb-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 drop-shadow-md">
              <i className="ri-compass-discover-line text-yellow-400" />
              {t('exploreGuide')}
            </h3>
          </div>

          {/* Navigation Cards */}
          {guideCards.map(card => (
            <Link key={card.title} to={card.link} className="block mb-3">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/25 shadow-xl overflow-hidden hover:bg-white/15 transition-colors">
                <div className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                    <i className={`${card.icon} text-white text-xl`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-base">{card.title}</h4>
                    <p className="text-white/70 text-sm">{card.description}</p>
                  </div>
                  <i className="ri-arrow-right-line text-white/40" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Reviews */}
        <div className="px-4 mb-6">
          <ReviewCarousel reviews={DEFAULT_REVIEWS} reviewUrl={REVIEW_URL} mapsUrl={MAPS_URL} />
        </div>
      </div>

      <PageFooter />
    </div>
  );
}

// Default navigation cards (fallback)
const DEFAULT_NAV_CARDS = [
  { title: 'Sua Estadia', description: 'Check-in, Check-out, Wi-Fi e informações', link: '/sua-estadia', icon: 'ri-hotel-line', color: 'bg-blue-500/20' },
  { title: 'Café & Gastronomia', description: 'Restaurante e café da manhã', link: '/cafe-gastronomia', icon: 'ri-restaurant-line', color: 'bg-orange-500/20' },
  { title: 'Lazer & Estrutura', description: 'Estacionamento, jogos e mais', link: '/lazer-estrutura', icon: 'ri-gamepad-line', color: 'bg-green-500/20' },
  { title: 'Links Úteis', description: 'Emergências, localização e contatos', link: '/links-uteis', icon: 'ri-links-line', color: 'bg-yellow-500/20' },
];

