import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface CardProps {
  title: string;
  description: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, description, onClick, icon }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden flex flex-col transition-all hover:scale-[1.02] hover:shadow-xl cursor-pointer h-full"
    >
      <div className="p-6 bg-gradient-to-r from-investor-50 to-white border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-investor-800">{title}</h3>
        {icon && <div className="text-investor-600 bg-white p-2 rounded-lg shadow-sm">{icon}</div>}
      </div>
      <div className="p-6 flex-1 bg-white">
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
        <div className="mt-4 text-investor-600 text-sm font-semibold flex items-center group">
          Acessar Calculadora <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </div>
  );
};

export const AdPlaceholder: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 p-4 transition-all hover:bg-slate-100 hover:border-slate-300 select-none ${className}`}>
    <span className="text-xs uppercase tracking-widest font-bold">Publicidade</span>
  </div>
);

export const CalculatorLayout: React.FC<{ 
  title: string; 
  onBack: () => void; 
  children: React.ReactNode 
}> = ({ title, onBack, children }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-investor-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      </div>
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full lg:w-1/3 bg-slate-50 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between">
    <div className="flex flex-col gap-5">
      <h3 className="text-sm uppercase tracking-wider font-bold text-slate-500 mb-2">Parâmetros</h3>
      {children}
    </div>
    
    <div className="mt-10 pt-8 border-t border-slate-200">
      <AdPlaceholder className="w-full h-[280px]" />
    </div>
  </div>
);

export const ContentArea: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full lg:w-2/3 p-6 lg:p-8 flex flex-col gap-6 bg-white">
    <AdPlaceholder className="w-full h-[100px]" />
    {children}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-investor-500 focus:border-transparent transition-all text-slate-800 shadow-sm bg-white"
      />
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <select
        {...props}
        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-investor-500 bg-white transition-all text-slate-800 shadow-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="w-full mt-4 py-3.5 px-6 bg-investor-600 hover:bg-investor-700 text-white font-bold rounded-lg shadow-lg hover:shadow-investor-200/50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-investor-500 active:scale-[0.98]"
    >
      {children}
    </button>
  );
};

export const ResultBox: React.FC<{ label: string; value: string | number; subValue?: string | number; highlight?: boolean }> = ({ label, value, subValue, highlight }) => {
  return (
    <div className={`p-5 rounded-xl border ${highlight ? 'bg-investor-50 border-investor-200' : 'bg-slate-50 border-slate-100'}`}>
      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-investor-700' : 'text-slate-800'}`}>{value}</p>
      {subValue && <p className="text-sm text-slate-600 mt-1">{subValue}</p>}
    </div>
  );
};