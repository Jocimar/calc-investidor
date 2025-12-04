import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { CalculatorLayout, Sidebar, ContentArea, Input, Button, ResultBox } from '../ui/Shared';
import * as MathUtils from '../../utils/financialMath';

interface Props {
  onBack: () => void;
}

type Mode = 'value' | 'proportion' | 'increase' | 'decrease';

const COLORS = ['#16a34a', '#e2e8f0', '#ef4444', '#3b82f6'];

export const PercentageCalculators: React.FC<Props> = ({ onBack }) => {
  const [mode, setMode] = useState<Mode>('value');
  
  // State for different modes
  const [valData, setValData] = useState({ total: '300', percent: '15' });
  const [propData, setPropData] = useState({ part: '300', total: '5000' });
  const [incData, setIncData] = useState({ value: '1500', percent: '10' });
  const [decData, setDecData] = useState({ original: '1500', final: '1000' });

  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    switch (mode) {
      case 'value':
        setResult(MathUtils.calcPercentValue(MathUtils.parse(valData.total), MathUtils.parse(valData.percent)));
        break;
      case 'proportion':
        setResult(MathUtils.calcPercentProportion(MathUtils.parse(propData.part), MathUtils.parse(propData.total)));
        break;
      case 'increase':
        setResult(MathUtils.calcPercentIncrease(MathUtils.parse(incData.value), MathUtils.parse(incData.percent)));
        break;
      case 'decrease':
        setResult(MathUtils.calcPercentRealDiscount(MathUtils.parse(decData.original), MathUtils.parse(decData.final)));
        break;
    }
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setResult(null);
  };

  const renderInputs = () => {
    switch (mode) {
      case 'value':
        return (
          <>
            <div className="bg-investor-50 p-4 rounded-lg border border-investor-100 mb-4 text-sm text-investor-800">
              Exemplo: <strong>15%</strong> de <strong>R$ 300</strong> é quanto?
            </div>
            <Input label="Porcentagem (%)" type="number" value={valData.percent} onChange={e => setValData({ ...valData, percent: e.target.value })} />
            <Input label="Valor Total (R$)" type="number" value={valData.total} onChange={e => setValData({ ...valData, total: e.target.value })} />
          </>
        );
      case 'proportion':
        return (
          <>
            <div className="bg-investor-50 p-4 rounded-lg border border-investor-100 mb-4 text-sm text-investor-800">
              Exemplo: <strong>R$ 300</strong> equivalem a quantos % de <strong>R$ 5.000</strong>?
            </div>
            <Input label="Valor da Parte (R$)" type="number" value={propData.part} onChange={e => setPropData({ ...propData, part: e.target.value })} />
            <Input label="Valor Total (R$)" type="number" value={propData.total} onChange={e => setPropData({ ...propData, total: e.target.value })} />
          </>
        );
      case 'increase':
        return (
          <>
            <div className="bg-investor-50 p-4 rounded-lg border border-investor-100 mb-4 text-sm text-investor-800">
              Exemplo: <strong>R$ 1.500</strong> com aumento de <strong>10%</strong>?
            </div>
            <Input label="Valor Inicial (R$)" type="number" value={incData.value} onChange={e => setIncData({ ...incData, value: e.target.value })} />
            <Input label="Percentual de Aumento (%)" type="number" value={incData.percent} onChange={e => setIncData({ ...incData, percent: e.target.value })} />
          </>
        );
      case 'decrease':
        return (
          <>
            <div className="bg-investor-50 p-4 rounded-lg border border-investor-100 mb-4 text-sm text-investor-800">
               Exemplo: Redução de <strong>R$ 1.500</strong> para <strong>R$ 1.000</strong>.
            </div>
            <Input label="Valor Original (R$)" type="number" value={decData.original} onChange={e => setDecData({ ...decData, original: e.target.value })} />
            <Input label="Valor Final (R$)" type="number" value={decData.final} onChange={e => setDecData({ ...decData, final: e.target.value })} />
          </>
        );
    }
  };

  const renderResults = () => {
    if (result === null) return <div className="text-slate-400 text-center mt-10">Preencha os dados e clique em calcular.</div>;

    switch (mode) {
      case 'value':
        const pieDataVal = [
          { name: 'Resultado', value: result },
          { name: 'Restante', value: MathUtils.parse(valData.total) - result }
        ];
        return (
          <>
            <ResultBox label={`Quanto é ${valData.percent}% de ${MathUtils.formatCurrency(MathUtils.parse(valData.total))}?`} value={MathUtils.formatCurrency(result)} highlight />
            <div className="h-64 mt-6">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieDataVal} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                    <Cell fill={COLORS[0]} />
                    <Cell fill={COLORS[1]} />
                  </Pie>
                  <Tooltip formatter={(val: number) => MathUtils.formatCurrency(val)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        );
      case 'proportion':
         const pieDataProp = [
          { name: 'Parte', value: MathUtils.parse(propData.part) },
          { name: 'Restante', value: MathUtils.parse(propData.total) - MathUtils.parse(propData.part) }
        ];
        return (
          <>
            <ResultBox label="Representatividade" value={MathUtils.formatPercent(result)} highlight />
            <div className="h-64 mt-6">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieDataProp} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                    <Cell fill={COLORS[3]} />
                    <Cell fill={COLORS[1]} />
                  </Pie>
                  <Tooltip formatter={(val: number) => MathUtils.formatCurrency(val)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        );
      case 'increase':
        const barDataInc = [
          { name: 'Inicial', valor: MathUtils.parse(incData.value) },
          { name: 'Aumento', valor: result.increase },
          { name: 'Final', valor: result.total },
        ];
        return (
          <>
             <div className="grid grid-cols-2 gap-4">
               <ResultBox label="Valor do Aumento" value={MathUtils.formatCurrency(result.increase)} />
               <ResultBox label="Valor Final" value={MathUtils.formatCurrency(result.total)} highlight />
             </div>
             <div className="h-64 mt-6 bg-slate-50 rounded-xl p-4">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={barDataInc}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(val: number) => MathUtils.formatCurrency(val)} />
                    <Bar dataKey="valor" fill="#16a34a" />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </>
        );
      case 'decrease':
        const barDataDec = [
          { name: 'Original', valor: MathUtils.parse(decData.original) },
          { name: 'Desconto', valor: result.discountValue },
          { name: 'Final', valor: MathUtils.parse(decData.final) },
        ];
        return (
           <>
             <div className="grid grid-cols-2 gap-4">
               <ResultBox label="Desconto (%)" value={MathUtils.formatPercent(result.discountPercent)} highlight />
               <ResultBox label="Valor Economizado" value={MathUtils.formatCurrency(result.discountValue)} />
             </div>
              <div className="h-64 mt-6 bg-slate-50 rounded-xl p-4">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={barDataDec}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(val: number) => MathUtils.formatCurrency(val)} />
                    <Bar dataKey="valor" fill="#ef4444" />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </>
        );
    }
  };

  return (
    <CalculatorLayout title="Calculadoras de Porcentagem" onBack={onBack}>
      <Sidebar>
        <div className="mb-6">
          <label className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2 block">Selecione o Cálculo</label>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => handleModeChange('value')}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${mode === 'value' ? 'bg-investor-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              % de um Valor
            </button>
            <button 
               onClick={() => handleModeChange('proportion')}
               className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${mode === 'proportion' ? 'bg-investor-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              Proporção (%)
            </button>
            <button 
               onClick={() => handleModeChange('increase')}
               className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${mode === 'increase' ? 'bg-investor-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              Aumento Percentual
            </button>
            <button 
               onClick={() => handleModeChange('decrease')}
               className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${mode === 'decrease' ? 'bg-investor-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              Desconto / Redução
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
           {renderInputs()}
           <Button onClick={calculate}>Calcular</Button>
        </div>
      </Sidebar>
      <ContentArea>
        {renderResults()}
      </ContentArea>
    </CalculatorLayout>
  );
};