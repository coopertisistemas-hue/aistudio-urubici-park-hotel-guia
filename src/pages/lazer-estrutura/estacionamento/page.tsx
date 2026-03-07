import DynamicDetailPage from '../../../components/feature/DynamicDetailPage';

const fallbackSections = [
    {
        icon: 'ri-car-line',
        title: 'Estacionamento',
        text: 'O hotel oferece estacionamento gratuito para hóspedes.',
    },
];

const EstacionamentoPage = () => (
    <DynamicDetailPage
        apiSlug="lazer-estrutura/estacionamento"
        fallbackSections={fallbackSections}
        title="Estacionamento"
        subtitle="Lazer & Estrutura"
        description="Informações e orientações para uso do estacionamento durante sua estadia."
        backTo="/lazer-estrutura"
        backLabel="Voltar para Lazer & Estrutura"
        heroIcon="ri-parking-box-line"
        heroIconColor="#4EA16C"
        containerLabel="Orientações de Acesso"
        containerLabelIcon="ri-road-map-line"
    />
);

export default EstacionamentoPage;
