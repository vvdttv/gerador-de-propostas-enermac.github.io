// Cálculos de indicadores financeiros - TIR, VPL, Payback
// Metodologia EVTF Enermac

import { CashFlowYear, ProjectedCashFlow, ExpandedFinancialConfig, DetailedOpex } from '@/types/expandedProposal';

interface FinancialIndicatorsInput {
  totalInvestment: number;
  ownCapital: number;
  financedAmount: number;
  annualSavings: number;
  annualRevenue: number;
  annualTaxes: number;
  opex: DetailedOpex;
  financialConfig: ExpandedFinancialConfig;
  projectionYears?: number;
}

/**
 * Calcula a Taxa Interna de Retorno (TIR) usando método de Newton-Raphson
 */
export function calculateIRR(cashFlows: number[], guess: number = 0.1): number {
  const maxIterations = 100;
  const tolerance = 0.0001;
  
  let rate = guess;
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivativeNpv = 0;
    
    for (let t = 0; t < cashFlows.length; t++) {
      const discountFactor = Math.pow(1 + rate, t);
      npv += cashFlows[t] / discountFactor;
      if (t > 0) {
        derivativeNpv -= t * cashFlows[t] / Math.pow(1 + rate, t + 1);
      }
    }
    
    if (Math.abs(npv) < tolerance) {
      return rate * 100; // Retorna como porcentagem
    }
    
    if (derivativeNpv === 0) {
      break;
    }
    
    rate = rate - npv / derivativeNpv;
  }
  
  // Se não convergiu, tenta método de bisseção
  return calculateIRRBisection(cashFlows);
}

/**
 * Calcula TIR usando método de bisseção (mais robusto)
 */
function calculateIRRBisection(cashFlows: number[]): number {
  let low = -0.99;
  let high = 10.0;
  const tolerance = 0.0001;
  const maxIterations = 100;
  
  const npv = (rate: number): number => {
    let sum = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      sum += cashFlows[t] / Math.pow(1 + rate, t);
    }
    return sum;
  };
  
  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2;
    const npvMid = npv(mid);
    
    if (Math.abs(npvMid) < tolerance) {
      return mid * 100;
    }
    
    if (npvMid > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return ((low + high) / 2) * 100;
}

/**
 * Calcula o Valor Presente Líquido (VPL)
 */
export function calculateNPV(cashFlows: number[], discountRate: number): number {
  const rate = discountRate / 100;
  let npv = 0;
  
  for (let t = 0; t < cashFlows.length; t++) {
    npv += cashFlows[t] / Math.pow(1 + rate, t);
  }
  
  return Math.round(npv);
}

/**
 * Calcula o Payback Simples
 */
export function calculateSimplePayback(
  investment: number,
  annualCashFlows: number[]
): number {
  let accumulated = -investment;
  
  for (let year = 0; year < annualCashFlows.length; year++) {
    accumulated += annualCashFlows[year];
    
    if (accumulated >= 0) {
      // Interpola para encontrar o mês exato
      const previousAccumulated = accumulated - annualCashFlows[year];
      const fraction = -previousAccumulated / annualCashFlows[year];
      return year + fraction;
    }
  }
  
  return annualCashFlows.length; // Não recuperou no período
}

/**
 * Calcula o Payback Descontado
 */
export function calculateDiscountedPayback(
  investment: number,
  annualCashFlows: number[],
  discountRate: number
): number {
  const rate = discountRate / 100;
  let accumulated = -investment;
  
  for (let year = 0; year < annualCashFlows.length; year++) {
    const discountedCashFlow = annualCashFlows[year] / Math.pow(1 + rate, year + 1);
    accumulated += discountedCashFlow;
    
    if (accumulated >= 0) {
      const previousAccumulated = accumulated - discountedCashFlow;
      const fraction = -previousAccumulated / discountedCashFlow;
      return year + fraction;
    }
  }
  
  return annualCashFlows.length;
}

/**
 * Calcula parcela do financiamento (Sistema PRICE)
 */
export function calculatePriceInstallment(
  principal: number,
  monthlyRate: number,
  months: number
): number {
  const rate = monthlyRate / 100;
  
  if (rate === 0) {
    return principal / months;
  }
  
  return principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
}

/**
 * Calcula parcela do financiamento (Sistema SAC)
 */
export function calculateSACInstallment(
  principal: number,
  monthlyRate: number,
  months: number,
  currentMonth: number
): { amortization: number; interest: number; total: number } {
  const rate = monthlyRate / 100;
  const amortization = principal / months;
  const remainingBalance = principal - (amortization * (currentMonth - 1));
  const interest = remainingBalance * rate;
  
  return {
    amortization,
    interest,
    total: amortization + interest
  };
}

/**
 * Gera o fluxo de caixa projetado para N anos
 */
