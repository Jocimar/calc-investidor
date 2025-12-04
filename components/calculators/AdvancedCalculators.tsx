import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { CalculatorLayout, Sidebar, ContentArea, Input, Button, ResultBox, Select, ResponsiveAdBlock } from '../ui/Shared';
import * as MathUtils from '../../utils/financialMath';
import { AnnuityType } from '../../types';

interface Props {
  onBack: () => void;
}

// 5. Anuidade FV
export const AnnuityFVCalc: React.FC<Props> = ({ onBack }) => {
  const [values, setValues] = useState({ pmt: '500', rate: '0.8', periods: '36', type: AnnuityType.POST });
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => setResult(MathUtils.calcAnnuityFV(MathUtils.parse(values.pmt), MathUtils.parse(values.rate), MathUtils.parse(values.periods), values.type));

  return (
    <CalculatorLayout title="Anuidade: Valor Futuro (FV)" onBack={onBack}>
      <Sidebar>
        <Input label="Pagamento Periódico (PMT)" type="number" value={values.pmt} onChange={e => setValues({ ...values, pmt: e.target.value })} />
        <Input label="Taxa por Período (%)" type="number" value={values.rate} onChange={e => setValues({ ...values, rate: e.target.value })} />
        <Input label="Número de Períodos" type="number" value={values.periods} onChange={e => setValues({ ...values, periods: e.target.value })} />
        <Select 
          label="Tipo de Pagamento" 
          options={[{ label: 'Postecipado (fim do mês)', value: AnnuityType.POST }, { label: 'Antecipado (início do mês)', value: AnnuityType.PRE }]}
          value={values.type}
          onChange={e => setValues({...values, type: e.target.value as AnnuityType})}
        />
        <Button onClick={calculate}>Calcular</Button>
      </Sidebar>
      <ContentArea>
        <ResponsiveAdBlock />
        {result !== null ? (
          <ResultBox label="Valor Acumulado (FV)" value={MathUtils.formatCurrency(result)} highlight />
        ) : <div className="text-slate-400 text-center mt-10">Aguardando cálculo...</div>}
      </ContentArea>
    </CalculatorLayout>
  );
};

// 6. Anuidade PV
export const AnnuityPVCalc: React.FC<Props> = ({ onBack }) => {
  const [values, setValues] = useState({ pmt: '1000', rate: '1', periods: '12', type: AnnuityType.POST });
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => setResult(MathUtils.calcAnnuityPV(MathUtils.parse(values.pmt), MathUtils.parse(values.rate), MathUtils.parse(values.periods), values.type));

  return (
    <CalculatorLayout title="Anuidade: Valor Presente (PV)" onBack={onBack}>
      <Sidebar>
        <Input label="Pagamento Periódico (PMT)" type="number" value={values.pmt} onChange={e => setValues({ ...values, pmt: e.target.value })} />
        <Input label="Taxa por Período (%)" type="number" value={values.rate} onChange={e => setValues({ ...values, rate: e.target.value })} />
        <Input label="Número de Períodos" type="number" value={values.periods} onChange={e => setValues({ ...values, periods: e.target.value })} />
        <Select 
          label="Tipo de Pagamento" 
          options={[{ label: 'Postecipado (fim do mês)', value: AnnuityType.POST }, { label: 'Antecipado (início do mês)', value: AnnuityType.PRE }]}
          value={values.type}
          onChange={e => setValues({...values, type: e.target.value as AnnuityType})}
        />
        <Button onClick={calculate}>Calcular</Button>
      </Sidebar>
      <ContentArea>
        <ResponsiveAdBlock />
        {result !== null ? (
          <ResultBox label="Valor Presente da Série" value={MathUtils.formatCurrency(result)} highlight />
        ) : <div className="text-slate-400 text-center mt-10">Aguardando cálculo...</div>}
      </ContentArea>
    </CalculatorLayout>
  );
};

// 9. NPV
export const NPVCalc: React.FC<Props> = ({ onBack }) => {
  const [rate, setRate] = useState('10');
  const [flows, setFlows] = useState('-1000, 200, 300, 400, 500');
  const [result, setResult] = useState<{npv: number, chartData: any[]} | null>(null);

  const calculate = () => {
    const flowArray = flows.split(',').map(f => parseFloat(f.trim())).filter(n => !isNaN(n));
    setResult(MathUtils.calcNPV(MathUtils.parse(rate), flowArray));
  };

  return (
    <CalculatorLayout title="VPL / NPV (Valor Presente Líquido)" onBack={onBack}>
      <Sidebar>
        <Input label="Taxa de Desconto / TMA (%)" type="number" value={rate} onChange={e => setRate(e.target.value)} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Fluxos de Caixa</label>
          <textarea
            value={flows}
            onChange={e => setFlows(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-investor-500 shadow-sm h-32 bg-white text-slate-800"
            placeholder="-1000, 200, 300..."
          />
          <p className="text-xs text-slate-500">Separe os valores por vírgula. Comece com o investimento (negativo).</p>
        </div>
        <Button onClick={calculate}>Calcular VPL</Button>
      </Sidebar>
      <ContentArea>
        <ResponsiveAdBlock />
        {result ? (
          <>
            <ResultBox 
              label="VPL (NPV)" 
              value={MathUtils.formatCurrency(result.npv)} 
              highlight 
            />
            <div className={`mt-2 font-bold ${result.npv >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {result.npv >= 0 ? 'Investimento Viável' : 'Investimento Inviável'}
            </div>

            <div className="h-64 w-full mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
               <h4 className="text-sm font-bold text-slate-500 mb-2 uppercase">Fluxo de Caixa (Nominal vs Descontado)</h4>
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <ReferenceLine y={0} stroke="#000" />
                  <XAxis dataKey="period" />
                  <YAxis hide />
                  <Tooltip formatter={(val: number) => MathUtils.formatCurrency(val)} />
                  <Bar dataKey="flow" name="Nominal" fill="#94a3b8" />
                  <Bar dataKey="discounted" name="Descontado (VP)" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : <div className="text-slate-400 text-center mt-10">Aguardando cálculo...</div>}
      </ContentArea>
    </CalculatorLayout>
  );
};

// 10. IRR
export const IRRCalc: React.FC<Props> = ({ onBack }) => {
  const [flows, setFlows] = useState('-1000, 200, 300, 400, 500');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const flowArray = flows.split(',').map(f => parseFloat(f.trim())).filter(n => !isNaN(n));
    setResult(MathUtils.calcIRR(flowArray));
  };

  return (
    <CalculatorLayout title="TIR / IRR (Taxa Interna de Retorno)" onBack={onBack}>
      <Sidebar>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Fluxos de Caixa</label>
          <textarea
            value={flows}
            onChange={e => setFlows(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-investor-500 shadow-sm h-32 bg-white text-slate-800"
            placeholder="-1000, 200, 300..."
          />
           <p className="text-xs text-slate-500">Separe os valores por vírgula. Comece com o investimento (negativo).</p>
        </div>
        <Button onClick={calculate}>Calcular TIR</Button>
      </Sidebar>
      <ContentArea>
        <ResponsiveAdBlock />
        {result !== null ? (
          <ResultBox label="Taxa Interna de Retorno" value={MathUtils.formatPercent(result)} highlight />
        ) : <div className="text-slate-400 text-center mt-10">Aguardando cálculo...</div>}
      </ContentArea>
    </CalculatorLayout>
  );
};