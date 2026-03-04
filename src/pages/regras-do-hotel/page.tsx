
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/feature/PageHeader';
import PageFooter from '../../components/feature/PageFooter';
import RecepcionModal from '../../components/feature/RecepcionModal';

const subcategories = [
  {
    icon: 'ri-moon-line',
    color: '#24577A',
    accentColor: '#7BB3E0',
    title: 'Horário de Silêncio',
    tag: 'Das 22h às 08h',
    description: 'Das 22h às 08h. Pedimos respeito ao silêncio para o conforto de todos.',
    isReception: false,
    linkTo: '/regras-do-hotel/horario-de-silencio',
  },
  {
    icon: 'ri-user-add-line',
    color: '#4EA16C',
    accentColor: '#8FD4A8',
    title: 'Visitantes',
    tag: 'Áreas comuns',
    description: 'Permitidos apenas nas áreas comuns do hotel.',
    isReception: false,
  },
  {
    icon: 'ri-footprint-line',
    color: '#C0622A',
    accentColor: '#F4B07A',
    title: 'Política de Pets',
    tag: 'Conforme normas',
    description: 'Conforme normas do hotel. Consulte a recepção para detalhes.',
    isReception: false,
  },
  {
    icon: 'ri-forbid-2-line',
    color: '#8A2A2A',
    accentColor: '#E08080',
    title: 'Proibições',
    tag: 'Restrições e conduta',
    description: 'Restrições e conduta esperada durante a estadia.',
    isReception: false,
  },
  {
    icon: 'ri-shield-check-line',
    color: '#6B4E8A',
    accentColor: '#C4A8E0',
    title: 'Danos & Responsabilidade',
    tag: 'Conservação',
    description: 'Conservação do patrimônio. Danos serão cobrados ao responsável.',
    isReception: false,
  },
  {
    icon: 'ri-phone-line',
    color: '#D19248',
    accentColor: '#E8C088',
    title: 'Chamar Recepção',
    tag: 'Ramal interno',
    description: 'Fale com a recepção',
    isReception: true,
  },
];

const RegrasDoHotelPage = () => {
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
      <PageHeader isScrolled={isScrolled} backTo="/" backLabel="Voltar à página inicial" />

      <div className="relative z-10 max-w-md mx-auto pt-8">
        <div className="px-4 mb-8 text-center relative">
          <h2 className="text-white font-bold text-3xl mb-3 drop-shadow-2xl leading-tight">
            Regras do Hotel
          </h2>
          <h3 className="text-blue-100 font-bold text-xl mb-4 drop-shadow-xl">
            Urubici Park Hotel
          </h3>
          <p className="text-white/90 text-base drop-shadow-lg leading-relaxed max-w-sm mx-auto">
            Normas e condutas para uma convivência harmoniosa.
          </p>
        </div>

        <div className="px-4 mb-6 pt-6">
          <div className="px-4 mb-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 drop-shadow-md">
              <i className="ri-grid-line text-yellow-400"></i>
              Normas &amp; Condutas
              <i className="ri-grid-line text-yellow-400"></i>
            </h3>
            <p className="text-white/80 text-xs text-center mt-1 drop-shadow-sm">
              Informações importantes para todos os hóspedes
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {subcategories.map((item) => {
              const cardClass = 'bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-2xl p-4 transition-all duration-200 border border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer group text-left';
              const inner = (
                <>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors"
                    style={{ backgroundColor: `${item.color}b3` }}
                  >
                    <i className={`${item.icon} text-white text-xl`}></i>
                  </div>
                  <h3 className="text-white font-bold text-sm text-center mb-1 drop-shadow-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-center font-medium mb-1" style={{ color: item.accentColor }}>
                    {item.tag}
                  </p>
                  <p className="text-white/80 text-xs text-center leading-snug">
                    {item.description}
                  </p>
                </>
              );

              if ((item as any).linkTo) {
                return (
                  <Link key={item.title} to={(item as any).linkTo} className={cardClass} title={item.description}>
                    {inner}
                  </Link>
                );
              }

              return (
                <button
                  key={item.title}
                  onClick={item.isReception ? () => setModalOpen(true) : undefined}
                  className={cardClass}
                  title={item.description}
                >
                  {inner}
                </button>
              );
            })}
          </div>
        </div>

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

      <RecepcionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <PageFooter />
    </div>
  );
};

export default RegrasDoHotelPage;
