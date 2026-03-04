
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/feature/PageHeader';
import PageFooter from '../../components/feature/PageFooter';
import RecepcionModal from '../../components/feature/RecepcionModal';

const subcategories = [
  {
    icon: 'ri-login-box-line',
    color: '#24577A',
    accentColor: '#7BB3E0',
    title: 'Check-in',
    tag: 'A partir das 14h',
    description: 'A partir das 14h. Apresente documento com foto na recepção.',
    isReception: false,
    link: '/sua-estadia/check-in',
  },
  {
    icon: 'ri-logout-box-line',
    color: '#4EA16C',
    accentColor: '#8FD4A8',
    title: 'Check-out',
    tag: 'Até 12h',
    description: 'Até 12h. Devolva as chaves na recepção ao sair.',
    isReception: false,
    link: '/sua-estadia/check-out',
  },
  {
    icon: 'ri-time-line',
    color: '#C0622A',
    accentColor: '#F4B07A',
    title: 'Late Check-out',
    tag: 'Sujeito à disponibilidade',
    description: 'Sujeito à disponibilidade e cobrança adicional. Solicitar na recepção.',
    isReception: false,
    link: '/sua-estadia/late-check-out',
  },
  {
    icon: 'ri-wifi-line',
    color: '#2A6B8A',
    accentColor: '#7EC8E8',
    title: 'Wi-Fi',
    tag: 'Rede e senha',
    description: 'Informações de rede e senha disponíveis na recepção.',
    isReception: false,
    link: '/sua-estadia/wi-fi',
  },
  {
    icon: 'ri-service-line',
    color: '#6B4E8A',
    accentColor: '#C4A8E0',
    title: 'Limpeza & Enxoval',
    tag: 'Horário operacional',
    description: 'Limpeza no horário operacional do hotel. Solicitações na recepção.',
    isReception: false,
    link: null,
  },
  {
    icon: 'ri-phone-line',
    color: '#D19248',
    accentColor: '#E8C088',
    title: 'Chamar Recepção',
    tag: 'Ramal interno',
    description: 'Fale com a recepção',
    isReception: true,
    link: null,
  },
];

const SuaEstadiaPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardClick = (item: typeof subcategories[0]) => {
    if (item.isReception) {
      setModalOpen(true);
    } else if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PageHeader isScrolled={isScrolled} backTo="/" backLabel="Voltar à página inicial" />

      <div className="relative z-10 max-w-md mx-auto pt-8">
        <div className="px-4 mb-8 text-center relative">
          <h2 className="text-white font-bold text-3xl mb-3 drop-shadow-2xl leading-tight">
            Sua Estadia
          </h2>
          <h3 className="text-blue-100 font-bold text-xl mb-4 drop-shadow-xl">
            Urubici Park Hotel
          </h3>
          <p className="text-white/90 text-base drop-shadow-lg leading-relaxed max-w-sm mx-auto">
            Informações essenciais para uma estadia confortável.
          </p>
        </div>

        <div className="px-4 mb-6 pt-6">
          <div className="px-4 mb-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 drop-shadow-md">
              <i className="ri-grid-line text-yellow-400"></i>
              Informações da Estadia
              <i className="ri-grid-line text-yellow-400"></i>
            </h3>
            <p className="text-white/80 text-xs text-center mt-1 drop-shadow-sm">
              Tudo que você precisa saber durante sua estadia
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {subcategories.map((item) => (
              <button
                key={item.title}
                onClick={() => handleCardClick(item)}
                className="bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-2xl p-4 transition-all duration-200 border border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer group text-left"
                title={item.description}
              >
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
              </button>
            ))}
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

export default SuaEstadiaPage;
