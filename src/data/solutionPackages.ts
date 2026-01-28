// Pacotes de soluções padronizadas Enermac
// Baseado na planilha SOLUÇÃO_COMPLETA_PADRÃO

export interface SolutionPackage {
  id: string;
  name: string;
  animalType: 'Suíno' | 'Bovino' | 'Aves';
  animalClass: string;
  minAnimals: number;
  maxAnimals: number;
  powerKw: number;
  biogasM3PerDay: number;
  energyKwhPerDay: number;
  capexTotal: number;
  opexMonthly: number;
  paybackYears: number;
  tirPercentage: number;
  description: string;
}

// Soluções padronizadas para Suínos Terminação
export const SOLUTION_PACKAGES: SolutionPackage[] = [
  // Suínos Terminação
  {
    id: 'SC1500.75KW',
    name: 'SC1500.75KW - Terminação',
    animalType: 'Suíno',
    animalClass: 'Terminação/Maraã',
    minAnimals: 3000,
    maxAnimals: 5000,
    powerKw: 75,
    biogasM3PerDay: 560,
    energyKwhPerDay: 1050,
    capexTotal: 850000,
    opexMonthly: 14571,
    paybackYears: 4.2,
    tirPercentage: 24.5,
    description: 'Sistema completo para 3.000-5.000 suínos em terminação'
  },
  {
    id: 'SC2000.100KW',
    name: 'SC2000.100KW - Terminação',
    animalType: 'Suíno',
    animalClass: 'Terminação/Maraã',
    minAnimals: 5000,
    maxAnimals: 8000,
    powerKw: 100,
    biogasM3PerDay: 850,
    energyKwhPerDay: 1600,
    capexTotal: 1150000,
    opexMonthly: 18500,
    paybackYears: 3.8,
    tirPercentage: 27.2,
    description: 'Sistema completo para 5.000-8.000 suínos em terminação'
  },
  {
    id: 'SC3000.150KW',
    name: 'SC3000.150KW - Terminação',
    animalType: 'Suíno',
    animalClass: 'Terminação/Maraã',
    minAnimals: 8000,
    maxAnimals: 12000,
    powerKw: 150,
    biogasM3PerDay: 1250,
    energyKwhPerDay: 2400,
    capexTotal: 1650000,
    opexMonthly: 24000,
    paybackYears: 3.5,
    tirPercentage: 29.8,
    description: 'Sistema completo para 8.000-12.000 suínos em terminação'
  },
  {
    id: 'SC4000.200KW',
    name: 'SC4000.200KW - Terminação',
    animalType: 'Suíno',
    animalClass: 'Terminação/Maraã',
    minAnimals: 12000,
    maxAnimals: 18000,
    powerKw: 200,
    biogasM3PerDay: 1700,
    energyKwhPerDay: 3200,
    capexTotal: 2100000,
    opexMonthly: 30000,
    paybackYears: 3.2,
    tirPercentage: 32.1,
    description: 'Sistema completo para 12.000-18.000 suínos em terminação'
  },
  // Suínos Matriz
  {
    id: 'SM1500.50KW',
    name: 'SM1500.50KW - Matriz',
    animalType: 'Suíno',
    animalClass: 'Matriz',
    minAnimals: 800,
    maxAnimals: 1500,
    powerKw: 50,
    biogasM3PerDay: 380,
    energyKwhPerDay: 700,
    capexTotal: 680000,
    opexMonthly: 12000,
    paybackYears: 4.8,
    tirPercentage: 21.2,
    description: 'Sistema completo para 800-1.500 matrizes suínas'
  },
  {
    id: 'SM2000.75KW',
    name: 'SM2000.75KW - Matriz',
    animalType: 'Suíno',
    animalClass: 'Matriz',
    minAnimals: 1500,
    maxAnimals: 2500,
    powerKw: 75,
    biogasM3PerDay: 580,
    energyKwhPerDay: 1050,
    capexTotal: 920000,
    opexMonthly: 15500,
    paybackYears: 4.3,
    tirPercentage: 23.8,
    description: 'Sistema completo para 1.500-2.500 matrizes suínas'
  },
  // Bovinos Confinamento
  {
    id: 'BC2000.75KW',
    name: 'BC2000.75KW - Confinamento',
    animalType: 'Bovino',
    animalClass: 'Terminação Confinamento',
    minAnimals: 500,
    maxAnimals: 1000,
    powerKw: 75,
    biogasM3PerDay: 520,
    energyKwhPerDay: 950,
    capexTotal: 980000,
    opexMonthly: 16000,
    paybackYears: 5.2,
    tirPercentage: 19.5,
    description: 'Sistema completo para 500-1.000 bovinos em confinamento'
  },
  {
    id: 'BC3000.120KW',
    name: 'BC3000.120KW - Confinamento',
    animalType: 'Bovino',
    animalClass: 'Terminação Confinamento',
    minAnimals: 1000,
    maxAnimals: 2000,
    powerKw: 120,
    biogasM3PerDay: 850,
    energyKwhPerDay: 1550,
    capexTotal: 1450000,
    opexMonthly: 22000,
    paybackYears: 4.8,
    tirPercentage: 21.8,
    description: 'Sistema completo para 1.000-2.000 bovinos em confinamento'
  },
  // Aves Poedeiras
  {
    id: 'AP1500.40KW',
    name: 'AP1500.40KW - Poedeiras',
    animalType: 'Aves',
    animalClass: 'Poedeira',
    minAnimals: 80000,
    maxAnimals: 150000,
    powerKw: 40,
    biogasM3PerDay: 280,
    energyKwhPerDay: 500,
    capexTotal: 550000,
    opexMonthly: 10500,
    paybackYears: 5.5,
    tirPercentage: 18.2,
    description: 'Sistema completo para 80.000-150.000 aves poedeiras'
  },
  {
    id: 'AP2000.75KW',
    name: 'AP2000.75KW - Poedeiras',
    animalType: 'Aves',
    animalClass: 'Poedeira',
    minAnimals: 150000,
    maxAnimals: 300000,
    powerKw: 75,
    biogasM3PerDay: 520,
    energyKwhPerDay: 950,
    capexTotal: 850000,
    opexMonthly: 15000,
    paybackYears: 4.8,
    tirPercentage: 21.5,
    description: 'Sistema completo para 150.000-300.000 aves poedeiras'
  }
];

