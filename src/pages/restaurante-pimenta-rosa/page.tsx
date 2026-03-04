import { useState, useEffect } from 'react';
import PageHeader from '../../components/feature/PageHeader';
import PageFooter from '../../components/feature/PageFooter';

const sections = [
  {
    icon: 'ri-time-line',
    title: 'Horário de Funcionamento',
    text: 'Atendimento para jantar a partir das 18h30. O restaurante não abre às quartas-feiras.',
  },
  {
    icon: 'ri-hotel-line',
    title: 'Localização',
    text: 'O Restaurante Pimenta Rosa está localizado anexo ao Urubici Park Hotel, com acesso direto a partir da recepção do hotel.',
  },
  {
    icon: 'ri-phone-line',
    title: 'Contato e Reservas',
    text: 'Reservas podem ser realizadas diretamente com o restaurante.',
  },
  {
    icon: 'ri-whatsapp-line',
    title: 'WhatsApp',
    text: '(55) 99690-2103',
    ctaLink: 'https://wa.me/5555996902103',
    ctaLabel: 'Abrir WhatsApp',
  },
  {
    icon: 'ri-instagram-line',
    title: 'Instagram',
    text: 'Acompanhe novidades e pratos do restaurante.',
    ctaLink: 'https://instagram.com/pimentarosaurubici',
    ctaLabel: 'Abrir Instagram',
  },
];

const RestaurantePimentaRosaPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PageHeader isScrolled={isScrolled} backTo="/cafe-gastronomia" backLabel="Voltar para Café & Gastronomia" />

      <div className="relative z-10 max-w-md mx-auto pt-8 pb-16">
        {/* Hero */}
        <div className="px-4 mb-10 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
            style={{ backgroundColor: '#D07A2Ab3' }}
          >
            <i className="ri-restaurant-2-line text-white text-3xl" />
          </div>

          <h2 className="text-white font-bold text-3xl mb-2 drop-shadow-2xl leading-tight">
            Restaurante Pimenta Rosa
          </h2>

          <p className="text-yellow-300 font-semibold text-sm uppercase tracking-widest mb-3 drop-shadow-md">
            Café & Gastronomia
          </p>

          <p className="text-white/90 text-base drop-shadow-lg leading-relaxed max-w-sm mx-auto">
            Restaurante localizado anexo ao Urubici Park Hotel, com pratos à la carte, massas, carnes, trutas e opções especiais da culinária regional.
          </p>
        </div>

        {/* Translucent editorial container */}
        <div className="px-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/25 shadow-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-4">
              <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                <i className="ri-store-2-line text-yellow-400 text-sm" />
                Informações do Restaurante
              </h3>
            </div>

            {sections.map((section, index) => (
              <div key={`${section.title}-${index}`}>
                {(index > 0 || true) && (
                  <div className="mx-6 border-t border-white/15" />
                )}

                <div className="px-6 py-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                      <i className={`${section.icon} text-white text-base`} />
                    </div>
                    <h4 className="text-white font-bold text-base leading-tight drop-shadow-sm">
                      {section.title}
                    </h4>
                  </div>

                  <p className="text-white/80 text-sm leading-relaxed">
                    {section.text}
                  </p>

                  {section.ctaLink && section.ctaLabel && (
                    <div className="mt-4">
                      <a
                        href={section.ctaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl px-4 py-2 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 group"
                      >
                        <i className={`${section.icon} text-sm group-hover:scale-110 transition-transform`} />
                        {section.ctaLabel}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="h-4" />
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="px-4 mt-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-white/50 text-xs text-center leading-relaxed font-medium">
              O Restaurante Pimenta Rosa é um serviço independente. A gestão, atendimento, cardápio e serviços são de responsabilidade exclusiva do restaurante.
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-4 z-20">
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110 cursor-pointer"
          aria-label="Voltar ao topo"
        >
          <i className="ri-arrow-up-line text-white text-lg" />
        </button>
      </div>

      <PageFooter />
    </div>
  );
};

export default RestaurantePimentaRosaPage;
