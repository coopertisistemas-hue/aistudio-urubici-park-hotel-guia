import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
    {
        icon: 'ri-volume-mute-line',
        title: 'Respeito ao silêncio',
        text: 'Evite ruídos excessivos, especialmente no período noturno, para o conforto de todos.',
    },
    {
        icon: 'ri-group-line',
        title: 'Circulação de visitantes',
        text: 'Visitantes devem respeitar as regras do hotel e permanecer nas áreas permitidas.',
    },
    {
        icon: 'ri-fire-line',
        title: 'Segurança',
        text: 'Não é permitido realizar atividades que comprometam a segurança do hotel, dos hóspedes ou das instalações.',
    },
    {
        icon: 'ri-information-line',
        title: 'Dúvidas e exceções',
        text: 'Em casos específicos, consulte a recepção para orientação.',
    },
];

const ProibicoesPage = () => (
    <DetailLayout
        title="Proibições"
        subtitle="Regras do Hotel"
        description="Orientações sobre condutas não permitidas para garantir conforto e segurança de todos."
        sections={sections}
        backTo="/regras-do-hotel"
        backLabel="Voltar para Regras do Hotel"
        heroIcon="ri-forbid-2-line"
        heroIconColor="#7E57C2"
        containerLabel="Condutas não permitidas"
        containerLabelIcon="ri-alert-line"
    />
);

export default ProibicoesPage;
