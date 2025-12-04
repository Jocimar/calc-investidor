import { AmortizationResult, AnnuityType } from '../types';

// Helper to handle parsing inputs safely
export const parse = (val: string): number => {
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
};

export interface TimeSeriesData {
  period: number;
  invested: number;
  interest: number;
  total: number;
  monthlyInterest?: number; // Added for detailed table
  totalInterest?: number;   // Added for detailed table
}

// 1. Simple Interest
export const calcSimpleInterest = (
  capital: number, 
  monthlyContribution: number,
  rate: number, 
  rateType: 'yearly' | 'monthly',
  period: number, 
  periodType: 'years' | 'months'
) => {
  // Normalize to months for calculation and schedule
  const totalMonths = periodType === 'years' ? period * 12 : period;
  // Simple interest rate per month. 
  // If rate is yearly, monthly rate is rate / 12.
  const monthlyRateVal = rateType === 'yearly' ? (rate / 12) : rate;
  const r = monthlyRateVal / 100;
  
  const schedule: TimeSeriesData[] = [];
  
  let currentInvested = capital;
  let totalInterest = 0;

  // Month 0
  schedule.push({
    period: 0,
    invested: capital,
    interest: 0,
    monthlyInterest: 0,
    totalInterest: 0,
    total: capital
  });

  for (let i = 1; i <= totalMonths; i++) {
    // Interest is calculated on the principal invested so far (not including previous interest)
    const currentMonthlyInterest = currentInvested * r;
    
    totalInterest += currentMonthlyInterest;
    currentInvested += monthlyContribution;
    
    schedule.push({
      period: i,
      invested: currentInvested,
      interest: totalInterest, // accumulated interest for chart
      monthlyInterest: currentMonthlyInterest,
      totalInterest: totalInterest,
      total: currentInvested + totalInterest
    });
  }

  const finalTotal = currentInvested + totalInterest;

  return { 
    interest: totalInterest, 
    total: finalTotal, 
    invested: currentInvested,
    schedule 
  };
};

// 2. Compound Interest (Advanced)
export const calcCompoundInterest = (
  principal: number,
  monthlyContribution: number,
  rate: number,
  rateType: 'yearly' | 'monthly',
  period: number,
  periodType: 'years' | 'months'
) => {
  // Convert time to months
  const totalMonths = periodType === 'years' ? period * 12 : period;
  
  // Convert rate to monthly equivalent
  // If rate is yearly, effective monthly rate = (1 + r)^(1/12) - 1
  // If rate is monthly, effective monthly rate = r
  const r = rate / 100;
  const monthlyRate = rateType === 'yearly' ? Math.pow(1 + r, 1 / 12) - 1 : r;

  let currentBalance = principal;
  let totalInvested = principal;
  
  const schedule: TimeSeriesData[] = [];

  // Initial state (Month 0)
  schedule.push({
    period: 0,
    invested: principal,
    interest: 0,
    monthlyInterest: 0,
    totalInterest: 0,
    total: principal
  });

  for (let i = 1; i <= totalMonths; i++) {
    const interestGain = currentBalance * monthlyRate;
    currentBalance += interestGain + monthlyContribution;
    totalInvested += monthlyContribution;

    schedule.push({
      period: i,
      invested: totalInvested,
      interest: interestGain, // This frame represents accumulated interest in graph usually, but here storing monthly gain logic
      monthlyInterest: interestGain,
      totalInterest: currentBalance - totalInvested,
      total: currentBalance
    });
  }

  const finalTotal = currentBalance;
  const finalInvested = totalInvested;
  const finalInterest = finalTotal - finalInvested;

  return {
    total: finalTotal,
    invested: finalInvested,
    interest: finalInterest,
    schedule
  };
};

// 3. Future Value (FV)
export const calcFV = (pv: number, rate: number, periods: number) => {
  return pv * Math.pow(1 + rate / 100, periods);
};

// 4. Present Value (PV)
export const calcPV = (fv: number, rate: number, periods: number) => {
  return fv / Math.pow(1 + rate / 100, periods);
};

// 5. Annuity FV
export const calcAnnuityFV = (pmt: number, rate: number, periods: number, type: AnnuityType) => {
  const r = rate / 100;
  if (r === 0) return pmt * periods;
  let fv = pmt * ((Math.pow(1 + r, periods) - 1) / r);
  if (type === AnnuityType.PRE) {
    fv *= (1 + r);
  }
  return fv;
};

// 6. Annuity PV
export const calcAnnuityPV = (pmt: number, rate: number, periods: number, type: AnnuityType) => {
  const r = rate / 100;
  if (r === 0) return pmt * periods;
  let pv = pmt * ((1 - Math.pow(1 + r, -periods)) / r);
  if (type === AnnuityType.PRE) {
    pv *= (1 + r);
  }
  return pv;
};

