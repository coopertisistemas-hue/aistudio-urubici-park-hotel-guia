
import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
    {
        icon: 'ri-time-line',
        title: 'Horário',
        text: 'Das 22h às 08h.',
    },
    {
        icon: 'ri-volume-mute-line',
        title: 'Orientação',
        text: 'Evite ruídos e mantenha o volume baixo nas áreas comuns, corredores e quartos.',
    },
    {
        icon: 'ri-information-line',
        title: 'Apoio',
        text: "Se precisar de ajuda, utilize a opção 'Chamar Recepção'.",
    },
];

const HorarioDeSilencioPage = () => (
    <DetailLayout
        title="Horário de Silêncio"
        subtitle="Regras do Hotel"
        description="Orientações para manter o conforto e o descanso de todos."
        sections={sections}
        backTo="/regras-do-hotel"
        backLabel="Voltar para Regras do Hotel"
        heroIcon="ri-moon-line"
        heroIconColor="#6B5AA6"
        containerLabel="Regras de Convivência"
        containerLabelIcon="ri-shield-check-line"
    />
);

export default HorarioDeSilencioPage;
