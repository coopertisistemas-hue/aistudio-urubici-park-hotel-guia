import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageFooter from '../../components/feature/PageFooter';
import QuickShortcuts, { type ShortcutItem } from '../../components/QuickShortcuts';
import TopSticker from '../../components/TopSticker';
import ReviewCarousel from '../../components/ReviewCarousel';
import { useLanguage, languageLabels, type Language } from '../../contexts/LanguageContext';

const REVIEW_URL = 'https://www.google.com/search?q=Urubici+Park+Hotel+avaliacoes';
const MAPS_URL = 'https://www.google.com/maps/place/Urubici+Park+Hotel';

const shortcuts: ShortcutItem[] = [
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

const stickerMessages = [
  { icon: '☕', text: 'Café da manhã até 10:00' },
  { icon: '🍷', text: 'Carta de vinhos disponível no restaurante' },
  { icon: '🎵', text: 'Música ao vivo hoje às 20h' },
];

const reviews = [
  { name: 'Mariana S.', rating: '★★★★★', text: 'Atendimento excelente, quarto impecável e café da manhã muito bem servido. Voltaremos!' },
  { name: 'Carlos A.', rating: '★★★★★', text: 'Localização perfeita e equipe muito atenciosa. Experiência premium do início ao fim.' },
  { name: 'Fernanda R.', rating: '★★★★☆', text: 'Tudo ótimo. Sugestão: mais opções sem lactose no café. No geral, excelente!' },
  { name: 'João P.', rating: '★★★★★', text: 'Hotel lindo, cama confortável e silêncio à noite. Recomendo muito.' },
  { name: 'Patrícia M.', rating: '★★★★★', text: 'Check-in rápido, recepção prestativa e estrutura impecável. Nota 10.' },
];

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguage();
  const languages: Language[] = ['pt-BR', 'es', 'en', 'de'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setLangMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header */}
      <header
        className={`w-full py-4 px-4 relative transition-all duration-300 ${isScrolled ? 'fixed top-0 left-0 right-0 z-50 bg-white shadow-lg' : ''
          }`}
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center overflow-hidden shadow-lg hover:scale-105 transition-all cursor-pointer ${isScrolled
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-white/20 border border-white/30 hover:bg-white/30'
                  }`}
                title="Ir para página inicial"
                aria-label="Ir para página inicial"
              >
                <img
                  alt="Urubici Park Hotel"
                  className="w-full h-full object-cover"
                  src="https://public.readdy.ai/ai/img_res/90171d99-2a4d-411b-855c-8e594b40cefb.png"
                />
              </button>
              <button
                className={`drop-shadow-lg hover:opacity-80 transition-all cursor-pointer text-left ${isScrolled ? 'text-blue-600' : 'text-white'
                  }`}
                title="Ir para página inicial"
                aria-label="Ir para página inicial"
              >
                <h1
                  className={`font-bold text-lg drop-shadow-md whitespace-nowrap ${isScrolled ? 'text-blue-600' : 'text-blue-300'
                    }`}
                >
                  Urubici Park Hotel
                </h1>
                <p
                  className={`text-xs drop-shadow-sm mt-0.5 leading-tight ${isScrolled ? 'text-gray-600' : 'text-white/90'
                    }`}
                >
                  Hospedagem Premium, experiência única na Serra.
                </p>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div className="relative" ref={langMenuRef}>
                <button
                  className={`w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all ${isScrolled
                      ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                    }`}
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  title="Alterar idioma"
                  aria-label="Alterar idioma do site"
                  aria-expanded={langMenuOpen}
                >
                  <i className={`ri-global-line text-lg ${isScrolled ? 'text-blue-600' : 'text-white'}`}></i>
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 top-12 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 py-2 min-w-[140px] z-[60]">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/50 transition-colors ${
                          language === lang 
                            ? 'text-blue-600 font-semibold' 
                            : 'text-gray-700'
                        }`}
                      >
                        {languageLabels[lang]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 max-w-md mx-auto pt-4">
        {/* Top Sticker - Above Hero */}
        <TopSticker messages={stickerMessages} />

        <div className="px-4 mt-3 mb-3 text-center">
          <h2 className="text-white font-bold text-3xl mb-2 drop-shadow-2xl leading-tight">
            {t('heroTitle')}
          </h2>
          <h3 className="text-blue-100 font-bold text-2xl mb-3 drop-shadow-xl">
            {t('heroSubtitle')}
          </h3>
          <p className="text-white/90 text-base drop-shadow-lg leading-relaxed max-w-sm mx-auto">
            {t('heroDescription')}
          </p>
        </div>

        {/* Quick Shortcuts - Direct on hero area */}
        <QuickShortcuts items={shortcuts} />

        {/* Guide Cards */}
        <div className="px-4 mb-6">
          <div className="px-4 mb-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 drop-shadow-md">
              <i className="ri-grid-line text-yellow-400"></i>
              {t('guideSectionTitle')}
              <i className="ri-grid-line text-yellow-400"></i>
            </h3>
            <p className="text-white/80 text-xs text-center mt-1 drop-shadow-sm">
              {t('guideSectionSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* 1 - Sua Estadia */}
            <Link
              to="/sua-estadia"
              className="bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-2xl p-4 transition-all duration-200 border border-white/30 shadow-xl hover:shadow-xl hover:scale-[1.02] cursor-pointer group"
              title="Check-in, Check-out, Wi-Fi e informações essenciais"
            >
              <div className="w-12 h-12 bg-[#24577A]/70 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#24577A]/90 transition-colors">
                <i className="ri-hotel-line text-white text-xl"></i>
              </div>
              <h3 className="text-white font-bold text-sm text-center mb-1 drop-shadow-sm">
                Sua Estadia
              </h3>
              <p className="text-[#7BB3E0] text-xs text-center font-medium mb-1">
                Check-in | Check-out | Wi-Fi
              </p>
              <p className="text-white/80 text-xs text-center leading-snug">
                Check-in, Check-out, Wi-Fi e informações essenciais.
              </p>
            </Link>

            {/* 2 - Regulamentos */}
            <Link
              to="/regras-do-hotel"
              className="bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-2xl p-4 transition-all duration-200 border border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer group"
              title="Silêncio, visitantes, responsabilidades e normas"
            >
              <div className="w-12 h-12 bg-[#6B4E8A]/70 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#6B4E8A]/90 transition-colors">
                <i className="ri-file-list-3-line text-white text-xl"></i>
              </div>
              <h3 className="text-white font-bold text-sm text-center mb-1 drop-shadow-sm">
                Regulamentos
              </h3>
              <p className="text-[#C4A8E0] text-xs text-center font-medium mb-1">
                Silêncio | Visitantes | Normas
              </p>
              <p className="text-white/80 text-xs text-center leading-snug">
                Silêncio, visitantes, responsabilidades e normas.
              </p>
            </Link>

            {/* 3 - Café & Gastronomia */}
            <Link
              to="/cafe-gastronomia"
              className="bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-2xl p-4 transition-all duration-200 border border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer group"
              title="Café da manhã e Restaurante Pimenta Rosa (parceiro)"
            >
              <div className="w-12 h-12 bg-[#C0622A]/70 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#C0622A]/90 transition-colors">
                <i className="ri-restaurant-line text-white text-xl"></i>
              </div>
              <h3 className="text-white font-bold text-sm text-center mb-1 drop-shadow-sm">
                Café &amp; Gastronomia
              </h3>
              <p className="text-[#F4B07A] text-xs text-center font-medium mb-1">
                Café da Manhã | Restaurante
              </p>
              <p className="text-white/80 text-xs text-center leading-snug">
                Café da manhã e Restaurante Pimenta Rosa (parceiro).
              </p>
            </Link>

            {/* 4 - Lazer & Estrutura */}
            <Link
              to="/lazer-estrutura"
              className="bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-2xl p-4 transition-all duration-200 border border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer group"
              title="Salão de jogos, estacionamento e carregamento elétrico"
            >
              <div className="w-12 h-12 bg-[#4EA16C]/70 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#4EA16C]/90 transition-colors">
                <i className="ri-billiards-line text-white text-xl"></i>
              </div>
              <h3 className="text-white font-bold text-sm text-center mb-1 drop-shadow-sm">
                Lazer & Estrutura
              </h3>
              <p className="text-[#8FD4A8] text-xs text-center font-medium mb-1">
                Jogos | Estacionamento | EV
              </p>
              <p className="text-white/80 text-xs text-center leading-snug">
                Salão de jogos, estacionamento e carregamento elétrico.
              </p>
            </Link>

            {/* 5 - Eventos & Corporativo */}
            <Link
              to="/eventos-corporativo"
              className="bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-2xl p-4 transition-all duration-200 border border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer group"
              title="Auditório e informações para eventos"
            >
              <div className="w-12 h-12 bg-[#2A6B8A]/70 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#2A6B8A]/90 transition-colors">
                <i className="ri-presentation-line text-white text-xl"></i>
              </div>
              <h3 className="text-white font-bold text-sm text-center mb-1 drop-shadow-sm">
                Eventos & Corporativo
              </h3>
              <p className="text-[#7EC8E8] text-xs text-center font-medium mb-1">
                Auditório | Eventos
              </p>
              <p className="text-white/80 text-xs text-center leading-snug">
                Auditório e informações para eventos.
              </p>
            </Link>

            {/* 6 - Links Úteis */}
            <Link
              to="/links-uteis"
              className="bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-2xl p-4 transition-all duration-200 border border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer group"
              title="Portal Urubici e site oficial"
            >
              <div className="w-12 h-12 bg-[#D19248]/70 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#D19248]/90 transition-colors">
                <i className="ri-links-line text-white text-xl"></i>
              </div>
              <h3 className="text-white font-bold text-sm text-center mb-1 drop-shadow-sm">
                Links Úteis
              </h3>
              <p className="text-[#E8C088] text-xs text-center font-medium mb-1">
                Portal Urubici | Site Oficial
              </p>
              <p className="text-white/80 text-xs text-center leading-snug">
                Portal Urubici e site oficial.
              </p>
            </Link>
          </div>
        </div>

        {/* Review Carousel */}
        <ReviewCarousel 
          reviews={reviews} 
          reviewUrl={REVIEW_URL}
          mapsUrl={MAPS_URL}
        />

        {/* Scroll to Top Button */}
        <div className="fixed bottom-6 left-4 z-20">
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-blue-600/90 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110 cursor-pointer"
            aria-label="Voltar ao topo"
          >
            <i className="ri-arrow-up-line text-white text-lg"></i>
          </button>
        </div>
      </div>

      <PageFooter />
    </div>
  );
};

export default HomePage;
