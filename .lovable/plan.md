
# Plano de Aperfeiçoamento do Sistema de Propostas - Baseado na Planilha EVTF

## Resumo Executivo

Após análise profunda da planilha EVTF (2342_-_EVTF_UPL3200.xlsx), da planilha de Soluções Padronizadas e da transcrição da conversa entre Baduco e Vinícius, identifiquei diversas melhorias significativas para alinhar o sistema atual com a metodologia completa de Estudo de Viabilidade Técnica e Financeira da Enermac.

---

## 1. Melhorias no Cálculo de Produção de Biogás

### 1.1 Fator de Sólidos Voláteis
**Situação Atual:** O sistema usa um fator direto simplificado (biogasPerM3).

**Melhoria Necessária:** Implementar o cálculo baseado em sólidos voláteis conforme a planilha:
- Cada animal gera X kg de sólidos voláteis por dia
- Cada kg de sólido volátil produz 474,5 litros de biogás (suínos)
- Fator de eficiência de 80% (real vs laboratorial)

**Dados da Transcrição:**
```
Linha 233: "0.72 kg de sólidos voláteis por cabeça de animal"
Linha 253-257: "474,5 litros de biogás por quilo de sólido volátil"
Linha 429: "Eficiência de processo: 80%"
```

### 1.2 Tempo de Retenção Hidráulica (TRH)
**Adicionar campo:** Permitir configurar TRH (padrão 30 dias) para calcular volume do biodigestor.

**Da Transcrição (linha 353-357):**
```
"Ponto ótimo em laboratório: 27 dias
Padrão comercial: 30 dias
Casos especiais como vinhaça: 7 dias"
```

---

## 2. Novos Tipos de Consumo e Aplicação Energética

### 2.1 Modalidades de Consumo (da planilha EVTF)
Adicionar opções de aplicação do biogás:
- **Eletricidade Simultaneidade:** Gera e consome ao mesmo tempo (não paga ICMS TUSD)
- **Eletricidade Local/Remoto:** Injeta na rede e consome depois (paga ICMS TUSD)
- **Térmico:** Substituição de lenha/GLP para aquecimento
- **Combustível Veicular:** Biometano para veículos
- **GLP/Gás Natural:** Substituição para uso industrial
- **Biofertilizante:** Economia com fertilizantes orgânicos

### 2.2 Diferenciação Financeira vs Econômica
```
Econômico = Consumo próprio (economia, não tributado sobre venda)
Financeiro = Venda para terceiros (receita, tributado)
```

---

## 3. Cálculo de CAPEX Detalhado

### 3.1 Estrutura de Investimento (da planilha)
Implementar breakdown completo:

```
00. Gerenciamento de Projetos
    - Projetos Executivos
    - Acompanhamento de Obra
    - Projeto de GD (micro/minigeração)
    - Plano de Inspeção e Testes (PIT)

01. Pré-Tratamento
    - Civil (escavação, tanque de concreto)
    - Mecânica (tubulações, homogeneizador, bomba)

02. Sistema de Biodigestão
    - Biodigestor (circular ou retangular conforme volume)
    - Geomembrana (PEAD inferior + PEBDL superior)
    - Sistema de agitação
    - Válvulas reguladoras

03. Digestato
    - Tubulação de condução
    - Lagoa de armazenamento

04. Condução e Tratamento do Biogás
    - Biodessulfurizador
    - Secador/Desumidificador
    - Filtro de carvão ativado

05. Geração de Energia Elétrica
    - Grupo motogerador
    - Painel de gerenciamento (PGGP)
    - Painel de proteção (PPS)
    - Casa de máquinas

06. Aproveitamento Térmico (se aplicável)
07. Biometano (se aplicável)
08. Fábrica de Organomineral (se aplicável)
09. Infraestrutura
    - Serviços elétricos
    - Materiais elétricos
    - Transformadores
```

### 3.2 Tabela de Biodigestores Padronizados
Usar dados da planilha (página 10):

| Volume | Diâmetro | Profundidade | Geomembrana | Mão de Obra | Total Estimado |
|--------|----------|--------------|-------------|-------------|----------------|
| 1.500 m³ | 25m | 4,5m | R$ 70.847 | R$ 16.680 | R$ 131.623 |
| 2.000 m³ | 28m | 4,5m | R$ 92.217 | R$ 18.070 | R$ 154.463 |
| 2.500 m³ | 30m | 4,5m | R$ 106.271 | R$ 19.460 | R$ 206.590 |
| 3.000 m³ | 34m | 4,5m | R$ 127.641 | R$ 20.850 | R$ 229.414 |
| 3.500 m³ | 36m | 4,5m | R$ 127.641 | R$ 22.240 | R$ 230.860 |
| 4.000 m³ | 38m | 4,5m | R$ 141.694 | R$ 23.630 | R$ 285.172 |
| 4.500 m³ | 40m | 4,5m | R$ 163.064 | R$ 25.020 | R$ 307.979 |
| 5.000 m³ | 42m | 4,5m | R$ 163.064 | R$ 26.410 | R$ 312.017 |

