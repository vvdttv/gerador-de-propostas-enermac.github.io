// Banco de dados de geradores a biogás padronizados Enermac
// Baseado na planilha EVTF

export interface GeneratorModel {
  id: string;
  brand: string;
  model: string;
  powerKw: number;                    // Potência nominal em kW
  biogasConsumptionM3PerHour: number; // Consumo de biogás em m³/hora
  conversionFactor: number;            // kWh por m³ de biogás
  estimatedCost: number;               // Custo estimado R$
  maintenanceCostMonthly: number;      // Custo de manutenção mensal R$
  minOperatingHours: number;           // Horas mínimas de operação/dia
  maxOperatingHours: number;           // Horas máximas de operação/dia
}

// Tabela de geradores a biogás disponíveis
export const GENERATOR_MODELS: GeneratorModel[] = [
  {
    id: 'mwm-25',
    brand: 'MWM',
    model: 'D229-4',
    powerKw: 25,
    biogasConsumptionM3PerHour: 15,
    conversionFactor: 1.67,
    estimatedCost: 85000,
    maintenanceCostMonthly: 1500,
    minOperatingHours: 4,
    maxOperatingHours: 20
  },
  {
    id: 'mwm-40',
    brand: 'MWM',
    model: 'D229-6',
    powerKw: 40,
    biogasConsumptionM3PerHour: 22,
    conversionFactor: 1.82,
    estimatedCost: 120000,
    maintenanceCostMonthly: 2000,
    minOperatingHours: 4,
    maxOperatingHours: 20
  },
  {
    id: 'fpt-75',
    brand: 'FPT',
    model: '4C',
    powerKw: 75,
    biogasConsumptionM3PerHour: 40,
    conversionFactor: 1.88,
    estimatedCost: 180000,
    maintenanceCostMonthly: 3806,
    minOperatingHours: 6,
    maxOperatingHours: 20
  },
  {
    id: 'scania-120',
    brand: 'Scania',
    model: 'SGI-120',
    powerKw: 120,
    biogasConsumptionM3PerHour: 55,
    conversionFactor: 2.18,
    estimatedCost: 280000,
    maintenanceCostMonthly: 5000,
    minOperatingHours: 8,
    maxOperatingHours: 20
  },
  {
    id: 'cat-180',
    brand: 'Caterpillar',
    model: 'G3306',
    powerKw: 180,
    biogasConsumptionM3PerHour: 80,
    conversionFactor: 2.25,
    estimatedCost: 420000,
    maintenanceCostMonthly: 7500,
    minOperatingHours: 8,
    maxOperatingHours: 20
  },
  {
    id: 'gmg-260',
    brand: 'Caterpillar',
    model: 'GMG 260',
    powerKw: 260,
    biogasConsumptionM3PerHour: 118,
    conversionFactor: 2.20,
    estimatedCost: 580000,
    maintenanceCostMonthly: 10000,
    minOperatingHours: 10,
    maxOperatingHours: 20
  },
  {
    id: 'cat-400',
    brand: 'Caterpillar',
    model: 'G3412',
    powerKw: 400,
    biogasConsumptionM3PerHour: 175,
    conversionFactor: 2.29,
    estimatedCost: 850000,
    maintenanceCostMonthly: 15000,
    minOperatingHours: 10,
    maxOperatingHours: 20
  },
  {
    id: 'cat-500',
    brand: 'Caterpillar',
    model: 'G3508',
    powerKw: 500,
    biogasConsumptionM3PerHour: 220,
    conversionFactor: 2.27,
    estimatedCost: 1050000,
    maintenanceCostMonthly: 18000,
    minOperatingHours: 10,
    maxOperatingHours: 20
  }
];

// Componentes auxiliares do sistema de geração
export interface GenerationSystemComponents {
  managementPanel: number;      // Painel de gerenciamento (PGGP)
  protectionPanel: number;      // Painel de proteção (PPS)
  machineHouse: number;         // Casa de máquinas
  installation: number;         // Instalação elétrica
}

// Custos dos componentes por faixa de potência
export function getGenerationSystemComponents(powerKw: number): GenerationSystemComponents {
  if (powerKw <= 50) {
    return {
      managementPanel: 25000,
      protectionPanel: 15000,
      machineHouse: 30000,
      installation: 20000
    };
  } else if (powerKw <= 100) {
    return {
      managementPanel: 35000,
      protectionPanel: 22000,
      machineHouse: 45000,
      installation: 30000
    };
  } else if (powerKw <= 200) {
    return {
      managementPanel: 50000,
      protectionPanel: 30000,
      machineHouse: 65000,
      installation: 45000
    };
  } else if (powerKw <= 300) {
    return {
      managementPanel: 65000,
      protectionPanel: 40000,
      machineHouse: 85000,
      installation: 60000
    };
  } else {
    return {
      managementPanel: 85000,
      protectionPanel: 55000,
      machineHouse: 120000,
      installation: 80000
    };
  }
}

/**
 * Seleciona o gerador mais adequado baseado na produção diária de biogás
 * e horas de operação desejadas
 */
export function selectGenerator(
  dailyBiogasProductionM3: number,
  targetOperatingHours: number = 14
): GeneratorModel | null {
  // Calcula o consumo horário necessário
  const requiredConsumptionPerHour = dailyBiogasProductionM3 / targetOperatingHours;
  
  // Encontra geradores que podem consumir essa quantidade
  const suitable = GENERATOR_MODELS.filter(g => {
    const operatingHours = dailyBiogasProductionM3 / g.biogasConsumptionM3PerHour;
    return operatingHours >= g.minOperatingHours && operatingHours <= g.maxOperatingHours;
  });
  
  if (suitable.length === 0) {
    // Se nenhum gerador atende perfeitamente, escolhe o mais próximo
    return GENERATOR_MODELS.reduce((closest, current) => {
      const currentDiff = Math.abs(current.biogasConsumptionM3PerHour * targetOperatingHours - dailyBiogasProductionM3);
      const closestDiff = Math.abs(closest.biogasConsumptionM3PerHour * targetOperatingHours - dailyBiogasProductionM3);
      return currentDiff < closestDiff ? current : closest;
    });
  }
  
  // Retorna o gerador que melhor aproveita o biogás (maior eficiência)
  return suitable.reduce((best, current) => 
    current.conversionFactor > best.conversionFactor ? current : best
  );
}

/**
 * Calcula as horas de operação diárias do gerador
 */
export function calculateOperatingHours(
  dailyBiogasProductionM3: number,
  generator: GeneratorModel
): number {
  const hours = dailyBiogasProductionM3 / generator.biogasConsumptionM3PerHour;
  return Math.min(hours, generator.maxOperatingHours);
}

/**
 * Calcula a produção diária de energia elétrica
 */
export function calculateDailyEnergyProduction(
  dailyBiogasProductionM3: number,
  generator: GeneratorModel
): number {
  const operatingHours = calculateOperatingHours(dailyBiogasProductionM3, generator);
  return generator.powerKw * operatingHours;
}

/**
 * Calcula o custo total do sistema de geração
 */
export function calculateGenerationSystemCost(generator: GeneratorModel): number {
  const components = getGenerationSystemComponents(generator.powerKw);
  return (
    generator.estimatedCost +
    components.managementPanel +
    components.protectionPanel +
    components.machineHouse +
    components.installation
  );
}
