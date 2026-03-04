import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import AppShell from '../components/feature/AppShell';

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
const NotFoundPage = lazy(() => import('../pages/NotFound'));

const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/sua-estadia', element: <SuaEstadiaPage /> },
      { path: '/regras-do-hotel', element: <RegrasDoHotelPage /> },
      { path: '/cafe-gastronomia', element: <CafeGastronomiaPage /> },
      { path: '/restaurante-pimenta-rosa', element: <RestaurantePimentaRosaPage /> },
      { path: '/lazer-estrutura', element: <LazerEstruturaPage /> },
      { path: '/salao-de-jogos', element: <SalaoDeJogosPage /> },
      { path: '/sua-estadia/check-in', element: <CheckInPage /> },
      { path: '/sua-estadia/check-out', element: <CheckOutPage /> },
      { path: '/sua-estadia/late-check-out', element: <LateCheckOutPage /> },
      { path: '/sua-estadia/limpeza-e-enxoval', element: <LimpezaEEnxovalPage /> },
      { path: '/sua-estadia/wi-fi', element: <WifiDetailPage /> },
      { path: '/lazer-estrutura/carregamento-eletrico', element: <CarregamentoEletricoPage /> },
      { path: '/lazer-estrutura/estacionamento', element: <EstacionamentoPage /> },
      { path: '/links-uteis/emergencias', element: <EmergenciasPage /> },
      { path: '/eventos-corporativo/auditorio', element: <AuditorioPage /> },
      { path: '/regras-do-hotel/horario-de-silencio', element: <HorarioDeSilencioPage /> },
      { path: '/regras-do-hotel/visitantes', element: <VisitantesPage /> },
      { path: '/regras-do-hotel/politica-de-pets', element: <PoliticaDePetsPage /> },
      { path: '/regras-do-hotel/proibicoes', element: <ProibicoesPage /> },
      { path: '/regras-do-hotel/danos-e-responsabilidade', element: <DanosEResponsabilidadePage /> },
      { path: '/cafe-gastronomia/cafe-da-manha', element: <CafeDaManhaDetailPage /> },
      { path: '/eventos-corporativo', element: <EventosCorporativoPage /> },
      { path: '/links-uteis', element: <LinksUteisPage /> },
      { path: '/links-uteis/localizacao', element: <LocalizacaoPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export default routes;
