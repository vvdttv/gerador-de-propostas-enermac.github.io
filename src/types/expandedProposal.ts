// Tipos expandidos para o sistema de propostas Enermac
// Baseado na metodologia EVTF

// =====================================================
// TIPOS DE APLICAÇÃO ENERGÉTICA
// =====================================================

export interface EnergyApplication {
  simultaneousElectricity: number;    // % Eletricidade simultaneidade (sem ICMS TUSD)
  localRemoteElectricity: number;     // % Eletricidade local/remoto (com ICMS TUSD)
  thermal: number;                     // % Térmico (substituição lenha/GLP)
  vehicleFuel: number;                 // % Combustível veicular (biometano)
  glpNaturalGas: number;              // % Substituição GLP/Gás Natural
  biofertilizer: number;              // % Biofertilizante
  biomethane: number;                  // % Biometano para venda
}

// =====================================================
// CONFIGURAÇÃO FINANCEIRA EXPANDIDA
// =====================================================

export interface ExpandedFinancialConfig {
  paymentMethod: 'financing' | 'direct' | 'mixed';
  ownCapitalPercentage: number;       // % Capital próprio
  financingPercentage: number;        // % Financiado
  financingTerm: number;              // Prazo em meses
  gracePeriod: number;                // Carência em meses
  monthlyInterestRate: number;        // Taxa de juros mensal %
  financingAdjustmentRate: number;    // Reajuste anual do financiamento %
  revenueAdjustmentRate: number;      // Reajuste anual da receita % (energia)
  opexInflationRate: number;          // Inflação do OPEX % ao ano
  tma: number;                        // Taxa Mínima de Atratividade %
  amortizationType: 'sac' | 'price';  // Sistema de amortização
  interestType: 'simple' | 'compound';
}

// =====================================================
// ESTRUTURA DE CAPEX DETALHADO
// =====================================================

export interface DetailedCapex {
  // 00. Gerenciamento de Projetos
  projectManagement: {
    executiveProjects: number;
    constructionMonitoring: number;
    gdProject: number;
    pitPlan: number;
    subtotal: number;
  };
  
  // 01. Pré-Tratamento
  pretreatment: {
    civil: number;
    mechanical: number;
    subtotal: number;
  };
  
  // 02. Sistema de Biodigestão
  biodigestionSystem: {
    biodigester: number;
    geomembrane: number;
    agitationSystem: number;
    regulatorValves: number;
    subtotal: number;
  };
  
  // 03. Digestato
  digestate: {
    conductionPiping: number;
    storageLagoon: number;
    subtotal: number;
  };
  
  // 04. Condução e Tratamento do Biogás
  biogasConduction: {
    biodesulfurizer: number;
    dryer: number;
    activatedCarbonFilter: number;
    piping: number;
    subtotal: number;
  };
  
  // 05. Geração de Energia Elétrica
  electricGeneration: {
    generator: number;
    managementPanel: number;
    protectionPanel: number;
    machineHouse: number;
    subtotal: number;
  };
  
  // 06. Aproveitamento Térmico
  thermal: {
    equipment: number;
    installation: number;
    subtotal: number;
  };
  
  // 07. Biometano
  biomethane: {
    purificationSystem: number;
    compression: number;
    storage: number;
    subtotal: number;
  };
  
  // 08. Fábrica de Organomineral
  organomineral: {
    equipment: number;
    civil: number;
    subtotal: number;
  };
  
  // 09. Infraestrutura
  infrastructure: {
    electricalServices: number;
    electricalMaterials: number;
    transformers: number;
    threePhaseGrid: number;
    gridDistance: number;
    subtotal: number;
  };
  
  // Total Geral
  total: number;
}

// =====================================================
// ESTRUTURA DE OPEX DETALHADO
// =====================================================

export interface DetailedOpex {
  // Custos mensais
  logistics: number;                    // Logística (se biomassa externa)
  biodigestionMaintenance: number;      // Manutenção sistema biodigestão
  biogasTreatmentMaintenance: number;   // Manutenção tratamento biogás
  electricGenerationMaintenance: number; // Manutenção geração elétrica
  thermalMaintenance: number;           // Manutenção aproveitamento térmico
  biomethaneMaintenance: number;        // Manutenção biometano
  organomineralMaintenance: number;     // Manutenção fábrica organomineral
  operation: number;                    // Operação (operador dedicado)
  administrative: number;               // Administrativo
  biomassRemuneration: number;          // Remuneração biomassa/biogás
  
  // Totais
  monthlyTotal: number;
  annualTotal: number;
}

// =====================================================
// FLUXO DE CAIXA PROJETADO
// =====================================================

export interface CashFlowYear {
  year: number;
  
  // Receitas
  avoidedCost: number;              // Custo evitado (economia)
  grossRevenue: number;             // Receita bruta (se venda)
  totalRevenue: number;             // Total receitas
  
  // Despesas
  taxOnRevenue: number;             // Impostos sobre receita
  opex: number;                     // Custo operacional
  
  // Financiamento
  amortization: number;             // Amortização do principal
  interest: number;                 // Juros
  financingPayment: number;         // Pagamento total financiamento
  
  // Resultados
  ebit: number;                     // Lucro operacional (EBIT)
  incomeTax: number;                // Imposto de renda
  netProfit: number;                // Lucro líquido
  
  // Fluxo de Caixa
  simpleCashFlow: number;           // Fluxo de caixa simples
  accumulatedCashFlow: number;      // Fluxo acumulado
  discountedCashFlow: number;       // Fluxo descontado (VPL)
  accumulatedDiscounted: number;    // VPL acumulado
}

export interface ProjectedCashFlow {
  years: CashFlowYear[];
  
