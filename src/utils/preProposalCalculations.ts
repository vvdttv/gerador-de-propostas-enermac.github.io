import { PreProposalInput, PreProposalResult, PaymentOption } from '@/types/preProposal';
import { LIVESTOCK_BIOGAS_DATA, getLivestockBiogasData } from '@/data/biodigesterDatabase';
import { selectBiodigester } from '@/data/biodigesterDatabase';
import { selectGenerator } from '@/data/generatorDatabase';
import { calculateIRR, calculateNPV } from '@/utils/financialIndicators';

// Mapeamento de tipos para o formato do banco
const LIVESTOCK_TYPE_MAP: Record<string, string> = {
  'suino': 'Suíno',
  'bovino': 'Bovino',
  'aves': 'Aves'
};

export function calculatePreProposal(input: PreProposalInput): PreProposalResult {
  // 1. Calcular produção de biogás usando os dados do banco
  const mappedType = LIVESTOCK_TYPE_MAP[input.livestockType || ''] || '';
  const livestockData = getLivestockBiogasData(mappedType, input.livestockClass);
  
  let dailyBiogasProduction = 0;
  let svPerHead = 0.50; // Default para terminação
  let biogasLitersPerKgSV = 474.5; // Default
  
  if (livestockData) {
    svPerHead = livestockData.volatileSolidsKgPerDay;
    biogasLitersPerKgSV = livestockData.biogasLiterPerKgSV;
  }
  
  // Cálculo baseado em sólidos voláteis
  const confinementFactor = Math.min(input.confinementHours / 24, 1);
  const biogasPerKgSV = biogasLitersPerKgSV / 1000; // Converter para m³/kg SV
  const processEfficiency = 0.80;
  
  dailyBiogasProduction = input.livestockQuantity * svPerHead * confinementFactor * biogasPerKgSV * processEfficiency;
  
  // 2. Calcular produção de energia
  const energyConversionFactor = 2.0; // kWh por m³ de biogás
  const dailyEnergyProduction = dailyBiogasProduction * energyConversionFactor;
  
  // 3. Calcular potência instalada (baseado em 14h de operação)
  const operatingHours = 14;
  const installedPowerKw = dailyEnergyProduction / operatingHours;
  
  // 4. Selecionar equipamentos
  const biodigester = selectBiodigester(dailyBiogasProduction * 30); // Produção diária * TRH (30 dias)
  const generator = selectGenerator(installedPowerKw);
  
  // 5. Calcular investimento
  const biodigesterCost = biodigester?.totalCost || 200000;
  const generatorCost = generator?.estimatedCost || 150000;
  const installationCost = (biodigesterCost + generatorCost) * 0.15;
  const infrastructureCost = (!input.hasThreePhaseGrid ? 20000 : 0) + (input.gridDistance * 500);
  
  const totalInvestment = biodigesterCost + generatorCost + installationCost + infrastructureCost;
  
  // 6. Calcular economia
  const monthlyEnergyProduction = dailyEnergyProduction * 30;
  const monthlySavings = monthlyEnergyProduction * input.energyCostPerKwh;
  const annualSavings = monthlySavings * 12;
  
  // 7. Gerar opções de pagamento
  const paymentOptions = generatePaymentOptions(totalInvestment, monthlySavings);
  
  // 8. Calcular indicadores de ROI
  const roi = calculateROIIndicators(totalInvestment, annualSavings);
  
  // 9. Verificar viabilidade
  const isViable = dailyBiogasProduction >= 10 && 
                   monthlySavings > 0 && 
                   roi.paybackYears <= 15;
  
  let viabilityMessage = '';
  if (!isViable) {
    if (dailyBiogasProduction < 10) {
      viabilityMessage = 'Produção de biogás insuficiente. Considere aumentar o plantel ou adicionar substratos.';
    } else if (monthlySavings <= 0) {
      viabilityMessage = 'Economia mensal não é positiva. Verifique os custos de energia atuais.';
    } else if (roi.paybackYears > 15) {
      viabilityMessage = 'Payback acima de 15 anos. Considere revisar a escala do projeto.';
    }
  } else {
    viabilityMessage = 'Projeto viável! Indicadores dentro dos parâmetros recomendados.';
  }
  
  return {
    dailyBiogasProduction,
    dailyEnergyProduction,
    installedPowerKw,
    totalInvestment,
    investmentBreakdown: {
      equipment: biodigesterCost + generatorCost,
      installation: installationCost,
      infrastructure: infrastructureCost
    },
    monthlySavings,
    annualSavings,
    paymentOptions,
    roi,
    isViable,
    viabilityMessage
  };
}

