import { CurrentCosts, FinancialConfig, TechnicalData, ProposalCalculations } from '@/types/proposal';

const SUBSTRATE_DATA: Record<string, {
  biogasPerM3: number;
  kwhPerM3Biogas: number;
  investmentPerKw: number;
}> = {
  'suino': {
    biogasPerM3: 0.007,
    kwhPerM3Biogas: 2.0,
    investmentPerKw: 8500
  },
  'bovino': {
    biogasPerM3: 0.024,
    kwhPerM3Biogas: 2.0,
    investmentPerKw: 9000
  },
  'rso': {
    biogasPerM3: 81.6,
    kwhPerM3Biogas: 2.0,
    investmentPerKw: 7500
  },
  'aves': {
    biogasPerM3: 0.017,
    kwhPerM3Biogas: 2.0,
    investmentPerKw: 8000
  }
};

export function calculateProposal(
  technical: TechnicalData,
  currentCosts: CurrentCosts,
  financial: FinancialConfig
): ProposalCalculations {
  const substrateInfo = SUBSTRATE_DATA[technical.substrate] || SUBSTRATE_DATA['suino'];
  
  // Calcular produção de biogás diária (m³/dia)
  const dailyBiogasProduction = technical.volume * substrateInfo.biogasPerM3;
  
  // Custo adicional se não houver rede trifásica (estimativa: R$ 15.000 a R$ 30.000)
  const threePhaseGridCost = !technical.hasThreePhaseGrid ? 20000 : 0;
  
  // Custo adicional por distância da rede (estimativa: R$ 500 por metro)
  const gridDistanceCost = technical.gridDistance * 500;
  
  // Calcular produção de energia (kWh/dia)
  const dailyEnergyProduction = dailyBiogasProduction * substrateInfo.kwhPerM3Biogas;
  
  // Potência instalada (kW) - assumindo 8h de operação
  const installedPowerKw = dailyEnergyProduction / 8;
  
  // Investimento total (incluindo custos adicionais de infraestrutura)
  const baseInvestment = installedPowerKw * substrateInfo.investmentPerKw;
  const totalInvestment = baseInvestment + threePhaseGridCost + gridDistanceCost;
  
  // Valor do sinal
  const downPayment = totalInvestment * (financial.downPaymentPercentage / 100);
  
  // Valor financiado
  const financedAmount = totalInvestment - downPayment;
  
  // Calcular parcela mensal
  let monthlyInstallment = 0;
  if (financial.paymentMethod === 'financing') {
    // Sistema PRICE
    const monthlyRate = financial.interestRate / 100 / 12;
    const n = financial.installments;
    monthlyInstallment = financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / 
                         (Math.pow(1 + monthlyRate, n) - 1);
  } else {
    // Pagamento direto com Enermac (sem juros ou juros menores)
    const directRate = 0.005; // 0.5% ao mês
    const monthlyRate = directRate;
    const n = financial.installments;
    monthlyInstallment = financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / 
                         (Math.pow(1 + monthlyRate, n) - 1);
  }
  
  // Economia mensal com energia
  const monthlyEnergyProduction = dailyEnergyProduction * 30;
  const monthlyEnergySavings = monthlyEnergyProduction * currentCosts.energyCostKwh;
  
  // Economia com combustível (se aplicável)
  const monthlyFuelSavings = currentCosts.monthlyFuelConsumption * currentCosts.fuelCostLiter * 0.7; // 70% de redução
  
  // Economia total mensal
  const monthlySavings = monthlyEnergySavings + monthlyFuelSavings;
  
  // Receita mensal líquida (economia - parcela)
  const monthlyRevenue = monthlySavings - monthlyInstallment;
  
  // Economia anual
  const annualSavings = monthlySavings * 12;
  
  // Payback em meses
  const paybackMonths = totalInvestment / monthlySavings;
  const paybackYears = paybackMonths / 12;
  
  // ROI em 20 anos (assumindo reajuste de 6.5% ao ano)
  let totalSavings20Years = 0;
  let currentSavings = annualSavings;
  for (let year = 1; year <= 20; year++) {
    totalSavings20Years += currentSavings;
    currentSavings *= 1.065; // Reajuste anual
  }
  const roi20Years = ((totalSavings20Years - totalInvestment) / totalInvestment) * 100;
  
  return {
    totalInvestment,
    downPayment,
    monthlyInstallment,
    monthlySavings,
    monthlyRevenue,
    annualSavings,
    paybackMonths,
    paybackYears,
    roi20Years
  };
}
