
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Info, Calculator } from 'lucide-react';
import { ResponsiveAdBlock, Input, Button, ResultBox } from '../ui/Shared';
import * as MathUtils from '../../utils/financialMath';

interface Props {
  onBack: () => void;
}

export const FixedIncomeSimulator: React.FC<Props> = ({ onBack }) => {
  const [values, setValues] = useState({
    capital: '1000',
    days: '360',
    diRate: '14.90',
    selicRate: '15.00',
    cdbPercent: '100',
    lciPercent: '90'
  });

  const [result, setResult] = useState<any>(null);

  // Auto calculate on mount
  useEffect(() => {
    calculate();
  }, []);

  const calculate = () => {
    setResult(MathUtils.calcFixedIncomeComparison(
      MathUtils.parse(values.capital),
      MathUtils.parse(values.days),
      MathUtils.parse(values.diRate),
      MathUtils.parse(values.selicRate),
      MathUtils.parse(values.cdbPercent),
      MathUtils.parse(values.lciPercent)
    ));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-5">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-2 rounded-full bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Calculator className="text-investor-600" size={24} />
            <h2 className="text-2xl font-bold text-slate-800">Calculadora Renda Fixa</h2>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-500 text-sm">
           <Info size={16} />
           <span>Simulação comparativa</span>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* SIDEBAR INPUTS */}
        <div className="w-full xl:w-[350px] flex-shrink-0 bg-white rounded-xl shadow-lg border border-slate-100 p-6 h-fit">
          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Investimento</h3>
          
          <div className="flex flex-col gap-5">
            <Input 
              label="Valor da Aplicação (R$)" 
              value={values.capital} 
              onChange={e => setValues({...values, capital: e.target.value})} 
            />

            <div className="flex gap-3">
               <div className="flex-1">
                 <Input 
                  label="Vencimento" 
                  value={values.days} 
                  onChange={e => setValues({...values, days: e.target.value})} 
                 />
               </div>
               <div className="w-[100px] pt-7">
                  <div className="px-3 py-2.5 bg-slate-100 text-slate-600 rounded-lg border border-slate-200 text-sm text-center">
                    dias
                  </div>
               </div>
            </div>

            <hr className="border-slate-100 my-1" />

            <div className="relative">
               <Input 
                  label="Taxa DI (% a.a.)" 
                  value={values.diRate} 
                  onChange={e => setValues({...values, diRate: e.target.value})} 
               />
            </div>
            
            <div className="relative">
               <Input 
                  label="Taxa SELIC (% a.a.)" 
                  value={values.selicRate} 
                  onChange={e => setValues({...values, selicRate: e.target.value})} 
               />
            </div>

            <hr className="border-slate-100 my-1" />
            
            <Input 
              label="CDB/RDB/LC (% do CDI)" 
              value={values.cdbPercent} 
              onChange={e => setValues({...values, cdbPercent: e.target.value})} 
            />

            <Input 
              label="LCI/LCA (% do CDI)" 
              value={values.lciPercent} 
              onChange={e => setValues({...values, lciPercent: e.target.value})} 
            />

            <Button onClick={calculate}>Calcular</Button>
          </div>
        </div>

        {/* RESULTS CONTENT */}
        <div className="flex-1 flex flex-col gap-6">
           <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm text-slate-600 text-sm">
             Simulação da rentabilidade do seu investimento conforme o tipo de aplicação e as taxas informadas.
             <br/>
             <span className="text-xs text-slate-400">* Considera ano comercial de 360 dias. IR regressivo aplicado conforme prazo.</span>
           </div>

           <ResponsiveAdBlock />

           {result && (
             <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                
                {/* POUPANÇA */}
                <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                  <div className="bg-investor-600 px-6 py-3 text-white font-bold text-lg">
                    Poupança
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">● Valor Total Líquido</p>
                        <p className="text-2xl font-bold text-slate-800">{MathUtils.formatCurrency(result.poupanca.total)}</p>
                     </div>
                     <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                        <p className="text-xs text-emerald-700 font-bold uppercase mb-1">● Rendimento Líquido</p>
                        <p className="text-2xl font-bold text-emerald-600">{MathUtils.formatCurrency(result.poupanca.yield)}</p>
                     </div>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500">Rentabilidade</span>
                      <span className="font-bold text-investor-600">{MathUtils.formatPercent(result.poupanca.percentReturn * 100)}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-4">
                       <div className="h-full bg-investor-500" style={{ width: `${Math.min(result.poupanca.percentReturn, 20) * 5}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                       <span>● Valor Investido</span>
                       <span>{MathUtils.formatCurrency(MathUtils.parse(values.capital))}</span>
                    </div>
                    <div className="flex justify-between text-xs text-emerald-600 mt-1">
                       <span>● Rendimento Bruto</span>
                       <span>{MathUtils.formatCurrency(result.poupanca.yield)}</span>
                    </div>
                  </div>
                </div>

                {/* CDB / RDB */}
                <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                  <div className="bg-investor-600 px-6 py-3 text-white font-bold text-lg">
                    CDB / RDB
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">● Valor Total Líquido</p>
                        <p className="text-2xl font-bold text-slate-800">{MathUtils.formatCurrency(result.cdb.total)}</p>
                     </div>
                     <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                        <p className="text-xs text-emerald-700 font-bold uppercase mb-1">● Rendimento Líquido</p>
                        <p className="text-2xl font-bold text-emerald-600">{MathUtils.formatCurrency(result.cdb.netYield)}</p>
                     </div>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500">Rentabilidade</span>
                      <span className="font-bold text-investor-600">{MathUtils.formatPercent(result.cdb.percentReturn * 100)}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-4">
                       <div className="h-full bg-investor-500" style={{ width: `${Math.min(result.cdb.percentReturn, 20) * 5}%` }}></div>
                    </div>
                     <div className="flex justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                       <span>● Valor Investido</span>
                       <span>{MathUtils.formatCurrency(MathUtils.parse(values.capital))}</span>
                    </div>
                    <div className="flex justify-between text-xs text-emerald-600 mt-1">
                       <span>● Rendimento Bruto</span>
                       <span>{MathUtils.formatCurrency(result.cdb.grossYield)}</span>
                    </div>
                     <div className="bg-red-50 p-2 rounded mt-2 flex justify-between text-xs text-red-600 items-center">
                       <div className="flex flex-col">
                         <span className="font-bold">● Deduções</span>
                         <span>Imposto de Renda <span className="bg-red-200 px-1 rounded text-[10px]">{MathUtils.formatNumber(result.taxRate)}%</span></span>
                       </div>
                       <span>- {MathUtils.formatCurrency(result.cdb.taxAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* LCI / LCA */}
                <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                  <div className="bg-investor-600 px-6 py-3 text-white font-bold text-lg">
                    LCI / LCA
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">● Valor Total Líquido</p>
                        <p className="text-2xl font-bold text-slate-800">{MathUtils.formatCurrency(result.lci.total)}</p>
                     </div>
                     <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                        <p className="text-xs text-emerald-700 font-bold uppercase mb-1">● Rendimento Líquido</p>
                        <p className="text-2xl font-bold text-emerald-600">{MathUtils.formatCurrency(result.lci.yield)}</p>
                     </div>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500">Rentabilidade</span>
                      <span className="font-bold text-investor-600">{MathUtils.formatPercent(result.lci.percentReturn * 100)}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-4">
                       <div className="h-full bg-investor-500" style={{ width: `${Math.min(result.lci.percentReturn, 20) * 5}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                       <span>● Valor Investido</span>
                       <span>{MathUtils.formatCurrency(MathUtils.parse(values.capital))}</span>
                    </div>
                    <div className="flex justify-between text-xs text-emerald-600 mt-1">
                       <span>● Rendimento Bruto</span>
                       <span>{MathUtils.formatCurrency(result.lci.yield)}</span>
                    </div>
                     <div className="bg-emerald-50 p-2 rounded mt-2 flex justify-between text-xs text-emerald-700 items-center">
                       <span>Isento de Imposto de Renda</span>
                       <span>R$ 0,00</span>
                    </div>
                  </div>
                </div>

             </div>
           )}
        </div>
      </div>
    </div>
  );
};
