import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, languageLabels, type Language } from '../../contexts/LanguageContext';

interface PageHeaderProps {
  isScrolled: boolean;
  backTo: string;
  backLabel?: string;
}

const PageHeader = ({ isScrolled, backTo, backLabel = 'Voltar' }: PageHeaderProps) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: Language[] = ['pt-BR', 'es', 'en', 'de'];

  const iconClass = `w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all ${
    isScrolled
      ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
      : 'bg-white/10 hover:bg-white/20 border border-white/20'
  }`;

  const iClass = `text-lg ${isScrolled ? 'text-blue-600' : 'text-white'}`;

  return (
    <header
      className={`w-full py-6 px-4 relative transition-all duration-300 ${
        isScrolled ? 'fixed top-0 left-0 right-0 z-50 bg-white shadow-lg' : ''
      }`}
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Name */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center overflow-hidden shadow-lg hover:scale-105 transition-all cursor-pointer ${
                isScrolled
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
            </Link>
            <Link
              to="/"
              className="drop-shadow-lg hover:opacity-80 transition-all cursor-pointer text-left"
              title="Ir para página inicial"
              aria-label="Ir para página inicial"
            >
              <p
                className={`font-bold text-lg drop-shadow-md whitespace-nowrap ${
                  isScrolled ? 'text-blue-600' : 'text-blue-300'
                }`}
              >
                Urubici Park Hotel
              </p>
              <p
                className={`text-xs drop-shadow-sm mt-0.5 leading-tight ${
                  isScrolled ? 'text-gray-600' : 'text-white/90'
                }`}
              >
                Hospedagem Premium, experiência única na Serra.
              </p>
            </Link>
          </div>

          {/* Right: Globe + Search + Back */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative" ref={menuRef}>
              <button
                className={iconClass}
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                title="Alterar idioma"
                aria-label="Alterar idioma do site"
                aria-expanded={langMenuOpen}
              >
                <span className={`${iClass} text-xs font-bold`}>
                  {language.split('-')[0].toUpperCase()}
                </span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 top-12 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 py-2 min-w-[140px] z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setLangMenuOpen(false);
                      }}
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

            {/* Search - Coming Soon tooltip */}
            <div className="relative group">
              <button
                className={iconClass}
                title="Em breve: Buscar no guia"
                aria-label="Buscar (em breve)"
              >
                <i className={`ri-search-line ${iClass}`}></i>
              </button>
              <div className="absolute right-0 top-12 bg-gray-900/90 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Em breve: Buscar no guia
              </div>
            </div>
            <Link
              to={backTo}
              className={`${iconClass} hover:scale-105`}
              title={backLabel}
              aria-label={backLabel}
            >
              <i className={`ri-arrow-left-line ${iClass}`}></i>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
