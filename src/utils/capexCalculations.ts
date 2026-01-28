// Cálculo detalhado de CAPEX - Metodologia EVTF Enermac

import { DetailedCapex } from '@/types/expandedProposal';
import { 
  selectBiodigester, 
  calculateRequiredBiodigesterVolume,
  getLivestockBiogasData,
  getSubstrateBiogasData,
  LIVESTOCK_BIOGAS_DATA
} from '@/data/biodigesterDatabase';
import { 
  selectGenerator, 
  calculateGenerationSystemCost,
  getGenerationSystemComponents 
} from '@/data/generatorDatabase';
import { TechnicalData } from '@/types/proposal';

interface CapexInput {
  dailyBiogasProductionM3: number;
  dailyBiomassVolumeM3: number;
  hydraulicRetentionTime: number;
  installedPowerKw: number;
  hasThreePhaseGrid: boolean;
  gridDistance: number;
  hasThermal: boolean;
  hasBiomethane: boolean;
  hasOrganomineral: boolean;
}

/**
 * Calcula o CAPEX detalhado do projeto
 */
export function calculateDetailedCapex(input: CapexInput): DetailedCapex {
  const {
    dailyBiogasProductionM3,
    dailyBiomassVolumeM3,
    hydraulicRetentionTime,
    installedPowerKw,
    hasThreePhaseGrid,
    gridDistance,
    hasThermal,
    hasBiomethane,
    hasOrganomineral
  } = input;

  // Selecionar biodigestor
  const requiredVolume = calculateRequiredBiodigesterVolume(
    dailyBiomassVolumeM3,
    hydraulicRetentionTime
  );
  const biodigester = selectBiodigester(requiredVolume);
  
  // Selecionar gerador
  const generator = selectGenerator(dailyBiogasProductionM3);
  const generatorComponents = generator 
    ? getGenerationSystemComponents(generator.powerKw)
    : getGenerationSystemComponents(installedPowerKw);

  // 00. Gerenciamento de Projetos
  const projectManagement = {
    executiveProjects: Math.round(installedPowerKw * 200), // R$ 200 por kW
    constructionMonitoring: Math.round(installedPowerKw * 150),
    gdProject: 8500, // Projeto de geração distribuída fixo
    pitPlan: 5000,   // Plano de inspeção e testes
    subtotal: 0
  };
  projectManagement.subtotal = 
    projectManagement.executiveProjects +
    projectManagement.constructionMonitoring +
    projectManagement.gdProject +
    projectManagement.pitPlan;

  // 01. Pré-Tratamento
  const pretreatment = {
    civil: Math.round(dailyBiomassVolumeM3 * 800),      // R$ 800 por m³/dia
    mechanical: Math.round(dailyBiomassVolumeM3 * 600), // R$ 600 por m³/dia
    subtotal: 0
  };
  pretreatment.subtotal = pretreatment.civil + pretreatment.mechanical;

  // 02. Sistema de Biodigestão
  const biodigestionSystem = {
    biodigester: biodigester?.civilCost || Math.round(requiredVolume * 50),
    geomembrane: biodigester?.geomembraneCost || Math.round(requiredVolume * 45),
    agitationSystem: Math.round(requiredVolume * 15),
    regulatorValves: 12000,
    subtotal: 0
  };
  biodigestionSystem.subtotal = 
    biodigestionSystem.biodigester +
    biodigestionSystem.geomembrane +
    biodigestionSystem.agitationSystem +
    biodigestionSystem.regulatorValves;

  // 03. Digestato
  const digestate = {
    conductionPiping: Math.round(dailyBiomassVolumeM3 * 200),
    storageLagoon: Math.round(dailyBiomassVolumeM3 * 30 * 25), // 30 dias de armazenamento
    subtotal: 0
  };
  digestate.subtotal = digestate.conductionPiping + digestate.storageLagoon;

  // 04. Condução e Tratamento do Biogás
  const biogasConduction = {
    biodesulfurizer: Math.round(dailyBiogasProductionM3 * 20),
    dryer: Math.round(dailyBiogasProductionM3 * 15),
    activatedCarbonFilter: Math.round(dailyBiogasProductionM3 * 10),
    piping: Math.round(dailyBiogasProductionM3 * 8),
    subtotal: 0
  };
  biogasConduction.subtotal = 
    biogasConduction.biodesulfurizer +
    biogasConduction.dryer +
    biogasConduction.activatedCarbonFilter +
    biogasConduction.piping;

  // 05. Geração de Energia Elétrica
  const electricGeneration = {
    generator: generator?.estimatedCost || Math.round(installedPowerKw * 2500),
    managementPanel: generatorComponents.managementPanel,
    protectionPanel: generatorComponents.protectionPanel,
    machineHouse: generatorComponents.machineHouse,
    subtotal: 0
  };
  electricGeneration.subtotal = 
    electricGeneration.generator +
    electricGeneration.managementPanel +
    electricGeneration.protectionPanel +
    electricGeneration.machineHouse;

  // 06. Aproveitamento Térmico
  const thermal = hasThermal ? {
    equipment: Math.round(installedPowerKw * 800),
    installation: Math.round(installedPowerKw * 300),
    subtotal: 0
  } : {
    equipment: 0,
    installation: 0,
    subtotal: 0
  };
  thermal.subtotal = thermal.equipment + thermal.installation;

  // 07. Biometano
  const biomethane = hasBiomethane ? {
    purificationSystem: Math.round(dailyBiogasProductionM3 * 150),
    compression: Math.round(dailyBiogasProductionM3 * 80),
    storage: Math.round(dailyBiogasProductionM3 * 50),
    subtotal: 0
  } : {
    purificationSystem: 0,
    compression: 0,
    storage: 0,
    subtotal: 0
  };
  biomethane.subtotal = 
    biomethane.purificationSystem +
    biomethane.compression +
    biomethane.storage;

  // 08. Fábrica de Organomineral
  const organomineral = hasOrganomineral ? {
    equipment: 180000,
    civil: 80000,
    subtotal: 260000
  } : {
    equipment: 0,
    civil: 0,
    subtotal: 0
  };

  // 09. Infraestrutura
  const infrastructure = {
    electricalServices: generatorComponents.installation,
    electricalMaterials: Math.round(installedPowerKw * 150),
    transformers: installedPowerKw > 75 ? Math.round(installedPowerKw * 400) : 0,
    threePhaseGrid: hasThreePhaseGrid ? 0 : 20000,
    gridDistance: gridDistance * 500,
    subtotal: 0
  };
  infrastructure.subtotal = 
    infrastructure.electricalServices +
    infrastructure.electricalMaterials +
    infrastructure.transformers +
    infrastructure.threePhaseGrid +
    infrastructure.gridDistance;

  // Total Geral
  const total = 
    projectManagement.subtotal +
    pretreatment.subtotal +
    biodigestionSystem.subtotal +
    digestate.subtotal +
    biogasConduction.subtotal +
    electricGeneration.subtotal +
    thermal.subtotal +
    biomethane.subtotal +
    organomineral.subtotal +
    infrastructure.subtotal;

  return {
    projectManagement,
    pretreatment,
    biodigestionSystem,
    digestate,
    biogasConduction,
    electricGeneration,
    thermal,
    biomethane,
    organomineral,
    infrastructure,
    total
  };
}

