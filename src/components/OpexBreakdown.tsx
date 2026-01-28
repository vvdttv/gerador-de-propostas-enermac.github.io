// Componente para exibição do breakdown de OPEX

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DetailedOpex } from '@/types/expandedProposal';
import { getOpexSummary } from '@/utils/opexCalculations';
import { formatCurrency } from '@/utils/financialIndicators';
import { Progress } from '@/components/ui/progress';

interface Props {
  opex: DetailedOpex;
}

export function OpexBreakdown({ opex }: Props) {
  const summary = getOpexSummary(opex);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custos Operacionais (OPEX)</CardTitle>
        <CardDescription>
          Custo mensal: {formatCurrency(opex.monthlyTotal)} | 
          Custo anual: {formatCurrency(opex.annualTotal)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary.map((item) => (
          <div key={item.category} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">{item.category}</span>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">
                  {item.percentage.toFixed(1)}%
                </span>
                <span className="font-semibold min-w-[100px] text-right">
                  {formatCurrency(item.value)}/mês
                </span>
              </div>
            </div>
            <Progress 
              value={item.percentage} 
              className="h-2"
            />
          </div>
        ))}
        
        {/* Resumo */}
        <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Mensal</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(opex.monthlyTotal)}
            </p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Anual</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(opex.annualTotal)}
            </p>
          </div>
        </div>
        
        {/* Nota explicativa */}
        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/30 rounded">
          <p className="font-medium mb-1">Composição do OPEX:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Manutenção preventiva e corretiva de todos os equipamentos</li>
            <li>Operação do sistema (mão de obra)</li>
            <li>Custos administrativos e gerenciais</li>
            <li>Logística (se aplicável biomassa externa)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
