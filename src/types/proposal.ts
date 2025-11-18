export interface ClientData {
  clientName: string;
  propertyName: string;
  propertyAddress: string;
  cityState: string;
  phone: string;
  email: string;
  consultantName: string;
  consultantPhone: string;
  consultantEmail: string;
}

export interface LivestockComposition {
  type: string;
  class: string;
  quantity: number;
  confinementTime: number;
}

export interface OtherSubstrate {
  type: string;
  volume: number;
  unit: string;
}

export interface TechnicalData {
  livestockComposition: LivestockComposition[];
  otherSubstrates: OtherSubstrate[];
  hasThreePhaseGrid: boolean;
  gridDistance: number;
  state: string;
}

export interface CurrentCosts {
  energyCostKwh: number;
  monthlyEnergyConsumption: number;
}

export interface FinancialConfig {
  paymentMethod: 'financing' | 'direct';
  downPaymentPercentage: number;
  installments: number;
  monthlyInterestRate: number;
  interestType: 'simple' | 'compound';
}

export interface ProposalCalculations {
  totalInvestment: number;
  downPayment: number;
  monthlyInstallment: number;
  monthlySavings: number;
  monthlyRevenue: number;
  annualSavings: number;
  paybackMonths: number;
  paybackYears: number;
  roi20Years: number;
  dailyBiogasProduction: number;
  dailyEnergyProduction: number;
  installedPowerKw: number;
  investmentBreakdown: {
    baseInvestment: number;
    threePhaseGridCost: number;
    gridDistanceCost: number;
  };
  isViable: boolean;
  viabilityIssues: string[];
  technologicalRoute: string;
  equipmentDetails: {
    biodigestor: string;
    generator: string;
    description: string;
  };
  taxation: {
    energyTaxRate: number;
    monthlyTax: number;
    annualTax: number;
  };
  proposalDate: string;
  validityDate: string;
}

export interface ProposalData {
  client: ClientData;
  technical: TechnicalData;
  currentCosts: CurrentCosts;
  financial: FinancialConfig;
  calculations: ProposalCalculations;
}
