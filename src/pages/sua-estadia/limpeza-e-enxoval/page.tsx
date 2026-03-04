import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
    {
        icon: 'ri-time-line',
        title: 'Horário de limpeza',
        text: 'A limpeza diária ocorre entre 09h00 e 15h00.',
    },
    {
        icon: 'ri-t-shirt-2-line',
        title: 'Troca de enxoval',
        text: 'A troca de enxoval ocorre a cada 3 dias ou sob solicitação.',
    },
    {
        icon: 'ri-drop-line',
        title: 'Toalhas',
        text: "Se precisar de troca adicional de toalhas, utilize a opção 'Chamar Recepção'.",
    },
    {
        icon: 'ri-information-line',
        title: 'Orientações',
        text: "Para ajustes de horário ou solicitações especiais, utilize a opção 'Chamar Recepção'.",
    },
];

const LimpezaEEnxovalPage = () => (
    <DetailLayout
        title="Limpeza & Enxoval"
        subtitle="Sua Estadia"
        description="Horários e orientações sobre limpeza do quarto e troca de enxoval."
        sections={sections}
        backTo="/sua-estadia"
        backLabel="Voltar para Sua Estadia"
        heroIcon="ri-home-smile-line"
        heroIconColor="#2A6B8A"
        containerLabel="Serviço de Camareira"
        containerLabelIcon="ri-brush-line"
    />
);

export default LimpezaEEnxovalPage;