---

## 4. Cálculo de OPEX (Custos Operacionais)

### 4.1 Categorias de OPEX (da planilha página 17)
```
1. LOGÍSTICA (se biomassa externa)
2. MANUTENÇÃO SISTEMA DE BIODIGESTÃO - R$ 1.042,80/mês
3. MANUTENÇÃO TRATAMENTO DE BIOGÁS - R$ 160,50/mês
4. MANUTENÇÃO GERAÇÃO ELÉTRICA - R$ 3.805,70/mês
5. MANUTENÇÃO APROVEITAMENTO TÉRMICO - R$ 0,00/mês
6. MANUTENÇÃO BIOMETANO - R$ 0,00/mês
7. MANUTENÇÃO FÁBRICA ORGANOMINERAL - R$ 0,00/mês
8. OPERAÇÃO (operador dedicado) - R$ 9.312,10/mês
9. ADMINISTRATIVO - R$ 250,00/mês
10. REMUNERAÇÃO BIOMASSA/BIOGÁS - Variável
```

**Total OPEX Mensal Estimado:** R$ 14.571,10

---

## 5. Fluxo de Caixa Projetado (20 anos)

### 5.1 Estrutura do Fluxo (da planilha página 18)
Implementar fluxo de caixa ano a ano:

```typescript
interface CashFlow {
  year: number;
  avoidedCost: number;      // Custo evitado (economia)
  grossRevenue: number;      // Receita bruta (se venda)
  taxOnRevenue: number;      // Impostos sobre receita
  opex: number;              // Custo operacional
  amortization: number;      // Amortização do financiamento
  interest: number;          // Juros do financiamento
  ebit: number;              // Lucro operacional
  incomeTax: number;         // Imposto de renda
  netProfit: number;         // Lucro líquido
  simpleCashFlow: number;    // Fluxo de caixa simples
  accumulatedCashFlow: number;  // Fluxo acumulado
  discountedCashFlow: number;   // Fluxo descontado (VPL)
  accumulatedDiscounted: number; // VPL acumulado
}
```

### 5.2 Indicadores Financeiros
Calcular e exibir:
- **TIR (Taxa Interna de Retorno):** Usando fórmula IRR
- **VPL (Valor Presente Líquido):** Usando TMA configurável
- **TMA (Taxa Mínima de Atratividade):** IPCA + 8% = 12.18% (padrão)
- **Payback Simples:** Em anos
- **Payback Descontado:** Em anos

---

## 6. Modelos de Geradores Padronizados

### 6.1 Tabela de Geradores (da planilha)
| Modelo | Potência | Consumo Biogás | Fator Conversão |
|--------|----------|----------------|-----------------|
| FPT 4C | 75 kW | 40 m³/hora | 1.88 kWh/m³ |
| Scania | 120 kW | Variável | 2.20 kWh/m³ |
| GMG 260 | 260 kW | Variável | 2.20 kWh/m³ |

### 6.2 Cálculo de Horas de Operação
```
Horas de operação/dia = Produção diária de biogás / Consumo horário do gerador
```
**Exemplo:** 560 m³/dia ÷ 40 m³/hora = 14 horas de operação

---

## 7. Configuração de Financiamento Aprimorada

### 7.1 Parâmetros Adicionais (da planilha página 13)
- **Capital Próprio vs Financiado:** Percentual configurável
- **Prazo de Financiamento:** Em meses (até 120)
- **Carência:** Período inicial sem amortização (6 meses padrão)
- **Reajuste do Financiamento:** % ao ano (IPCA = 4%)
- **Reajuste da Receita:** % ao ano (energia = 6.5%)
- **Reajuste OPEX (Inflação):** % ao ano (4.1%)

### 7.2 Amortização SAC vs PRICE
Implementar ambos os sistemas de amortização.

---

## 8. Tributação Detalhada

### 8.1 Tipos de Impostos (da planilha)
```
- Imposto sobre receita energia: 10%
- Imposto sobre receita biometano: 0-15%
- Imposto sobre créditos de carbono: 15%
- Imposto sobre biofertilizante: 15%
- Imposto de renda: 0-27.5% (configurável)
```

### 8.2 ICMS TUSD
Diferenciar entre:
- Simultaneidade: Sem ICMS TUSD
- Local/Remoto: Com ICMS TUSD (progressivo)

---

## 9. Interface de Múltiplos Cenários

