import DynamicDetailPage from '../../../components/feature/DynamicDetailPage';

const fallbackSections = [
    {
        icon: 'ri-calendar-check-line',
        title: 'Late Check-out',
        text: 'Sujeito à disponibilidade do hotel. Solicite com antecedência na recepção. Pode haver cobrança adicional.',
    },
];

const LateCheckOutPage = () => (
    <DynamicDetailPage
        apiSlug="sua-estadia/late-check-out"
        fallbackSections={fallbackSections}
        title="Late Check-out"
        subtitle="Sua Estadia"
        description="Regras e orientações para saída após o horário padrão."
        backTo="/sua-estadia"
        backLabel="Voltar para Sua Estadia"
        heroIcon="ri-time-line"
        heroIconColor="#2A6B8A"
        containerLabel="Condições"
        containerLabelIcon="ri-information-line"
    />
);

export default LateCheckOutPage;
