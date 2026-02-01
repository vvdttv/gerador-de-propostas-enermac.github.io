import type { PreProposalInput, PreProposalResult } from '@/types/preProposal';
import { calculatePreProposal } from './preProposalCalculations';

// Configurações para gerar dados realistas (alinhado com PreProposalForm)
const LIVESTOCK_CONFIGS = {
  suino: {
    classes: ['Matriz', 'Crechário (Lâmina d\'água)', 'Terminação/Maraã'],
    quantityRange: { viable: { min: 500, max: 5000 }, nonViable: { min: 50, max: 300 } }
  },
  bovino: {
    classes: ['Matriz UPD', 'Terminação Confinamento'],
    quantityRange: { viable: { min: 200, max: 2000 }, nonViable: { min: 20, max: 100 } }
  },
  aves: {
    classes: ['Poedeira', 'Frango de Corte'],
    quantityRange: { viable: { min: 50000, max: 200000 }, nonViable: { min: 5000, max: 20000 } }
  }
};

const BRAZILIAN_STATES = [
  'PR', 'SC', 'RS', 'SP', 'MG', 'GO', 'MT', 'MS', 'BA', 'TO'
];

const FIRST_NAMES = [
  'João', 'José', 'Carlos', 'Pedro', 'Antônio', 'Paulo', 'Lucas', 'Marcos',
  'Maria', 'Ana', 'Francisca', 'Adriana', 'Juliana', 'Fernanda', 'Patricia'
];

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves',
  'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho'
];

const FARM_NAMES = [
  'Fazenda Boa Vista', 'Sítio São José', 'Fazenda Santa Maria', 'Chácara Esperança',
  'Fazenda Bela Vista', 'Sítio Novo Horizonte', 'Fazenda Sol Nascente', 'Granja São Pedro',
  'Fazenda Três Irmãos', 'Sítio Recanto Verde', 'Fazenda Água Limpa', 'Rancho Feliz'
];

// Helpers
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateClientName(): string {
  return `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`;
}

/**
 * Gera um input de pré-proposta simulado
 */
export function generateMockPreProposalInput(viability: 'viable' | 'nonViable'): PreProposalInput {
  const livestockType = randomItem(['suino', 'bovino', 'aves'] as const);
  const config = LIVESTOCK_CONFIGS[livestockType];
  const quantityRange = config.quantityRange[viability];
  
  // Projetos não viáveis têm características que prejudicam a viabilidade
  const isViable = viability === 'viable';
  
  return {
    clientName: generateClientName(),
    propertyName: randomItem(FARM_NAMES),
    state: randomItem(BRAZILIAN_STATES),
    livestockType,
    livestockClass: randomItem(config.classes),
    livestockQuantity: randomInt(quantityRange.min, quantityRange.max),
    confinementHours: isViable ? randomInt(18, 24) : randomInt(6, 12), // Menos horas = menos dejeto
    monthlyEnergyCost: isViable ? randomFloat(3000, 25000) : randomFloat(500, 2000), // Custo baixo = pouca economia
    energyCostPerKwh: randomFloat(0.65, 0.95),
    hasThreePhaseGrid: isViable ? true : Math.random() > 0.5,
    gridDistance: isViable ? randomInt(0, 500) : randomInt(1000, 5000) // Distância grande = custo alto
  };
}

/**
 * Gera um conjunto de dados simulados
 */
export interface MockDataRow {
  id: string;
  viability: 'Viável' | 'Não Viável';
  input: PreProposalInput;
  result: PreProposalResult;
  createdAt: Date;
}

export function generateMockDataset(
  viableCount: number,
  nonViableCount: number
): MockDataRow[] {
  const dataset: MockDataRow[] = [];
  
  // Gerar casos viáveis
  for (let i = 0; i < viableCount; i++) {
    const input = generateMockPreProposalInput('viable');
    const result = calculatePreProposal(input);
    
    dataset.push({
      id: `viable-${i + 1}`,
      viability: 'Viável',
      input,
      result,
      createdAt: new Date(Date.now() - randomInt(0, 30) * 24 * 60 * 60 * 1000) // Últimos 30 dias
    });
  }
  
  // Gerar casos não viáveis
  for (let i = 0; i < nonViableCount; i++) {
    const input = generateMockPreProposalInput('nonViable');
    const result = calculatePreProposal(input);
    
    dataset.push({
      id: `nonViable-${i + 1}`,
      viability: 'Não Viável',
      input,
      result,
      createdAt: new Date(Date.now() - randomInt(0, 30) * 24 * 60 * 60 * 1000)
    });
  }
  
  // Embaralhar o dataset
  return dataset.sort(() => Math.random() - 0.5);
}

