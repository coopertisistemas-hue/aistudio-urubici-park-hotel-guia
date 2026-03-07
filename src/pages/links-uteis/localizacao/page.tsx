import DynamicDetailPage from '../../../components/feature/DynamicDetailPage';

const fallbackSections = [
    {
        icon: 'ri-map-pin-line',
        title: 'Localização',
        text: 'Urubici Park Hotel',
    },
];

const LocalizacaoPage = () => (
    <DynamicDetailPage
        apiSlug="links-uteis/localizacao"
        fallbackSections={fallbackSections}
        title="Localização"
        subtitle="Links Úteis"
        description="Informações de localização e orientações gerais."
        backTo="/links-uteis"
        backLabel="Voltar para Links Úteis"
        heroIcon="ri-map-pin-line"
        heroIconColor="#C27C2C"
        containerLabel="Orientações"
        containerLabelIcon="ri-road-map-line"
    />
);

export default LocalizacaoPage;
