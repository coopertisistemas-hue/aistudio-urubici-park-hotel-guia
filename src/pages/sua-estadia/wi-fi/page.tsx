import DynamicDetailPage from '../../../components/feature/DynamicDetailPage';

const fallbackSections = [
    {
        icon: 'ri-wifi-line',
        title: 'Wi-Fi',
        text: 'Wi-Fi gratuito disponível em todas as áreas do hotel.',
    },
];

const WifiDetailPage = () => (
    <DynamicDetailPage
        apiSlug="sua-estadia/wi-fi"
        fallbackSections={fallbackSections}
        title="Wi-Fi"
        subtitle="Sua Estadia"
        description="Conecte-se à internet durante sua hospedagem."
        backTo="/sua-estadia"
        backLabel="Voltar para Sua Estadia"
        heroIcon="ri-wifi-line"
        heroIconColor="#2A6B8A"
        containerLabel="Informações de Conexão"
        containerLabelIcon="ri-signal-wifi-line"
    />
);

export default WifiDetailPage;
