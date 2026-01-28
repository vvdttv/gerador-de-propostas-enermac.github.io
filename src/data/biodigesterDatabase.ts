// Banco de dados de biodigestores padronizados Enermac
// Baseado na planilha EVTF - Página 10

export interface BiodigesterModel {
  volume: number;           // Volume em m³
  diameter: number;         // Diâmetro em metros
  depth: number;            // Profundidade em metros
  geomembraneCost: number;  // Custo da geomembrana R$
  laborCost: number;        // Custo de mão de obra R$
  civilCost: number;        // Custo civil R$
  totalCost: number;        // Custo total estimado R$
  type: 'circular' | 'rectangular';
}

// Tabela de biodigestores circulares padronizados
export const BIODIGESTER_MODELS: BiodigesterModel[] = [
  {
    volume: 1500,
    diameter: 25,
    depth: 4.5,
    geomembraneCost: 70847,
    laborCost: 16680,
    civilCost: 44096,
    totalCost: 131623,
    type: 'circular'
  },
  {
    volume: 2000,
    diameter: 28,
    depth: 4.5,
    geomembraneCost: 92217,
    laborCost: 18070,
    civilCost: 44176,
    totalCost: 154463,
    type: 'circular'
  },
  {
    volume: 2500,
    diameter: 30,
    depth: 4.5,
    geomembraneCost: 106271,
    laborCost: 19460,
    civilCost: 80859,
    totalCost: 206590,
    type: 'circular'
  },
  {
    volume: 3000,
    diameter: 34,
    depth: 4.5,
    geomembraneCost: 127641,
    laborCost: 20850,
    civilCost: 80923,
    totalCost: 229414,
    type: 'circular'
  },
  {
    volume: 3500,
    diameter: 36,
    depth: 4.5,
    geomembraneCost: 127641,
    laborCost: 22240,
    civilCost: 80979,
    totalCost: 230860,
    type: 'circular'
  },
  {
    volume: 4000,
    diameter: 38,
    depth: 4.5,
    geomembraneCost: 141694,
    laborCost: 23630,
    civilCost: 119848,
    totalCost: 285172,
    type: 'circular'
  },
  {
    volume: 4500,
    diameter: 40,
    depth: 4.5,
    geomembraneCost: 163064,
    laborCost: 25020,
    civilCost: 119895,
    totalCost: 307979,
    type: 'circular'
  },
  {
    volume: 5000,
    diameter: 42,
    depth: 4.5,
    geomembraneCost: 163064,
    laborCost: 26410,
    civilCost: 122543,
    totalCost: 312017,
    type: 'circular'
  },
  {
    volume: 6000,
    diameter: 46,
    depth: 4.5,
    geomembraneCost: 184434,
    laborCost: 29190,
    civilCost: 140000,
    totalCost: 353624,
    type: 'circular'
  },
  {
    volume: 8000,
    diameter: 52,
    depth: 4.5,
    geomembraneCost: 220000,
    laborCost: 35000,
    civilCost: 180000,
    totalCost: 435000,
    type: 'circular'
  },
  {
    volume: 10000,
    diameter: 58,
    depth: 4.5,
    geomembraneCost: 260000,
    laborCost: 42000,
    civilCost: 220000,
    totalCost: 522000,
    type: 'circular'
  }
];

// Parâmetros de produção de biogás por tipo de animal
// Baseado em sólidos voláteis (SV) - metodologia EVTF
export interface LivestockBiogasData {
  type: string;
  class: string;
  volatileSolidsKgPerDay: number;     // kg de sólidos voláteis por animal/dia
  biogasLiterPerKgSV: number;         // litros de biogás por kg de SV
  processEfficiency: number;           // eficiência do processo (80% padrão)
  investmentPerKw: number;             // investimento por kW instalado
}

