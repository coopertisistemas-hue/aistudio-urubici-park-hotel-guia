import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
    {
        icon: 'ri-community-line',
        title: 'Áreas permitidas',
        text: 'Visitantes são permitidos apenas nas áreas comuns.',
    },
    {
        icon: 'ri-hotel-line',
        title: 'Acesso aos quartos',
        text: 'O acesso aos quartos é restrito aos hóspedes registrados.',
    },
    {
        icon: 'ri-shield-check-line',
        title: 'Segurança',
        text: "Em caso de dúvidas, utilize a opção 'Chamar Recepção'.",
    },
];

const VisitantesPage = () => (
    <DetailLayout
        title="Visitantes"
        subtitle="Regras do Hotel"
        description="Política de visitantes durante a hospedagem."
        sections={sections}
        backTo="/regras-do-hotel"
        backLabel="Voltar para Regras do Hotel"
        heroIcon="ri-user-shared-line"
        heroIconColor="#6B5AA6"
        containerLabel="Orientações"
        containerLabelIcon="ri-information-line"
    />
);

export default VisitantesPage;
