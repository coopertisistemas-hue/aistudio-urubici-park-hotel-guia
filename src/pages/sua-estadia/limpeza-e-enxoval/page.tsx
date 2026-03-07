import DynamicDetailPage from '../../../components/feature/DynamicDetailPage';

const fallbackSections = [
    {
        icon: 'ri-t-shirt-2-line',
        title: 'Troca de Roupas',
        text: 'A troca de roupas de cama e banho é realizada a cada 2 dias durante sua estadia.',
    },
    {
        icon: 'ri-leaf-line',
        title: 'Sustentabilidade',
        text: 'Para manter o conforto e contribuir com práticas sustentáveis, a troca de enxoval é realizada a cada 2 dias.',
    },
];

const LimpezaEEnxovalPage = () => (
    <DynamicDetailPage
        apiSlug="sua-estadia/limpeza-e-enxoval"
        fallbackSections={fallbackSections}
        title="Limpeza & Enxoval"
        subtitle="Sua Estadia"
        description="Horários e orientações sobre limpeza do quarto e troca de enxoval."
        backTo="/sua-estadia"
        backLabel="Voltar para Sua Estadia"
        heroIcon="ri-home-smile-line"
        heroIconColor="#2A6B8A"
        containerLabel="Serviço de Camareira"
        containerLabelIcon="ri-brush-line"
    />
);

export default LimpezaEEnxovalPage;