export const LIVESTOCK_BIOGAS_DATA: LivestockBiogasData[] = [
  // Suínos
  {
    type: 'Suíno',
    class: 'Matriz',
    volatileSolidsKgPerDay: 0.72,
    biogasLiterPerKgSV: 474.5,
    processEfficiency: 0.80,
    investmentPerKw: 8500
  },
  {
    type: 'Suíno',
    class: 'Crechário (Lâmina d\'água)',
    volatileSolidsKgPerDay: 0.25,
    biogasLiterPerKgSV: 474.5,
    processEfficiency: 0.80,
    investmentPerKw: 8500
  },
  {
    type: 'Suíno',
    class: 'Terminação/Maraã',
    volatileSolidsKgPerDay: 0.50,
    biogasLiterPerKgSV: 474.5,
    processEfficiency: 0.80,
    investmentPerKw: 8500
  },
  // Bovinos
  {
    type: 'Bovino',
    class: 'Matriz UPD',
    volatileSolidsKgPerDay: 2.5,
    biogasLiterPerKgSV: 350.0,
    processEfficiency: 0.80,
    investmentPerKw: 9000
  },
  {
    type: 'Bovino',
    class: 'Terminação Confinamento',
    volatileSolidsKgPerDay: 3.0,
    biogasLiterPerKgSV: 350.0,
    processEfficiency: 0.80,
    investmentPerKw: 9000
  },
  // Aves
  {
    type: 'Aves',
    class: 'Poedeira',
    volatileSolidsKgPerDay: 0.025,
    biogasLiterPerKgSV: 450.0,
    processEfficiency: 0.80,
    investmentPerKw: 8000
  },
  {
    type: 'Aves',
    class: 'Frango de Corte',
    volatileSolidsKgPerDay: 0.020,
    biogasLiterPerKgSV: 450.0,
    processEfficiency: 0.80,
    investmentPerKw: 8000
  }
];

// Dados de outros substratos (RSO, RSU, etc.)
export interface SubstrateBiogasData {
  type: string;
  biogasM3PerTon: number;           // m³ de biogás por tonelada
  processEfficiency: number;         // eficiência do processo
  investmentPerKw: number;           // investimento por kW
}

export const SUBSTRATE_BIOGAS_DATA: SubstrateBiogasData[] = [
  {
    type: 'RSO',
    biogasM3PerTon: 81.6,
    processEfficiency: 0.80,
    investmentPerKw: 7500
  },
  {
    type: 'RSU',
    biogasM3PerTon: 100.0,
    processEfficiency: 0.80,
    investmentPerKw: 7800
  },
  {
    type: 'Vinhaça',
    biogasM3PerTon: 25.0,
    processEfficiency: 0.85,
    investmentPerKw: 7000
  },
  {
    type: 'Resíduo Agroindustrial',
    biogasM3PerTon: 60.0,
    processEfficiency: 0.80,
    investmentPerKw: 7500
  }
];

// Tempo de Retenção Hidráulica padrão por tipo de substrato
export const DEFAULT_HRT: Record<string, number> = {
  'Suíno': 30,
  'Bovino': 30,
  'Aves': 30,
  'RSO': 30,
  'RSU': 30,
  'Vinhaça': 7,
  'Resíduo Agroindustrial': 25
};

/**
 * Seleciona o biodigestor mais adequado baseado no volume necessário
 */
export function selectBiodigester(requiredVolume: number): BiodigesterModel | null {
  // Encontra o menor biodigestor que atende ao volume necessário
  const suitable = BIODIGESTER_MODELS.find(b => b.volume >= requiredVolume);
  
  if (suitable) {
    return suitable;
  }
  
  // Se nenhum biodigestor padrão atende, retorna o maior
  // (projeto customizado seria necessário)
  return BIODIGESTER_MODELS[BIODIGESTER_MODELS.length - 1];
}

/**
 * Calcula o volume necessário do biodigestor baseado na produção diária de biomassa
 */
export function calculateRequiredBiodigesterVolume(
  dailyBiomassM3: number,
  hydraulicRetentionTime: number = 30
): number {
  // Volume = produção diária × tempo de retenção
  return dailyBiomassM3 * hydraulicRetentionTime;
}

/**
 * Busca dados de produção de biogás por tipo e classe de animal
 */
export function getLivestockBiogasData(type: string, animalClass: string): LivestockBiogasData | undefined {
  return LIVESTOCK_BIOGAS_DATA.find(
    data => data.type === type && data.class === animalClass
  );
}

/**
 * Busca dados de produção de biogás por tipo de substrato
 */
export function getSubstrateBiogasData(type: string): SubstrateBiogasData | undefined {
  return SUBSTRATE_BIOGAS_DATA.find(data => data.type === type);
}
