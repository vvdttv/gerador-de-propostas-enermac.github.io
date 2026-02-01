export interface PreProposalInput {
  // Dados básicos
  clientName: string;
  propertyName: string;
  state: string;
  
  // Composição do plantel (simplificado)
  livestockType: 'suino' | 'bovino' | 'aves' | '';
  livestockClass: string;
  livestockQuantity: number;
  confinementHours: number;
  
  // Custos atuais
  monthlyEnergyCost: number;
  energyCostPerKwh: number;
  
  // Infraestrutura
  hasThreePhaseGrid: boolean;
  gridDistance: number;
}

export interface PaymentStage {
  name: string;
  percentage: number;
  value: number;
  timing: string;
  condition?: string;
}

export interface EnermacPaymentPlan {
  name: string;
  description: string;
  stages: PaymentStage[];
  totalValue: number;
}

export interface PreProposalResult {
  // Produção
  dailyBiogasProduction: number;
  dailyEnergyProduction: number;
  installedPowerKw: number;
  
  // Investimento
  totalInvestment: number;
  investmentBreakdown: {
    equipment: number;
    installation: number;
    infrastructure: number;
  };
  
  // Economia
  monthlySavings: number;
  annualSavings: number;
  
  // Plano de pagamento Enermac
  paymentPlan: EnermacPaymentPlan;
  
  // Indicadores de ROI
  roi: {
    paybackYears: number;
    paybackDiscounted: number;
    roi5Years: number;
    roi10Years: number;
    roi20Years: number;
    totalSavings20Years: number;
    tir: number;
    vpl: number;
  };
  
  // Viabilidade
  isViable: boolean;
  viabilityMessage: string;
}