### 9.1 Comparação de Cenários
Permitir até 3 cenários simultâneos como na planilha:
- **Cenário 1:** Ex: 100% energia elétrica
- **Cenário 2:** Ex: 50% energia + 50% biometano
- **Cenário 3:** Ex: 100% biometano

### 9.2 Dashboard Comparativo
Mostrar lado a lado:
- CAPEX de cada cenário
- OPEX mensal
- Economia/Receita mensal
- TIR, VPL, Payback
- Recomendação de melhor cenário

---

## 10. Implementação Técnica

### 10.1 Novos Tipos TypeScript
```typescript
// Parâmetros de financiamento expandidos
interface ExpandedFinancialConfig {
  ownCapitalPercentage: number;
  financingPercentage: number;
  financingTerm: number;
  gracePeriod: number;
  financingAdjustmentRate: number;
  revenueAdjustmentRate: number;
  opexInflationRate: number;
  tma: number;
  amortizationType: 'sac' | 'price';
}

// Aplicação energética
interface EnergyApplication {
  simultaneousElectricity: number;
  localRemoteElectricity: number;
  thermal: number;
  vehicleFuel: number;
  glpNaturalGas: number;
  biofertilizer: number;
  biomethane: number;
}

// Estrutura de CAPEX
interface DetailedCapex {
  projectManagement: number;
  pretreatment: number;
  biodigestionSystem: number;
  digestate: number;
  biogasConduction: number;
  electricGeneration: number;
  thermal: number;
  biomethane: number;
  organomineral: number;
  infrastructure: number;
  total: number;
}

// Fluxo de caixa projetado
interface ProjectedCashFlow {
  years: CashFlowYear[];
  tir: number;
  vpl: number;
  paybackSimple: number;
  paybackDiscounted: number;
}
```

### 10.2 Novos Arquivos a Criar
1. `src/utils/cashFlowCalculations.ts` - Cálculos de fluxo de caixa e indicadores
2. `src/utils/capexCalculations.ts` - Cálculo detalhado de CAPEX
3. `src/utils/opexCalculations.ts` - Cálculo de custos operacionais
4. `src/utils/financialIndicators.ts` - TIR, VPL, Payback
5. `src/data/equipmentDatabase.ts` - Banco de dados de equipamentos
6. `src/data/biodigestorDatabase.ts` - Tabela de biodigestores padronizados
7. `src/components/forms/EnergyApplicationForm.tsx` - Formulário de aplicação
8. `src/components/CashFlowTable.tsx` - Tabela de fluxo de caixa
9. `src/components/ScenarioComparison.tsx` - Comparação de cenários
10. `src/components/FinancialIndicators.tsx` - Exibição de TIR/VPL

### 10.3 Modificações em Arquivos Existentes
1. `src/types/proposal.ts` - Adicionar novos tipos
2. `src/utils/proposalCalculations.ts` - Integrar novos cálculos
3. `src/components/forms/FinancialConfigForm.tsx` - Expandir opções
4. `src/components/forms/TechnicalDataForm.tsx` - Adicionar TRH e aplicação
5. `src/components/ProposalPreview.tsx` - Exibir novos indicadores
6. `src/components/ProposalForm.tsx` - Adicionar etapas de cenários
7. `src/utils/pptxExport.ts` - Atualizar com novos dados

---

## 11. Cronograma de Implementação Sugerido

### Fase 1: Cálculos Fundamentais (Alta Prioridade)
1. Implementar cálculo de sólidos voláteis
2. Criar banco de dados de biodigestores
3. Criar banco de dados de geradores
4. Implementar cálculo de CAPEX detalhado

### Fase 2: OPEX e Fluxo de Caixa
1. Implementar cálculo de OPEX
2. Criar tabela de fluxo de caixa 20 anos
3. Implementar TIR e VPL
4. Calcular Payback simples e descontado

### Fase 3: Aplicação Energética
1. Adicionar formulário de aplicação energética
2. Implementar diferenciação financeiro vs econômico
3. Adicionar tributação por tipo de aplicação

### Fase 4: Múltiplos Cenários
1. Permitir criação de até 3 cenários
2. Criar dashboard comparativo
3. Atualizar exportação PowerPoint

---

## Resultado Esperado

Após implementação, o sistema será capaz de:

1. **Calcular com precisão** a produção de biogás baseada em sólidos voláteis
2. **Dimensionar corretamente** biodigestores e geradores usando tabelas padronizadas
3. **Detalhar CAPEX** em 10 categorias conforme a planilha EVTF
4. **Calcular OPEX** mensal e anual com todos os custos operacionais
5. **Projetar fluxo de caixa** para 20 anos com reajustes
6. **Calcular indicadores financeiros** (TIR, VPL, Payback)
7. **Comparar cenários** de aplicação energética
8. **Gerar propostas profissionais** com todos os dados técnico-financeiros
