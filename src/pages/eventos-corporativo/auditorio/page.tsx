
import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
    {
        icon: 'ri-group-line',
        title: 'Capacidade',
        text: 'O auditório possui capacidade aproximada para até 150 pessoas.',
    },
    {
        icon: 'ri-tools-line',
        title: 'Estrutura',
        text: 'O espaço pode ser configurado conforme o tipo de evento, como palestras, treinamentos ou reuniões.',
    },
    {
        icon: 'ri-time-line',
        title: 'Horários',
        text: 'A utilização pode ocorrer inclusive fora do horário comercial, mediante agendamento.',
    },
    {
        icon: 'ri-information-line',
        title: 'Solicitações e Orçamentos',
        text: "Para solicitar informações, disponibilidade ou orçamento para eventos, utilize a opção 'Chamar Recepção'.",
    },
];

const AuditorioPage = () => (
    <DetailLayout
        title="Auditório / Salão de Eventos"
        subtitle="Eventos & Corporativo"
        description="Informações sobre utilização do auditório e realização de eventos no hotel."
        sections={sections}
        backTo="/eventos-corporativo"
        backLabel="Voltar para Eventos & Corporativo"
        heroIcon="ri-presentation-line"
        heroIconColor="#2A6B8A"
        containerLabel="Estrutura do Espaço"
        containerLabelIcon="ri-building-line"
    />
);

export default AuditorioPage;
