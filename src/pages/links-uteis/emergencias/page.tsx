
import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
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
        icon: 'ri-information-line',
        title: 'Apoio do Hotel',
        text: "Para assistência interna, utilize a opção 'Chamar Recepção' e disque o ramal 9 no telefone do quarto.",
    },
];

const EmergenciasPage = () => (
    <DetailLayout
        title="Emergências"
        subtitle="Links Úteis"
        description="Contatos essenciais para situações de emergência."
        sections={sections}
        backTo="/links-uteis"
        backLabel="Voltar para Links Úteis"
        heroIcon="ri-alarm-warning-line"
        heroIconColor="#C27C2C"
        containerLabel="Contatos Importantes"
        containerLabelIcon="ri-phone-line"
    />
);

export default EmergenciasPage;
