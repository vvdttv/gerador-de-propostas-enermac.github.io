import { ClientData, TechnicalData, CurrentCosts, FinancialConfig, ProposalCalculations } from '@/types/proposal';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { TrendingUp, DollarSign, Calendar, Zap, Leaf, AlertTriangle, CheckCircle2, User, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

interface Props {
  client: ClientData;
  technical: TechnicalData;
  currentCosts: CurrentCosts;
  financial: FinancialConfig;
  calculations: ProposalCalculations;
}

export function ProposalPreview({ client, calculations, financial, technical, currentCosts }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:text-black">
      {/* Header */}
      <div className="text-center space-y-2 print:mb-8">
        <h1 className="text-3xl font-bold text-primary print:text-black">PROPOSTA COMERCIAL</h1>
        <p className="text-xl font-semibold">Enermac - Energia Renovável</p>
        <p className="text-muted-foreground print:text-gray-600">Geração de Bioenergia através de Resíduos Orgânicos</p>
      </div>

      <Separator className="print:hidden" />

      {/* Client Info */}
      <Card className="p-6 bg-primary/5 border-primary/20 print:break-after-page print:bg-white print:border-gray-300">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary print:text-black" />
          Dados do Cliente
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">Cliente</p>
            <p className="font-semibold">{client.clientName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">Propriedade</p>
            <p className="font-semibold">{client.propertyName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">Endereço</p>
            <p className="font-semibold">{client.propertyAddress}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">Cidade/Estado</p>
            <p className="font-semibold">{client.cityState}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">Telefone</p>
            <p className="font-semibold">{client.phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">E-mail</p>
            <p className="font-semibold">{client.email}</p>
          </div>
        </div>

        <Separator className="my-4" />

        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <User className="h-5 w-5 text-primary print:text-black" />
          Consultor Responsável
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">Nome</p>
            <p className="font-semibold">{client.consultantName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">Telefone</p>
            <p className="font-semibold">{client.consultantPhone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">E-mail</p>
            <p className="font-semibold">{client.consultantEmail}</p>
          </div>
        </div>
      </Card>

      {/* Technological Route */}
      <Card className="p-6 bg-primary/5 border-primary/20 print:break-after-page print:bg-white print:border-gray-300">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary print:text-black" />
          Rota Tecnológica Escolhida
        </h2>
        <p className="text-muted-foreground leading-relaxed print:text-gray-800">
          {calculations.technologicalRoute}
        </p>
        
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="p-3 bg-background rounded-lg print:bg-gray-50">
            <p className="text-sm text-muted-foreground print:text-gray-600">Produção de Biogás</p>
            <p className="text-lg font-bold">{formatNumber(calculations.dailyBiogasProduction)} m³/dia</p>
          </div>
          <div className="p-3 bg-background rounded-lg print:bg-gray-50">
            <p className="text-sm text-muted-foreground print:text-gray-600">Produção de Energia</p>
            <p className="text-lg font-bold">{formatNumber(calculations.dailyEnergyProduction)} kWh/dia</p>
          </div>
          <div className="p-3 bg-background rounded-lg print:bg-gray-50">
            <p className="text-sm text-muted-foreground print:text-gray-600">Potência Instalada</p>
            <p className="text-lg font-bold">{formatNumber(calculations.installedPowerKw)} kW</p>
          </div>
        </div>
      </Card>

      {/* Viability Status */}
      {!calculations.isViable ? (
        <Alert variant="destructive" className="print:break-after-page print:border-red-300 print:bg-red-50">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>
            <div className="space-y-3">
              <p className="font-bold text-lg">⚠️ Situação Atual do Projeto</p>
              <p className="text-base leading-relaxed">
                Com base na análise técnico-econômica realizada, identificamos que o projeto apresenta <strong>limitações importantes de viabilidade</strong> que precisam ser endereçadas antes de prosseguir com a implementação:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                {calculations.viabilityIssues.map((issue, index) => (
                  <li key={index} className="text-base">{issue}</li>
                ))}
              </ul>
              <div className="mt-4 p-4 bg-background/50 rounded-lg print:bg-white">
                <p className="font-semibold mb-2">💡 Recomendações para Viabilização:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {calculations.dailyBiogasProduction < 10 && (
                    <li>Aumentar a quantidade de substrato ou animais em confinamento para elevar a produção de biogás</li>
                  )}
                  {calculations.monthlyRevenue < 0 && (
                    <li>Considerar aumentar o período de financiamento para reduzir as parcelas mensais ou aumentar o sinal</li>
                  )}
                  {calculations.paybackYears > 20 && (
                    <li>Revisar as condições de financiamento ou avaliar fontes de substrato adicionais para melhorar o retorno</li>
                  )}
                  {calculations.dailyEnergyProduction < currentCosts.monthlyEnergyConsumption / 30 && (
                    <li>Dimensionar o sistema para atender plenamente a demanda energética da propriedade</li>
                  )}
                  <li>Consultar nossa equipe técnica para avaliar alternativas e ajustes no projeto</li>
                </ul>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-green-500 bg-green-50 print:break-after-page">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertDescription>
            <div className="space-y-3">
              <p className="font-bold text-lg text-green-800">✅ Situação Atual do Projeto</p>
              <p className="text-base leading-relaxed text-green-900">
                Excelente notícia! A análise técnico-econômica indica que <strong>o projeto é plenamente viável</strong> e apresenta condições favoráveis para implementação. Os indicadores demonstram:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2 text-green-900">
                <li>Produção de biogás dentro dos parâmetros ideais ({formatNumber(calculations.dailyBiogasProduction)} m³/dia)</li>
                <li>Geração de energia suficiente para atender a demanda da propriedade</li>
                <li>Retorno do investimento em {formatNumber(calculations.paybackYears)} anos, dentro do prazo recomendado</li>
                <li>Fluxo de caixa positivo desde o início das operações</li>
                <li>ROI de {formatNumber(calculations.roi20Years)}% em 20 anos, demonstrando excelente rentabilidade</li>
              </ul>
              <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                <p className="font-semibold mb-2 text-green-800">🎯 Por que avançar com este projeto?</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-green-900">
                  <li>Redução imediata nos custos com energia elétrica</li>
                  <li>Solução sustentável para destinação de resíduos orgânicos</li>
                  <li>Geração de biofertilizante de alta qualidade como subproduto</li>
                  <li>Independência energética e proteção contra aumentos tarifários</li>
                  <li>Valorização da propriedade com tecnologia renovável</li>
                  <li>Conformidade ambiental e possíveis incentivos fiscais</li>
                </ul>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Investment Summary */}
      <div className="grid md:grid-cols-3 gap-4 print:break-after-page">
        <Card className="p-6 print:bg-white print:border-gray-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg print:bg-gray-100">
              <DollarSign className="h-6 w-6 text-primary print:text-black" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground print:text-gray-600">Investimento Total</p>
              <p className="text-2xl font-bold">{formatCurrency(calculations.totalInvestment)}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 print:text-gray-700">
            <strong>Composição:</strong> Biodigestor, gerador, instalação e infraestrutura elétrica necessária.
          </p>
        </Card>

        <Card className="p-6 print:bg-white print:border-gray-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg print:bg-gray-100">
              <TrendingUp className="h-6 w-6 text-primary print:text-black" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground print:text-gray-600">Economia Mensal</p>
              <p className="text-2xl font-bold">{formatCurrency(calculations.monthlySavings)}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 print:text-gray-700">
            <strong>Cálculo:</strong> Produção mensal de {formatNumber(calculations.dailyEnergyProduction * 30)} kWh × {formatCurrency(currentCosts.energyCostKwh)}/kWh
          </p>
        </Card>

        <Card className="p-6 print:bg-white print:border-gray-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg print:bg-gray-100">
              <Calendar className="h-6 w-6 text-primary print:text-black" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground print:text-gray-600">Payback</p>
              <p className="text-2xl font-bold">{formatNumber(calculations.paybackYears)} anos</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 print:text-gray-700">
            <strong>Retorno:</strong> Tempo estimado para recuperar o investimento através das economias geradas.
          </p>
        </Card>
      </div>

      {/* Financial Details */}
      <Card className="p-6 print:break-after-page print:bg-white print:border-gray-300">
        <h2 className="text-xl font-bold mb-4">Detalhamento Financeiro</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground print:text-gray-600">Forma de Pagamento</span>
              <span className="font-semibold">{financial.paymentMethod === 'financing' ? 'Financiamento Bancário' : 'Pagamento Direto'}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground print:text-gray-600">Valor do Sinal ({financial.downPaymentPercentage}%)</span>
              <span className="font-semibold">{formatCurrency(calculations.downPayment)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground print:text-gray-600">Número de Parcelas</span>
              <span className="font-semibold">{financial.installments}x</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground print:text-gray-600">Taxa de Juros Mensal</span>
              <span className="font-semibold">{formatNumber(financial.monthlyInterestRate)}%</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground print:text-gray-600">Tipo de Juros</span>
              <span className="font-semibold">{financial.interestType === 'compound' ? 'Compostos (PRICE)' : 'Simples'}</span>
            </div>
            <div className="flex justify-between py-2 border-b font-bold">
              <span>Valor da Parcela Mensal</span>
              <span className="text-primary print:text-black">{formatCurrency(calculations.monthlyInstallment)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-primary/5 rounded-lg print:bg-gray-50">
              <p className="text-sm text-muted-foreground mb-1 print:text-gray-600">Investimento Base</p>
              <p className="text-lg font-semibold">{formatCurrency(calculations.investmentBreakdown.baseInvestment)}</p>
            </div>
            {calculations.investmentBreakdown.threePhaseGridCost > 0 && (
              <div className="p-4 bg-primary/5 rounded-lg print:bg-gray-50">
                <p className="text-sm text-muted-foreground mb-1 print:text-gray-600">Adaptação Rede Trifásica</p>
                <p className="text-lg font-semibold">{formatCurrency(calculations.investmentBreakdown.threePhaseGridCost)}</p>
              </div>
            )}
            {calculations.investmentBreakdown.gridDistanceCost > 0 && (
              <div className="p-4 bg-primary/5 rounded-lg print:bg-gray-50">
                <p className="text-sm text-muted-foreground mb-1 print:text-gray-600">Extensão de Rede ({technical.gridDistance}m)</p>
                <p className="text-lg font-semibold">{formatCurrency(calculations.investmentBreakdown.gridDistanceCost)}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Benefits */}
      <Card className="p-6 print:break-after-page print:bg-white print:border-gray-300">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary print:text-black" />
          Benefícios do Projeto
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary print:text-black">{formatCurrency(calculations.annualSavings)}</div>
            <p className="text-sm text-muted-foreground print:text-gray-600">Economia Anual</p>
            <p className="text-xs text-muted-foreground print:text-gray-700">
              <strong>Detalhamento:</strong> Economia total no primeiro ano. Com reajuste médio de 6,5% ao ano na tarifa de energia, a economia aumenta progressivamente.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary print:text-black">{formatCurrency(calculations.monthlyRevenue)}</div>
            <p className="text-sm text-muted-foreground print:text-gray-600">Receita Líquida Mensal</p>
            <p className="text-xs text-muted-foreground print:text-gray-700">
              <strong>Cálculo:</strong> Economia mensal ({formatCurrency(calculations.monthlySavings)}) menos parcela mensal ({formatCurrency(calculations.monthlyInstallment)})
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary print:text-black">{formatNumber(calculations.roi20Years)}%</div>
            <p className="text-sm text-muted-foreground print:text-gray-600">ROI em 20 anos</p>
            <p className="text-xs text-muted-foreground print:text-gray-700">
              <strong>Projeção:</strong> Retorno total sobre investimento considerando reajuste anual de 6,5% nas tarifas de energia elétrica.
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 no-print">
        <Button onClick={handleExportPDF} size="lg" className="gap-2">
          Salvar Proposta (PDF)
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-8 border-t print:text-gray-600">
        <p>Esta proposta é válida por 30 dias a partir da data de emissão.</p>
        <p className="mt-2">Enermac - Energia Renovável | contato@enermac.com | (00) 0000-0000</p>
      </div>
    </div>
  );
}
