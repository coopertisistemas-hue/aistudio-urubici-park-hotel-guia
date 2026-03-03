import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/feature/PageHeader';
import PageFooter from '../../components/feature/PageFooter';

const subcategories = [
  {
    icon: 'ri-time-line',
    color: '#C0622A',
    accentColor: '#F4B07A',
    title: 'Horário de Funcionamento',
    tag: 'Jantar',
    description: 'Aberto a partir das 18h30. Fechado às quartas-feiras.',
    link: null,
  },
  {
    icon: 'ri-restaurant-2-line',
    color: '#8A5A2A',
    accentColor: '#D4A870',
    title: 'Cardápio',
    tag: 'Menu completo',
    description: 'Confira os pratos e valores do restaurante.',
    link: null,
  },
  {
    icon: 'ri-calendar-check-line',
    color: '#D19248',
    accentColor: '#E8C088',
    title: 'Reservar Mesa',
    tag: 'Agendamento',
    description: 'Reserve sua mesa com antecedência.',
    link: null,
  },
  {
    icon: 'ri-hotel-bed-line',
    color: '#A67C52',
    accentColor: '#C9A876',
    title: 'Solicitar no Quarto',
    tag: 'Room service',
    description: 'Peça para entregar no seu quarto.',
    link: null,
  },
  {
    icon: 'ri-phone-line',
    color: '#8B6F47',
    accentColor: '#B89968',
    title: 'Contato',
    tag: '(55) 99690-2103',
    description: 'Entre em contato direto com o restaurante.',
    link: null,
  },
];

const RestaurantePimentaRosaPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PageHeader isScrolled={isScrolled} backTo="/cafe-gastronomia" backLabel="Voltar para Café & Gastronomia" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-md mx-auto pt-8">
        <div className="px-4 mb-8 text-center relative">
          <h2 className="text-white font-bold text-3xl mb-3 drop-shadow-2xl leading-tight">
            Restaurante Pimenta Rosa
          </h2>
          <h3 className="text-blue-100 font-bold text-xl mb-4 drop-shadow-xl">
            Parceiro do Urubici Park Hotel
          </h3>
          <p className="text-white/90 text-base drop-shadow-lg leading-relaxed max-w-sm mx-auto">
            Gastronomia de qualidade com atendimento especializado.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="px-4 mb-6 pt-6">
          <div className="px-4 mb-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 drop-shadow-md">
              <i className="ri-restaurant-line text-yellow-400"></i>
              Informações &amp; Serviços
              <i className="ri-restaurant-line text-yellow-400"></i>
            </h3>
            <p className="text-white/80 text-xs text-center mt-1 drop-shadow-sm">
              Horários, cardápio e formas de contato
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {subcategories.map((item) => {
              const CardWrapper = item.link ? Link : 'button';
              const cardProps = item.link
                ? { to: item.link }
                : { type: 'button' as const };

              return (
                <CardWrapper
                  key={item.title}
                  {...(cardProps as any)}
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
                  <p
                    className="text-xs text-center font-medium mb-1"
                    style={{ color: item.accentColor }}
                  >
                    {item.tag}
                  </p>
                  <p className="text-white/80 text-xs text-center leading-snug">
                    {item.description}
                  </p>
                </CardWrapper>
              );
            })}
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="px-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <p className="text-white/70 text-xs text-center leading-relaxed">
              O Restaurante Pimenta Rosa é uma empresa independente (CNPJ próprio). A gestão, atendimento e serviços são de responsabilidade exclusiva do restaurante.
            </p>
          </div>
        </div>

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

export default RestaurantePimentaRosaPage;
