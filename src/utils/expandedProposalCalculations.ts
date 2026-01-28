// Cálculos de proposta utilizando módulos expandidos
// Integra biogás, CAPEX, OPEX e indicadores financeiros

import { CurrentCosts, FinancialConfig, TechnicalData, ProposalCalculations } from '@/types/proposal';
import { 
  ExpandedFinancialConfig, 
  DetailedCapex, 
  DetailedOpex, 
  ProjectedCashFlow,
  DEFAULT_EXPANDED_FINANCIAL_CONFIG 
} from '@/types/expandedProposal';
import { calculateBiogasProductionAdvanced, checkMinimumViability } from '@/utils/biogasProductionCalculations';
import { calculateDetailedCapex, calculateDailyBiomassVolume } from '@/utils/capexCalculations';
import { calculateDetailedOpex } from '@/utils/opexCalculations';
import { generateProjectedCashFlow } from '@/utils/financialIndicators';
import { selectBiodigester } from '@/data/biodigesterDatabase';
import { selectGenerator, calculateOperatingHours } from '@/data/generatorDatabase';

// Taxas de tributação por estado (baseado na planilha EVTF - 10% sobre energia)
const STATE_TAX_RATES: Record<string, number> = {
  'AC': 0.10, 'AL': 0.10, 'AP': 0.10, 'AM': 0.10, 'BA': 0.10,
  'CE': 0.10, 'DF': 0.10, 'ES': 0.10, 'GO': 0.10, 'MA': 0.10,
  'MT': 0.10, 'MS': 0.10, 'MG': 0.10, 'PA': 0.10, 'PB': 0.10,
  'PR': 0.10, 'PE': 0.10, 'PI': 0.10, 'RJ': 0.10, 'RN': 0.10,
  'RS': 0.10, 'RO': 0.10, 'RR': 0.10, 'SC': 0.10, 'SP': 0.10,
  'SE': 0.10, 'TO': 0.10
};

const STATE_FULL_NAMES: Record<string, string> = {
  'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
  'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
  'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
  'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
  'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
  'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
  'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
};

export interface ExpandedCalculationResult {
  // Cálculos básicos (compatibilidade)
  basic: ProposalCalculations;
  
  // Cálculos expandidos
  biogasProduction: ReturnType<typeof calculateBiogasProductionAdvanced>;
  capex: DetailedCapex;
  opex: DetailedOpex;
  cashFlow: ProjectedCashFlow;
  
  // Equipamentos selecionados
  selectedBiodigester: ReturnType<typeof selectBiodigester>;
  selectedGenerator: ReturnType<typeof selectGenerator>;
}

/**
 * Calcula proposta com metodologia expandida (EVTF)
 */
