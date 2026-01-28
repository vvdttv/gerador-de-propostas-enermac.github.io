// Componente para exibição de indicadores financeiros

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectedCashFlow } from '@/types/expandedProposal';
import { formatCurrency, formatPercentage } from '@/utils/financialIndicators';
import { TrendingUp, TrendingDown, Clock, DollarSign, Target, Percent } from 'lucide-react';

interface Props {
  cashFlow: ProjectedCashFlow;
  totalInvestment: number;
}

export function FinancialIndicatorsDisplay({ cashFlow, totalInvestment }: Props) {
  const isGoodTIR = cashFlow.tir > cashFlow.tmaUsed;
  const isGoodVPL = cashFlow.vpl > 0;
  const isGoodPayback = cashFlow.paybackSimple < 7;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* TIR */}
      <Card className={isGoodTIR ? 'border-green-500/50' : 'border-yellow-500/50'}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Percent className="h-4 w-4" />
            Taxa Interna de Retorno (TIR)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${isGoodTIR ? 'text-green-600' : 'text-yellow-600'}`}>
              {formatPercentage(cashFlow.tir)}
            </span>
            {isGoodTIR ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-yellow-600" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            TMA utilizada: {formatPercentage(cashFlow.tmaUsed)}
          </p>
          <Badge variant={isGoodTIR ? 'default' : 'secondary'} className="mt-2">
            {isGoodTIR ? 'Projeto Atrativo' : 'Abaixo da TMA'}
          </Badge>
        </CardContent>
      </Card>

      {/* VPL */}
      <Card className={isGoodVPL ? 'border-green-500/50' : 'border-red-500/50'}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Valor Presente Líquido (VPL)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${isGoodVPL ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(cashFlow.vpl)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Projeção de {cashFlow.projectionYears} anos
          </p>
          <Badge variant={isGoodVPL ? 'default' : 'destructive'} className="mt-2">
            {isGoodVPL ? 'VPL Positivo' : 'VPL Negativo'}
          </Badge>
        </CardContent>
      </Card>

      {/* Payback Simples */}
      <Card className={isGoodPayback ? 'border-green-500/50' : 'border-yellow-500/50'}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Payback Simples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${isGoodPayback ? 'text-green-600' : 'text-yellow-600'}`}>
              {cashFlow.paybackSimple.toFixed(1)}
            </span>
            <span className="text-lg text-muted-foreground">anos</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Payback descontado: {cashFlow.paybackDiscounted.toFixed(1)} anos
          </p>
          <Badge variant={isGoodPayback ? 'default' : 'secondary'} className="mt-2">
            {isGoodPayback ? 'Retorno Rápido' : 'Retorno Longo'}
          </Badge>
        </CardContent>
      </Card>

      {/* ROI Total */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            ROI Total ({cashFlow.projectionYears} anos)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              {formatPercentage(cashFlow.roi)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Retorno sobre o investimento
          </p>
        </CardContent>
      </Card>

      {/* Investimento Total */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Investimento Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {formatCurrency(totalInvestment)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            CAPEX completo do projeto
          </p>
        </CardContent>
      </Card>

      {/* Resumo de Viabilidade */}
      <Card className={
        isGoodTIR && isGoodVPL && isGoodPayback 
          ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
          : isGoodVPL 
            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
            : 'border-red-500 bg-red-50 dark:bg-red-950/20'
      }>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Parecer de Viabilidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {isGoodTIR && isGoodVPL && isGoodPayback ? (
              <>
                <Badge className="bg-green-600">PROJETO VIÁVEL</Badge>
                <p className="text-sm">
                  Todos os indicadores financeiros estão dentro dos parâmetros recomendados.
                </p>
              </>
            ) : isGoodVPL ? (
              <>
                <Badge className="bg-yellow-600">VIÁVEL COM RESSALVAS</Badge>
                <p className="text-sm">
                  O projeto apresenta retorno positivo, mas alguns indicadores precisam de atenção.
                </p>
              </>
            ) : (
              <>
                <Badge variant="destructive">PROJETO INVIÁVEL</Badge>
                <p className="text-sm">
                  Os indicadores financeiros não atendem aos critérios mínimos de viabilidade.
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
