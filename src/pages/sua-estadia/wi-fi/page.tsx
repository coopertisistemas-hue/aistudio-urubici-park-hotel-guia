
import DetailLayout, { type DetailSection } from '../../../components/feature/DetailLayout';

const sections: DetailSection[] = [
    {
        icon: 'ri-wifi-line',
        title: 'Rede Wi-Fi',
        text: 'Conecte-se à rede UPH01, disponível em todos os ambientes do hotel.',
    },
    {
        icon: 'ri-lock-password-line',
        title: 'Senha',
        text: 'A senha da rede é uph.com.br. Ela é válida para todo o hotel.',
    },
    {
        icon: 'ri-information-line',
        title: 'Orientações',
        text: 'Em caso de dificuldade de conexão, reinicie o dispositivo e tente novamente. Persistindo o problema, dirija-se à recepção para obter assistência.',
    },
];

const WifiDetailPage = () => (
    <DetailLayout
        title="Wi-Fi"
        subtitle="Sua Estadia"
        description="Conecte-se à internet durante sua hospedagem."
        sections={sections}
        backTo="/sua-estadia"
        backLabel="Voltar para Sua Estadia"
        heroIcon="ri-wifi-line"
        heroIconColor="#2A6B8A"
        containerLabel="Informações de Conexão"
        containerLabelIcon="ri-signal-wifi-line"
    />
);

export default WifiDetailPage;
