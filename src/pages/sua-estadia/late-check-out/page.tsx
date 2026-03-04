import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
    {
        icon: 'ri-calendar-check-line',
        title: 'Disponibilidade',
        text: 'O late check-out está sujeito à disponibilidade no dia.',
    },
    {
        icon: 'ri-money-dollar-circle-line',
        title: 'Cobrança',
        text: 'Poderá haver cobrança adicional conforme política do hotel.',
    },
    {
        icon: 'ri-phone-line',
        title: 'Solicitação',
        text: "Para solicitar late check-out, utilize a opção 'Chamar Recepção'.",
    },
];

const LateCheckOutPage = () => (
    <DetailLayout
        title="Late Check-out"
        subtitle="Sua Estadia"
        description="Regras e orientações para saída após o horário padrão."
        sections={sections}
        backTo="/sua-estadia"
        backLabel="Voltar para Sua Estadia"
        heroIcon="ri-time-line"
        heroIconColor="#2A6B8A"
        containerLabel="Condições"
        containerLabelIcon="ri-information-line"
    />
);

export default LateCheckOutPage;