export function generateProjectedCashFlow(input: FinancialIndicatorsInput): ProjectedCashFlow {
  const {
    totalInvestment,
    ownCapital,
    financedAmount,
    annualSavings,
    annualRevenue,
    annualTaxes,
    opex,
    financialConfig,
    projectionYears = 20
  } = input;

  const years: CashFlowYear[] = [];
  let accumulatedCashFlow = -ownCapital;
  let accumulatedDiscounted = -ownCapital;
  
  // Arrays para cálculo de TIR
  const cashFlowsForIRR: number[] = [-totalInvestment];
  const annualCashFlows: number[] = [];
  
  // Calcular parcela mensal do financiamento
  const monthlyInstallment = financedAmount > 0
    ? calculatePriceInstallment(
        financedAmount,
        financialConfig.monthlyInterestRate,
        financialConfig.financingTerm
      )
    : 0;
  
  const annualFinancingPayment = monthlyInstallment * 12;
  const financingYears = Math.ceil(financialConfig.financingTerm / 12);
  
  // Taxas de reajuste
  const revenueAdjustment = 1 + financialConfig.revenueAdjustmentRate / 100;
  const opexInflation = 1 + financialConfig.opexInflationRate / 100;
  const tma = financialConfig.tma / 100;
  
  let currentAnnualSavings = annualSavings;
  let currentAnnualRevenue = annualRevenue;
  let currentAnnualOpex = opex.annualTotal;
  let currentAnnualTaxes = annualTaxes;

  for (let year = 1; year <= projectionYears; year++) {
    // Receitas do ano (com reajuste)
    const avoidedCost = Math.round(currentAnnualSavings);
    const grossRevenue = Math.round(currentAnnualRevenue);
    const totalRevenue = avoidedCost + grossRevenue;
    
    // Impostos sobre receita
    const taxOnRevenue = Math.round(currentAnnualTaxes);
    
    // OPEX (com inflação)
    const yearOpex = Math.round(currentAnnualOpex);
    
    // Financiamento (apenas nos anos do prazo)
    const isInFinancingPeriod = year <= financingYears && financedAmount > 0;
    const amortization = isInFinancingPeriod ? Math.round(financedAmount / financingYears) : 0;
    const interest = isInFinancingPeriod ? Math.round(annualFinancingPayment - amortization) : 0;
    const financingPayment = isInFinancingPeriod ? Math.round(annualFinancingPayment) : 0;
    
    // EBIT (Lucro antes de juros e impostos)
    const ebit = totalRevenue - taxOnRevenue - yearOpex;
    
    // Imposto de renda (simplificado - apenas sobre lucro positivo)
    const incomeTax = ebit > 0 ? Math.round(ebit * (financialConfig.tma > 0 ? 0 : 0)) : 0;
    
    // Lucro líquido
    const netProfit = ebit - incomeTax - interest;
    
    // Fluxo de caixa simples
    const simpleCashFlow = netProfit - amortization;
    accumulatedCashFlow += simpleCashFlow;
    
    // Fluxo de caixa descontado
    const discountedCashFlow = Math.round(simpleCashFlow / Math.pow(1 + tma, year));
    accumulatedDiscounted += discountedCashFlow;
    
    years.push({
      year,
      avoidedCost,
      grossRevenue,
      totalRevenue,
      taxOnRevenue,
      opex: yearOpex,
      amortization,
      interest,
      financingPayment,
      ebit,
      incomeTax,
      netProfit,
      simpleCashFlow,
      accumulatedCashFlow: Math.round(accumulatedCashFlow),
      discountedCashFlow,
      accumulatedDiscounted: Math.round(accumulatedDiscounted)
    });
    
    // Para cálculos de indicadores
    cashFlowsForIRR.push(simpleCashFlow + amortization); // Fluxo operacional
    annualCashFlows.push(simpleCashFlow + amortization);
    
    // Aplicar reajustes para próximo ano
    currentAnnualSavings *= revenueAdjustment;
    currentAnnualRevenue *= revenueAdjustment;
    currentAnnualOpex *= opexInflation;
    currentAnnualTaxes *= revenueAdjustment;
  }
  
  // Calcular indicadores
  const tir = calculateIRR(cashFlowsForIRR);
  const vpl = calculateNPV(cashFlowsForIRR, financialConfig.tma);
  const paybackSimple = calculateSimplePayback(totalInvestment, annualCashFlows);
  const paybackDiscounted = calculateDiscountedPayback(totalInvestment, annualCashFlows, financialConfig.tma);
  
  // ROI total
  const totalCashFlow = years.reduce((sum, y) => sum + y.simpleCashFlow, 0);
  const roi = totalInvestment > 0 ? ((totalCashFlow / totalInvestment) * 100) : 0;

  return {
    years,
    tir: Math.round(tir * 100) / 100,
    vpl,
    paybackSimple: Math.round(paybackSimple * 10) / 10,
    paybackDiscounted: Math.round(paybackDiscounted * 10) / 10,
    roi: Math.round(roi * 100) / 100,
    tmaUsed: financialConfig.tma,
    projectionYears
  };
}

/**
 * Formata valor monetário para exibição
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Formata porcentagem para exibição
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}
