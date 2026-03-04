import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
    {
        icon: 'ri-time-line',
        title: 'Horário',
        text: 'O café da manhã é servido diariamente conforme horário definido pelo hotel.',
    },
    {
        icon: 'ri-map-pin-line',
        title: 'Local',
        text: 'O café da manhã é servido no restaurante do hotel.',
    },
    {
        icon: 'ri-information-line',
        title: 'Orientações',
        text: 'Caso precise de alguma informação adicional ou tenha restrições alimentares, consulte a recepção.',
    },
];

const CafeDaManhaDetailPage = () => (
    <DetailLayout
        title="Café da Manhã"
        subtitle="Café & Gastronomia"
        description="Informações sobre horário e funcionamento do café da manhã."
        sections={sections}
        backTo="/cafe-gastronomia"
        backLabel="Voltar para Café & Gastronomia"
        heroIcon="ri-cup-line"
        heroIconColor="#C6922F"
        containerLabel="Informações"
        containerLabelIcon="ri-restaurant-line"
    />
);

export default CafeDaManhaDetailPage;
