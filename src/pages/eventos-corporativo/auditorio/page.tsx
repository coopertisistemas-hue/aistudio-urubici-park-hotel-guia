import DynamicDetailPage from '../../../components/feature/DynamicDetailPage';

const fallbackSections = [
    {
        icon: 'ri-presentation-line',
        title: 'Auditório',
        text: 'O hotel possui auditório disponível para eventos e reuniões. Consulte condições e disponibilidade na recepção.',
    },
];

const AuditorioPage = () => (
    <DynamicDetailPage
        apiSlug="eventos-corporativo/auditorio"
        fallbackSections={fallbackSections}
        title="Auditório / Salão de Eventos"
        subtitle="Eventos & Corporativo"
        description="Informações sobre utilização do inúmerário e realização de eventos no hotel."
        backTo="/eventos-corporativo"
        backLabel="Voltar para Eventos & Corporativo"
        heroIcon="ri-presentation-line"
        heroIconColor="#2A6B8A"
        containerLabel="Estrutura do Espaço"
        containerLabelIcon="ri-building-line"
    />
);

export default AuditorioPage;
