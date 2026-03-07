import DynamicDetailPage from '../../../components/feature/DynamicDetailPage';

const fallbackSections = [
    {
        icon: 'ri-battery-charge-line',
        title: 'Carregamento Elétrico',
        text: 'O hotel dispõe de estação de carregamento para veículos elétricos. Consulte a recepção para disponibilidade.',
    },
];

const CarregamentoEletricoPage = () => (
    <DynamicDetailPage
        apiSlug="lazer-estrutura/carregamento-eletrico"
        fallbackSections={fallbackSections}
        title="Carregamento Elétrico"
        subtitle="Lazer & Estrutura"
        description="Informações sobre utilização do ponto de recarga para veículos elétricos."
        backTo="/lazer-estrutura"
        backLabel="Voltar para Lazer & Estrutura"
        heroIcon="ri-battery-charge-line"
        heroIconColor="#2A6B8A"
        containerLabel="Informações de Utilização"
        containerLabelIcon="ri-flashlight-line"
    />
);

export default CarregamentoEletricoPage;
