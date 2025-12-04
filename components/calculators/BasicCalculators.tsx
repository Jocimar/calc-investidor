
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { CalculatorLayout, Sidebar, ContentArea, Input, Button, ResultBox, Select, ResponsiveAdBlock } from '../ui/Shared';
import * as MathUtils from '../../utils/financialMath';

interface Props {
  onBack: () => void;
}

// 1. Juros Simples
export const SimpleInterestCalc: React.FC<Props> = ({ onBack }) => {
  const [values, setValues] = useState({ 
    capital: '1000', 
    monthly: '0', 
    rate: '10',
    rateType: 'yearly' as 'yearly' | 'monthly',
    time: '1',
    timeType: 'years' as 'years' | 'months'
  });
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    setResult(MathUtils.calcSimpleInterest(
      MathUtils.parse(values.capital), 
      MathUtils.parse(values.monthly),
      MathUtils.parse(values.rate), 
      values.rateType,
      MathUtils.parse(values.time),
      values.timeType
    ));
  };

  const reset = () => {
    setValues({ 
      capital: '1000', 
      monthly: '0',
      rate: '10', 
      rateType: 'yearly',
      time: '1',
      timeType: 'years'
    });
    setResult(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-5">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-full bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">Calculadora de Juros Simples</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 lg:p-8">
        {/* INPUT SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Input 
            label="Valor Inicial" 
            type="number" 
            value={values.capital} 
            onChange={e => setValues({ ...values, capital: e.target.value })} 
          />
          <Input 
            label="Valor Mensal" 
            type="number" 
            value={values.monthly} 
            onChange={e => setValues({ ...values, monthly: e.target.value })} 
          />
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Input 
                label="Taxa de juros" 
                type="number" 
                value={values.rate} 
                onChange={e => setValues({ ...values, rate: e.target.value })} 
              />
            </div>
            <div className="w-1/3 pt-7">
               <select 
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white"
                value={values.rateType}
                onChange={e => setValues({...values, rateType: e.target.value as any})}
              >
                <option value="yearly">anual</option>
                <option value="monthly">mensal</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Input 
                label="Período" 
                type="number" 
                value={values.time} 
                onChange={e => setValues({ ...values, time: e.target.value })} 
              />
            </div>
             <div className="w-1/3 pt-7">
               <select 
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white"
                value={values.timeType}
                onChange={e => setValues({...values, timeType: e.target.value as any})}
              >
                <option value="years">ano(s)</option>
                <option value="months">mês(es)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center border-b border-slate-100 pb-8 mb-4">
          <button 
            onClick={calculate}
            className="bg-investor-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-investor-900 transition-all active:scale-95"
          >
            Calcular
          </button>
           <div className="flex gap-4 text-sm font-medium">
             <button onClick={reset} className="text-slate-400 hover:text-slate-600">Limpar</button>
          </div>
        </div>

        <ResponsiveAdBlock />

        {/* RESULTS SECTION */}
        {result ? (
          <div className="animate-in fade-in duration-700">
            <h3 className="text-lg font-bold text-investor-800 mb-4">Resultado</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {/* Main Highlight Card */}
              <div className="bg-investor-800 text-white p-6 rounded-lg shadow-md text-center">
                <p className="text-xs uppercase font-bold opacity-80 mb-2">Valor total final</p>
                <p className="text-3xl font-bold">{MathUtils.formatCurrency(result.total)}</p>
              </div>
              
              <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm text-center">
                 <p className="text-xs uppercase font-bold text-slate-500 mb-2">Valor Total Investido</p>
                 <p className="text-2xl font-bold text-slate-800">{MathUtils.formatCurrency(result.invested)}</p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm text-center">
                 <p className="text-xs uppercase font-bold text-slate-500 mb-2">Total em Juros</p>
                 <p className="text-2xl font-bold text-investor-600">{MathUtils.formatCurrency(result.interest)}</p>
              </div>
            </div>
            
            <div className="mb-10">
              <div className="h-80 w-full bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-sm font-bold text-slate-500 mb-4 uppercase">Evolução do Patrimônio</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.schedule}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="period" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickFormatter={(val) => `R$${(val/1000).toFixed(0)}k`} tickLine={false} axisLine={false} />
                    <Tooltip 
                      formatter={(val: number) => MathUtils.formatCurrency(val)} 
                      cursor={{fill: '#f1f5f9'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="invested" name="Valor Investido" stackId="a" fill="#94a3b8" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="interest" name="Juros Acumulados" stackId="a" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TABLE SECTION */}
            <div>
              <h4 className="text-lg font-bold text-investor-800 mb-4 text-center">Tabela Detalhada</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                  <table className="w-full text-sm text-center">
                    <thead className="bg-slate-100 text-slate-700 sticky top-0 font-semibold">
                      <tr>
                        <th className="py-3 px-4">Período (Mês)</th>
                        <th className="py-3 px-4">Juros (Mês)</th>
                        <th className="py-3 px-4">Total Investido</th>
                        <th className="py-3 px-4">Juros Acumulados</th>
                        <th className="py-3 px-4">Total Acumulado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.schedule.map((row: any) => (
                        <tr key={row.period} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 text-slate-500">{row.period}</td>
                          <td className="py-3 px-4 text-slate-600">{MathUtils.formatCurrency(row.monthlyInterest)}</td>
                          <td className="py-3 px-4 text-slate-600">{MathUtils.formatCurrency(row.invested)}</td>
                          <td className="py-3 px-4 text-investor-600">{MathUtils.formatCurrency(row.interest)}</td>
                          <td className="py-3 px-4 font-bold text-slate-800">{MathUtils.formatCurrency(row.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-slate-400">
            Preencha os dados acima e clique em Calcular.
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Juros Compostos - Advanced Layout
export const CompoundInterestCalc: React.FC<Props> = ({ onBack }) => {
  const [values, setValues] = useState({ 
    principal: '10000', 
    monthly: '600', 
    rate: '8',
    rateType: 'yearly' as 'yearly' | 'monthly',
    period: '30',
    periodType: 'years' as 'years' | 'months'
  });
  
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    setResult(MathUtils.calcCompoundInterest(
      MathUtils.parse(values.principal), 
      MathUtils.parse(values.monthly), 
      MathUtils.parse(values.rate), 
      values.rateType,
      MathUtils.parse(values.period), 
      values.periodType
    ));
  };

  const reset = () => {
    setValues({
      principal: '10000', 
      monthly: '600', 
      rate: '8',
      rateType: 'yearly',
      period: '30',
      periodType: 'years'
    });
    setResult(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-5">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-full bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">Simulador de Juros Compostos</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 lg:p-8">
        {/* INPUT SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Input 
            label="Valor Inicial" 
            value={values.principal} 
            onChange={e => setValues({...values, principal: e.target.value})} 
          />
          <Input 
            label="Valor Mensal" 
            value={values.monthly} 
            onChange={e => setValues({...values, monthly: e.target.value})} 
          />
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Input 
                label="Taxa de juros" 
                value={values.rate} 
                onChange={e => setValues({...values, rate: e.target.value})} 
              />
            </div>
            <div className="w-1/3 pt-7">
              <select 
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white"
                value={values.rateType}
                onChange={e => setValues({...values, rateType: e.target.value as any})}
              >
                <option value="yearly">anual</option>
                <option value="monthly">mensal</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Input 
                label="Período" 
                value={values.period} 
                onChange={e => setValues({...values, period: e.target.value})} 
              />
            </div>
            <div className="w-1/3 pt-7">
              <select 
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white"
                value={values.periodType}
                onChange={e => setValues({...values, periodType: e.target.value as any})}
              >
                <option value="years">ano(s)</option>
                <option value="months">mês(es)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center border-b border-slate-100 pb-8 mb-4">
          <button 
            onClick={calculate}
            className="bg-investor-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-investor-900 transition-all active:scale-95"
          >
            Calcular
          </button>
          <div className="flex gap-4 text-sm font-medium">
             <button onClick={reset} className="text-slate-400 hover:text-slate-600">Limpar</button>
          </div>
        </div>

        <ResponsiveAdBlock />

        {/* RESULTS SECTION */}
        {result && (
          <div className="animate-in fade-in duration-700">
            <h3 className="text-lg font-bold text-investor-800 mb-4">Resultado</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {/* Main Highlight Card */}
              <div className="bg-investor-800 text-white p-6 rounded-lg shadow-md text-center">
                <p className="text-xs uppercase font-bold opacity-80 mb-2">Valor total final</p>
                <p className="text-3xl font-bold">{MathUtils.formatCurrency(result.total)}</p>
              </div>
              
              <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm text-center">
                 <p className="text-xs uppercase font-bold text-slate-500 mb-2">Valor total investido</p>
                 <p className="text-2xl font-bold text-slate-800">{MathUtils.formatCurrency(result.invested)}</p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm text-center">
                 <p className="text-xs uppercase font-bold text-slate-500 mb-2">Total em juros</p>
                 <p className="text-2xl font-bold text-investor-600">{MathUtils.formatCurrency(result.interest)}</p>
              </div>
            </div>

            {/* CHART SECTION */}
            <div className="mb-10">
              <div className="h-96 w-full bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-sm font-bold text-slate-500 mb-4 uppercase">Evolução do Patrimônio</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.schedule} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="period" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} tickLine={false} axisLine={false} />
                    <Tooltip 
                      formatter={(val: number) => MathUtils.formatCurrency(val)} 
                      cursor={{fill: '#f1f5f9'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="invested" name="Valor Investido" stackId="a" fill="#94a3b8" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="totalInterest" name="Juros Acumulados" stackId="a" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TABLE SECTION */}
            <div>
              <h4 className="text-lg font-bold text-investor-800 mb-4 text-center">Tabela Detalhada</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                  <table className="w-full text-sm text-center">
                    <thead className="bg-slate-100 text-slate-700 sticky top-0 font-semibold">
                      <tr>
                        <th className="py-3 px-4">Mês</th>
                        <th className="py-3 px-4">Juros</th>
                        <th className="py-3 px-4">Total Investido</th>
                        <th className="py-3 px-4">Total Juros</th>
                        <th className="py-3 px-4">Total Acumulado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.schedule.map((row: any) => (
                        <tr key={row.period} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 text-slate-500">{row.period}</td>
                          <td className="py-3 px-4 text-slate-600">{MathUtils.formatCurrency(row.monthlyInterest)}</td>
                          <td className="py-3 px-4 text-slate-600">{MathUtils.formatCurrency(row.invested)}</td>
                          <td className="py-3 px-4 text-investor-600">{MathUtils.formatCurrency(row.totalInterest)}</td>
                          <td className="py-3 px-4 font-bold text-slate-800">{MathUtils.formatCurrency(row.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Future Value (FV)
export const FVCalc: React.FC<Props> = ({ onBack }) => {
  const [values, setValues] = useState({ pv: '1000', rate: '0.5', periods: '12' });
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    setResult(MathUtils.calcFV(
      MathUtils.parse(values.pv),
      MathUtils.parse(values.rate),
      MathUtils.parse(values.periods)
    ));
  };

  return (
    <CalculatorLayout title="Valor Futuro (FV)" onBack={onBack}>
      <Sidebar>
        <Input label="Valor Presente (PV)" type="number" value={values.pv} onChange={e => setValues({ ...values, pv: e.target.value })} />
        <Input label="Taxa de Juros por Período (%)" type="number" value={values.rate} onChange={e => setValues({ ...values, rate: e.target.value })} />
        <Input label="Número de Períodos" type="number" value={values.periods} onChange={e => setValues({ ...values, periods: e.target.value })} />
        <Button onClick={calculate}>Calcular FV</Button>
      </Sidebar>
      <ContentArea>
        <ResponsiveAdBlock />
        {result !== null ? (
          <ResultBox label="Valor Futuro" value={MathUtils.formatCurrency(result)} highlight />
        ) : <div className="text-slate-400 text-center mt-10">Aguardando cálculo...</div>}
      </ContentArea>
    </CalculatorLayout>
  );
};

// 4. Present Value (PV)
export const PVCalc: React.FC<Props> = ({ onBack }) => {
  const [values, setValues] = useState({ fv: '1000', rate: '0.5', periods: '12' });
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    setResult(MathUtils.calcPV(
      MathUtils.parse(values.fv),
      MathUtils.parse(values.rate),
      MathUtils.parse(values.periods)
    ));
  };

  return (
    <CalculatorLayout title="Valor Presente (PV)" onBack={onBack}>
      <Sidebar>
        <Input label="Valor Futuro Desejado (FV)" type="number" value={values.fv} onChange={e => setValues({ ...values, fv: e.target.value })} />
        <Input label="Taxa de Juros por Período (%)" type="number" value={values.rate} onChange={e => setValues({ ...values, rate: e.target.value })} />
        <Input label="Número de Períodos" type="number" value={values.periods} onChange={e => setValues({ ...values, periods: e.target.value })} />
        <Button onClick={calculate}>Calcular PV</Button>
      </Sidebar>
      <ContentArea>
        <ResponsiveAdBlock />
        {result !== null ? (
          <ResultBox label="Valor Presente Necessário" value={MathUtils.formatCurrency(result)} highlight />
        ) : <div className="text-slate-400 text-center mt-10">Aguardando cálculo...</div>}
      </ContentArea>
    </CalculatorLayout>
  );
};

// 7. CAGR
export const CAGRCalc: React.FC<Props> = ({ onBack }) => {
  const [values, setValues] = useState({ start: '1000', end: '2000', years: '5' });
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    setResult(MathUtils.calcCAGR(
      MathUtils.parse(values.start),
      MathUtils.parse(values.end),
      MathUtils.parse(values.years)
    ));
  };

  return (
    <CalculatorLayout title="CAGR (Taxa de Crescimento Anual Composta)" onBack={onBack}>
      <Sidebar>
        <Input label="Valor Inicial" type="number" value={values.start} onChange={e => setValues({ ...values, start: e.target.value })} />
        <Input label="Valor Final" type="number" value={values.end} onChange={e => setValues({ ...values, end: e.target.value })} />
        <Input label="Número de Anos" type="number" value={values.years} onChange={e => setValues({ ...values, years: e.target.value })} />
        <Button onClick={calculate}>Calcular CAGR</Button>
      </Sidebar>
      <ContentArea>
        <ResponsiveAdBlock />
        {result !== null ? (
          <ResultBox label="CAGR (Crescimento Anual)" value={MathUtils.formatPercent(result)} highlight />
        ) : <div className="text-slate-400 text-center mt-10">Aguardando cálculo...</div>}
      </ContentArea>
    </CalculatorLayout>
  );
};

// 8. ROI
export const ROICalc: React.FC<Props> = ({ onBack }) => {
  const [values, setValues] = useState({ start: '1000', end: '1500' });
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    setResult(MathUtils.calcROI(
      MathUtils.parse(values.start),
      MathUtils.parse(values.end)
    ));
  };

  return (
    <CalculatorLayout title="ROI (Retorno Sobre Investimento)" onBack={onBack}>
      <Sidebar>
        <Input label="Valor Investido" type="number" value={values.start} onChange={e => setValues({ ...values, start: e.target.value })} />
        <Input label="Valor Retornado" type="number" value={values.end} onChange={e => setValues({ ...values, end: e.target.value })} />
        <Button onClick={calculate}>Calcular ROI</Button>
      </Sidebar>
      <ContentArea>
        <ResponsiveAdBlock />
        {result !== null ? (
          <ResultBox label="ROI Total" value={MathUtils.formatPercent(result)} highlight />
        ) : <div className="text-slate-400 text-center mt-10">Aguardando cálculo...</div>}
      </ContentArea>
    </CalculatorLayout>
  );
};

// 13. Inflation Adjustment
export const InflationCalc: React.FC<Props> = ({ onBack }) => {
  const [values, setValues] = useState({ value: '100', rate: '5', periods: '1' });
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    setResult(MathUtils.calcInflation(
      MathUtils.parse(values.value),
      MathUtils.parse(values.rate),
      MathUtils.parse(values.periods)
    ));
  };

  return (
    <CalculatorLayout title="Ajuste por Inflação" onBack={onBack}>
      <Sidebar>
        <Input label="Valor Original" type="number" value={values.value} onChange={e => setValues({ ...values, value: e.target.value })} />
        <Input label="Taxa de Inflação (%)" type="number" value={values.rate} onChange={e => setValues({ ...values, rate: e.target.value })} />
        <Input label="Período (Anos/Meses)" type="number" value={values.periods} onChange={e => setValues({ ...values, periods: e.target.value })} />
        <Button onClick={calculate}>Calcular Valor Corrigido</Button>
      </Sidebar>
      <ContentArea>
        <ResponsiveAdBlock />
        {result !== null ? (
          <ResultBox label="Valor Corrigido" value={MathUtils.formatCurrency(result)} highlight />
        ) : <div className="text-slate-400 text-center mt-10">Aguardando cálculo...</div>}
      </ContentArea>
    </CalculatorLayout>
  );
};

// 14. Depreciation
export const DepreciationCalc: React.FC<Props> = ({ onBack }) => {
  const [values, setValues] = useState({ cost: '50000', residual: '10000', life: '5' });
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    setResult(MathUtils.calcDepreciation(
      MathUtils.parse(values.cost),
      MathUtils.parse(values.residual),
      MathUtils.parse(values.life)
    ));
  };

  return (
    <CalculatorLayout title="Depreciação Linear" onBack={onBack}>
      <Sidebar>
        <Input label="Custo do Ativo" type="number" value={values.cost} onChange={e => setValues({ ...values, cost: e.target.value })} />
        <Input label="Valor Residual" type="number" value={values.residual} onChange={e => setValues({ ...values, residual: e.target.value })} />
        <Input label="Vida Útil (anos)" type="number" value={values.life} onChange={e => setValues({ ...values, life: e.target.value })} />
        <Button onClick={calculate}>Calcular Depreciação Anual</Button>
      </Sidebar>
      <ContentArea>
        <ResponsiveAdBlock />
        {result !== null ? (
          <ResultBox label="Depreciação Anual" value={MathUtils.formatCurrency(result)} highlight />
        ) : <div className="text-slate-400 text-center mt-10">Aguardando cálculo...</div>}
      </ContentArea>
    </CalculatorLayout>
  );
};
