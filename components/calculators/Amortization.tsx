import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { CalculatorLayout, Sidebar, ContentArea, Input, Button, ResultBox, ResponsiveAdBlock, DownloadButton, downloadCSV, Select } from '../ui/Shared';
import * as MathUtils from '../../utils/financialMath';
import { AmortizationResult } from '../../types';
import { ArrowLeft, Calculator, Info } from 'lucide-react';

interface AmortizationTableProps {
  data: AmortizationResult;
  compact?: boolean;
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({ data, compact }) => {
  return (
    <div className="mt-6 border rounded-lg overflow-hidden border-slate-200 dark:border-slate-700">
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
          <thead className="text-xs text-slate-700 dark:text-slate-200 uppercase bg-slate-100 dark:bg-slate-700 sticky top-0">
            <tr>
              <th className="px-4 py-3 bg-slate-100 dark:bg-slate-800">#</th>
              <th className="px-4 py-3 bg-slate-100 dark:bg-slate-800">Parcela</th>
              {!compact && <th className="px-4 py-3 bg-slate-100 dark:bg-slate-800">Juros</th>}
              {!compact && <th className="px-4 py-3 bg-slate-100 dark:bg-slate-800">Amortização</th>}
              <th className="px-4 py-3 bg-slate-100 dark:bg-slate-800">Saldo</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800">
            {data.schedule.map((row) => (
              <tr key={row.period} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-2 font-medium text-slate-500 dark:text-slate-400">{row.period}</td>
                <td className="px-4 py-2 text-slate-800 dark:text-slate-200 font-bold">{MathUtils.formatNumber(row.payment)}</td>
                {!compact && <td className="px-4 py-2 text-red-600 dark:text-red-400">{MathUtils.formatNumber(row.interest)}</td>}
                {!compact && <td className="px-4 py-2 text-emerald-600 dark:text-emerald-400">{MathUtils.formatNumber(row.amortization)}</td>}
                <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{MathUtils.formatNumber(row.balance)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-200 dark:bg-slate-700 font-bold sticky bottom-0 text-slate-800 dark:text-slate-100">
            <tr>
              <td className="px-4 py-3">TOTAL</td>
              <td className="px-4 py-3">{MathUtils.formatNumber(data.totalPaid)}</td>
              {!compact && <td className="px-4 py-3 text-red-700 dark:text-red-400">{MathUtils.formatNumber(data.totalInterest)}</td>}
              {!compact && <td className="px-4 py-3 text-emerald-700 dark:text-emerald-400">{MathUtils.formatNumber(data.totalPaid - data.totalInterest)}</td>}
              <td className="px-4 py-3">-</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

interface Props {
  onBack: () => void;
}

// 11. PRICE (Keep for direct access if needed, but mainly used in comparator now)
export const PriceCalc: React.FC<Props> = ({ onBack }) => {
  const [values, setValues] = useState({ loan: '200000', rate: '1', periods: '60' });
  const [result, setResult] = useState<AmortizationResult | null>(null);

  const calculate = () => setResult(MathUtils.calcPrice(MathUtils.parse(values.loan), MathUtils.parse(values.rate), MathUtils.parse(values.periods)));

  const handleDownload = () => {
    if (!result) return;
    const csvData = result.schedule.map(row => ({
      Periodo: row.period,
      Parcela: row.payment.toFixed(2),
      Juros: row.interest.toFixed(2),
      Amortizacao: row.amortization.toFixed(2),
      SaldoDevedor: row.balance.toFixed(2)
    }));
    downloadCSV(csvData, 'tabela_price');
  };

  return (
    <CalculatorLayout title="Sistema Price (Parcelas Fixas)" onBack={onBack}>
      <Sidebar>
        <Input label="Valor do Empréstimo" type="number" value={values.loan} onChange={e => setValues({ ...values, loan: e.target.value })} />
        <Input label="Taxa de Juros (%)" type="number" value={values.rate} onChange={e => setValues({ ...values, rate: e.target.value })} />
        <Input label="Nº de Parcelas" type="number" value={values.periods} onChange={e => setValues({ ...values, periods: e.target.value })} />
        <Button onClick={calculate}>Gerar Tabela Price</Button>
      </Sidebar>
      <ContentArea>
        <ResponsiveAdBlock />
        {result ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <ResultBox label="Parcela Mensal" value={MathUtils.formatCurrency(result.fixedPayment || 0)} highlight />
               <ResultBox label="Total de Juros" value={MathUtils.formatCurrency(result.totalInterest)} />
            </div>

            <div className="h-64 w-full bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
               <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase">Composição da Parcela</h4>
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.schedule} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#475569" strokeOpacity={0.2} />
                  <XAxis dataKey="period" tick={{fill: '#94a3b8'}} />
                  <YAxis hide />
                  <Tooltip formatter={(val: number) => MathUtils.formatNumber(val)} cursor={{fill: 'rgba(148, 163, 184, 0.1)'}} />
                  <Legend />
                  <Bar dataKey="interest" name="Juros" stackId="a" fill="#ef4444" />
                  <Bar dataKey="amortization" name="Amortização" stackId="a" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <DownloadButton onClick={handleDownload} />
            <AmortizationTable data={result} />
          </>
        ) : <div className="text-slate-400 dark:text-slate-500 text-center mt-10">Aguardando cálculo...</div>}
      </ContentArea>
    </CalculatorLayout>
  );
};

// 12. SAC
export const SACCalc: React.FC<Props> = ({ onBack }) => {
  const [values, setValues] = useState({ loan: '200000', rate: '1', periods: '60' });
  const [result, setResult] = useState<AmortizationResult | null>(null);

  const calculate = () => setResult(MathUtils.calcSAC(MathUtils.parse(values.loan), MathUtils.parse(values.rate), MathUtils.parse(values.periods)));

  const handleDownload = () => {
    if (!result) return;
    const csvData = result.schedule.map(row => ({
      Periodo: row.period,
      Parcela: row.payment.toFixed(2),
      Juros: row.interest.toFixed(2),
      Amortizacao: row.amortization.toFixed(2),
      SaldoDevedor: row.balance.toFixed(2)
    }));
    downloadCSV(csvData, 'tabela_sac');
  };

  return (
    <CalculatorLayout title="Sistema SAC (Amortização Constante)" onBack={onBack}>
      <Sidebar>
        <Input label="Valor do Empréstimo" type="number" value={values.loan} onChange={e => setValues({ ...values, loan: e.target.value })} />
        <Input label="Taxa de Juros (%)" type="number" value={values.rate} onChange={e => setValues({ ...values, rate: e.target.value })} />
        <Input label="Nº de Parcelas" type="number" value={values.periods} onChange={e => setValues({ ...values, periods: e.target.value })} />
        <Button onClick={calculate}>Gerar Tabela SAC</Button>
      </Sidebar>
      <ContentArea>
        <ResponsiveAdBlock />
        {result ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <ResultBox label="Primeira Parcela" value={MathUtils.formatCurrency(result.schedule[0].payment)} highlight />
               <ResultBox label="Última Parcela" value={MathUtils.formatCurrency(result.schedule[result.schedule.length - 1].payment)} />
            </div>

             <div className="h-64 w-full bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
               <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase">Evolução da Parcela (Decrescente)</h4>
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.schedule} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#475569" strokeOpacity={0.2} />
                  <XAxis dataKey="period" tick={{fill: '#94a3b8'}} />
                  <YAxis hide />
                  <Tooltip formatter={(val: number) => MathUtils.formatNumber(val)} cursor={{fill: 'rgba(148, 163, 184, 0.1)'}} />
                  <Legend />
                  <Bar dataKey="interest" name="Juros" stackId="a" fill="#ef4444" />
                  <Bar dataKey="amortization" name="Amortização" stackId="a" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <DownloadButton onClick={handleDownload} />
            <AmortizationTable data={result} />
          </>
        ) : <div className="text-slate-400 dark:text-slate-500 text-center mt-10">Aguardando cálculo...</div>}
      </ContentArea>
    </CalculatorLayout>
  );
};

// NEW: Combined Comparator Module (SAC vs PRICE)
export const AmortizationComparator: React.FC<Props> = ({ onBack }) => {
  const [values, setValues] = useState({
    propertyValue: '250000',
    downPayment: '50000',
    rate: '10',
    rateType: 'yearly' as 'yearly' | 'monthly',
    period: '20',
    periodType: 'years' as 'years' | 'months'
  });

  const [result, setResult] = useState<{
    price: AmortizationResult, 
    sac: AmortizationResult,
    loanAmount: number
  } | null>(null);

  useEffect(() => {
    calculate();
  }, []);

  const calculate = () => {
    const propVal = MathUtils.parse(values.propertyValue);
    const downVal = MathUtils.parse(values.downPayment);
    const loan = Math.max(0, propVal - downVal);

    // Convert Rate
    let rateVal = MathUtils.parse(values.rate);
    if (values.rateType === 'yearly') {
      // Equivalent monthly rate from yearly rate: (1 + i)^(1/12) - 1
      rateVal = (Math.pow(1 + rateVal / 100, 1 / 12) - 1) * 100;
    }

    // Convert Period
    let periodsVal = MathUtils.parse(values.period);
    if (values.periodType === 'years') {
      periodsVal = periodsVal * 12;
    }

    const res = MathUtils.calcAmortizationComparison(loan, rateVal, periodsVal);
    setResult({ ...res, loanAmount: loan });
  };

  // Prepare chart data combining both
  const chartData = result ? result.sac.schedule.map((sacRow, index) => ({
    period: sacRow.period,
    sacPayment: sacRow.payment,
    pricePayment: result.price.schedule[index]?.payment || 0
  })) : [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-5">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Calculator className="text-investor-600 dark:text-investor-400" size={24} />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Comparador SAC vs PRICE</h2>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
           <Info size={16} />
           <span>Simulação comparativa</span>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* SIDEBAR */}
        <div className="w-full xl:w-[350px] flex-shrink-0 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 p-6 h-fit transition-colors duration-300">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">Parâmetros do Financiamento</h3>
          
          <div className="flex flex-col gap-5">
            <Input 
              label="Valor do imóvel ou bem" 
              value={values.propertyValue} 
              onChange={e => setValues({...values, propertyValue: e.target.value})} 
            />
            
            <Input 
              label="Valor de entrada" 
              value={values.downPayment} 
              onChange={e => setValues({...values, downPayment: e.target.value})} 
            />

            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mb-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Valor a Financiar</span>
              <div className="text-lg font-bold text-investor-600 dark:text-investor-400">
                {MathUtils.formatCurrency(Math.max(0, MathUtils.parse(values.propertyValue) - MathUtils.parse(values.downPayment)))}
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input 
                  label="Taxa de juros %" 
                  value={values.rate} 
                  onChange={e => setValues({...values, rate: e.target.value})} 
                />
              </div>
              <div className="w-[130px]">
                <Select 
                  label="&nbsp;"
                  options={[{ label: 'ao ano', value: 'yearly' }, { label: 'ao mês', value: 'monthly' }]}
                  value={values.rateType}
                  onChange={e => setValues({...values, rateType: e.target.value as any})}
                />
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
              <div className="w-[130px]">
                <Select 
                  label="&nbsp;"
                  options={[{ label: 'em anos', value: 'years' }, { label: 'em meses', value: 'months' }]}
                  value={values.periodType}
                  onChange={e => setValues({...values, periodType: e.target.value as any})}
                />
              </div>
            </div>

            <Button onClick={calculate}>Comparar Sistemas</Button>
          </div>
        </div>

        {/* RESULTS */}
        <div className="flex-1 flex flex-col gap-6">
           
           <ResponsiveAdBlock />

           {result && (
             <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
               
               {/* SIDE-BY-SIDE SUMMARY CARDS */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* SAC SUMMARY */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border-t-4 border-t-blue-500 border-x border-b border-slate-100 dark:border-slate-700 overflow-hidden">
                      <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 border-b border-blue-100 dark:border-blue-800/50 flex justify-between items-center">
                        <span className="text-blue-700 dark:text-blue-300 font-bold">TABELA SAC</span>
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded uppercase">Parcelas Decrescentes</span>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                         <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Total Pago</span>
                            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{MathUtils.formatCurrency(result.sac.totalPaid)}</span>
                         </div>
                         <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Total Juros</span>
                            <span className="text-lg font-bold text-red-600 dark:text-red-400">{MathUtils.formatCurrency(result.sac.totalInterest)}</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="text-xs text-slate-400">Primeira Parcela</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">{MathUtils.formatCurrency(result.sac.schedule[0].payment)}</span>
                            </div>
                            <div className="text-slate-300">→</div>
                             <div className="flex flex-col text-right">
                              <span className="text-xs text-slate-400">Última Parcela</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">{MathUtils.formatCurrency(result.sac.schedule[result.sac.schedule.length-1].payment)}</span>
                            </div>
                         </div>
                      </div>
                  </div>

                  {/* PRICE SUMMARY */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border-t-4 border-t-purple-500 border-x border-b border-slate-100 dark:border-slate-700 overflow-hidden">
                      <div className="bg-purple-50 dark:bg-purple-900/20 px-6 py-3 border-b border-purple-100 dark:border-purple-800/50 flex justify-between items-center">
                        <span className="text-purple-700 dark:text-purple-300 font-bold">TABELA PRICE</span>
                        <span className="text-[10px] bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 px-2 py-0.5 rounded uppercase">Parcelas Fixas</span>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                         <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Total Pago</span>
                            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{MathUtils.formatCurrency(result.price.totalPaid)}</span>
                         </div>
                         <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Total Juros</span>
                            <span className="text-lg font-bold text-red-600 dark:text-red-400">{MathUtils.formatCurrency(result.price.totalInterest)}</span>
                         </div>
                         <div className="flex justify-between items-center pt-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Parcela Fixa</span>
                            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{MathUtils.formatCurrency(result.price.fixedPayment || 0)}</span>
                         </div>
                      </div>
                  </div>
               </div>

               {/* EVOLUTION CHART */}
               <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-100 dark:border-slate-700">
                  <h4 className="text-center text-sm font-bold text-slate-600 dark:text-slate-300 mb-6 uppercase">Evolução do valor das parcelas - em R$</h4>
                  <div className="h-72 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#475569" strokeOpacity={0.1} />
                           <XAxis dataKey="period" tick={{fill: '#94a3b8'}} minTickGap={30} />
                           <YAxis tick={{fill: '#94a3b8'}} tickFormatter={(val) => `R$${val}`} domain={['auto', 'auto']} />
                           <Tooltip 
                              formatter={(val: number) => MathUtils.formatCurrency(val)}
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                           />
                           <Legend verticalAlign="top" height={36} />
                           <Line type="monotone" dataKey="sacPayment" name="SAC (Decrescente)" stroke="#3b82f6" strokeWidth={3} dot={false} />
                           <Line type="monotone" dataKey="pricePayment" name="PRICE (Fixa)" stroke="#a855f7" strokeWidth={3} dot={false} />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* DETAILED TABLES SIDE-BY-SIDE */}
               <div>
                 <div className="flex justify-center mb-4">
                    <span className="text-slate-800 dark:text-slate-200 font-bold">Resultado detalhado</span>
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                       <div className="bg-blue-100 dark:bg-blue-900/30 py-2 text-center text-blue-800 dark:text-blue-300 font-bold text-sm">TABELA SAC</div>
                       <AmortizationTable data={result.sac} compact />
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                       <div className="bg-purple-100 dark:bg-purple-900/30 py-2 text-center text-purple-800 dark:text-purple-300 font-bold text-sm">TABELA PRICE</div>
                       <AmortizationTable data={result.price} compact />
                    </div>
                 </div>

                 {/* DISCLAIMER */}
                 <div className="mt-8 text-center max-w-4xl mx-auto p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed">
                      "Esta simulação não contempla a correção monetária do saldo devedor (geralmente feita pela TR ou IPCA). Lembre-se de que, no financiamento imobiliário, essa atualização ocorre além dos juros e pode alterar o valor final das parcelas."
                    </p>
                 </div>
               </div>

             </div>
           )}
        </div>
      </div>
    </div>
  );
};
