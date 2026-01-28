// Componente para exibição do fluxo de caixa projetado

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CashFlowYear, ProjectedCashFlow } from '@/types/expandedProposal';
import { formatCurrency } from '@/utils/financialIndicators';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  cashFlow: ProjectedCashFlow;
  showDetails?: boolean;
}

export function CashFlowTable({ cashFlow, showDetails = false }: Props) {
  const [expanded, setExpanded] = useState(showDetails);
  const [displayYears, setDisplayYears] = useState(10);
  
  const yearsToShow = cashFlow.years.slice(0, displayYears);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Fluxo de Caixa Projetado</CardTitle>
            <CardDescription>
              Projeção de {cashFlow.projectionYears} anos com TMA de {cashFlow.tmaUsed}%
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Resumido
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Detalhado
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10">Ano</TableHead>
                <TableHead className="text-right">Receita Total</TableHead>
                {expanded && (
                  <>
                    <TableHead className="text-right">Impostos</TableHead>
                    <TableHead className="text-right">OPEX</TableHead>
                    <TableHead className="text-right">Financiamento</TableHead>
                  </>
                )}
                <TableHead className="text-right">Fluxo de Caixa</TableHead>
                <TableHead className="text-right">Acumulado</TableHead>
                {expanded && (
                  <>
                    <TableHead className="text-right">FC Descontado</TableHead>
                    <TableHead className="text-right">VPL Acumulado</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {yearsToShow.map((year) => (
                <TableRow 
                  key={year.year}
                  className={year.accumulatedCashFlow >= 0 ? 'bg-green-50/50 dark:bg-green-950/20' : ''}
                >
                  <TableCell className="sticky left-0 bg-background font-medium">
                    {year.year}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(year.totalRevenue)}
                  </TableCell>
                  {expanded && (
                    <>
                      <TableCell className="text-right text-red-600">
                        -{formatCurrency(year.taxOnRevenue)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        -{formatCurrency(year.opex)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {year.financingPayment > 0 ? `-${formatCurrency(year.financingPayment)}` : '-'}
                      </TableCell>
                    </>
                  )}
                  <TableCell className={`text-right font-medium ${year.simpleCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(year.simpleCashFlow)}
                  </TableCell>
                  <TableCell className={`text-right font-bold ${year.accumulatedCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(year.accumulatedCashFlow)}
                  </TableCell>
                  {expanded && (
                    <>
                      <TableCell className="text-right text-muted-foreground">
                        {formatCurrency(year.discountedCashFlow)}
                      </TableCell>
                      <TableCell className={`text-right ${year.accumulatedDiscounted >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(year.accumulatedDiscounted)}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        
        {displayYears < cashFlow.projectionYears && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDisplayYears(Math.min(displayYears + 10, cashFlow.projectionYears))}
            >
              Mostrar mais anos
            </Button>
          </div>
        )}
        
        {/* Resumo do Fluxo de Caixa */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Receita Total ({cashFlow.projectionYears} anos)</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(cashFlow.years.reduce((sum, y) => sum + y.totalRevenue, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Fluxo Acumulado Final</p>
            <p className={`text-lg font-bold ${cashFlow.years[cashFlow.years.length - 1]?.accumulatedCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(cashFlow.years[cashFlow.years.length - 1]?.accumulatedCashFlow || 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">VPL Final</p>
            <p className={`text-lg font-bold ${cashFlow.vpl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(cashFlow.vpl)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Ano de Payback</p>
            <p className="text-lg font-bold text-primary">
              Ano {Math.ceil(cashFlow.paybackSimple)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
