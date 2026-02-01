import type { PreProposalResult as PreProposalResultType, PreProposalInput } from '@/types/preProposal';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  ArrowLeft,
  CreditCard,
  PiggyBank,
  Target,
  BarChart3
} from 'lucide-react';

interface Props {
  result: PreProposalResultType;
  input: PreProposalInput;
  onBack: () => void;
  onSwitchToSimple?: () => void;
}

export function PreProposalResultView({ result, input, onBack, onSwitchToSimple }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 1) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">Pré-Proposta de Investimento</h1>
        <p className="text-lg text-muted-foreground">
          {input.clientName} - {input.propertyName || 'Propriedade'}
        </p>
        <Badge variant={result.isViable ? 'default' : 'destructive'} className="text-sm">
          {result.isViable ? '✓ Projeto Viável' : '⚠ Requer Ajustes'}
        </Badge>
      </div>

      {/* Viabilidade Alert */}
      {!result.isViable && (
        <Card className="p-4 bg-destructive/10 border-destructive/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Atenção</p>
              <p className="text-sm text-muted-foreground">{result.viabilityMessage}</p>
            </div>
          </div>
        </Card>
      )}

      {result.isViable && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-primary">Projeto Viável!</p>
              <p className="text-sm text-muted-foreground">{result.viabilityMessage}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Produção Estimada */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Produção Estimada
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-3xl font-bold text-primary">{formatNumber(result.dailyBiogasProduction)}</p>
            <p className="text-sm text-muted-foreground">m³ biogás/dia</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-3xl font-bold text-primary">{formatNumber(result.dailyEnergyProduction)}</p>
            <p className="text-sm text-muted-foreground">kWh/dia</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-3xl font-bold text-primary">{formatNumber(result.installedPowerKw)}</p>
            <p className="text-sm text-muted-foreground">kW instalados</p>
          </div>
        </div>
      </Card>

      {/* 1. Valor de Investimento Estimado */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          1. Valor de Investimento Estimado
        </h2>
        
        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-primary">{formatCurrency(result.totalInvestment)}</p>
          <p className="text-muted-foreground">Investimento total estimado</p>
        </div>

        <Separator className="my-4" />
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Equipamentos</p>
            <p className="text-lg font-semibold">{formatCurrency(result.investmentBreakdown.equipment)}</p>
            <p className="text-xs text-muted-foreground">Biodigestor + Gerador</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Instalação</p>
            <p className="text-lg font-semibold">{formatCurrency(result.investmentBreakdown.installation)}</p>
            <p className="text-xs text-muted-foreground">Montagem e configuração</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Infraestrutura</p>
            <p className="text-lg font-semibold">{formatCurrency(result.investmentBreakdown.infrastructure)}</p>
            <p className="text-xs text-muted-foreground">Rede elétrica e conexões</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-primary/5 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Economia Mensal Estimada</p>
              <p className="text-sm text-muted-foreground">Redução na conta de energia</p>
            </div>
            <p className="text-2xl font-bold text-primary">{formatCurrency(result.monthlySavings)}</p>
          </div>
        </div>
      </Card>

      {/* 2. Opções de Pagamento */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          2. Opções de Pagamento
        </h2>
        
        <div className="space-y-4">
          {result.paymentOptions.map((option, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border-2 ${
                option.monthlyBalance >= 0 
                  ? 'border-primary/30 bg-primary/5' 
                  : 'border-muted bg-muted/30'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{option.name}</h3>
                    {option.monthlyBalance >= 0 && (
                      <Badge variant="default" className="text-xs">Recomendado</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Entrada</p>
                    <p className="font-semibold">{formatCurrency(option.downPaymentValue)}</p>
                    <p className="text-xs text-muted-foreground">({option.downPaymentPercentage}%)</p>
                  </div>
                  {option.installments > 1 && (
                    <>
                      <div>
                        <p className="text-xs text-muted-foreground">Parcela</p>
                        <p className="font-semibold">{formatCurrency(option.monthlyInstallment)}</p>
                        <p className="text-xs text-muted-foreground">{option.installments}x</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Taxa</p>
                        <p className="font-semibold">{formatNumber(option.interestRate)}%</p>
                        <p className="text-xs text-muted-foreground">ao mês</p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Saldo Mensal</p>
                    <p className={`font-bold ${option.monthlyBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
                      {formatCurrency(option.monthlyBalance)}
                    </p>
                    <p className="text-xs text-muted-foreground">economia - parcela</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          * O saldo mensal representa a diferença entre a economia gerada e a parcela do financiamento. 
          Valores positivos indicam que o projeto "se paga" desde o primeiro mês.
        </p>
      </Card>

      {/* 3. Projeção de ROI */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          3. Projeção de ROI (Retorno sobre Investimento)
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Indicadores Principais */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4" />
              Indicadores Principais
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">TIR (Taxa Interna de Retorno)</p>
                  <p className="text-xs text-muted-foreground">Rentabilidade anual do investimento</p>
                </div>
                <p className="text-xl font-bold text-primary">{formatNumber(result.roi.tir)}%</p>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">VPL (Valor Presente Líquido)</p>
                  <p className="text-xs text-muted-foreground">TMA de 12,18% a.a.</p>
                </div>
                <p className={`text-xl font-bold ${result.roi.vpl >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {formatCurrency(result.roi.vpl)}
                </p>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Payback Simples</p>
                  <p className="text-xs text-muted-foreground">Tempo para recuperar o investimento</p>
                </div>
                <p className="text-xl font-bold text-primary">{formatNumber(result.roi.paybackYears)} anos</p>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Payback Descontado</p>
                  <p className="text-xs text-muted-foreground">Considerando valor do dinheiro no tempo</p>
                </div>
                <p className="text-xl font-bold text-primary">{formatNumber(result.roi.paybackDiscounted)} anos</p>
              </div>
            </div>
          </div>

          {/* ROI por Período */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Retorno por Período
            </h3>
            
            <div className="space-y-3">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Em 5 anos</p>
                  <p className={`text-lg font-bold ${result.roi.roi5Years >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    {formatNumber(result.roi.roi5Years)}%
                  </p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${Math.min(Math.max(result.roi.roi5Years + 100, 0), 200) / 2}%` }}
                  />
                </div>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Em 10 anos</p>
                  <p className={`text-lg font-bold ${result.roi.roi10Years >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    {formatNumber(result.roi.roi10Years)}%
                  </p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${Math.min(Math.max(result.roi.roi10Years / 5, 0), 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Em 20 anos</p>
                  <p className="text-lg font-bold text-primary">{formatNumber(result.roi.roi20Years)}%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }} />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Economia total: {formatCurrency(result.roi.totalSavings20Years)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Premissas utilizadas:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Reajuste anual da tarifa de energia: 6,5%</li>
            <li>Taxa Mínima de Atratividade (TMA): 12,18% a.a. (IPCA + 8%)</li>
            <li>Vida útil do projeto: 20 anos</li>
            <li>Eficiência de conversão: 80%</li>
          </ul>
        </div>
      </Card>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" size="lg" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Nova Simulação
        </Button>
        {onSwitchToSimple && (
          <Button variant="ghost" size="lg" onClick={onSwitchToSimple} className="gap-2">
            Ver versão simplificada
          </Button>
        )}
        <Button size="lg" className="gap-2" onClick={() => window.print()}>
          <TrendingUp className="h-4 w-4" />
          Salvar/Imprimir Pré-Proposta
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-4 border-t">
        <p>Esta é uma estimativa preliminar. Valores podem variar conforme análise técnica detalhada.</p>
        <p className="font-semibold mt-2">Enermac - Energia Renovável</p>
      </div>
    </div>
  );
}
