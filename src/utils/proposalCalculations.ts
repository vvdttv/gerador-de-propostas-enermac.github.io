import { CurrentCosts, FinancialConfig, TechnicalData, ProposalCalculations } from '@/types/proposal';

// Dados de produção de biogás por animal (m³/dia por animal em confinamento completo - 24h)
const LIVESTOCK_DATA: Record<string, {
  biogasPerM3: number;
  investmentPerKw: number;
}> = {
  'Suíno-Crechário (Lâmina d\'água)': {
    biogasPerM3: 0.007,
    investmentPerKw: 8500
  },
  'Suíno-Terminação/Maraã': {
    biogasPerM3: 0.014,
    investmentPerKw: 8500
  },
  'Bovino-Matriz UPD': {
    biogasPerM3: 0.024,
    investmentPerKw: 9000
  },
  'Bovino-Terminação Confinamento': {
    biogasPerM3: 0.030,
    investmentPerKw: 9000
  },
  'Aves-Poedeira': {
    biogasPerM3: 0.010,
    investmentPerKw: 8000
  },
  'Aves-Frango de Corte': {
    biogasPerM3: 0.017,
    investmentPerKw: 8000
  }
};

// Dados de produção de biogás por outros substratos (m³/tonelada)
const OTHER_SUBSTRATE_DATA: Record<string, {
  biogasPerTon: number;
  investmentPerKw: number;
}> = {
  'RSO': {
    biogasPerTon: 81.6,
    investmentPerKw: 7500
  },
  'RSU': {
    biogasPerTon: 100.0,
    investmentPerKw: 7800
  }
};

const KWH_PER_M3_BIOGAS = 2.0;

