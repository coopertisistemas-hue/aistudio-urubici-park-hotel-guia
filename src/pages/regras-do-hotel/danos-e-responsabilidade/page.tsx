import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
    {
        icon: 'ri-home-gear-line',
        title: 'Patrimônio do hotel',
        text: 'Pedimos cuidado com móveis, enxoval e equipamentos do apartamento e áreas comuns.',
    },
    {
        icon: 'ri-alert-line',
        title: 'Danos e avarias',
        text: 'Em caso de danos, avarias ou extravios, poderá haver cobrança conforme avaliação do hotel.',
    },
    {
        icon: 'ri-chat-1-line',
        title: 'Comunique a recepção',
        text: 'Se ocorrer qualquer incidente, comunique a recepção o quanto antes para orientação.',
    },
];

const DanosEResponsabilidadePage = () => (
    <DetailLayout
        title="Danos & Responsabilidade"
        subtitle="Regras do Hotel"
        description="Orientações sobre responsabilidade por danos e cuidados com o patrimônio do hotel."
        sections={sections}
        backTo="/regras-do-hotel"
        backLabel="Voltar para Regras do Hotel"
        heroIcon="ri-shield-check-line"
        heroIconColor="#7E57C2"
        containerLabel="Orientações"
        containerLabelIcon="ri-information-line"
    />
);

export default DanosEResponsabilidadePage;
