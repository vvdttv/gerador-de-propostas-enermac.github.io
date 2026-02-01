import type { PreProposalResult as PreProposalResultType, PreProposalInput } from '@/types/preProposal';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  ArrowLeft,
  Leaf,
  Coins,
  Clock,
  CheckCircle,
  Lightbulb,
  Wallet,
  TrendingUp
} from 'lucide-react';

interface Props {
  result: PreProposalResultType;
  input: PreProposalInput;
  onBack: () => void;
  onSwitchToDetailed: () => void;
}

export function PreProposalResultSimple({ result, input, onBack, onSwitchToDetailed }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  const paybackMonths = Math.round(result.roi.paybackYears * 12);
  const { paymentPlan } = result;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header Simples */}
      <div className="text-center space-y-3 py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          Sua Energia Limpa
        </h1>
        <p className="text-lg text-muted-foreground">
          Proposta para <span className="font-semibold">{input.clientName}</span>
        </p>
      </div>

      {/* Card Principal - Plano de Pagamento */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-primary">
            <Wallet className="h-6 w-6" />
            <span className="text-lg font-semibold">Como funciona o pagamento?</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Parcelamento direto com a Enermac em 5 etapas
          </p>

          <div className="space-y-3 text-left">
            {paymentPlan.stages.map((stage, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-background/80 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{stage.name}</span>
                    <span className="font-bold text-primary">{stage.percentage}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{stage.timing}</p>
                </div>
                <span className="text-sm font-semibold whitespace-nowrap">{formatCurrency(stage.value)}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">Investimento total</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(paymentPlan.totalValue)}</p>
          </div>
        </div>
      </Card>

      {/* Quando Começa a Economizar */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-2">Quando começo a economizar?</h2>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-primary flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                {paybackMonths <= 12 ? 'Em menos de 1 ano!' : `Em aproximadamente ${paybackMonths} meses`}
              </p>
              <p className="text-muted-foreground">
                Sua economia será de <strong>{formatCurrency(result.monthlySavings)}/mês</strong>. 
                Após quitar o investimento, esse valor fica todo no seu bolso!
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Benefícios Simples */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          O que você ganha?
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <Coins className="h-10 w-10 text-primary shrink-0" />
            <div>
              <p className="font-bold text-lg">Economia na conta de luz</p>
              <p className="text-muted-foreground">
                Até <span className="font-bold text-primary">{formatCurrency(result.monthlySavings)}</span> por mês
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <Leaf className="h-10 w-10 text-primary shrink-0" />
            <div>
              <p className="font-bold text-lg">Fim dos problemas com dejetos</p>
              <p className="text-muted-foreground">
                O biodigestor trata o esterco e acaba com o mau cheiro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <TrendingUp className="h-10 w-10 text-primary shrink-0" />
            <div>
              <p className="font-bold text-lg">Energia garantida</p>
              <p className="text-muted-foreground">
                Gerador próprio - sem depender só da rede elétrica
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Resumo em 20 anos */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold text-muted-foreground">Em 20 anos você terá economizado:</p>
          <p className="text-4xl md:text-5xl font-bold text-primary">
            {formatCurrency(result.roi.totalSavings20Years)}
          </p>
          <p className="text-sm text-muted-foreground">
            Isso é dinheiro que hoje vai para a conta de luz
          </p>
        </div>
      </Card>

      {/* Projeto Viável */}
      {result.isViable && (
        <Card className="p-4 bg-primary/10 border-primary/30">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="font-bold text-primary text-lg">Projeto Aprovado!</p>
              <p className="text-sm text-muted-foreground">
                A análise mostra que esse investimento vale a pena para sua propriedade.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Ações */}
      <div className="space-y-3">
        <Button size="lg" className="w-full gap-2 text-lg py-6" onClick={() => window.print()}>
          <TrendingUp className="h-5 w-5" />
          Quero essa proposta!
        </Button>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" size="lg" onClick={onBack} className="flex-1 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Refazer cálculo
          </Button>
          <Button variant="ghost" size="lg" onClick={onSwitchToDetailed} className="flex-1 text-muted-foreground">
            Ver detalhes técnicos
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-4 border-t">
        <p>Valores aproximados. Um técnico visitará sua propriedade para confirmar.</p>
        <p className="font-semibold mt-2 text-primary">Enermac - Energia Renovável</p>
      </div>
    </div>
  );
}