/**
 * Calcula a produção diária de biomassa em m³
 */
export function calculateDailyBiomassVolume(technical: TechnicalData): number {
  let totalBiomassM3 = 0;
  
  // Biomassa de animais (estimativa: 0.007 m³ por kg de SV)
  for (const livestock of technical.livestockComposition) {
    const key = `${livestock.type}-${livestock.class}`;
    const livestockData = LIVESTOCK_BIOGAS_DATA.find(
      d => `${d.type}-${d.class}` === key
    );
    
    if (livestockData) {
      const confinementFraction = livestock.confinementTime / 24;
      const dailySV = livestockData.volatileSolidsKgPerDay * livestock.quantity * confinementFraction;
      // Relação aproximada: 1 kg SV = 0.007 m³ de biomassa
      totalBiomassM3 += dailySV * 0.007;
    }
  }
  
  // Biomassa de outros substratos
  for (const substrate of technical.otherSubstrates) {
    // volume em kg/dia, converter para m³ (densidade ~1000 kg/m³)
    totalBiomassM3 += substrate.volume / 1000;
  }
  
  return totalBiomassM3;
}

/**
 * Retorna resumo do CAPEX por categoria para exibição
 */
export function getCapexSummary(capex: DetailedCapex): { category: string; value: number; percentage: number }[] {
  const categories = [
    { category: 'Gerenciamento de Projetos', value: capex.projectManagement.subtotal },
    { category: 'Pré-Tratamento', value: capex.pretreatment.subtotal },
    { category: 'Sistema de Biodigestão', value: capex.biodigestionSystem.subtotal },
    { category: 'Digestato', value: capex.digestate.subtotal },
    { category: 'Tratamento do Biogás', value: capex.biogasConduction.subtotal },
    { category: 'Geração Elétrica', value: capex.electricGeneration.subtotal },
    { category: 'Aproveitamento Térmico', value: capex.thermal.subtotal },
    { category: 'Biometano', value: capex.biomethane.subtotal },
    { category: 'Fábrica Organomineral', value: capex.organomineral.subtotal },
    { category: 'Infraestrutura', value: capex.infrastructure.subtotal }
  ];
  
  return categories
    .filter(c => c.value > 0)
    .map(c => ({
      ...c,
      percentage: (c.value / capex.total) * 100
    }));
}
