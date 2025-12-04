import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  onBack: () => void;
}

const TextPageLayout: React.FC<{ title: string; onBack: () => void; children: React.ReactNode }> = ({ title, onBack, children }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-investor-600 dark:hover:text-investor-400 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 lg:p-12 min-h-[600px] transition-colors duration-300">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert text-slate-700 dark:text-slate-300 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export const AboutPage: React.FC<PageProps> = ({ onBack }) => (
  <TextPageLayout title="Sobre Nós" onBack={onBack}>
    <h3 className="text-xl font-bold text-investor-800 dark:text-investor-400 mb-4">Bem-vindo ao CALC INVESTIDOR</h3>
    <p className="mb-6">
      O <strong>CALC INVESTIDOR</strong> nasceu com a missão de simplificar a matemática financeira para investidores, estudantes e profissionais. 
      Sabemos que tomar decisões financeiras exige precisão, e muitas vezes as ferramentas disponíveis são complexas demais ou simplistas ao extremo.
    </p>
    <p className="mb-6">
      Nossa plataforma reúne <strong>14 calculadoras essenciais</strong> em um único lugar, permitindo simulações de juros compostos, amortizações, 
      análise de viabilidade de projetos (VPL/TIR) e métricas de crescimento (CAGR/ROI), tudo de forma gratuita, rápida e intuitiva.
    </p>
    <h3 className="text-xl font-bold text-investor-800 dark:text-investor-400 mb-4">Nossa Missão</h3>
    <p>
      Empoderar pessoas através da educação financeira e ferramentas acessíveis, auxiliando na construção de patrimônio e na tomada de decisões inteligentes.
    </p>
  </TextPageLayout>
);

export const PrivacyPage: React.FC<PageProps> = ({ onBack }) => (
  <TextPageLayout title="Política de Privacidade" onBack={onBack}>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Última atualização: {new Date().getFullYear()}</p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">1. Coleta de Dados</h3>
    <p className="mb-6">
      O <strong>CALC INVESTIDOR</strong> preza pela sua privacidade. <strong>Não coletamos, armazenamos ou compartilhamos</strong> os dados financeiros 
      inseridos nas calculadoras. Todos os cálculos são processados localmente no seu navegador. Quando você fecha a página, os dados inseridos são apagados.
    </p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">2. Cookies e Tecnologias de Rastreamento</h3>
    <p className="mb-6">
      Utilizamos cookies apenas para fins essenciais de funcionamento do site e para a exibição de publicidade através de parceiros como o Google AdSense.
    </p>
    <ul className="list-disc pl-6 mb-6 space-y-2">
      <li><strong>Google AdSense:</strong> Parceiros de publicidade terceiros podem usar cookies para exibir anúncios com base em suas visitas anteriores a este ou a outros sites.</li>
      <li>Você pode optar por não receber publicidade personalizada visitando as Configurações de Anúncios do Google.</li>
    </ul>

    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">3. Links Externos</h3>
    <p className="mb-6">
      Nosso site pode conter links para outros sites. Não nos responsabilizamos pelas práticas de privacidade ou conteúdo desses sites terceiros.
    </p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">4. Contato</h3>
    <p>
      Para questões relacionadas a esta política, entre em contato através dos canais oficiais disponíveis na plataforma.
    </p>
  </TextPageLayout>
);

export const TermsPage: React.FC<PageProps> = ({ onBack }) => (
  <TextPageLayout title="Termos de Uso" onBack={onBack}>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Última atualização: {new Date().getFullYear()}</p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">1. Aceitação dos Termos</h3>
    <p className="mb-6">
      Ao acessar e usar o <strong>CALC INVESTIDOR</strong>, você aceita e concorda em cumprir os termos e disposições deste contrato.
    </p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">2. Uso Educacional</h3>
    <p className="mb-6">
      Todas as ferramentas e informações fornecidas neste site têm <strong>fins estritamente educacionais e informativos</strong>. 
      O CALC INVESTIDOR não fornece consultoria financeira, jurídica ou tributária.
    </p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">3. Isenção de Responsabilidade</h3>
    <p className="mb-6">
      Embora nos esforcemos para garantir a precisão dos cálculos, não garantimos que os resultados estejam livres de erros. 
      Investimentos envolvem riscos. O usuário é inteiramente responsável por verificar os resultados antes de tomar qualquer decisão financeira real. 
      Não nos responsabilizamos por perdas ou danos decorrentes do uso das informações aqui contidas.
    </p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">4. Propriedade Intelectual</h3>
    <p className="mb-6">
      O design, código fonte, gráficos e conteúdo do site são propriedade do CALC INVESTIDOR e estão protegidos pelas leis de direitos autorais.
    </p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">5. Alterações</h3>
    <p>
      Reservamo-nos o direito de modificar estes termos a qualquer momento. O uso continuado do site após tais alterações constitui sua aceitação dos novos termos.
    </p>
  </TextPageLayout>
);