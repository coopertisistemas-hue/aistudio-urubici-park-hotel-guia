import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
    {
        icon: 'ri-time-line',
        title: 'Horário',
        text: 'O horário de check-in pode variar conforme a ocupação. Em caso de dúvidas, confirme com a recepção.',
    },
    {
        icon: 'ri-id-card-line',
        title: 'Documentos',
        text: 'Tenha seus documentos em mãos para agilizar o atendimento no check-in.',
    },
    {
        icon: 'ri-luggage-cart-line',
        title: 'Bagagens',
        text: "Se precisar de apoio com bagagens, utilize a opção 'Chamar Recepção'.",
    },
];

const CheckInPage = () => (
    <DetailLayout
        title="Check-in"
        subtitle="Sua Estadia"
        description="Orientações para a sua chegada e início da hospedagem."
        sections={sections}
        backTo="/sua-estadia"
        backLabel="Voltar para Sua Estadia"
        heroIcon="ri-login-box-line"
        heroIconColor="#2A6B8A"
        containerLabel="Orientações de Check-in"
        containerLabelIcon="ri-information-line"
    />
);

export default CheckInPage;
