import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
    {
        icon: 'ri-car-line',
        title: 'Acesso e uso',
        text: 'Utilize o estacionamento conforme orientações do hotel. Em caso de dúvida, consulte a recepção.',
    },
    {
        icon: 'ri-shield-check-line',
        title: 'Segurança',
        text: 'Recomendamos não deixar objetos de valor aparentes no veículo.',
    },
    {
        icon: 'ri-information-line',
        title: 'Orientações adicionais',
        text: 'Para instruções específicas (vagas, circulação e regras), consulte a recepção.',
    },
];

const EstacionamentoPage = () => (
    <DetailLayout
        title="Estacionamento"
        subtitle="Lazer & Estrutura"
        description="Informações e orientações para uso do estacionamento durante sua estadia."
        sections={sections}
        backTo="/lazer-estrutura"
        backLabel="Voltar para Lazer & Estrutura"
        heroIcon="ri-parking-box-line"
        heroIconColor="#4EA16C"
        containerLabel="Orientações de Acesso"
        containerLabelIcon="ri-road-map-line"
    />
);

export default EstacionamentoPage;
