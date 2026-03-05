import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import DetailLayout, { type DetailSection } from '../../components/feature/DetailLayout';

const sections: DetailSection[] = [
  {
    icon: 'ri-time-line',
    title: 'Horário de Funcionamento',
    text: 'Atendimento para jantar a partir das 18h30. O restaurante não abre às quartas-feiras.',
  },
  {
    icon: 'ri-book-open-line',
    title: 'Cardápio',
    text: 'Pratos à la carte, massas, carnes, trutas e opções especiais da culinária regional. Consulte a recepção ou o WhatsApp do restaurante para o cardápio atualizado.',
  },
  {
    icon: 'ri-wine-line',
    title: 'Carta de Vinhos',
    text: 'Selección de vinos nacionales e internacionales para acompañar seus pratos. Consulte as opções disponíveis com nosso atendimento.',
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
];

const CTAsAndDisclaimer = () => (
  <div className="max-w-md mx-auto px-4 w-full relative z-10 pb-8 flex flex-col gap-4">
    {/* WhatsApp CTA */}
    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-lg flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-green-400 shrink-0 shadow-sm">
          <i className="ri-whatsapp-line text-xl"></i>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm leading-tight">WhatsApp</h4>
          <p className="text-white/80 text-xs mt-0.5">(55) 99690-2103</p>
        </div>
      </div>
      <a
        href="https://wa.me/5555996902103"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-colors shadow-md"
      >
        <i className="ri-whatsapp-line text-sm"></i>
        Abrir WhatsApp
      </a>
    </div>

    {/* Instagram CTA */}
    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-lg flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-pink-400 shrink-0 shadow-sm">
          <i className="ri-instagram-line text-xl"></i>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm leading-tight">Instagram</h4>
          <p className="text-white/80 text-xs mt-0.5 leading-snug">Acompanhe novidades e pratos do restaurante.</p>
        </div>
      </div>
      <a
        href="https://instagram.com/pimentarosaurubici"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-opacity shadow-md"
      >
        <i className="ri-instagram-line text-sm"></i>
        Abrir Instagram
      </a>
    </div>

    {/* Legal Disclaimer */}
    <div className="mt-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
      <p className="text-white/50 text-xs text-center leading-relaxed font-medium">
        O Restaurante Pimenta Rosa é um serviço independente. A gestão, atendimento, cardápio e serviços são de responsabilidade exclusiva do restaurante.
      </p>
    </div>
  </div>
);

const RestaurantePimentaRosaPage = () => {
  const [footerMountNode, setFooterMountNode] = useState<Element | null>(null);

  useEffect(() => {
    // Utilize react portal to inject CTAs directly below DetailLayout's content container gracefully 
    // avoiding modification to the locked Layout component constraint.
    const footer = document.querySelector('footer');
    if (footer && footer.parentElement) {
      const container = document.createElement('div');
      // Adding a negative top margin to bridge the pb-16 padding from DetailLayout container natively
      container.className = '-mt-6';
      footer.parentElement.insertBefore(container, footer);
      setFooterMountNode(container);

      return () => {
        container.remove();
      };
    }
  }, []);

  return (
    <>
      <DetailLayout
        title="Restaurante Pimenta Rosa"
        subtitle="Café & Gastronomia"
        description="Restaurante localizado anexo ao Urubici Park Hotel, com pratos à la carte, massas, carnes, trutas e opções especiais da culinária regional."
        sections={sections}
        backTo="/cafe-gastronomia"
        backLabel="Voltar para Café & Gastronomia"
        heroIcon="ri-restaurant-2-line"
        heroIconColor="#D07A2A"
        containerLabel="Informações do Restaurante"
        containerLabelIcon="ri-store-2-line"
      />
      {footerMountNode && createPortal(<CTAsAndDisclaimer />, footerMountNode)}
    </>
  );
};

export default RestaurantePimentaRosaPage;
