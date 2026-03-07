import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import AppShell from '../components/feature/AppShell';
import DynamicPage from '../components/feature/DynamicPage';
import DynamicIndexPage from '../components/feature/DynamicIndexPage';

// Lazy loaded pages (detail pages with dynamic content)
const HomePage = lazy(() => import('../pages/home/page'));
const SuaEstadiaPage = lazy(() => import('../pages/sua-estadia/page'));
const RegrasDoHotelPage = lazy(() => import('../pages/regras-do-hotel/page'));
const CafeGastronomiaPage = lazy(() => import('../pages/cafe-gastronomia/page'));
const RestaurantePimentaRosaPage = lazy(() => import('../pages/restaurante-pimenta-rosa/page'));
const LazerEstruturaPage = lazy(() => import('../pages/lazer-estrutura/page'));
const SalaoDeJogosPage = lazy(() => import('../pages/salao-de-jogos/page'));
const WifiDetailPage = lazy(() => import('../pages/sua-estadia/wi-fi/page'));
const CafeDaManhaDetailPage = lazy(() => import('../pages/cafe-gastronomia/cafe-da-manha/page'));
const EventosCorporativoPage = lazy(() => import('../pages/eventos-corporativo/page'));
const LinksUteisPage = lazy(() => import('../pages/links-uteis/page'));
const CarregamentoEletricoPage = lazy(() => import('../pages/lazer-estrutura/carregamento-eletrico/page'));
const EstacionamentoPage = lazy(() => import('../pages/lazer-estrutura/estacionamento/page'));
const EmergenciasPage = lazy(() => import('../pages/links-uteis/emergencias/page'));
const AuditorioPage = lazy(() => import('../pages/eventos-corporativo/auditorio/page'));
const HorarioDeSilencioPage = lazy(() => import('../pages/regras-do-hotel/horario-de-silencio/page'));
const VisitantesPage = lazy(() => import('../pages/regras-do-hotel/visitantes/page'));
const DanosEResponsabilidadePage = lazy(() => import('../pages/regras-do-hotel/danos-e-responsabilidade/page'));
const ProibicoesPage = lazy(() => import('../pages/regras-do-hotel/proibicoes/page'));
const PoliticaDePetsPage = lazy(() => import('../pages/regras-do-hotel/politica-de-pets/page'));
const LocalizacaoPage = lazy(() => import('../pages/links-uteis/localizacao/page'));
const CheckInPage = lazy(() => import('../pages/sua-estadia/check-in/page'));
const CheckOutPage = lazy(() => import('../pages/sua-estadia/check-out/page'));
const LateCheckOutPage = lazy(() => import('../pages/sua-estadia/late-check-out/page'));
const LimpezaEEnxovalPage = lazy(() => import('../pages/sua-estadia/limpeza-e-enxoval/page'));
const ClimaPage = lazy(() => import('../pages/clima/page'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a5276] to-[#0d2f47]">
      <div className="text-white text-center">
        <i className="ri-loader-4-line text-4xl animate-spin mb-4" />
        <p>Carregando...</p>
      </div>
    </div>
  );
}

// Wrapper for lazy loading with suspense
function LazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  );
}

// Index page configs
const INDEX_PAGES = [
  { path: '/sua-estadia', slug: 'sua-estadia', title: 'Sua Estadia', icon: 'ri-hotel-line' },
  { path: '/cafe-gastronomia', slug: 'cafe-gastronomia', title: 'Café & Gastronomia', icon: 'ri-restaurant-line' },
  { path: '/lazer-estrutura', slug: 'lazer-estrutura', title: 'Lazer & Estrutura', icon: 'ri-gamepad-line' },
  { path: '/links-uteis', slug: 'links-uteis', title: 'Links Úteis', icon: 'ri-links-line' },
  { path: '/regras-do-hotel', slug: 'regras-do-hotel', title: 'Regras do Hotel', icon: 'ri-file-list-3-line' },
  { path: '/eventos-corporativo', slug: 'eventos-corporativo', title: 'Eventos & Corporativo', icon: 'ri-presentation-line' },
];

const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      // Home page - API-driven
      { path: '/', element: <LazyWrapper><HomePage /></LazyWrapper> },
      
      // Index pages - Dynamic API-driven with fallback
      ...INDEX_PAGES.map(page => ({
        path: page.path,
        element: <DynamicIndexPage 
          indexSlug={page.slug} 
          title={page.title}
          heroIcon={page.icon}
        />
      })),
      
      // Detail pages - Already migrated to DynamicDetailPage
      { path: '/restaurante-pimenta-rosa', element: <LazyWrapper><RestaurantePimentaRosaPage /></LazyWrapper> },
      { path: '/salao-de-jogos', element: <LazyWrapper><SalaoDeJogosPage /></LazyWrapper> },
      { path: '/sua-estadia/check-in', element: <LazyWrapper><CheckInPage /></LazyWrapper> },
      { path: '/sua-estadia/check-out', element: <LazyWrapper><CheckOutPage /></LazyWrapper> },
      { path: '/sua-estadia/late-check-out', element: <LazyWrapper><LateCheckOutPage /></LazyWrapper> },
      { path: '/sua-estadia/limpeza-e-enxoval', element: <LazyWrapper><LimpezaEEnxovalPage /></LazyWrapper> },
      { path: '/sua-estadia/wi-fi', element: <LazyWrapper><WifiDetailPage /></LazyWrapper> },
      { path: '/lazer-estrutura/carregamento-eletrico', element: <LazyWrapper><CarregamentoEletricoPage /></LazyWrapper> },
      { path: '/lazer-estrutura/estacionamento', element: <LazyWrapper><EstacionamentoPage /></LazyWrapper> },
      { path: '/links-uteis/emergencias', element: <LazyWrapper><EmergenciasPage /></LazyWrapper> },
      { path: '/eventos-corporativo/auditorio', element: <LazyWrapper><AuditorioPage /></LazyWrapper> },
      { path: '/regras-do-hotel/horario-de-silencio', element: <LazyWrapper><HorarioDeSilencioPage /></LazyWrapper> },
      { path: '/regras-do-hotel/visitantes', element: <LazyWrapper><VisitantesPage /></LazyWrapper> },
      { path: '/regras-do-hotel/politica-de-pets', element: <LazyWrapper><PoliticaDePetsPage /></LazyWrapper> },
      { path: '/regras-do-hotel/proibicoes', element: <LazyWrapper><ProibicoesPage /></LazyWrapper> },
      { path: '/regras-do-hotel/danos-e-responsabilidade', element: <LazyWrapper><DanosEResponsabilidadePage /></LazyWrapper> },
      { path: '/cafe-gastronomia/cafe-da-manha', element: <LazyWrapper><CafeDaManhaDetailPage /></LazyWrapper> },
      { path: '/links-uteis/localizacao', element: <LazyWrapper><LocalizacaoPage /></LazyWrapper> },
      { path: '/clima', element: <LazyWrapper><ClimaPage /></LazyWrapper> },
      
      // Dynamic route - catches any unmapped routes and loads from API
      { path: '*', element: <DynamicPage /> },
    ],
  },
];

export default routes;
