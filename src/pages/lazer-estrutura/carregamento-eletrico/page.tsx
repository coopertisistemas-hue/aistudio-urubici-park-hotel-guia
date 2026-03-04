
import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
    {
        icon: 'ri-parking-box-line',
        title: 'Disponibilidade',
        text: 'O hotel possui 1 vaga disponível para carregamento de veículos elétricos.',
    },
    {
        icon: 'ri-flashlight-line',
        title: 'Tipo de Carregamento',
        text: 'O carregamento disponível é do tipo padrão (mais lento).',
    },
    {
        icon: 'ri-money-dollar-circle-line',
        title: 'Tarifa',
        text: 'A utilização do carregamento possui tarifa de R$ 2,50.',
    },
    {
        icon: 'ri-information-line',
        title: 'Solicitação',
        text: 'É necessário solicitar a liberação do ponto de carregamento na recepção antes da utilização.',
    },
];

const CarregamentoEletricoPage = () => (
    <DetailLayout
        title="Carregamento Elétrico"
        subtitle="Lazer & Estrutura"
        description="Informações sobre utilização do ponto de recarga para veículos elétricos."
        sections={sections}
        backTo="/lazer-estrutura"
        backLabel="Voltar para Lazer & Estrutura"
        heroIcon="ri-battery-charge-line"
        heroIconColor="#2A6B8A"
        containerLabel="Informações de Utilização"
        containerLabelIcon="ri-flashlight-line"
    />
);

export default CarregamentoEletricoPage;
