import DynamicDetailPage from '../../../components/feature/DynamicDetailPage';

const fallbackSections = [
    {
        icon: 'ri-time-line',
        title: 'Horário',
        text: 'O check-out deve ser realizado até as 12h. Devolva as chaves na recepção ao sair.',
    },
    {
        icon: 'ri-alarm-warning-line',
        title: 'Late Check-out',
        text: 'Sujeito à disponibilidade e cobrança adicional. Solicite na recepção com antecedência.',
    },
];

const CheckOutPage = () => (
    <DynamicDetailPage
        apiSlug="sua-estadia/check-out"
        fallbackSections={fallbackSections}
        title="Check-out"
        subtitle="Sua Estadia"
        description="Orientações para encerramento da hospedagem e saída."
        backTo="/sua-estadia"
        backLabel="Voltar para Sua Estadia"
        heroIcon="ri-logout-box-line"
        heroIconColor="#2A6B8A"
        containerLabel="Orientações de Check-out"
        containerLabelIcon="ri-information-line"
    />
);

export default CheckOutPage;