export function calculateExpandedProposal(
  technical: TechnicalData,
  currentCosts: CurrentCosts,
  financial: FinancialConfig,
  hydraulicRetentionTime: number = 30,
  targetOperatingHours: number = 14
): ExpandedCalculationResult {
  
  // 1. Calcular produção de biogás (metodologia sólidos voláteis)
  const biogasProduction = calculateBiogasProductionAdvanced(
    technical,
    hydraulicRetentionTime,
    targetOperatingHours
  );
  
  // 2. Selecionar equipamentos
  const selectedBiodigester = selectBiodigester(biogasProduction.requiredBiodigesterVolumeM3);
  const selectedGenerator = selectGenerator(biogasProduction.dailyBiogasM3, targetOperatingHours);
  
  // 3. Calcular horas de operação reais
  const operatingHours = selectedGenerator 
    ? calculateOperatingHours(biogasProduction.dailyBiogasM3, selectedGenerator)
    : targetOperatingHours;
  
  // 4. Calcular volume de biomassa diário
  const dailyBiomassVolume = calculateDailyBiomassVolume(technical);
  
  // 5. Calcular CAPEX detalhado
  const capex = calculateDetailedCapex({
    dailyBiogasProductionM3: biogasProduction.dailyBiogasM3,
    dailyBiomassVolumeM3: dailyBiomassVolume,
    hydraulicRetentionTime,
    installedPowerKw: biogasProduction.installedPowerKw,
    hasThreePhaseGrid: technical.hasThreePhaseGrid,
    gridDistance: technical.gridDistance,
    hasThermal: false,
    hasBiomethane: false,
    hasOrganomineral: false
  });
  
  // 6. Calcular OPEX detalhado
  const opex = calculateDetailedOpex({
    installedPowerKw: biogasProduction.installedPowerKw,
    hasThermal: false,
    hasBiomethane: false,
    hasOrganomineral: false,
    hasExternalBiomass: false,
    hasDedicatedOperator: biogasProduction.installedPowerKw >= 100
  });
  
  // 7. Calcular economia e receita
  const monthlyEnergyProduction = biogasProduction.monthlyEnergyKwh;
  const monthlyEnergySavings = monthlyEnergyProduction * currentCosts.energyCostKwh;
  
  // Tributação
  const energyTaxRate = STATE_TAX_RATES[technical.state] || 0.10;
  const monthlyTax = monthlyEnergySavings * energyTaxRate;
  const monthlySavings = monthlyEnergySavings - monthlyTax;
  const annualSavings = monthlySavings * 12;
  const annualTax = monthlyTax * 12;
  
  // 8. Converter configuração financeira para formato expandido
  const expandedFinancial: ExpandedFinancialConfig = {
    ...DEFAULT_EXPANDED_FINANCIAL_CONFIG,
    paymentMethod: financial.paymentMethod === 'financing' ? 'financing' : 'direct',
    ownCapitalPercentage: financial.downPaymentPercentage,
    financingPercentage: 100 - financial.downPaymentPercentage,
    financingTerm: financial.installments,
    monthlyInterestRate: financial.monthlyInterestRate,
    amortizationType: financial.interestType === 'compound' ? 'price' : 'sac',
    interestType: financial.interestType
  };
  
  // 9. Calcular valores de financiamento
  const downPayment = capex.total * (financial.downPaymentPercentage / 100);
  const financedAmount = capex.total - downPayment;
  
  // 10. Gerar fluxo de caixa projetado
  const cashFlow = generateProjectedCashFlow({
    totalInvestment: capex.total,
    ownCapital: downPayment,
    financedAmount,
    annualSavings,
    annualRevenue: 0, // Sem venda externa por padrão
    annualTaxes: annualTax,
    opex,
    financialConfig: expandedFinancial,
    projectionYears: 20
  });
  
  // 11. Calcular parcela mensal (para compatibilidade)
  const monthlyRate = financial.monthlyInterestRate / 100;
  let monthlyInstallment = 0;
  
  if (financial.interestType === 'compound') {
    const n = financial.installments;
    if (monthlyRate > 0) {
      monthlyInstallment = financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / 
                           (Math.pow(1 + monthlyRate, n) - 1);
    } else {
      monthlyInstallment = financedAmount / n;
    }
  } else {
    const totalInterest = financedAmount * monthlyRate * financial.installments;
    const totalAmount = financedAmount + totalInterest;
    monthlyInstallment = totalAmount / financial.installments;
  }
  
  // 12. Verificar viabilidade
  const viabilityCheck = checkMinimumViability(biogasProduction);
  const monthlyRevenue = monthlySavings - monthlyInstallment;
  
  const viabilityIssues: string[] = [...viabilityCheck.issues];
  let isViable = viabilityCheck.isViable;
  
  if (monthlyRevenue < 0) {
    viabilityIssues.push('Receita líquida mensal negativa - as parcelas superam a economia');
    isViable = false;
  }
  
  if (cashFlow.paybackSimple > 20) {
    viabilityIssues.push('Período de retorno muito longo (acima de 20 anos)');
    isViable = false;
  }
  
  if (biogasProduction.dailyEnergyKwh < currentCosts.monthlyEnergyConsumption / 30) {
    viabilityIssues.push('Produção de energia insuficiente para atender o consumo mensal');
    isViable = false;
  }
  
  // 13. Determinar rota tecnológica e equipamentos
  const hasLivestock = technical.livestockComposition.length > 0;
  const hasSubstrates = technical.otherSubstrates.length > 0;
  
  let technologicalRoute = '';
  if (hasLivestock && !hasSubstrates) {
    const livestockTypes = technical.livestockComposition.map(l => l.type).join(', ');
    technologicalRoute = `Biodigestão anaeróbia de dejetos animais (${livestockTypes}). Esta rota é ideal para aproveitamento de resíduos orgânicos da pecuária, transformando um passivo ambiental em energia limpa.`;
  } else if (!hasLivestock && hasSubstrates) {
    const substrateTypes = technical.otherSubstrates.map(s => s.type).join(', ');
    technologicalRoute = `Biodigestão anaeróbia de resíduos sólidos (${substrateTypes}). Sistema projetado para tratamento de resíduos orgânicos, convertendo-os em biogás para geração de energia elétrica.`;
  } else if (hasLivestock && hasSubstrates) {
    technologicalRoute = `Codigestão anaeróbia combinando dejetos animais e resíduos sólidos orgânicos. Esta rota otimiza a produção de biogás através da sinergia entre diferentes substratos.`;
  } else {
    technologicalRoute = `Sistema de biodigestão anaeróbia para conversão de resíduos orgânicos em energia renovável.`;
  }
  
  // Descrição dos equipamentos
  const biodigestorName = selectedBiodigester 
    ? `Biodigestor ${selectedBiodigester.type === 'circular' ? 'Circular' : 'Retangular'} ${selectedBiodigester.volume}m³`
    : `Biodigestor Customizado ${biogasProduction.requiredBiodigesterVolumeM3}m³`;
  
  const generatorName = selectedGenerator
    ? `${selectedGenerator.brand} ${selectedGenerator.model} - ${selectedGenerator.powerKw} kW`
    : `Gerador a Biogás ${Math.ceil(biogasProduction.installedPowerKw)} kW`;
  
  const equipmentDescription = `Sistema completo de geração de energia a partir de biogás, incluindo ${biodigestorName.toLowerCase()} e ${generatorName.toLowerCase()}, com todos os equipamentos auxiliares necessários para operação.`;
  
  // Datas da proposta
  const proposalDate = new Date().toLocaleDateString('pt-BR');
  const validityDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');
  
  // 14. Montar resultado básico (compatibilidade com tipo original)
  const basic: ProposalCalculations = {
    totalInvestment: capex.total,
    downPayment,
    monthlyInstallment,
    monthlySavings,
    monthlyRevenue,
    annualSavings,
    paybackMonths: cashFlow.paybackSimple * 12,
    paybackYears: cashFlow.paybackSimple,
    roi20Years: cashFlow.roi,
    dailyBiogasProduction: biogasProduction.dailyBiogasM3,
    dailyEnergyProduction: biogasProduction.dailyEnergyKwh,
    installedPowerKw: biogasProduction.installedPowerKw,
    investmentBreakdown: {
      baseInvestment: capex.biodigestionSystem.subtotal + capex.electricGeneration.subtotal,
      threePhaseGridCost: capex.infrastructure.threePhaseGrid,
      gridDistanceCost: capex.infrastructure.gridDistance
    },
    isViable,
    viabilityIssues,
    technologicalRoute,
    equipmentDetails: {
      biodigestor: biodigestorName,
      generator: generatorName,
      description: equipmentDescription
    },
    taxation: {
      energyTaxRate,
      monthlyTax,
      annualTax
    },
    proposalDate,
    validityDate
  };
  
  return {
    basic,
    biogasProduction,
    capex,
    opex,
    cashFlow,
    selectedBiodigester,
    selectedGenerator
  };
}

/**
 * Função de cálculo simplificada para compatibilidade
 * Usa a nova metodologia por baixo dos panos
 */
export function calculateProposal(
  technical: TechnicalData,
  currentCosts: CurrentCosts,
  financial: FinancialConfig
): ProposalCalculations {
  const result = calculateExpandedProposal(technical, currentCosts, financial);
  return result.basic;
}