// 7. CAGR
export const calcCAGR = (start: number, end: number, years: number) => {
  if (start === 0 || years === 0) return 0;
  return (Math.pow(end / start, 1 / years) - 1) * 100;
};

// 8. ROI
export const calcROI = (start: number, end: number) => {
  if (start === 0) return 0;
  return ((end - start) / start) * 100;
};

// 9. NPV
export const calcNPV = (rate: number, flows: number[]) => {
  const r = rate / 100;
  const result = flows.reduce((acc, curr, t) => acc + curr / Math.pow(1 + r, t), 0);
  
  // Generate chart data for NPV (Cumulative and Flow)
  const chartData = flows.map((flow, t) => {
      const discounted = flow / Math.pow(1 + r, t);
      return {
          period: t,
          flow: flow,
          discounted: discounted
      };
  });

  return { npv: result, chartData };
};

// 10. IRR (Newton-Raphson approximation)
export const calcIRR = (flows: number[], guess = 0.1): number => {
  const maxIter = 1000;
  const precision = 0.00001;
  let r = guess;

  for (let i = 0; i < maxIter; i++) {
    let npv = 0;
    let dNpv = 0; // Derivative of NPV

    for (let t = 0; t < flows.length; t++) {
      const num = flows[t];
      const denom = Math.pow(1 + r, t);
      npv += num / denom;
      dNpv -= (t * num) / (denom * (1 + r));
    }

    if (Math.abs(npv) < precision) return r * 100;

    const newR = r - npv / dNpv;
    if (Math.abs(newR - r) < precision) return newR * 100;
    r = newR;
  }
  return 0; // Failed to converge
};

// 11. Price Amortization
export const calcPrice = (loan: number, rate: number, periods: number): AmortizationResult => {
  const r = rate / 100;
  const pmt = r === 0 ? loan / periods : loan * ((r * Math.pow(1 + r, periods)) / (Math.pow(1 + r, periods) - 1));
  
  const schedule = [];
  let balance = loan;
  let totalInterest = 0;

  for (let i = 1; i <= periods; i++) {
    const interest = balance * r;
    const amortization = pmt - interest;
    balance -= amortization;
    
    // Fix floating point dust
    if (balance < 0.01) balance = 0;

    totalInterest += interest;
    schedule.push({
      period: i,
      payment: pmt,
      interest,
      amortization,
      balance
    });
  }

  return {
    fixedPayment: pmt,
    totalInterest,
    totalPaid: pmt * periods,
    schedule
  };
};

// 12. SAC Amortization
export const calcSAC = (loan: number, rate: number, periods: number): AmortizationResult => {
  const r = rate / 100;
  const amortization = loan / periods;
  
  const schedule = [];
  let balance = loan;
  let totalInterest = 0;
  let totalPaid = 0;

  for (let i = 1; i <= periods; i++) {
    const interest = balance * r;
    const payment = amortization + interest;
    balance -= amortization;
    
    if (balance < 0.01) balance = 0;

    totalInterest += interest;
    totalPaid += payment;

    schedule.push({
      period: i,
      payment,
      interest,
      amortization,
      balance
    });
  }

  return {
    fixedAmortization: amortization,
    totalInterest,
    totalPaid,
    schedule
  };
};

// 13. Inflation Adjustment
export const calcInflation = (value: number, rate: number, periods: number) => {
  return value * Math.pow(1 + rate / 100, periods);
};

// 14. Depreciation
export const calcDepreciation = (cost: number, residual: number, life: number) => {
  if (life === 0) return 0;
  return (cost - residual) / life;
};

// --- NEW: Percentage Calculators ---

// 15. Percentage Value (X% of Y)
export const calcPercentValue = (total: number, percent: number) => {
  return total * (percent / 100);
};

// 16. Proportion (X is what % of Y)
export const calcPercentProportion = (part: number, total: number) => {
  if (total === 0) return 0;
  return (part / total) * 100;
};

// 17. Increase (Value + X%)
export const calcPercentIncrease = (value: number, percent: number) => {
  const increase = value * (percent / 100);
  return {
    increase,
    total: value + increase
  };
};

// 18. Decrease (Original -> Final, find discount)
export const calcPercentRealDiscount = (original: number, current: number) => {
  const discountValue = original - current;
  const discountPercent = original === 0 ? 0 : (discountValue / original) * 100;
  return {
    discountValue,
    discountPercent
  };
};

// Formatters
export const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
export const formatPercent = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val / 100);
export const formatNumber = (val: number) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(val);