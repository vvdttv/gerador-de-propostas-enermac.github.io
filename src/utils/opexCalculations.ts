// Cálculo detalhado de OPEX - Metodologia EVTF Enermac

import { DetailedOpex } from '@/types/expandedProposal';

interface OpexInput {
  installedPowerKw: number;
  hasThermal: boolean;
  hasBiomethane: boolean;
  hasOrganomineral: boolean;
  hasExternalBiomass: boolean;
  externalBiomassVolumeKgPerDay?: number;
  biomassTransportDistanceKm?: number;
  hasDedicatedOperator: boolean;
}

// Custos de manutenção mensais de referência (da planilha EVTF)
const MAINTENANCE_COSTS = {
  biodigestion: {
    base: 500,
    perKw: 7.24
  },
  biogasTreatment: {
    base: 100,
    perKw: 0.81
  },
  electricGeneration: {
    base: 1000,
    perKw: 37.41
  },
  thermal: {
    base: 300,
    perKw: 5.0
  },
  biomethane: {
    base: 500,
    perKw: 15.0
  },
  organomineral: {
    fixed: 2500
  }
};

// Custos operacionais de referência
const OPERATION_COSTS = {
  // Operador dedicado (salário + encargos)
  dedicatedOperator: {
    salary: 3500,
    benefits: 1.66 // Fator de encargos (66%)
  },
  // Operação parcial (horas do funcionário existente)
  partialOperation: {
    base: 1500
  },
  // Administrativo
  administrative: {
    fixed: 250
  }
};

// Custo de transporte de biomassa
const BIOMASS_TRANSPORT = {
  costPerKgPerKm: 0.0005 // R$ 0,0005 por kg por km
};

/**
 * Calcula o OPEX detalhado do projeto
 */
export function calculateDetailedOpex(input: OpexInput): DetailedOpex {
  const {
    installedPowerKw,
    hasThermal,
    hasBiomethane,
    hasOrganomineral,
    hasExternalBiomass,
    externalBiomassVolumeKgPerDay = 0,
    biomassTransportDistanceKm = 0,
    hasDedicatedOperator
  } = input;

  // Logística (transporte de biomassa externa)
  const logistics = hasExternalBiomass
    ? Math.round(
        externalBiomassVolumeKgPerDay * 
        biomassTransportDistanceKm * 
        BIOMASS_TRANSPORT.costPerKgPerKm * 
        30 // dias por mês
      )
    : 0;

  // Manutenção do sistema de biodigestão
  const biodigestionMaintenance = Math.round(
    MAINTENANCE_COSTS.biodigestion.base +
    MAINTENANCE_COSTS.biodigestion.perKw * installedPowerKw
  );

  // Manutenção do tratamento de biogás
  const biogasTreatmentMaintenance = Math.round(
    MAINTENANCE_COSTS.biogasTreatment.base +
    MAINTENANCE_COSTS.biogasTreatment.perKw * installedPowerKw
  );

  // Manutenção da geração elétrica
  const electricGenerationMaintenance = Math.round(
    MAINTENANCE_COSTS.electricGeneration.base +
    MAINTENANCE_COSTS.electricGeneration.perKw * installedPowerKw
  );

  // Manutenção do aproveitamento térmico
  const thermalMaintenance = hasThermal
    ? Math.round(
        MAINTENANCE_COSTS.thermal.base +
        MAINTENANCE_COSTS.thermal.perKw * installedPowerKw
      )
    : 0;

  // Manutenção do biometano
  const biomethaneMaintenance = hasBiomethane
    ? Math.round(
        MAINTENANCE_COSTS.biomethane.base +
        MAINTENANCE_COSTS.biomethane.perKw * installedPowerKw
      )
    : 0;

  // Manutenção da fábrica de organomineral
  const organomineralMaintenance = hasOrganomineral
    ? MAINTENANCE_COSTS.organomineral.fixed
    : 0;

  // Operação
  const operation = hasDedicatedOperator
    ? Math.round(
        OPERATION_COSTS.dedicatedOperator.salary *
        OPERATION_COSTS.dedicatedOperator.benefits
      )
    : OPERATION_COSTS.partialOperation.base;

  // Administrativo
  const administrative = OPERATION_COSTS.administrative.fixed;

  // Remuneração de biomassa (se aplicável - geralmente zero para biomassa própria)
  const biomassRemuneration = 0;

  // Totais
  const monthlyTotal = 
    logistics +
    biodigestionMaintenance +
    biogasTreatmentMaintenance +
    electricGenerationMaintenance +
    thermalMaintenance +
    biomethaneMaintenance +
    organomineralMaintenance +
    operation +
    administrative +
    biomassRemuneration;

  const annualTotal = monthlyTotal * 12;

  return {
    logistics,
    biodigestionMaintenance,
    biogasTreatmentMaintenance,
    electricGenerationMaintenance,
    thermalMaintenance,
    biomethaneMaintenance,
    organomineralMaintenance,
    operation,
    administrative,
    biomassRemuneration,
    monthlyTotal,
    annualTotal
  };
}

/**
 * Calcula o OPEX simplificado baseado apenas na potência
 */
export function calculateSimplifiedOpex(installedPowerKw: number): DetailedOpex {
  return calculateDetailedOpex({
    installedPowerKw,
    hasThermal: false,
    hasBiomethane: false,
    hasOrganomineral: false,
    hasExternalBiomass: false,
    hasDedicatedOperator: installedPowerKw >= 100
  });
}

/**
 * Retorna resumo do OPEX por categoria para exibição
 */
export function getOpexSummary(opex: DetailedOpex): { category: string; value: number; percentage: number }[] {
  const categories = [
    { category: 'Logística', value: opex.logistics },
    { category: 'Manut. Biodigestão', value: opex.biodigestionMaintenance },
    { category: 'Manut. Trat. Biogás', value: opex.biogasTreatmentMaintenance },
    { category: 'Manut. Geração Elétrica', value: opex.electricGenerationMaintenance },
    { category: 'Manut. Térmico', value: opex.thermalMaintenance },
    { category: 'Manut. Biometano', value: opex.biomethaneMaintenance },
    { category: 'Manut. Organomineral', value: opex.organomineralMaintenance },
    { category: 'Operação', value: opex.operation },
    { category: 'Administrativo', value: opex.administrative },
    { category: 'Remuneração Biomassa', value: opex.biomassRemuneration }
  ];
  
  return categories
    .filter(c => c.value > 0)
    .map(c => ({
      ...c,
      percentage: opex.monthlyTotal > 0 ? (c.value / opex.monthlyTotal) * 100 : 0
    }));
}

/**
 * Projeta o OPEX para anos futuros com inflação
 */
export function projectOpexWithInflation(
  baseOpex: DetailedOpex,
  inflationRate: number,
  years: number
): number[] {
  const projectedOpex: number[] = [];
  let currentAnnualOpex = baseOpex.annualTotal;
  
  for (let year = 1; year <= years; year++) {
    projectedOpex.push(Math.round(currentAnnualOpex));
    currentAnnualOpex *= (1 + inflationRate / 100);
  }
  
  return projectedOpex;
}
