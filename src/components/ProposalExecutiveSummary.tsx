// Componente de Resumo Executivo - Uma página com todas as informações essenciais

import { ClientData, TechnicalData, CurrentCosts, FinancialConfig, ProposalCalculations } from '@/types/proposal';
import { ExpandedCalculationResult } from '@/utils/expandedProposalCalculations';
import { formatCurrency, formatPercentage } from '@/utils/financialIndicators';
import { CheckCircle2, AlertTriangle, Zap, DollarSign, Calendar, TrendingUp, Building2, User } from 'lucide-react';

interface Props {
  client: ClientData;
  technical: TechnicalData;
  currentCosts: CurrentCosts;
  financial: FinancialConfig;
  calculations: ProposalCalculations;
  expandedCalculations?: ExpandedCalculationResult;
}

export function ProposalExecutiveSummary({ 
  client, 
  calculations, 
  financial, 
  technical, 
  currentCosts, 
  expandedCalculations 
}: Props) {
  const cashFlow = expandedCalculations?.cashFlow;
  const tirValue = cashFlow?.tir ?? 0;
  const vplValue = cashFlow?.vpl ?? 0;
  const paybackSimple = cashFlow?.paybackSimple ?? calculations.paybackYears;
  
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="print:block hidden bg-white p-4 text-sm">
      {/* Cabeçalho */}
      <div className="text-center border-b-2 border-primary pb-3 mb-4">
        <h1 className="text-2xl font-bold text-primary">PROPOSTA COMERCIAL - RESUMO EXECUTIVO</h1>
        <p className="text-base font-semibold">Enermac - Sistema de Geração de Energia a Biogás</p>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Cliente */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2 border-b pb-1">
            <Building2 className="h-4 w-4 text-primary" />
            <h2 className="font-bold text-sm">CLIENTE</h2>
          </div>
          <div className="space-y-1 text-xs">
            <p><span className="font-semibold">Nome:</span> {client.clientName}</p>
            <p><span className="font-semibold">Propriedade:</span> {client.propertyName}</p>
            <p><span className="font-semibold">Local:</span> {client.cityState}</p>
            <p><span className="font-semibold">Contato:</span> {client.phone}</p>
          </div>
        </div>

        {/* Consultor */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2 border-b pb-1">
            <User className="h-4 w-4 text-primary" />
            <h2 className="font-bold text-sm">CONSULTOR</h2>
          </div>
          <div className="space-y-1 text-xs">
            <p><span className="font-semibold">Nome:</span> {client.consultantName}</p>
            <p><span className="font-semibold">Telefone:</span> {client.consultantPhone}</p>
            <p><span className="font-semibold">E-mail:</span> {client.consultantEmail}</p>
          </div>
        </div>
      </div>

      {/* Dados Técnicos */}
      <div className="border rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 mb-2 border-b pb-1">
          <Zap className="h-4 w-4 text-primary" />
          <h2 className="font-bold text-sm">DADOS TÉCNICOS DO PROJETO</h2>
        </div>
        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-gray-600">Produção de Biogás</p>
            <p className="text-lg font-bold text-primary">{formatNumber(calculations.dailyBiogasProduction)}</p>
            <p className="text-gray-500">m³/dia</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-gray-600">Energia Gerada</p>
            <p className="text-lg font-bold text-primary">{formatNumber(calculations.dailyEnergyProduction)}</p>
            <p className="text-gray-500">kWh/dia</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-gray-600">Potência Instalada</p>
            <p className="text-lg font-bold text-primary">{formatNumber(calculations.installedPowerKw)}</p>
            <p className="text-gray-500">kW</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-gray-600">Consumo Mensal</p>
            <p className="text-lg font-bold text-primary">{formatNumber(currentCosts.monthlyEnergyConsumption)}</p>
            <p className="text-gray-500">kWh</p>
          </div>
        </div>
        <div className="mt-2 text-xs">
          <p><span className="font-semibold">Equipamentos:</span> {calculations.equipmentDetails.biodigestor} + {calculations.equipmentDetails.generator}</p>
        </div>
      </div>

      {/* Investimento e Financeiro */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Investimento */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2 border-b pb-1">
            <DollarSign className="h-4 w-4 text-primary" />
            <h2 className="font-bold text-sm">INVESTIMENTO</h2>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Investimento Total:</span>
              <span className="font-bold text-lg">{formatCurrency(calculations.totalInvestment)}</span>
            </div>
            <div className="flex justify-between">
              <span>Sinal ({financial.downPaymentPercentage}%):</span>
              <span className="font-semibold">{formatCurrency(calculations.downPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span>Parcela Mensal ({financial.installments}x):</span>
              <span className="font-semibold">{formatCurrency(calculations.monthlyInstallment)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de Juros:</span>
              <span>{formatNumber(financial.monthlyInterestRate)}% a.m.</span>
            </div>
          </div>
        </div>

        {/* Indicadores Financeiros */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2 border-b pb-1">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="font-bold text-sm">INDICADORES FINANCEIROS</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-green-50 rounded">
              <p className="text-gray-600">TIR</p>
              <p className="text-base font-bold text-green-600">{formatPercentage(tirValue)}</p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <p className="text-gray-600">VPL</p>
              <p className="text-base font-bold text-green-600">{formatCurrency(vplValue)}</p>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <p className="text-gray-600">Payback</p>
              <p className="text-base font-bold text-blue-600">{formatNumber(paybackSimple)} anos</p>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <p className="text-gray-600">ROI (20 anos)</p>
              <p className="text-base font-bold text-blue-600">{formatNumber(calculations.roi20Years)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Economia e Benefícios */}
      <div className="border rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 mb-2 border-b pb-1">
          <Calendar className="h-4 w-4 text-primary" />
          <h2 className="font-bold text-sm">ECONOMIA E BENEFÍCIOS</h2>
        </div>
        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className="text-center p-2 bg-green-50 rounded border border-green-200">
            <p className="text-gray-600">Economia Mensal</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(calculations.monthlySavings)}</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded border border-green-200">
            <p className="text-gray-600">Economia Anual</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(calculations.annualSavings)}</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
            <p className="text-gray-600">Receita Líquida/Mês</p>
            <p className={`text-lg font-bold ${calculations.monthlyRevenue >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(calculations.monthlyRevenue)}
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded border border-gray-200">
            <p className="text-gray-600">Tributo Mensal</p>
            <p className="text-lg font-bold text-gray-600">{formatCurrency(calculations.taxation.monthlyTax)}</p>
          </div>
        </div>
      </div>

      {/* Status de Viabilidade */}
      <div className={`border-2 rounded-lg p-3 mb-3 ${calculations.isViable ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
        <div className="flex items-center justify-center gap-2">
          {calculations.isViable ? (
            <>
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-green-600">PROJETO VIÁVEL</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <span className="text-xl font-bold text-red-600">PROJETO INVIÁVEL</span>
            </>
          )}
        </div>
        {!calculations.isViable && calculations.viabilityIssues.length > 0 && (
          <div className="mt-2 text-xs text-red-700">
            <p className="font-semibold">Problemas identificados:</p>
            <ul className="list-disc list-inside">
              {calculations.viabilityIssues.slice(0, 2).map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Rodapé */}
      <div className="text-center text-xs border-t pt-2">
        <p><span className="font-semibold">Data de Emissão:</span> {calculations.proposalDate} | <span className="font-semibold">Válido até:</span> {calculations.validityDate}</p>
        <p className="mt-1 text-gray-500">Enermac - Energia Renovável | Proposta sujeita a confirmação técnica</p>
      </div>
    </div>
  );
}