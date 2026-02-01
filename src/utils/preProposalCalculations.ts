import { PreProposalInput, PreProposalResult, EnermacPaymentPlan, PaymentStage } from '@/types/preProposal';
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
  
  // 7. Gerar plano de pagamento Enermac
  const paymentPlan = generateEnermacPaymentPlan(totalInvestment);
  
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
    paymentPlan,
    roi,
    isViable,
    viabilityMessage
  };
}

function generateEnermacPaymentPlan(totalInvestment: number): EnermacPaymentPlan {
  const stages: PaymentStage[] = [
    {
      name: 'Sinal',
      percentage: 5,
      value: totalInvestment * 0.05,
      timing: 'Na assinatura da proposta',
      condition: undefined
    },
    {
      name: 'Contrato',
      percentage: 30,
      value: totalInvestment * 0.30,
      timing: 'Até 3 dias úteis após assinatura',
      condition: undefined
    },
    {
      name: 'Impermeabilização',
      percentage: 30,
      value: totalInvestment * 0.30,
      timing: '30 dias após assinatura do contrato',
      condition: 'Condicionado à impermeabilização do biodigestor'
    },
    {
      name: 'Gerador',
      percentage: 30,
      value: totalInvestment * 0.30,
      timing: '30 dias após impermeabilização',
      condition: 'Condicionado ao embarque do gerador (com seguro)'
    },
    {
      name: 'Start-up',
      percentage: 5,
      value: totalInvestment * 0.05,
      timing: '30 dias após recebimento do gerador',
      condition: 'Início de operação da usina'
    }
  ];

  return {
    name: 'Parcelamento Direto Enermac',
    description: 'Pagamento em 5 etapas vinculadas ao andamento do projeto',
    stages,
    totalValue: totalInvestment
  };
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
