import { ClientData, TechnicalData, CurrentCosts, FinancialConfig, ProposalCalculations } from '@/types/proposal';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { TrendingUp, DollarSign, Calendar, Zap, Leaf, TrendingDown, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

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

  const handleExportPPT = () => {
    alert('Funcionalidade de exportação para PPT em desenvolvimento');
  };

  return (
    <div className="space-y-6 print:text-black">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">PROPOSTA COMERCIAL</h1>
        <p className="text-xl font-semibold">Enermac - Energia Renovável</p>
        <p className="text-muted-foreground">Geração de Bioenergia através de Resíduos Orgânicos</p>
      </div>

      <Separator />

      {/* Client Info */}
      <Card className="p-6 bg-primary/5 border-primary/20 print:break-after-page">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          Dados do Cliente
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Cliente</p>
            <p className="font-semibold">{client.clientName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Propriedade</p>
            <p className="font-semibold">{client.propertyName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Endereço</p>
            <p className="font-semibold">{client.propertyAddress}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cidade/Estado</p>
            <p className="font-semibold">{client.cityState}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Telefone</p>
            <p className="font-semibold">{client.phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">E-mail</p>
            <p className="font-semibold">{client.email}</p>
          </div>
        </div>
      </Card>

      {/* Viability Alert */}
      {!calculations.isViable && (
        <Alert variant="destructive" className="print:break-after-page">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">Este projeto apresenta limitações de viabilidade:</p>
              <ul className="list-disc list-inside space-y-1">
                {calculations.viabilityIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Investment Summary */}
      <div className="grid md:grid-cols-3 gap-4 print:break-after-page">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-8 w-8 text-primary" />
            <h3 className="text-lg font-semibold">Investimento Total</h3>
          </div>
          <p className="text-3xl font-bold text-primary mb-2">{formatCurrency(calculations.totalInvestment)}</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>O que está incluído:</strong></p>
            <p>• Equipamentos e instalação: {formatCurrency(calculations.investmentBreakdown.baseInvestment)}</p>
            {calculations.investmentBreakdown.threePhaseGridCost > 0 && (
              <p>• Rede trifásica: {formatCurrency(calculations.investmentBreakdown.threePhaseGridCost)}</p>
            )}
            {calculations.investmentBreakdown.gridDistanceCost > 0 && (
              <p>• Adequação da distância da rede: {formatCurrency(calculations.investmentBreakdown.gridDistanceCost)}</p>
            )}
            <p className="pt-1">Inclui biodigestor, gerador, sistema de purificação e instalação completa.</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <h3 className="text-lg font-semibold">Economia Mensal</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(calculations.monthlySavings)}</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Como economizar:</strong></p>
            <p>• Produção mensal: {formatNumber(calculations.dailyEnergyProduction * 30)} kWh</p>
            <p>• Tarifa atual: {formatCurrency(currentCosts.energyCostKwh)}/kWh</p>
            <p>• Cálculo: {formatNumber(calculations.dailyEnergyProduction * 30)} kWh × {formatCurrency(currentCosts.energyCostKwh)}</p>
            <p className="pt-1">Você deixa de pagar pela energia que o sistema gera, reduzindo drasticamente sua conta.</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h3 className="text-lg font-semibold">Payback</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600 mb-2">{formatNumber(calculations.paybackYears)} anos</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Por que este prazo:</strong></p>
            <p>• Investimento: {formatCurrency(calculations.totalInvestment)}</p>
            <p>• Economia mensal: {formatCurrency(calculations.monthlySavings)}</p>
            <p>• Cálculo: {formatCurrency(calculations.totalInvestment)} ÷ {formatCurrency(calculations.monthlySavings * 12)}/ano</p>
            <p className="pt-1">Após {formatNumber(calculations.paybackYears)} anos, o sistema já se pagou e toda economia vira lucro!</p>
          </div>
        </Card>
      </div>

      {/* Financial Details */}
      <Card className="p-6 print:break-after-page">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Detalhamento Financeiro
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-secondary/30 rounded">
            <span className="font-semibold">Forma de Pagamento:</span>
            <span className="text-lg">
              {financial.paymentMethod === 'financing' ? 'Financiamento Bancário' : 'Direto com Enermac'}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-secondary/30 rounded">
            <span className="font-semibold">Valor de Entrada ({financial.downPaymentPercentage}%):</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(calculations.downPayment)}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-secondary/30 rounded">
            <span className="font-semibold">Valor Financiado:</span>
            <span className="text-lg">{formatCurrency(calculations.totalInvestment - calculations.downPayment)}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-secondary/30 rounded">
            <span className="font-semibold">Número de Parcelas:</span>
            <span className="text-lg">{financial.installments}x</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-secondary/30 rounded">
            <span className="font-semibold">Valor da Parcela:</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(calculations.monthlyInstallment)}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-secondary/30 rounded">
            <span className="font-semibold">Taxa de Juros:</span>
            <span className="text-lg">{formatNumber(financial.monthlyInterestRate)}% ao mês ({financial.interestType === 'simple' ? 'Juros Simples' : 'Juros Compostos'})</span>
          </div>
        </div>
      </Card>

      {/* Benefits */}
      <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 print:break-after-page">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-700">
          <Zap className="h-5 w-5" />
          Seus Benefícios
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-background/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Economia Anual</h3>
            </div>
            <p className="text-2xl font-bold text-green-600 mb-2">{formatCurrency(calculations.annualSavings)}</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Motivo desta economia:</strong></p>
              <p>• Economia mensal: {formatCurrency(calculations.monthlySavings)}</p>
              <p>• Multiplicado por 12 meses</p>
              <p>• Cálculo: {formatCurrency(calculations.monthlySavings)} × 12 = {formatCurrency(calculations.annualSavings)}</p>
              <p className="pt-1">Redução direta e permanente nos custos com energia elétrica da propriedade.</p>
            </div>
          </div>

          <div className="p-4 bg-background/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Receita Líquida Mensal</h3>
            </div>
            <p className="text-2xl font-bold text-green-600 mb-2">{formatCurrency(calculations.monthlyRevenue)}</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>De onde vem este valor:</strong></p>
              <p>• Economia de energia: {formatCurrency(calculations.monthlySavings)}</p>
              <p>• Menos parcela mensal: -{formatCurrency(calculations.monthlyInstallment)}</p>
              <p>• Resultado: {formatCurrency(calculations.monthlySavings)} - {formatCurrency(calculations.monthlyInstallment)}</p>
              <p className="pt-1">Fluxo de caixa positivo todo mês durante o financiamento - você já economiza enquanto paga!</p>
            </div>
          </div>

          <div className="p-4 bg-background/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Retorno do Investimento</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600 mb-2">{formatNumber(calculations.paybackMonths)} meses</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Como chegamos neste resultado:</strong></p>
              <p>• Investimento total: {formatCurrency(calculations.totalInvestment)}</p>
              <p>• Economia mensal: {formatCurrency(calculations.monthlySavings)}</p>
              <p>• Cálculo: {formatCurrency(calculations.totalInvestment)} ÷ {formatCurrency(calculations.monthlySavings)} = {formatNumber(calculations.paybackMonths)} meses</p>
              <p className="pt-1">Tempo necessário para que a soma das economias iguale o investimento inicial.</p>
            </div>
          </div>

          <div className="p-4 bg-background/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">ROI em 20 anos</h3>
            </div>
            <p className="text-2xl font-bold text-primary mb-2">{formatNumber(calculations.roi20Years)}%</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Entenda este retorno:</strong></p>
              <p>• Economia total em 20 anos: {formatCurrency(calculations.annualSavings * 20)}</p>
              <p>• Investimento inicial: {formatCurrency(calculations.totalInvestment)}</p>
              <p>• Cálculo: ({formatCurrency(calculations.annualSavings * 20)} - {formatCurrency(calculations.totalInvestment)}) ÷ {formatCurrency(calculations.totalInvestment)} × 100</p>
              <p className="pt-1">Para cada R$ 1,00 investido, você terá retorno de R$ {formatNumber(1 + calculations.roi20Years/100)} em 20 anos!</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="p-8 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-primary/40 print:break-after-page">
        <div className="text-center space-y-4">
          {calculations.isViable ? (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-primary">
                Este é o Melhor Investimento que Você Pode Fazer!
              </h2>
              <p className="text-lg">
                Transforme seus resíduos orgânicos em <span className="font-bold text-primary">energia limpa</span> e 
                <span className="font-bold text-primary"> economia real</span>.
              </p>
              <p className="text-muted-foreground">
                Com a Enermac, você reduz custos, gera receita adicional e contribui para um futuro sustentável.
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-16 w-16 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-orange-600">
                Projeto Necessita de Ajustes para Viabilização
              </h2>
              <p className="text-lg">
                Identificamos alguns pontos que precisam ser otimizados para tornar este investimento viável.
              </p>
              <div className="text-left space-y-3 mt-4 p-4 bg-background/50 rounded-lg">
                <p className="font-semibold">Por que o projeto não é viável no momento:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {calculations.viabilityIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
                <p className="font-semibold pt-3">Sugestões para viabilizar o projeto:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {calculations.dailyBiogasProduction < 10 && (
                    <li>Aumentar a quantidade de substrato ou plantel para gerar mais biogás (mínimo 10 m³/dia recomendado)</li>
                  )}
                  {calculations.monthlyRevenue < 0 && (
                    <li>Ajustar as condições de financiamento: aumentar entrada, reduzir taxa de juros ou estender o prazo de pagamento</li>
                  )}
                  {calculations.paybackYears > 20 && (
                    <li>Reduzir custos de instalação ou aumentar a produção de energia para melhorar o retorno do investimento</li>
                  )}
                  {calculations.dailyEnergyProduction < currentCosts.monthlyEnergyConsumption / 30 && (
                    <li>Dimensionar um sistema maior que atenda 100% da demanda energética da propriedade</li>
                  )}
                  <li>Considerar a comercialização de biofertilizantes como receita adicional</li>
                  <li>Avaliar programas de incentivos fiscais e linhas de crédito específicas para energia renovável</li>
                  <li>Explorar a possibilidade de venda de excedente de energia para a concessionária</li>
                </ul>
              </div>
              <p className="text-muted-foreground mt-4">
                Nossa equipe técnica está à disposição para ajustar o projeto e encontrar a melhor solução para seu negócio.
              </p>
            </>
          )}
          <div className="pt-4 print:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Download className="h-5 w-5" />
                  Salvar Proposta
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar como PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPPT}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar como PPT
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              Proposta válida por 30 dias | Data: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </Card>

      <div className="text-center text-sm text-muted-foreground pt-4 border-t">
        <p>Enermac - Energia Renovável através de Biogás e Biometano</p>
        <p>Transformando resíduos em oportunidades sustentáveis</p>
      </div>
    </div>
  );
}
