import DynamicDetailPage from '../../../components/feature/DynamicDetailPage';

const fallbackSections = [
    {
        icon: 'ri-police-car-line',
        title: 'Polícia',
        text: '190',
    },
    {
        icon: 'ri-hospital-line',
        title: 'SAMU',
        text: '192',
    },
    {
        icon: 'ri-fire-line',
        title: 'Bombeiros',
        text: '193',
    },
    {
        icon: 'ri-phone-line',
        title: 'Apoio do Hotel',
        text: 'Para assistência interna, utilize a opção Chamar Recepção e disque o ramal 9 no telefone do quarto.',
    },
];

const EmergenciasPage = () => (
    <DynamicDetailPage
        apiSlug="links-uteis/emergencias"
        fallbackSections={fallbackSections}
        title="Emergências"
        subtitle="Links Úteis"
        description="Contatos essenciais para situações de emergência."
        backTo="/links-uteis"
        backLabel="Voltar para Links Úteis"
        heroIcon="ri-alarm-warning-line"
        heroIconColor="#C27C2C"
        containerLabel="Contatos Importantes"
        containerLabelIcon="ri-phone-line"
    />
);

export default EmergenciasPage;
