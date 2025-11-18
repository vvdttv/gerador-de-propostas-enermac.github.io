import { ClientData, TechnicalData, CurrentCosts, FinancialConfig, ProposalCalculations } from '@/types/proposal';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { TrendingUp, DollarSign, Calendar, Zap, Leaf, TrendingDown } from 'lucide-react';

interface Props {
  client: ClientData;
  technical: TechnicalData;
  currentCosts: CurrentCosts;
  financial: FinancialConfig;
  calculations: ProposalCalculations;
}

export function ProposalPreview({ client, calculations, financial }: Props) {
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
      <Card className="p-6 bg-primary/5 border-primary/20">
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

      {/* Investment Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-8 w-8 text-primary" />
            <h3 className="text-lg font-semibold">Investimento Total</h3>
          </div>
          <p className="text-3xl font-bold text-primary">{formatCurrency(calculations.totalInvestment)}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <h3 className="text-lg font-semibold">Economia Mensal</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(calculations.monthlySavings)}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h3 className="text-lg font-semibold">Payback</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{formatNumber(calculations.paybackYears)} anos</p>
        </Card>
      </div>

      {/* Financial Details */}
      <Card className="p-6">
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
      <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
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
            <p className="text-2xl font-bold text-green-600">{formatCurrency(calculations.annualSavings)}</p>
            <p className="text-sm text-muted-foreground mt-1">Redução nos custos com energia</p>
          </div>

          <div className="p-4 bg-background/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Receita Líquida Mensal</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(calculations.monthlyRevenue)}</p>
            <p className="text-sm text-muted-foreground mt-1">Após deduzir a parcela do financiamento</p>
          </div>

          <div className="p-4 bg-background/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Retorno do Investimento</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatNumber(calculations.paybackMonths)} meses</p>
            <p className="text-sm text-muted-foreground mt-1">Tempo para recuperar o investimento</p>
          </div>

          <div className="p-4 bg-background/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">ROI em 20 anos</h3>
            </div>
            <p className="text-2xl font-bold text-primary">{formatNumber(calculations.roi20Years)}%</p>
            <p className="text-sm text-muted-foreground mt-1">Retorno sobre o investimento</p>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="p-8 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-primary/40">
        <div className="text-center space-y-4">
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
          <div className="pt-4">
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