  // Indicadores Financeiros
  tir: number;                      // Taxa Interna de Retorno %
  vpl: number;                      // Valor Presente Líquido R$
  paybackSimple: number;            // Payback simples em anos
  paybackDiscounted: number;        // Payback descontado em anos
  roi: number;                      // ROI total %
  
  // Parâmetros usados
  tmaUsed: number;                  // TMA utilizada
  projectionYears: number;          // Anos projetados
}

// =====================================================
// TRIBUTAÇÃO DETALHADA
// =====================================================

export interface DetailedTaxation {
  // Taxas por tipo de receita
  energyTaxRate: number;            // Imposto sobre energia %
  biomethaneTaxRate: number;        // Imposto sobre biometano %
  carbonCreditsTaxRate: number;     // Imposto sobre créditos de carbono %
  biofertilizerTaxRate: number;     // Imposto sobre biofertilizante %
  incomeTaxRate: number;            // Imposto de renda %
  
  // ICMS
  icmsTusdRate: number;             // ICMS TUSD % (eletricidade local/remota)
  
  // Valores calculados mensais
  monthlyEnergyTax: number;
  monthlyBiomethaneTax: number;
  monthlyOtherTax: number;
  monthlyTotalTax: number;
  
  // Valores anuais
  annualTotalTax: number;
}

// =====================================================
// EQUIPAMENTOS SELECIONADOS
// =====================================================

export interface SelectedEquipment {
  biodigester: {
    model: string;
    volume: number;
    diameter: number;
    depth: number;
    cost: number;
  };
  
  generator: {
    id: string;
    brand: string;
    model: string;
    powerKw: number;
    biogasConsumption: number;
    cost: number;
    operatingHours: number;
  };
  
  biogasTreatment: {
    biodesulfurizer: string;
    dryer: string;
    filter: string;
    totalCost: number;
  };
  
  solutionPackage?: {
    id: string;
    name: string;
  };
}

// =====================================================
// DADOS TÉCNICOS EXPANDIDOS
// =====================================================

export interface ExpandedTechnicalData {
  livestockComposition: {
    type: string;
    class: string;
    quantity: number;
    confinementTime: number;          // horas por dia
    volatileSolidsKgPerDay?: number;  // kg SV por animal/dia (calculado)
  }[];
  
  otherSubstrates: {
    type: string;
    volume: number;
    unit: string;
  }[];
  
  hasThreePhaseGrid: boolean;
  gridDistance: number;
  state: string;
  
  // Novos campos
  hydraulicRetentionTime: number;     // TRH em dias (padrão 30)
  energyApplication: EnergyApplication;
  targetOperatingHours: number;       // Horas de operação alvo do gerador
}

// =====================================================
// CÁLCULOS EXPANDIDOS
// =====================================================

export interface ExpandedProposalCalculations {
  // Produção
  dailyBiogasProduction: number;
  dailyEnergyProduction: number;
  monthlyEnergyProduction: number;
  installedPowerKw: number;
  operatingHoursPerDay: number;
  biodigesterVolume: number;
  
  // Investimentos
  capex: DetailedCapex;
  totalInvestment: number;
  
  // Custos operacionais
  opex: DetailedOpex;
  
  // Economia e Receita
  monthlySavingsElectricity: number;
  monthlyRevenueBiomethane: number;
  monthlyRevenueThermal: number;
  monthlyRevenueBiofertilizer: number;
  totalMonthlySavings: number;
  totalMonthlyRevenue: number;
  
  // Tributação
  taxation: DetailedTaxation;
  
  // Financiamento
  downPayment: number;
  financedAmount: number;
  monthlyInstallment: number;
  
  // Resultado mensal líquido
  monthlyNetResult: number;
  
  // Indicadores financeiros
  cashFlow: ProjectedCashFlow;
  
  // Viabilidade
  isViable: boolean;
  viabilityIssues: string[];
  viabilityScore: number;             // 0-100
  
  // Equipamentos
  equipment: SelectedEquipment;
  technologicalRoute: string;
  
  // Datas
  proposalDate: string;
  validityDate: string;
}

// =====================================================
// CENÁRIO DE PROPOSTA
// =====================================================

export interface ProposalScenario {
  id: string;
  name: string;
  energyApplication: EnergyApplication;
  calculations: ExpandedProposalCalculations;
}

// =====================================================
// DEFAULTS
// =====================================================

export const DEFAULT_ENERGY_APPLICATION: EnergyApplication = {
  simultaneousElectricity: 100,
  localRemoteElectricity: 0,
  thermal: 0,
  vehicleFuel: 0,
  glpNaturalGas: 0,
  biofertilizer: 0,
  biomethane: 0
};

export const DEFAULT_EXPANDED_FINANCIAL_CONFIG: ExpandedFinancialConfig = {
  paymentMethod: 'financing',
  ownCapitalPercentage: 20,
  financingPercentage: 80,
  financingTerm: 120,
  gracePeriod: 6,
  monthlyInterestRate: 1.04,
  financingAdjustmentRate: 4.0,       // IPCA
  revenueAdjustmentRate: 6.5,         // Reajuste energia
  opexInflationRate: 4.1,             // Inflação geral
  tma: 12.18,                         // IPCA + 8%
  amortizationType: 'price',
  interestType: 'compound'
};

export const DEFAULT_TAXATION_RATES: Partial<DetailedTaxation> = {
  energyTaxRate: 0.10,
  biomethaneTaxRate: 0.15,
  carbonCreditsTaxRate: 0.15,
  biofertilizerTaxRate: 0.15,
  incomeTaxRate: 0,
  icmsTusdRate: 0.25
};
