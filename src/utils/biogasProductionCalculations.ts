// Cálculo expandido de produção de biogás - Metodologia de Sólidos Voláteis
// Baseado na transcrição e planilha EVTF

import { TechnicalData } from '@/types/proposal';
import { 
  LIVESTOCK_BIOGAS_DATA, 
  SUBSTRATE_BIOGAS_DATA,
  getLivestockBiogasData,
  getSubstrateBiogasData
} from '@/data/biodigesterDatabase';

interface BiogasProductionResult {
  // Produção total
  dailyBiogasM3: number;
  monthlyBiogasM3: number;
  
  // Detalhamento por fonte
  livestockBiogasM3: number;
  substratesBiogasM3: number;
  
  // Sólidos voláteis
  dailyVolatileSolidsKg: number;
  
  // Energia
  dailyEnergyKwh: number;
  monthlyEnergyKwh: number;
  
  // Potência
  installedPowerKw: number;
  operatingHoursPerDay: number;
  
  // Volume do biodigestor
  dailyBiomassVolumeM3: number;
  requiredBiodigesterVolumeM3: number;
  
  // Breakdown por animal
  detailByLivestock: {
    type: string;
    class: string;
    quantity: number;
    volatileSolidsKg: number;
    biogasM3: number;
  }[];
  
  // Breakdown por substrato
  detailBySubstrate: {
    type: string;
    volumeKg: number;
    biogasM3: number;
  }[];
}

// Constantes de conversão
const CONVERSION_FACTORS = {
  // kWh por m³ de biogás (média de geradores a biogás)
  kwhPerM3Biogas: 2.0,
  
  // Horas de operação padrão do gerador
  defaultOperatingHours: 14,
  
  // Tempo de retenção hidráulica padrão (dias)
  defaultHRT: 30,
  
  // Densidade da biomassa (kg/m³) - aproximação
  biomassDensity: 1000
};

/**
 * Calcula a produção de biogás usando metodologia de sólidos voláteis
 * Mais precisa que o método simplificado anterior
 */
export function calculateBiogasProductionAdvanced(
  technical: TechnicalData,
  hydraulicRetentionTime: number = CONVERSION_FACTORS.defaultHRT,
  targetOperatingHours: number = CONVERSION_FACTORS.defaultOperatingHours
): BiogasProductionResult {
  
  let totalDailyBiogasM3 = 0;
  let totalDailyVolatileSolidsKg = 0;
  let livestockBiogasM3 = 0;
  let substratesBiogasM3 = 0;
  let totalDailyBiomassVolumeM3 = 0;
  
  const detailByLivestock: BiogasProductionResult['detailByLivestock'] = [];
  const detailBySubstrate: BiogasProductionResult['detailBySubstrate'] = [];
  
  // Calcular produção de biogás do plantel
  for (const livestock of technical.livestockComposition) {
    const livestockData = getLivestockBiogasData(livestock.type, livestock.class);
    
    if (livestockData) {
      // Ajustar pelo tempo de confinamento (fração do dia)
      const confinementFraction = livestock.confinementTime / 24;
      
      // Sólidos voláteis produzidos por dia
      const dailySV = livestockData.volatileSolidsKgPerDay * livestock.quantity * confinementFraction;
      
      // Biogás produzido (considerando eficiência do processo)
      // Fórmula: SV (kg) × Produção de biogás (L/kg SV) × Eficiência / 1000 (para m³)
      const dailyBiogas = (dailySV * livestockData.biogasLiterPerKgSV * livestockData.processEfficiency) / 1000;
      
      totalDailyVolatileSolidsKg += dailySV;
      livestockBiogasM3 += dailyBiogas;
      totalDailyBiogasM3 += dailyBiogas;
      
      // Estimar volume de biomassa (dejeto líquido)
      // Relação aproximada: 1 kg SV = 0.007 m³ de dejeto (baseado em 10-15% de sólidos totais)
      totalDailyBiomassVolumeM3 += dailySV * 0.007;
      
      detailByLivestock.push({
        type: livestock.type,
        class: livestock.class,
        quantity: livestock.quantity,
        volatileSolidsKg: Math.round(dailySV * 100) / 100,
        biogasM3: Math.round(dailyBiogas * 100) / 100
      });
    }
  }
  
  // Calcular produção de biogás de outros substratos
  for (const substrate of technical.otherSubstrates) {
    const substrateData = getSubstrateBiogasData(substrate.type);
    
    if (substrateData) {
      // Volume em kg/dia, converter para toneladas
      const volumeInTons = substrate.volume / 1000;
      
      // Biogás produzido (m³/tonelada × toneladas × eficiência)
      const dailyBiogas = volumeInTons * substrateData.biogasM3PerTon * substrateData.processEfficiency;
      
      substratesBiogasM3 += dailyBiogas;
      totalDailyBiogasM3 += dailyBiogas;
      
      // Volume de biomassa (direto em m³)
      totalDailyBiomassVolumeM3 += substrate.volume / CONVERSION_FACTORS.biomassDensity;
      
      detailBySubstrate.push({
        type: substrate.type,
        volumeKg: substrate.volume,
        biogasM3: Math.round(dailyBiogas * 100) / 100
      });
    }
  }
  
  // Calcular energia e potência
  const dailyEnergyKwh = totalDailyBiogasM3 * CONVERSION_FACTORS.kwhPerM3Biogas;
  const monthlyEnergyKwh = dailyEnergyKwh * 30;
  
  // Potência instalada baseada nas horas de operação alvo
  const installedPowerKw = dailyEnergyKwh / targetOperatingHours;
  
  // Volume do biodigestor necessário
  const requiredBiodigesterVolumeM3 = totalDailyBiomassVolumeM3 * hydraulicRetentionTime;
  
  return {
    dailyBiogasM3: Math.round(totalDailyBiogasM3 * 100) / 100,
    monthlyBiogasM3: Math.round(totalDailyBiogasM3 * 30 * 100) / 100,
    livestockBiogasM3: Math.round(livestockBiogasM3 * 100) / 100,
    substratesBiogasM3: Math.round(substratesBiogasM3 * 100) / 100,
    dailyVolatileSolidsKg: Math.round(totalDailyVolatileSolidsKg * 100) / 100,
    dailyEnergyKwh: Math.round(dailyEnergyKwh * 100) / 100,
    monthlyEnergyKwh: Math.round(monthlyEnergyKwh * 100) / 100,
    installedPowerKw: Math.round(installedPowerKw * 100) / 100,
    operatingHoursPerDay: targetOperatingHours,
    dailyBiomassVolumeM3: Math.round(totalDailyBiomassVolumeM3 * 100) / 100,
    requiredBiodigesterVolumeM3: Math.round(requiredBiodigesterVolumeM3),
    detailByLivestock,
    detailBySubstrate
  };
}