export function calculateProposal(
  technical: TechnicalData,
  currentCosts: CurrentCosts,
  financial: FinancialConfig
): ProposalCalculations {
  // Calcular produção de biogás de plantel (m³/dia)
  let dailyBiogasFromLivestock = 0;
  let totalInvestmentKwLivestock = 0;
  let countLivestock = 0;
  
  for (const livestock of technical.livestockComposition) {
    const key = `${livestock.type}-${livestock.class}`;
    const livestockInfo = LIVESTOCK_DATA[key];
    
    if (livestockInfo) {
      // Converter tempo de confinamento em horas para fração do dia
      const confinementFraction = livestock.confinementTime / 24;
      const biogasPerAnimal = livestockInfo.biogasPerM3 * confinementFraction;
      dailyBiogasFromLivestock += biogasPerAnimal * livestock.quantity;
      totalInvestmentKwLivestock += livestockInfo.investmentPerKw;
      countLivestock++;
    }
  }
  
  // Calcular produção de biogás de outros substratos (m³/dia)
  let dailyBiogasFromSubstrates = 0;
  let totalInvestmentKwSubstrates = 0;
  let countSubstrates = 0;
  
  for (const substrate of technical.otherSubstrates) {
    const substrateInfo = OTHER_SUBSTRATE_DATA[substrate.type];
    
    if (substrateInfo) {
      // volume está em kg/dia, converter para toneladas
      const volumeInTons = substrate.volume / 1000;
      dailyBiogasFromSubstrates += volumeInTons * substrateInfo.biogasPerTon;
      totalInvestmentKwSubstrates += substrateInfo.investmentPerKw;
      countSubstrates++;
    }
  }
  
  // Produção total de biogás (m³/dia)
  const dailyBiogasProduction = dailyBiogasFromLivestock + dailyBiogasFromSubstrates;
  
  // Calcular investimento médio por kW
  const totalCount = countLivestock + countSubstrates;
  const avgInvestmentPerKw = totalCount > 0 
    ? (totalInvestmentKwLivestock + totalInvestmentKwSubstrates) / totalCount 
    : 8500;
  
  // Custo adicional se não houver rede trifásica
  const threePhaseGridCost = !technical.hasThreePhaseGrid ? 20000 : 0;
  
  // Custo adicional por distância da rede
  const gridDistanceCost = technical.gridDistance * 500;
  
  // Calcular produção de energia (kWh/dia)
  const dailyEnergyProduction = dailyBiogasProduction * KWH_PER_M3_BIOGAS;
  
  // Potência instalada (kW) - assumindo 8h de operação por dia
  const installedPowerKw = dailyEnergyProduction / 8;
  
  // Investimento base no gerador e biodigestor
  const baseInvestment = installedPowerKw * avgInvestmentPerKw;
  
  // Investimento total (incluindo custos adicionais de infraestrutura)
  const totalInvestment = baseInvestment + threePhaseGridCost + gridDistanceCost;
  
  // Valor do sinal
  const downPayment = totalInvestment * (financial.downPaymentPercentage / 100);
  
  // Valor financiado
  const financedAmount = totalInvestment - downPayment;
  
  // Calcular parcela mensal
  let monthlyInstallment = 0;
  const monthlyRate = financial.monthlyInterestRate / 100;
  
  if (financial.interestType === 'compound') {
    // Sistema PRICE (juros compostos)
    const n = financial.installments;
    if (monthlyRate > 0) {
      monthlyInstallment = financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / 
                           (Math.pow(1 + monthlyRate, n) - 1);
    } else {
      monthlyInstallment = financedAmount / n;
    }
  } else {
    // Juros simples
    const totalInterest = financedAmount * monthlyRate * financial.installments;
    const totalAmount = financedAmount + totalInterest;
    monthlyInstallment = totalAmount / financial.installments;
  }
  
  // Economia mensal com energia
  const monthlyEnergyProduction = dailyEnergyProduction * 30;
  const monthlyEnergySavings = monthlyEnergyProduction * currentCosts.energyCostKwh;
  
  // Economia total mensal
  const monthlySavings = monthlyEnergySavings;
  
  // Receita mensal líquida (economia - parcela)
  const monthlyRevenue = monthlySavings - monthlyInstallment;
  
  // Economia anual
  const annualSavings = monthlySavings * 12;
  
  // Payback em meses
  const paybackMonths = monthlySavings > 0 ? totalInvestment / monthlySavings : 0;
  const paybackYears = paybackMonths / 12;
  
  // ROI em 20 anos (assumindo reajuste de 6.5% ao ano)
  let totalSavings20Years = 0;
  let currentAnnualSavings = annualSavings;
  for (let year = 1; year <= 20; year++) {
    totalSavings20Years += currentAnnualSavings;
    currentAnnualSavings *= 1.065; // Reajuste anual
  }
  const roi20Years = totalInvestment > 0 ? ((totalSavings20Years - totalInvestment) / totalInvestment) * 100 : 0;
  
  // Verificar viabilidade
  const viabilityIssues: string[] = [];
  let isViable = true;

  if (dailyBiogasProduction < 10) {
    viabilityIssues.push('Produção de biogás insuficiente (mínimo 10 m³/dia)');
    isViable = false;
  }

  if (monthlyRevenue < 0) {
    viabilityIssues.push('Receita líquida mensal negativa - as parcelas superam a economia');
    isViable = false;
  }

  if (paybackYears > 20) {
    viabilityIssues.push('Período de retorno muito longo (acima de 20 anos)');
    isViable = false;
  }

  if (dailyEnergyProduction < currentCosts.monthlyEnergyConsumption / 30) {
    viabilityIssues.push('Produção de energia insuficiente para atender o consumo mensal');
    isViable = false;
  }

  return {
    totalInvestment,
    downPayment,
    monthlyInstallment,
    monthlySavings,
    monthlyRevenue,
    annualSavings,
    paybackMonths,
    paybackYears,
    roi20Years,
    dailyBiogasProduction,
    dailyEnergyProduction,
    installedPowerKw,
    investmentBreakdown: {
      baseInvestment,
      threePhaseGridCost,
      gridDistanceCost
    },
    isViable,
    viabilityIssues
  };
}
