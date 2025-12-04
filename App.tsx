
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Activity, 
  Briefcase,
  PiggyBank,
  LineChart,
  BarChart3,
  CalendarClock,
  ArrowRight,
  DivideSquare,
  Landmark
} from 'lucide-react';
import { Card, AdPlaceholder, ResponsiveAdBlock, ShareButton } from './components/ui/Shared';
import * as Basic from './components/calculators/BasicCalculators';
import * as Advanced from './components/calculators/AdvancedCalculators';
import * as Amort from './components/calculators/Amortization';
import { FixedIncomeSimulator } from './components/calculators/FixedIncomeCalculators';
import { PercentageCalculators } from './components/calculators/PercentageCalculators';
import { AboutPage, PrivacyPage, TermsPage } from './components/pages/StaticPages';

type View = 
  | 'dashboard'
  | 'simple-interest' | 'compound-interest'
  | 'fv' | 'pv'
  | 'annuity-fv' | 'annuity-pv'
  | 'cagr' | 'roi'
  | 'npv' | 'irr'
  | 'price' | 'sac'
  | 'inflation' | 'depreciation'
  | 'percentage'
  | 'fixed-income' // Unified view for Poupança, CDB, LCI
  | 'about' | 'privacy' | 'terms'; 

const App: React.FC = () => {
  // Helper to get view from URL
  const getViewFromUrl = (): View => {
    if (typeof window === 'undefined') return 'dashboard';
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') as View;
    const validViews: View[] = [
      'simple-interest', 'compound-interest', 'fv', 'pv', 
      'annuity-fv', 'annuity-pv', 'cagr', 'roi', 'npv', 
      'irr', 'price', 'sac', 'inflation', 'depreciation', 
      'percentage', 'fixed-income', 'about', 'privacy', 'terms'
    ];
    return validViews.includes(view) ? view : 'dashboard';
  };

  const [currentView, setCurrentView] = useState<View>('dashboard');

  // Initialize view from URL on mount
  useEffect(() => {
    setCurrentView(getViewFromUrl());

    const handlePopState = () => {
      setCurrentView(getViewFromUrl());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: View) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
    
    // Update URL
    const url = new URL(window.location.href);
    if (view === 'dashboard') {
      url.searchParams.delete('view');
    } else {
      url.searchParams.set('view', view);
    }
    window.history.pushState({}, '', url);
  };

  const goToDashboard = () => {
    navigateTo('dashboard');
  }

  const renderContent = () => {
    switch(currentView) {
      case 'simple-interest': return <Basic.SimpleInterestCalc onBack={goToDashboard} />;
      case 'compound-interest': return <Basic.CompoundInterestCalc onBack={goToDashboard} />;
      case 'fv': return <Basic.FVCalc onBack={goToDashboard} />;
      case 'pv': return <Basic.PVCalc onBack={goToDashboard} />;
      case 'annuity-fv': return <Advanced.AnnuityFVCalc onBack={goToDashboard} />;
      case 'annuity-pv': return <Advanced.AnnuityPVCalc onBack={goToDashboard} />;
      case 'cagr': return <Basic.CAGRCalc onBack={goToDashboard} />;
      case 'roi': return <Basic.ROICalc onBack={goToDashboard} />;
      case 'npv': return <Advanced.NPVCalc onBack={goToDashboard} />;
      case 'irr': return <Advanced.IRRCalc onBack={goToDashboard} />;
      case 'price': return <Amort.PriceCalc onBack={goToDashboard} />;
      case 'sac': return <Amort.SACCalc onBack={goToDashboard} />;
      case 'inflation': return <Basic.InflationCalc onBack={goToDashboard} />;
      case 'depreciation': return <Basic.DepreciationCalc onBack={goToDashboard} />;
      case 'percentage': return <PercentageCalculators onBack={goToDashboard} />;
      case 'fixed-income': return <FixedIncomeSimulator onBack={goToDashboard} />;
      case 'about': return <AboutPage onBack={goToDashboard} />;
      case 'privacy': return <PrivacyPage onBack={goToDashboard} />;
      case 'terms': return <TermsPage onBack={goToDashboard} />;
      default: return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Ferramentas Financeiras Profissionais</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Selecione uma calculadora abaixo para começar seu planejamento financeiro.
          </p>
          
          <ResponsiveAdBlock />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* TOP: Matemática Básica */}
        <h3 className="col-span-full text-xl font-bold text-slate-800 flex items-center gap-2 mt-4 pb-2 border-b border-slate-200">
          <DivideSquare className="text-orange-500" /> Matemática Básica
        </h3>
        <Card 
          title="Calculadoras de Porcentagem" 
          description="4 modos: % de valor, proporção, aumento e desconto real." 
          onClick={() => navigateTo('percentage')} 
          icon={<Percent size={20} />}
        />

        {/* Rendimento & Juros */}
        <h3 className="col-span-full text-xl font-bold text-slate-800 flex items-center gap-2 mt-8 pb-2 border-b border-slate-200">
          <PiggyBank className="text-investor-500" /> Rendimento & Juros
        </h3>
        <Card 
          title="Juros Simples" 
          description="Cálculo linear ideal para empréstimos de curto prazo ou descontos." 
          onClick={() => navigateTo('simple-interest')} 
          icon={<Percent size={20} />}
        />
        <Card 
          title="Juros Compostos" 
          description="O poder dos juros sobre juros. Fundamental para investimentos de longo prazo." 
          onClick={() => navigateTo('compound-interest')} 
          icon={<TrendingUp size={20} />}
        />
        <Card 
          title="Ajuste por Inflação" 
          description="Descubra o valor real do seu dinheiro corrigido pelo tempo." 
          onClick={() => navigateTo('inflation')} 
          icon={<Activity size={20} />}
        />

        {/* NEW: Renda Fixa */}
        <h3 className="col-span-full text-xl font-bold text-slate-800 flex items-center gap-2 mt-8 pb-2 border-b border-slate-200">
          <Landmark className="text-investor-500" /> Renda Fixa
        </h3>
        <Card 
          title="Simulador de Renda Fixa" 
          description="Compare a rentabilidade entre Poupança, CDB, RDB, LCI e LCA em um único lugar." 
          onClick={() => navigateTo('fixed-income')} 
          icon={<Landmark size={20} />}
        />
        
        <h3 className="col-span-full text-xl font-bold text-slate-800 flex items-center gap-2 mt-8 pb-2 border-b border-slate-200">
          <CalendarClock className="text-blue-500" /> Valor no Tempo
        </h3>
        <Card 
          title="Valor Futuro (FV)" 
          description="Quanto seu dinheiro aplicado hoje valerá no futuro?" 
          onClick={() => navigateTo('fv')} 
        />
        <Card 
          title="Valor Presente (PV)" 
          description="Quanto você precisa investir hoje para ter X no futuro?" 
          onClick={() => navigateTo('pv')} 
        />
        <Card 
          title="Anuidade (FV)" 
          description="Acumulação de capital com depósitos mensais recorrentes." 
          onClick={() => navigateTo('annuity-fv')} 
        />
        <Card 
          title="Anuidade (PV)" 
          description="Capital necessário hoje para garantir retiradas mensais." 
          onClick={() => navigateTo('annuity-pv')} 
        />

        <h3 className="col-span-full text-xl font-bold text-slate-800 flex items-center gap-2 mt-8 pb-2 border-b border-slate-200">
          <DollarSign className="text-emerald-500" /> Financiamento & Empréstimo
        </h3>
        <Card 
          title="Tabela PRICE" 
          description="Financiamento com parcelas fixas (ex: carros, CDC)." 
          onClick={() => navigateTo('price')} 
          icon={<Briefcase size={20} />}
        />
        <Card 
          title="Tabela SAC" 
          description="Financiamento com amortização constante (ex: imobiliário)." 
          onClick={() => navigateTo('sac')} 
          icon={<LineChart size={20} />}
        />

        <h3 className="col-span-full text-xl font-bold text-slate-800 flex items-center gap-2 mt-8 pb-2 border-b border-slate-200">
          <BarChart3 className="text-purple-500" /> Indicadores de Negócio
        </h3>
        <Card 
          title="CAGR" 
          description="Taxa de crescimento anual composta para medir performance." 
          onClick={() => navigateTo('cagr')} 
        />
        <Card 
          title="ROI" 
          description="Retorno sobre investimento. Quanto você lucrou percentualmente?" 
          onClick={() => navigateTo('roi')} 
        />
        <Card 
          title="VPL / NPV" 
          description="Análise de viabilidade de projetos baseada em fluxo de caixa." 
          onClick={() => navigateTo('npv')} 
        />
        <Card 
          title="TIR / IRR" 
          description="A taxa interna de retorno de um projeto ou investimento." 
          onClick={() => navigateTo('irr')} 
        />
        <Card 
          title="Depreciação" 
          description="Cálculo linear da perda de valor de um ativo." 
          onClick={() => navigateTo('depreciation')} 
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-investor-900 text-white sticky top-0 z-50 shadow-lg border-b border-investor-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={goToDashboard}
          >
            <div className="bg-investor-800 p-2 rounded-lg border border-investor-700 group-hover:bg-investor-700 transition-colors">
              <Calculator className="w-6 h-6 text-investor-300" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">CALC <span className="text-investor-400">INVESTIDOR</span></h1>
          </div>
          
          <nav className="flex gap-6 text-sm font-medium text-investor-200">
             {currentView !== 'dashboard' && (
               <button onClick={goToDashboard} className="hover:text-white transition-colors flex items-center gap-1">
                 Voltar ao Início
               </button>
             )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {renderContent()}
      </main>

      {/* Floating Share Button */}
      <ShareButton />

      {/* Footer */}
      <footer className="bg-white text-slate-500 py-12 border-t border-slate-200 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
             {/* Brand */}
             <div className="flex flex-col gap-4">
               <div className="flex items-center gap-2">
                <div className="bg-investor-100 p-1.5 rounded border border-investor-200">
                  <Calculator className="w-5 h-5 text-investor-700" />
                </div>
                <span className="text-lg font-bold text-slate-800">CALC INVESTIDOR</span>
               </div>
               <p className="text-sm text-slate-600 leading-relaxed">
                 O conjunto mais completo de calculadoras financeiras para ajudar você a tomar as melhores decisões para o seu dinheiro.
               </p>
             </div>

             {/* Links */}
             <div className="flex flex-col gap-2">
               <h4 className="font-bold text-slate-800 mb-2 uppercase text-xs tracking-wider">Ferramentas</h4>
               <button onClick={() => navigateTo('compound-interest')} className="text-left text-sm hover:text-investor-600 hover:underline">Juros Compostos</button>
               <button onClick={() => navigateTo('simple-interest')} className="text-left text-sm hover:text-investor-600 hover:underline">Juros Simples</button>
               <button onClick={() => navigateTo('price')} className="text-left text-sm hover:text-investor-600 hover:underline">Financiamento (PRICE)</button>
               <button onClick={() => navigateTo('fixed-income')} className="text-left text-sm hover:text-investor-600 hover:underline">Renda Fixa</button>
             </div>

             {/* Institutional */}
             <div className="flex flex-col gap-2">
               <h4 className="font-bold text-slate-800 mb-2 uppercase text-xs tracking-wider">Institucional</h4>
               <button onClick={() => navigateTo('about')} className="text-left text-sm hover:text-investor-600 hover:underline">Sobre Nós</button>
               <button onClick={() => navigateTo('privacy')} className="text-left text-sm hover:text-investor-600 hover:underline">Política de Privacidade</button>
               <button onClick={() => navigateTo('terms')} className="text-left text-sm hover:text-investor-600 hover:underline">Termos de Uso</button>
             </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© {new Date().getFullYear()} CALC INVESTIDOR. Todos os direitos reservados.</p>
            <div className="flex gap-4">
               {/* Social placeholders if needed */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
