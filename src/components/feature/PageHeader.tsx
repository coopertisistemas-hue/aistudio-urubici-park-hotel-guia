
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  isScrolled: boolean;
  backTo: string;
  backLabel?: string;
}

const PageHeader = ({ isScrolled, backTo, backLabel = 'Voltar' }: PageHeaderProps) => {
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
            <button
              className={iconClass}
              title="Alterar idioma"
              aria-label="Alterar idioma do site"
            >
              <i className={`ri-global-line ${iClass}`}></i>
            </button>
            <button
              className={iconClass}
              title="Buscar"
              aria-label="Abrir busca"
            >
              <i className={`ri-search-line ${iClass}`}></i>
            </button>
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
