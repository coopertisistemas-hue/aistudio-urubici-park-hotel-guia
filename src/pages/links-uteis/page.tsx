
import { useState, useEffect } from 'react';
import PageHeader from '../../components/feature/PageHeader';
import PageFooter from '../../components/feature/PageFooter';
import RecepcionModal from '../../components/feature/RecepcionModal';

const subcategories = [
  {
    icon: 'ri-global-line',
    color: '#2A6B8A',
    accentColor: '#7EC8E8',
    title: 'Site Oficial UPH',
    tag: 'm.uph.com.br',
    description: 'Acesse o site oficial do Urubici Park Hotel.',
    href: 'https://m.uph.com.br',
    external: true,
    isReception: false,
  },
  {
    icon: 'ri-map-2-line',
    color: '#4EA16C',
    accentColor: '#8FD4A8',
    title: 'Portal Urubici',
    tag: 'portal.urubici.com.br',
    description: 'Informações turísticas e serviços da cidade.',
    href: 'https://portal.urubici.com.br',
    external: true,
    isReception: false,
  },
  {
    icon: 'ri-hospital-line',
    color: '#C0622A',
    accentColor: '#F4B07A',
    title: 'Emergências',
    tag: 'Telefones e orientações',
    description: 'Contatos de emergência e orientações de segurança.',
    href: null,
    external: false,
    isReception: false,
  },
  {
    icon: 'ri-map-pin-2-line',
    color: '#6B4E8A',
    accentColor: '#C4A8E0',
    title: 'Localização',
    tag: 'Mapa e rotas',
    description: 'Veja o mapa e trace rotas até o hotel.',
    href: null,
    external: false,
    isReception: false,
  },
  {
    icon: 'ri-file-shield-2-line',
    color: '#8A5A2A',
    accentColor: '#D4A870',
    title: 'Políticas e Termos',
    tag: 'Informações importantes',
    description: 'Políticas de uso, privacidade e termos do hotel.',
    href: null,
    external: false,
    isReception: false,
  },
  {
    icon: 'ri-phone-line',
    color: '#D19248',
    accentColor: '#E8C088',
    title: 'Chamar Recepção',
    tag: 'Ramal interno',
    description: 'Fale com a recepção',
    href: null,
    external: false,
    isReception: true,
  },
];

const LinksUteisPage = () => {
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
            Links Úteis
          </h2>
          <h3 className="text-blue-100 font-bold text-xl mb-4 drop-shadow-xl">
            Urubici Park Hotel
          </h3>
          <p className="text-white/90 text-base drop-shadow-lg leading-relaxed max-w-sm mx-auto">
            Recursos, contatos e informações essenciais ao seu alcance.
          </p>
        </div>

        <div className="px-4 mb-6 pt-6">
          <div className="px-4 mb-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 drop-shadow-md">
              <i className="ri-grid-line text-yellow-400"></i>
              Recursos &amp; Contatos
              <i className="ri-grid-line text-yellow-400"></i>
            </h3>
            <p className="text-white/80 text-xs text-center mt-1 drop-shadow-sm">
              Links e informações úteis para sua estadia em Urubici
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {subcategories.map((item) => {
              const cardClass =
                'bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-2xl p-4 transition-all duration-200 border border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer group text-left';

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

              if (item.href) {
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClass}
                    title={item.description}
                  >
                    {inner}
                  </a>
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

export default LinksUteisPage;