/**
 * Converte o dataset para formato tabular (flat) para análise
 */
export interface FlatDataRow {
  id: string;
  viability: string;
  clientName: string;
  propertyName: string;
  state: string;
  livestockType: string;
  livestockClass: string;
  livestockQuantity: number;
  confinementHours: number;
  monthlyEnergyCost: number;
  energyCostPerKwh: number;
  hasThreePhaseGrid: boolean;
  gridDistance: number;
  dailyBiogasProduction: number;
  dailyEnergyProduction: number;
  installedPowerKw: number;
  totalInvestment: number;
  monthlySavings: number;
  annualSavings: number;
  paybackYears: number;
  tir: number;
  vpl: number;
  roi5Years: number;
  roi10Years: number;
  roi20Years: number;
  isViable: boolean;
  createdAt: string;
}

export function flattenDataset(dataset: MockDataRow[]): FlatDataRow[] {
  return dataset.map(row => ({
    id: row.id,
    viability: row.viability,
    clientName: row.input.clientName,
    propertyName: row.input.propertyName,
    state: row.input.state,
    livestockType: row.input.livestockType,
    livestockClass: row.input.livestockClass,
    livestockQuantity: row.input.livestockQuantity,
    confinementHours: row.input.confinementHours,
    monthlyEnergyCost: row.input.monthlyEnergyCost,
    energyCostPerKwh: row.input.energyCostPerKwh,
    hasThreePhaseGrid: row.input.hasThreePhaseGrid,
    gridDistance: row.input.gridDistance,
    dailyBiogasProduction: row.result.dailyBiogasProduction,
    dailyEnergyProduction: row.result.dailyEnergyProduction,
    installedPowerKw: row.result.installedPowerKw,
    totalInvestment: row.result.totalInvestment,
    monthlySavings: row.result.monthlySavings,
    annualSavings: row.result.annualSavings,
    paybackYears: row.result.roi.paybackYears,
    tir: row.result.roi.tir,
    vpl: row.result.roi.vpl,
    roi5Years: row.result.roi.roi5Years,
    roi10Years: row.result.roi.roi10Years,
    roi20Years: row.result.roi.roi20Years,
    isViable: row.result.isViable,
    createdAt: row.createdAt.toISOString()
  }));
}

/**
 * Exporta dataset como CSV
 */
export function datasetToCSV(dataset: MockDataRow[]): string {
  const flatData = flattenDataset(dataset);
  if (flatData.length === 0) return '';
  
  const headers = Object.keys(flatData[0]);
  const rows = flatData.map(row => 
    headers.map(header => {
      const value = row[header as keyof FlatDataRow];
      // Escapar strings com vírgulas
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return String(value);
    }).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
}

/**
 * Download do CSV
 */
export function downloadCSV(dataset: MockDataRow[], filename: string = 'mock_data.csv'): void {
  const csv = datasetToCSV(dataset);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Estatísticas do dataset
 */
export interface DatasetStats {
  total: number;
  viable: number;
  nonViable: number;
  viablePercentage: number;
  avgInvestment: number;
  avgMonthlySavings: number;
  avgPayback: number;
  avgTir: number;
  byLivestockType: Record<string, number>;
  byState: Record<string, number>;
}

export function calculateDatasetStats(dataset: MockDataRow[]): DatasetStats {
  const viable = dataset.filter(d => d.result.isViable);
  const flatData = flattenDataset(dataset);
  
  const byLivestockType: Record<string, number> = {};
  const byState: Record<string, number> = {};
  
  flatData.forEach(row => {
    byLivestockType[row.livestockType] = (byLivestockType[row.livestockType] || 0) + 1;
    byState[row.state] = (byState[row.state] || 0) + 1;
  });
  
  return {
    total: dataset.length,
    viable: viable.length,
    nonViable: dataset.length - viable.length,
    viablePercentage: (viable.length / dataset.length) * 100,
    avgInvestment: flatData.reduce((sum, r) => sum + r.totalInvestment, 0) / flatData.length,
    avgMonthlySavings: flatData.reduce((sum, r) => sum + r.monthlySavings, 0) / flatData.length,
    avgPayback: flatData.reduce((sum, r) => sum + r.paybackYears, 0) / flatData.length,
    avgTir: flatData.reduce((sum, r) => sum + r.tir, 0) / flatData.length,
    byLivestockType,
    byState
  };
}
