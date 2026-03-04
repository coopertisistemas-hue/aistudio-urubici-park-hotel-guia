import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
    {
        icon: 'ri-map-pin-line',
        title: 'Endereço',
        text: "Para confirmação do endereço completo e orientações, utilize a opção 'Chamar Recepção'.",
    },
    {
        icon: 'ri-navigation-line',
        title: 'Rotas',
        text: 'Use o aplicativo de mapas de sua preferência para navegação.',
    },
    {
        icon: 'ri-information-line',
        title: 'Apoio',
        text: "Se precisar de ajuda, utilize a opção 'Chamar Recepção'.",
    },
];

const LocalizacaoPage = () => (
    <DetailLayout
        title="Localização"
        subtitle="Links Úteis"
        description="Informações de localização e orientações gerais."
        sections={sections}
        backTo="/links-uteis"
        backLabel="Voltar para Links Úteis"
        heroIcon="ri-map-pin-line"
        heroIconColor="#C27C2C"
        containerLabel="Orientações"
        containerLabelIcon="ri-road-map-line"
    />
);

export default LocalizacaoPage;
