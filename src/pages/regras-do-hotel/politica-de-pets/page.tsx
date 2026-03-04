import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
    {
        icon: 'ri-shield-check-line',
        title: 'Regras gerais',
        text: 'A hospedagem com pets segue regras específicas do hotel. Consulte a recepção para confirmação e orientações.',
    },
    {
        icon: 'ri-home-4-line',
        title: 'Áreas permitidas',
        text: 'Respeite as áreas permitidas para circulação de pets. Em caso de dúvida, consulte a recepção.',
    },
    {
        icon: 'ri-brush-line',
        title: 'Higiene e cuidados',
        text: 'Mantenha o ambiente limpo e evite que o pet cause incômodo a outros hóspedes.',
    },
    {
        icon: 'ri-alert-line',
        title: 'Responsabilidade',
        text: 'O tutor é responsável pelo pet durante toda a estadia, incluindo eventuais danos ou ocorrências.',
    },
];

const PoliticaDePetsPage = () => (
    <DetailLayout
        title="Política de Pets"
        subtitle="Regras do Hotel"
        description="Orientações para hospedagem com pets, visando conforto e segurança de todos."
        sections={sections}
        backTo="/regras-do-hotel"
        backLabel="Voltar para Regras do Hotel"
        heroIcon="ri-footprint-line"
        heroIconColor="#7E57C2"
        containerLabel="Orientações para Pets"
        containerLabelIcon="ri-information-line"
    />
);

export default PoliticaDePetsPage;
