export interface ClientData {
  clientName: string;
  propertyName: string;
  propertyAddress: string;
  cityState: string;
  phone: string;
  email: string;
}

export interface TechnicalData {
  substrate: string;
  volume: number;
  biogasProduction: number;
}

export interface CurrentCosts {
  energyCostKwh: number;
  monthlyEnergyConsumption: number;
  fuelCostLiter: number;
  monthlyFuelConsumption: number;
}

export interface FinancialConfig {
  paymentMethod: 'financing' | 'direct';
  downPaymentPercentage: number;
  installments: number;
  interestRate: number;
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
}

export interface ProposalData {
  client: ClientData;
  technical: TechnicalData;
  currentCosts: CurrentCosts;
  financial: FinancialConfig;
  calculations: ProposalCalculations;
}
