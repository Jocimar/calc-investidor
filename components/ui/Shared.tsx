import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Share2, Check, Copy, Download } from 'lucide-react';

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
      className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col transition-all hover:scale-[1.02] hover:shadow-xl cursor-pointer h-full"
    >
      <div className="p-6 bg-gradient-to-r from-investor-50 to-white dark:from-slate-800 dark:to-slate-800 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <h3 className="text-lg font-bold text-investor-800 dark:text-investor-400">{title}</h3>
        {icon && <div className="text-investor-600 dark:text-investor-400 bg-white dark:bg-slate-700 p-2 rounded-lg shadow-sm">{icon}</div>}
      </div>
      <div className="p-6 flex-1 bg-white dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
        <div className="mt-4 text-investor-600 dark:text-investor-400 text-sm font-semibold flex items-center group">
          Acessar Calculadora <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </div>
  );
};

interface AdProps {
  className?: string;
  slot?: string;
  format?: string;
  responsive?: string;
  style?: React.CSSProperties;
}

export const AdPlaceholder: React.FC<AdProps> = ({ 
  className, 
  slot = "3124751542", // Default generic slot
  format = "auto",
  responsive = "true",
  style = { display: 'block', width: '100%' }
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Check if element is visible and has width before requesting ad
    // This prevents "No slot size for availableWidth=0" error
    const attemptLoad = () => {
       if (adRef.current && adRef.current.offsetWidth > 0) {
          try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (e) {
            console.error("AdSense Error:", e);
          }
       }
    };

    // Add a delay to ensure the container has a calculated width
    const timer = setTimeout(attemptLoad, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex items-center justify-center bg-slate-50 dark:bg-slate-900 overflow-hidden ${className}`}>
      <ins ref={adRef}
           className="adsbygoogle"
           style={style}
           data-ad-client="ca-pub-2924325515288163"
           data-ad-slot={slot}
           data-ad-format={format}
           data-full-width-responsive={responsive}></ins>
    </div>
  );
};

export const ResponsiveAdBlock: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Use matchMedia to detect desktop size (md breakpoint is usually 768px in tailwind)
    const media = window.matchMedia("(min-width: 768px)");
    
    // Set initial state
    setIsDesktop(media.matches);

    // Listener for resize
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    media.addEventListener("change", listener);
    
    return () => media.removeEventListener("change", listener);
  }, []);

  if (!mounted) return <div className="w-full h-[90px] bg-slate-50/50 dark:bg-slate-900/50" />;

  return (
    <div className="w-full my-6 flex justify-center items-center bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg py-4 overflow-hidden">
      {isDesktop ? (
        /* Desktop: Fixed 728x90 */
        <div className="w-[728px] h-[90px] bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mx-auto">
             <AdPlaceholder 
                key="desktop-ad"
                slot="9775572766" 
                style={{ display: 'inline-block', width: '728px', height: '90px' }}
                format=""
                responsive="false"
             />
        </div>
      ) : (
        /* Mobile: Rectangle */
        <div className="w-full px-4 flex justify-center">
           <AdPlaceholder 
              key="mobile-ad"
              slot="3124751542" 
              format="rectangle" 
              responsive="true"
              style={{ display: 'block', width: '100%', minHeight: '250px' }}
           />
        </div>
      )}
    </div>
  );
};

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
          className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-investor-600 dark:hover:text-investor-400 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <div className="flex flex-col xl:flex-row min-h-[600px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full xl:w-[400px] flex-shrink-0 bg-slate-50 dark:bg-slate-800/50 p-6 lg:p-8 border-b xl:border-b-0 xl:border-r border-slate-200 dark:border-slate-700 flex flex-col justify-between transition-colors duration-300">
    <div className="flex flex-col gap-5">
      <h3 className="text-sm uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-2">Parâmetros</h3>
      {children}
    </div>
  </div>
);

export const ContentArea: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full xl:flex-1 p-6 lg:p-8 flex flex-col gap-6 bg-white dark:bg-slate-800 min-w-0 transition-colors duration-300">
    {children}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-investor-500 focus:border-transparent transition-all text-slate-800 dark:text-slate-100 shadow-sm bg-white dark:bg-slate-700 dark:placeholder-slate-400"
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
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      <select
        {...props}
        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-investor-500 bg-white dark:bg-slate-700 transition-all text-slate-800 dark:text-slate-100 shadow-sm"
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
      className="w-full mt-4 py-3.5 px-6 bg-investor-600 hover:bg-investor-700 text-white font-bold rounded-lg shadow-lg hover:shadow-investor-200/50 dark:hover:shadow-investor-900/50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-investor-500 active:scale-[0.98]"
    >
      {children}
    </button>
  );
};

export const ResultBox: React.FC<{ label: string; value: string | number; subValue?: string | number; highlight?: boolean }> = ({ label, value, subValue, highlight }) => {
  return (
    <div className={`p-5 rounded-xl border ${
      highlight 
        ? 'bg-investor-50 dark:bg-investor-900/20 border-investor-200 dark:border-investor-800' 
        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'
    } transition-colors duration-300`}>
      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-investor-700 dark:text-investor-400' : 'text-slate-800 dark:text-slate-100'}`}>{value}</p>
      {subValue && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{subValue}</p>}
    </div>
  );
};

export const ShareButton: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'CALC INVESTIDOR',
      text: 'Confira estas calculadoras financeiras gratuitas e completas!',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled, ignore
      }
    } else {
      // Fallback for desktop browsers
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy');
      }
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="fixed bottom-6 right-6 z-50 bg-investor-600 hover:bg-investor-700 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Compartilhar"
        title="Compartilhar Calculadora"
      >
        {copied ? (
          <Check size={24} className="animate-in zoom-in duration-300" />
        ) : (
          <Share2 size={24} className="group-hover:-rotate-12 transition-transform duration-300" />
        )}
      </button>
      
      {/* Toast Notification */}
      {copied && (
        <div className="fixed bottom-24 right-6 z-50 bg-slate-800 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center gap-2">
           <Copy size={14} /> Link copiado!
        </div>
      )}
    </>
  );
};

export const downloadCSV = (data: any[], filename: string) => {
  if (!data || !data.length) return;

  const separator = ';';
  const keys = Object.keys(data[0]);
  
  const csvContent = [
    keys.join(separator),
    ...data.map(row => keys.map(key => {
        const val = row[key];
        return typeof val === 'string' && val.includes(separator) ? `"${val}"` : val;
    }).join(separator))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const DownloadButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button
      {...props}
      className="flex items-center justify-center gap-2 w-full mt-4 py-2.5 px-4 bg-white dark:bg-slate-800 text-investor-600 dark:text-investor-400 font-semibold border border-investor-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
    >
      <Download size={16} />
      Baixar Tabela (CSV)
    </button>
  );
};
