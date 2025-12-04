export interface AmortizationRow {
  period: number;
  payment: number;
  interest: number;
  amortization: number;
  balance: number;
}

export interface AmortizationResult {
  fixedPayment?: number;
  fixedAmortization?: number;
  totalInterest: number;
  totalPaid: number;
  schedule: AmortizationRow[];
}

export enum AnnuityType {
  POST = 'post', // Post-fixed (end of period)
  PRE = 'pre',   // Pre-fixed (beginning of period)
}

export interface CalculatorProps {
  id: string;
}