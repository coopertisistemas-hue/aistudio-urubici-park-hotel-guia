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

const MenuSection = () => {
  const menuCategories = [
    {
      title: 'Especialidades da Casa',
      icon: '🏠',
      items: [
        'Truta grelhada da Serra',
        'Carnes selecionadas',
        'Massas artesanais',
        'Saladas e opções leves',
      ],
    },
    {
      title: 'Pratos Regionais',
      icon: '🌄',
      items: [
        'Culinária típica da Serra Catarinense',
        'Queijos e acompanhamentos regionais',
        'Sugestões de harmonização',
      ],
    },
    {
      title: 'Sobremesas',
      icon: '🍰',
      items: [
        'Sobremesas artesanais',
        'Doces tradicionais',
      ],
    },
    {
      title: 'Carta de Vinhos',
      icon: '🍷',
      items: [
        'Vinhos tintos selecionados',
        'Espumantes nacionais',
        'Rótulos da Serra Catarinense',
        'Sugestões de harmonização',
      ],
    },
  ];

  return (
    <div className="max-w-md mx-auto px-4 w-full relative z-10">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/25 shadow-2xl overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
            <i className="ri-book-open-line text-yellow-400 text-sm" />
            Cardápio
          </h3>
        </div>

        {menuCategories.map((category, catIndex) => (
          <div key={category.title}>
            {catIndex > 0 && <div className="mx-5 border-t border-white/10" />}
            <div className="px-5 py-4">
              <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <span>{category.icon}</span>
                {category.title}
              </h4>
              <ul className="space-y-1.5">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-white/70 text-xs flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div className="h-3" />
      </div>
    </div>
  );
};

const CTAsAndDisclaimer = () => {
  const whatsappMessage = encodeURIComponent('Olá! Gostaria de fazer uma reserva no Restaurante Pimenta Rosa.');

  return (
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
          href={`https://wa.me/5555996902103?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-colors shadow-md"
        >
          <i className="ri-whatsapp-line text-sm"></i>
          Reservar mesa
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
};

const RestaurantePimentaRosaPage = () => {
  const [footerMountNode, setFooterMountNode] = useState<Element | null>(null);
  const [menuMountNode, setMenuMountNode] = useState<Element | null>(null);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (footer && footer.parentElement) {
      const container = document.createElement('div');
      container.className = '-mt-6';
      footer.parentElement.insertBefore(container, footer);
      setFooterMountNode(container);
    }
  }, []);

  useEffect(() => {
    const content = document.querySelector('.max-w-md.mx-auto');
    if (content && !menuMountNode) {
      const menuContainer = document.createElement('div');
      menuContainer.className = 'mb-6';
      content.parentNode?.insertBefore(menuContainer, content.nextSibling);
      setMenuMountNode(menuContainer);
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
      {menuMountNode && createPortal(<MenuSection />, menuMountNode)}
      {footerMountNode && createPortal(<CTAsAndDisclaimer />, footerMountNode)}
    </>
  );
};

export default RestaurantePimentaRosaPage;