function generatePaymentOptions(totalInvestment: number, monthlySavings: number): PaymentOption[] {
  const options: PaymentOption[] = [];
  
  // Opção 1: À Vista (10% desconto)
  const discountRate = 0.10;
  const cashPrice = totalInvestment * (1 - discountRate);
  options.push({
    name: 'À Vista',
    description: '10% de desconto no pagamento à vista',
    downPaymentPercentage: 100,
    downPaymentValue: cashPrice,
    installments: 1,
    monthlyInstallment: 0,
    totalPaid: cashPrice,
    interestRate: 0,
    monthlyBalance: monthlySavings
  });
  
  // Opção 2: 30% entrada + 60x (1.2% a.m.)
  const option2Down = totalInvestment * 0.30;
  const option2Financed = totalInvestment * 0.70;
  const option2Rate = 0.012;
  const option2Installment = calculatePriceInstallment(option2Financed, option2Rate, 60);
  options.push({
    name: '30% + 60x',
    description: '30% de entrada + 60 parcelas fixas',
    downPaymentPercentage: 30,
    downPaymentValue: option2Down,
    installments: 60,
    monthlyInstallment: option2Installment,
    totalPaid: option2Down + (option2Installment * 60),
    interestRate: 1.2,
    monthlyBalance: monthlySavings - option2Installment
  });
  
  // Opção 3: 20% entrada + 84x (1.0% a.m.)
  const option3Down = totalInvestment * 0.20;
  const option3Financed = totalInvestment * 0.80;
  const option3Rate = 0.010;
  const option3Installment = calculatePriceInstallment(option3Financed, option3Rate, 84);
  options.push({
    name: '20% + 84x',
    description: '20% de entrada + 84 parcelas (7 anos)',
    downPaymentPercentage: 20,
    downPaymentValue: option3Down,
    installments: 84,
    monthlyInstallment: option3Installment,
    totalPaid: option3Down + (option3Installment * 84),
    interestRate: 1.0,
    monthlyBalance: monthlySavings - option3Installment
  });
  
  // Opção 4: 10% entrada + 120x (0.9% a.m.) - Financiamento BNDES
  const option4Down = totalInvestment * 0.10;
  const option4Financed = totalInvestment * 0.90;
  const option4Rate = 0.009;
  const option4Installment = calculatePriceInstallment(option4Financed, option4Rate, 120);
  options.push({
    name: 'BNDES 10 anos',
    description: '10% entrada + 120x (linha verde)',
    downPaymentPercentage: 10,
    downPaymentValue: option4Down,
    installments: 120,
    monthlyInstallment: option4Installment,
    totalPaid: option4Down + (option4Installment * 120),
    interestRate: 0.9,
    monthlyBalance: monthlySavings - option4Installment
  });
  
  return options;
}

function calculatePriceInstallment(principal: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return principal / months;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

function calculateROIIndicators(totalInvestment: number, annualSavings: number) {
  const annualAdjustment = 0.065; // 6.5% reajuste anual da tarifa
  const tma = 0.1218; // 12.18% a.a. (IPCA + 8%)
  
  // Gerar fluxo de caixa para 20 anos
  const cashFlows: number[] = [-totalInvestment];
  let accumulatedSavings = 0;
  let savings5Years = 0;
  let savings10Years = 0;
  let paybackYear = 0;
  
  for (let year = 1; year <= 20; year++) {
    const yearSavings = annualSavings * Math.pow(1 + annualAdjustment, year - 1);
    cashFlows.push(yearSavings);
    accumulatedSavings += yearSavings;
    
    if (year <= 5) savings5Years += yearSavings;
    if (year <= 10) savings10Years += yearSavings;
    
    if (paybackYear === 0 && accumulatedSavings >= totalInvestment) {
      paybackYear = year;
    }
  }
  
  // Calcular TIR e VPL
  const tir = calculateIRR(cashFlows) * 100;
  const vpl = calculateNPV(cashFlows, tma);
  
  // Calcular payback descontado
  let discountedAccumulated = -totalInvestment;
  let discountedPayback = 0;
  for (let year = 1; year <= 20; year++) {
    const discountedFlow = cashFlows[year] / Math.pow(1 + tma, year);
    discountedAccumulated += discountedFlow;
    if (discountedPayback === 0 && discountedAccumulated >= 0) {
      discountedPayback = year;
    }
  }
  
  return {
    paybackYears: paybackYear || (totalInvestment / annualSavings),
    paybackDiscounted: discountedPayback || 20,
    roi5Years: ((savings5Years - totalInvestment) / totalInvestment) * 100,
    roi10Years: ((savings10Years - totalInvestment) / totalInvestment) * 100,
    roi20Years: ((accumulatedSavings - totalInvestment) / totalInvestment) * 100,
    totalSavings20Years: accumulatedSavings,
    tir,
    vpl
  };
}
