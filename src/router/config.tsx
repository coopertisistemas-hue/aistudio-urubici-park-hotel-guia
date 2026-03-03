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
const WifiPage = lazy(() => import('../pages/wifi/page'));
const CafeDaManhaPage = lazy(() => import('../pages/cafe-da-manha/page'));
const EventosCorporativoPage = lazy(() => import('../pages/eventos-corporativo/page'));
const LinksUteisPage = lazy(() => import('../pages/links-uteis/page'));
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
      { path: '/wifi', element: <WifiPage /> },
      { path: '/cafe-da-manha', element: <CafeDaManhaPage /> },
      { path: '/eventos-corporativo', element: <EventosCorporativoPage /> },
      { path: '/links-uteis', element: <LinksUteisPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export default routes;
