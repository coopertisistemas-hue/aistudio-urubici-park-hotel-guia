
import { useState, useEffect } from 'react';
import PageHeader from '../../components/feature/PageHeader';
import PageFooter from '../../components/feature/PageFooter';
import RecepcionModal from '../../components/feature/RecepcionModal';

const sections = [
  {
    icon: 'ri-time-line',
    color: '#C0622A',
    accentColor: '#F4B07A',
    title: 'Horário de Funcionamento',
    highlight: 'Das 06h às 10h — servido diariamente',
    description:
      'O café da manhã é servido todos os dias da semana, das 06h às 10h. Após o horário de encerramento, o serviço não estará disponível.',
  },
  {
    icon: 'ri-map-pin-line',
    color: '#8A5A2A',
    accentColor: '#D4A870',
    title: 'Local',
    highlight: 'Restaurante do hotel',
    description:
      'O café da manhã é servido no restaurante do hotel. Dirija-se ao espaço dentro do horário de funcionamento para ser atendido.',
  },
  {
    icon: 'ri-hotel-bed-line',
    color: '#4EA16C',
    accentColor: '#8FD4A8',
    title: 'Inclusão na Hospedagem',
    highlight: 'Incluso na diária',
    description:
      'O café da manhã está incluso na diária de hospedagem. Não há cobrança adicional para hóspedes com reserva ativa.',
  },
  {
    icon: 'ri-information-line',
    color: '#6B4E8A',
    accentColor: '#C4A8E0',
    title: 'Orientações',
    highlight: 'Atenção',
    description:
      'Após o horário de encerramento, o serviço não estará disponível. Em caso de dúvidas, utilize ',
    hasReception: true,
  },
];

const CafeDaManha = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PageHeader isScrolled={isScrolled} backTo="/cafe-gastronomia" backLabel="Voltar para Café & Gastronomia" />

      <div className="relative z-10 max-w-md mx-auto pt-8 pb-16">
        {/* Hero Section */}
        <div className="px-4 mb-10 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
            style={{ backgroundColor: '#C0622Ab3' }}
          >
            <i className="ri-cup-line text-white text-3xl"></i>
          </div>
          <h2 className="text-white font-bold text-3xl mb-2 drop-shadow-2xl leading-tight">
            Café da Manhã
          </h2>
          <p className="text-yellow-300 font-semibold text-sm uppercase tracking-widest mb-3 drop-shadow-md">
            Café &amp; Gastronomia
          </p>
          <p className="text-white/90 text-base drop-shadow-lg leading-relaxed max-w-sm mx-auto">
            Informações sobre horário e funcionamento.
          </p>
        </div>

        {/* Informational Content */}
        <div className="px-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/25 shadow-2xl overflow-hidden">

            {/* Section label */}
            <div className="px-6 pt-6 pb-4">
              <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                <i className="ri-cup-line text-yellow-400 text-sm"></i>
                Informações &amp; Orientações
              </h3>
            </div>

            {sections.map((section, index) => (
              <div key={section.title}>
                {index > 0 && (
                  <div className="mx-6 border-t border-white/15" />
                )}

                <div className="px-6 py-5">
                  {/* Icon + Title row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${section.color}99` }}
                    >
                      <i className={`${section.icon} text-white text-base`}></i>
                    </div>
                    <h4 className="text-white font-bold text-base leading-tight drop-shadow-sm">
                      {section.title}
                    </h4>
                  </div>

                  {/* Highlight badge */}
                  <p
                    className="text-xs font-semibold mb-2 tracking-wide"
                    style={{ color: section.accentColor }}
                  >
                    {section.highlight}
                  </p>

                  {/* Description */}
                  {section.hasReception ? (
                    <p className="text-white/80 text-sm leading-relaxed">
                      {section.description}
                      <button
                        onClick={() => setModalOpen(true)}
                        className="text-yellow-300 underline underline-offset-2 font-semibold cursor-pointer hover:text-yellow-200 transition-colors whitespace-nowrap"
                      >
                        Chamar Recepção
                      </button>
                      .
                    </p>
                  ) : (
                    <p className="text-white/80 text-sm leading-relaxed">
                      {section.description}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div className="h-4" />
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <div className="fixed bottom-6 left-4 z-20">
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110 cursor-pointer"
          aria-label="Voltar ao topo"
        >
          <i className="ri-arrow-up-line text-white text-lg"></i>
        </button>
      </div>

      <RecepcionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <PageFooter />
    </div>
  );
};

export default CafeDaManha;
