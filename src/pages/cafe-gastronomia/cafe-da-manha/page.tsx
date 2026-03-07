import DynamicDetailPage from '../../../components/feature/DynamicDetailPage';

const fallbackSections = [
    {
        icon: 'ri-cup-line',
        title: 'Café da Manhã',
        text: 'O café da manhã é servido das 6h às 10h, com opções variadas de pães, frutas, frios, ovos, cafés e sucos.',
    },
];

const CafeDaManhaDetailPage = () => (
    <DynamicDetailPage
        apiSlug="cafe-gastronomia/cafe-da-manha"
        fallbackSections={fallbackSections}
        title="Café da Manhã"
        subtitle="Café & Gastronomia"
        description="Informações sobre horário e funcionamento do café da manhã."
        backTo="/cafe-gastronomia"
        backLabel="Voltar para Café & Gastronomia"
        heroIcon="ri-cup-line"
        heroIconColor="#C6922F"
        containerLabel="Informações"
        containerLabelIcon="ri-restaurant-line"
    />
);

export default CafeDaManhaDetailPage;
