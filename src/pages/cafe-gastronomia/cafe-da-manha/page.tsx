
import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
    {
        icon: 'ri-time-line',
        title: 'Horário de Funcionamento',
        text: 'O café da manhã é servido diariamente das 06h às 10h.',
    },
    {
        icon: 'ri-restaurant-line',
        title: 'Local',
        text: 'O café da manhã é servido no restaurante do hotel.',
    },
    {
        icon: 'ri-checkbox-circle-line',
        title: 'Incluso na Hospedagem',
        text: 'O café da manhã está incluso na diária para hóspedes.',
    },
    {
        icon: 'ri-information-line',
        title: 'Orientações',
        text: "Após o horário de encerramento o serviço não estará disponível. Em caso de dúvidas utilize 'Chamar Recepção'.",
    },
];

const CafeDaManhaDetailPage = () => (
    <DetailLayout
        title="Café da Manhã"
        subtitle="Café & Gastronomia"
        description="Informações sobre o café da manhã servido no hotel."
        sections={sections}
        backTo="/cafe-gastronomia"
        backLabel="Voltar para Café & Gastronomia"
        heroIcon="ri-cup-line"
        heroIconColor="#C27C2C"
        containerLabel="Informações do Café da Manhã"
        containerLabelIcon="ri-restaurant-line"
    />
);

export default CafeDaManhaDetailPage;
