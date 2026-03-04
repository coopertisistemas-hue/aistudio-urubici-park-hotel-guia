import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
    {
        icon: 'ri-time-line',
        title: 'Horário',
        text: 'Check-out até 12h00.',
    },
    {
        icon: 'ri-alarm-warning-line',
        title: 'Atrasos',
        text: 'Após 12h00 poderá haver cobrança adicional conforme política do hotel.',
    },
    {
        icon: 'ri-luggage-cart-line',
        title: 'Bagagens',
        text: "Se precisar de apoio com bagagens, utilize a opção 'Chamar Recepção'.",
    },
];

const CheckOutPage = () => (
    <DetailLayout
        title="Check-out"
        subtitle="Sua Estadia"
        description="Orientações para encerramento da hospedagem e saída."
        sections={sections}
        backTo="/sua-estadia"
        backLabel="Voltar para Sua Estadia"
        heroIcon="ri-logout-box-line"
        heroIconColor="#2A6B8A"
        containerLabel="Orientações de Check-out"
        containerLabelIcon="ri-information-line"
    />
);

export default CheckOutPage;