/**
 * Encontra o pacote de solução mais adequado para o tipo e quantidade de animais
 */
export function findSuitableSolutionPackage(
  animalType: string,
  animalClass: string,
  quantity: number
): SolutionPackage | null {
  return SOLUTION_PACKAGES.find(pkg => 
    pkg.animalType === animalType &&
    pkg.animalClass === animalClass &&
    quantity >= pkg.minAnimals &&
    quantity <= pkg.maxAnimals
  ) || null;
}

/**
 * Retorna todas as soluções disponíveis para um tipo de animal
 */
export function getSolutionsByAnimalType(animalType: string): SolutionPackage[] {
  return SOLUTION_PACKAGES.filter(pkg => pkg.animalType === animalType);
}

/**
 * Calcula valores ajustados para quantidade específica de animais
 * (interpolação linear entre pacotes)
 */
export function calculateAdjustedValues(
  animalType: string,
  animalClass: string,
  quantity: number
): Partial<SolutionPackage> | null {
  const package1 = SOLUTION_PACKAGES.find(pkg => 
    pkg.animalType === animalType &&
    pkg.animalClass === animalClass &&
    quantity >= pkg.minAnimals &&
    quantity <= pkg.maxAnimals
  );
  
  if (package1) {
    // Calcula o fator de ajuste baseado na posição dentro da faixa
    const rangeSize = package1.maxAnimals - package1.minAnimals;
    const position = quantity - package1.minAnimals;
    const factor = position / rangeSize;
    
    // Ajusta valores proporcionalmente (simplificado)
    return {
      ...package1,
      biogasM3PerDay: Math.round(package1.biogasM3PerDay * (0.8 + 0.4 * factor)),
      energyKwhPerDay: Math.round(package1.energyKwhPerDay * (0.8 + 0.4 * factor)),
      capexTotal: Math.round(package1.capexTotal * (0.9 + 0.2 * factor)),
      opexMonthly: Math.round(package1.opexMonthly * (0.9 + 0.2 * factor))
    };
  }
  
  return null;
}