/**
 * Calcula a viabilidade mínima do projeto
 */
export function checkMinimumViability(production: BiogasProductionResult): {
  isViable: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = [];
  let score = 100;
  
  // Produção mínima de biogás (10 m³/dia)
  if (production.dailyBiogasM3 < 10) {
    issues.push(`Produção de biogás muito baixa: ${production.dailyBiogasM3} m³/dia (mínimo: 10 m³/dia)`);
    score -= 40;
  } else if (production.dailyBiogasM3 < 50) {
    issues.push(`Produção de biogás abaixo do ideal: ${production.dailyBiogasM3} m³/dia (recomendado: >50 m³/dia)`);
    score -= 15;
  }
  
  // Potência mínima instalada (25 kW para viabilidade econômica)
  if (production.installedPowerKw < 25) {
    issues.push(`Potência instalada muito baixa: ${production.installedPowerKw.toFixed(1)} kW (mínimo recomendado: 25 kW)`);
    score -= 30;
  } else if (production.installedPowerKw < 50) {
    issues.push(`Potência instalada abaixo do ideal: ${production.installedPowerKw.toFixed(1)} kW`);
    score -= 10;
  }
  
  // Volume do biodigestor
  if (production.requiredBiodigesterVolumeM3 > 10000) {
    issues.push(`Volume do biodigestor muito grande: ${production.requiredBiodigesterVolumeM3} m³ (pode requerer projeto customizado)`);
    score -= 10;
  }
  
  const isViable = score >= 50;
  
  return {
    isViable,
    issues,
    score: Math.max(0, score)
  };
}

/**
 * Retorna os tipos de animais disponíveis
 */
export function getAvailableLivestockTypes(): string[] {
  return [...new Set(LIVESTOCK_BIOGAS_DATA.map(d => d.type))];
}

/**
 * Retorna as classes disponíveis para um tipo de animal
 */
export function getAvailableLivestockClasses(type: string): string[] {
  return LIVESTOCK_BIOGAS_DATA
    .filter(d => d.type === type)
    .map(d => d.class);
}

/**
 * Retorna os tipos de substratos disponíveis
 */
export function getAvailableSubstrateTypes(): string[] {
  return SUBSTRATE_BIOGAS_DATA.map(d => d.type);
}
