import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalculatorLayout, Sidebar, ContentArea, Input, Button, ResultBox, ResponsiveAdBlock } from '../ui/Shared';
import * as MathUtils from '../../utils/financialMath';
import { AmortizationResult } from '../../types';

interface AmortizationTableProps {
  data: AmortizationResult;
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({ data }) => {
  return (
    <div className="mt-6 border rounded-lg overflow-hidden border-slate-200">
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
            <tr>
              <th className="px-4 py-3 bg-slate-100">#</th>
              <th className="px-4 py-3 bg-slate-100">Parcela</th>
              <th className="px-4 py-3 bg-slate-100">Juros</th>
              <th className="px-4 py-3 bg-slate-100">Amortização</th>
              <th className="px-4 py-3 bg-slate-100">Saldo Devedor</th>
            </tr>
          </thead>
          <tbody>
            {data.schedule.map((row) => (
              <tr key={row.period} className="bg-white border-b hover:bg-slate-50">
                <td className="px-4 py-2 font-medium">{row.period}</td>
                <td className="px-4 py-2">{MathUtils.formatNumber(row.payment)}</td>
                <td className="px-4 py-2 text-red-600">{MathUtils.formatNumber(row.interest)}</td>
                <td className="px-4 py-2 text-emerald-600">{MathUtils.formatNumber(row.amortization)}</td>
                <td className="px-4 py-2 font-bold">{MathUtils.formatNumber(row.balance)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-200 font-bold sticky bottom-0">
            <tr>
              <td className="px-4 py-3">TOTAL</td>
              <td className="px-4 py-3">{MathUtils.formatNumber(data.totalPaid)}</td>
              <td className="px-4 py-3 text-red-700">{MathUtils.formatNumber(data.totalInterest)}</td>
              <td className="px-4 py-3 text-emerald-700">{MathUtils.formatNumber(data.totalPaid - data.totalInterest)}</td>
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

// 11. PRICE
export const PriceCalc: React.FC<Props> = ({ onBack }) => {
  const [values, setValues] = useState({ loan: '200000', rate: '1', periods: '60' });
  const [result, setResult] = useState<AmortizationResult | null>(null);

  const calculate = () => setResult(MathUtils.calcPrice(MathUtils.parse(values.loan), MathUtils.parse(values.rate), MathUtils.parse(values.periods)));

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

            <div className="h-64 w-full bg-slate-50 p-4 rounded-xl border border-slate-100">
               <h4 className="text-sm font-bold text-slate-500 mb-2 uppercase">Composição da Parcela</h4>
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.schedule} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="period" />
                  <YAxis hide />
                  <Tooltip formatter={(val: number) => MathUtils.formatNumber(val)} />
                  <Legend />
                  <Bar dataKey="interest" name="Juros" stackId="a" fill="#ef4444" />
                  <Bar dataKey="amortization" name="Amortização" stackId="a" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <AmortizationTable data={result} />
          </>
        ) : <div className="text-slate-400 text-center mt-10">Aguardando cálculo...</div>}
      </ContentArea>
    </CalculatorLayout>
  );
};

// 12. SAC
export const SACCalc: React.FC<Props> = ({ onBack }) => {
  const [values, setValues] = useState({ loan: '200000', rate: '1', periods: '60' });
  const [result, setResult] = useState<AmortizationResult | null>(null);

  const calculate = () => setResult(MathUtils.calcSAC(MathUtils.parse(values.loan), MathUtils.parse(values.rate), MathUtils.parse(values.periods)));

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

             <div className="h-64 w-full bg-slate-50 p-4 rounded-xl border border-slate-100">
               <h4 className="text-sm font-bold text-slate-500 mb-2 uppercase">Evolução da Parcela (Decrescente)</h4>
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.schedule} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="period" />
                  <YAxis hide />
                  <Tooltip formatter={(val: number) => MathUtils.formatNumber(val)} />
                  <Legend />
                  <Bar dataKey="interest" name="Juros" stackId="a" fill="#ef4444" />
                  <Bar dataKey="amortization" name="Amortização" stackId="a" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <AmortizationTable data={result} />
          </>
        ) : <div className="text-slate-400 text-center mt-10">Aguardando cálculo...</div>}
      </ContentArea>
    </CalculatorLayout>
  );
};