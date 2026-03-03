
import { useState, useEffect } from 'react';
import PageHeader from '../../components/feature/PageHeader';
import PageFooter from '../../components/feature/PageFooter';

const sections = [
  {
    icon: 'ri-time-line',
    color: '#4EA16C',
    accentColor: '#8FD4A8',
    title: 'Horário de Funcionamento',
    highlight: '08h às 22h — todos os dias',
    description:
      'O salão de jogos está disponível todos os dias da semana dentro deste horário. Fora deste período, o acesso ao espaço não é permitido.',
  },
  {
    icon: 'ri-parent-line',
    color: '#C0622A',
    accentColor: '#F4B07A',
    title: 'Supervisão de Menores',
    highlight: 'Responsável obrigatório',
    description:
      'O hotel não disponibiliza supervisão para crianças e adolescentes. A presença de um adulto responsável é obrigatória durante toda a utilização do espaço por menores de idade.',
  },
  {
    icon: 'ri-shield-check-line',
    color: '#6B4E8A',
    accentColor: '#C4A8E0',
    title: 'Responsabilidade pelo Patrimônio',
    highlight: 'Danos serão cobrados',
    description:
      'Qualquer dano causado ao patrimônio do hotel — equipamentos, móveis ou instalações — será de responsabilidade do hóspede titular da reserva e cobrado conforme avaliação da equipe.',
  },
];

const SalaoDeJogosPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PageHeader isScrolled={isScrolled} backTo="/lazer-estrutura" backLabel="Voltar para Lazer & Estrutura" />

      <div className="relative z-10 max-w-md mx-auto pt-8 pb-16">
        {/* Hero Section */}
        <div className="px-4 mb-10 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
            style={{ backgroundColor: '#4EA16Cb3' }}
          >
            <i className="ri-gamepad-line text-white text-3xl"></i>
          </div>
          <h2 className="text-white font-bold text-3xl mb-2 drop-shadow-2xl leading-tight">
            Salão de Jogos
          </h2>
          <p className="text-yellow-300 font-semibold text-sm uppercase tracking-widest mb-3 drop-shadow-md">
            Lazer &amp; Estrutura
          </p>
          <p className="text-white/90 text-base drop-shadow-lg leading-relaxed max-w-sm mx-auto">
            Informações e regras de utilização.
          </p>
        </div>

        {/* Informational Content */}
        <div className="px-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/25 shadow-2xl overflow-hidden">

            {/* Section label */}
            <div className="px-6 pt-6 pb-4">
              <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                <i className="ri-information-line text-yellow-400 text-sm"></i>
                Regras &amp; Informações
              </h3>
            </div>

            {sections.map((section, index) => (
              <div key={section.title}>
                {/* Separator */}
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
                  <p className="text-white/80 text-sm leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Bottom padding */}
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

      <PageFooter />
    </div>
  );
};

export default SalaoDeJogosPage;
