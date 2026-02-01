import { useState } from 'react';
import { ClientData, TechnicalData, CurrentCosts, FinancialConfig, ProposalCalculations } from '@/types/proposal';
import { ExpandedCalculationResult } from '@/utils/expandedProposalCalculations';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { TrendingUp, DollarSign, Calendar, Zap, Leaf, AlertTriangle, CheckCircle2, User, Lightbulb, FileText, BarChart3, Save, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { exportToPowerPoint } from '@/utils/pptxExport';
import { CommentField } from './CommentField';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  clientDataSchema, 
  technicalDataSchema, 
  currentCostsSchema, 
  financialConfigSchema, 
  proposalNameSchema 
} from '@/schemas/proposalSchemas';
import { FinancialIndicatorsDisplay } from './FinancialIndicatorsDisplay';
import { CashFlowTable } from './CashFlowTable';
import { CapexBreakdown } from './CapexBreakdown';
import { OpexBreakdown } from './OpexBreakdown';
import { ProposalExecutiveSummary } from './ProposalExecutiveSummary';

interface ProposalComments {
  client: string;
  technicalRoute: string;
  investment: string;
  financial: string;
  benefits: string;
  indicators: string;
  general: string;
}

interface Props {
  client: ClientData;
  technical: TechnicalData;
  currentCosts: CurrentCosts;
  financial: FinancialConfig;
  calculations: ProposalCalculations;
  expandedCalculations?: ExpandedCalculationResult;
}

export function ProposalPreview({ client, calculations, financial, technical, currentCosts, expandedCalculations }: Props) {
  const [comments, setComments] = useState<ProposalComments>({
    client: '',
    technicalRoute: '',
    investment: '',
    financial: '',
    benefits: '',
    indicators: '',
    general: ''
  });
  

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

  const updateComment = (field: keyof ProposalComments, value: string) => {
    setComments(prev => ({ ...prev, [field]: value }));
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportPowerPoint = async () => {
    try {
      toast.loading('Gerando apresentação PowerPoint...');
      const proposalData = {
        client,
        technical,
        currentCosts,
        financial,
        calculations,
        expandedCalculations
      };
      await exportToPowerPoint(proposalData);
      toast.success('Apresentação PowerPoint gerada com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PowerPoint:', error);
      toast.error('Erro ao gerar apresentação PowerPoint');
    }
  };

  const handleSaveProposal = async () => {
    try {
      const proposalName = prompt('Digite um nome para esta proposta:');
      if (!proposalName) return;

      // Validate proposal name
      const validatedName = proposalNameSchema.parse(proposalName);

      // Validate all data before saving
      const validatedClient = clientDataSchema.parse(client);
      const validatedTechnical = technicalDataSchema.parse(technical);
      const validatedCurrentCosts = currentCostsSchema.parse(currentCosts);
      const validatedFinancial = financialConfigSchema.parse(financial);

      toast.loading('Salvando proposta...');
      
      const { error } = await supabase
        .from('proposals')
        .insert([{
          proposal_name: validatedName,
          client_data: validatedClient as any,
          technical_data: validatedTechnical as any,
          current_costs: validatedCurrentCosts as any,
          financial_config: validatedFinancial as any,
          calculations: calculations as any
        }]);

      if (error) throw error;
      
      toast.success('Proposta salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar proposta:', error);
      if (error instanceof Error) {
        toast.error(`Erro ao salvar: ${error.message}`);
      } else {
        toast.error('Erro ao salvar proposta');
      }
    }
  };

  return (
    <div className="space-y-6 print:text-black">
      {/* Executive Summary - Print Only (First Page) */}
      <ProposalExecutiveSummary 
        client={client}
        technical={technical}
        currentCosts={currentCosts}
        financial={financial}
        calculations={calculations}
        expandedCalculations={expandedCalculations}
      />

      {/* Full Details - Screen and Additional Print Pages */}
      <div className="screen-only md:block">
        {/* Header */}
        <div className="text-center space-y-2 print:mb-8">
          <h1 className="text-3xl font-bold text-primary print:text-black">PROPOSTA COMERCIAL</h1>
          <p className="text-xl font-semibold">Enermac - Energia Renovável</p>
          <p className="text-muted-foreground print:text-gray-600">Geração de Bioenergia através de Resíduos Orgânicos</p>
        </div>
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
        
        <CommentField
          value={comments.client}
          onChange={(value) => updateComment('client', value)}
          placeholder="Adicione observações sobre o cliente ou particularidades da propriedade..."
          label="Comentário sobre o cliente"
        />
      </Card>

      {/* Technological Route */}
      <Card className="p-6 bg-primary/5 border-primary/20 print:break-after-page print:bg-white print:border-gray-300">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary print:text-black" />
          Rota Tecnológica Escolhida
        </h2>
        <p className="text-muted-foreground leading-relaxed print:text-gray-800 mb-4">
          {calculations.technologicalRoute}
        </p>

        <Separator className="my-4" />

        <h3 className="text-lg font-semibold mb-3">Equipamentos Selecionados</h3>
        <div className="space-y-3">
          <div className="p-3 bg-background rounded-lg print:bg-gray-50">
            <p className="text-sm font-semibold text-primary print:text-black">Biodigestor</p>
            <p className="text-sm text-muted-foreground print:text-gray-800">{calculations.equipmentDetails.biodigestor}</p>
          </div>
          <div className="p-3 bg-background rounded-lg print:bg-gray-50">
            <p className="text-sm font-semibold text-primary print:text-black">Grupo Motogerador</p>
            <p className="text-sm text-muted-foreground print:text-gray-800">{calculations.equipmentDetails.generator}</p>
          </div>
          <div className="p-3 bg-background rounded-lg print:bg-gray-50">
            <p className="text-sm font-semibold text-primary print:text-black">Descrição Completa do Sistema</p>
            <p className="text-sm text-muted-foreground print:text-gray-800">{calculations.equipmentDetails.description}</p>
          </div>
        </div>
        
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
        
        <CommentField
          value={comments.technicalRoute}
          onChange={(value) => updateComment('technicalRoute', value)}
          placeholder="Adicione justificativas técnicas ou observações sobre os equipamentos selecionados..."
          label="Comentário sobre rota tecnológica"
        />
      </Card>

      {/* Viability Status */}
      {!calculations.isViable ? (
        <Alert variant="destructive" className="print:break-after-page print:border-red-300 print:bg-red-50">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>
            <div className="space-y-4">
              <p className="font-bold text-xl">⚠️ Análise Detalhada de Viabilidade do Projeto</p>
              
              <div className="p-4 bg-background/50 rounded-lg print:bg-white border-l-4 border-red-600">
                <p className="font-semibold text-lg mb-2">🔍 Diagnóstico da Situação Atual</p>
                <p className="text-base leading-relaxed mb-3">
                  Após análise técnico-econômica detalhada dos parâmetros do projeto, identificamos <strong className="text-red-700">{calculations.viabilityIssues.length} limitação(ões) crítica(s)</strong> que impedem a viabilidade do projeto nas condições atuais. Cada ponto abaixo detalha especificamente o problema encontrado e seu impacto:
                </p>
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-base">📋 Problemas Identificados:</p>
                {calculations.viabilityIssues.map((issue, index) => (
                  <div key={index} className="p-3 bg-background/50 rounded-lg print:bg-white border-l-4 border-red-500">
                    <p className="text-sm font-semibold text-red-700">Problema {index + 1}:</p>
                    <p className="text-sm leading-relaxed mt-1">{issue}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-300">
                <p className="font-bold text-base mb-3 text-yellow-900">💡 Plano de Ação para Viabilização do Projeto:</p>
                <p className="text-sm mb-3 text-yellow-900">
                  Para transformar este projeto em uma oportunidade viável, recomendamos as seguintes ações específicas:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-yellow-900">
                  {calculations.dailyBiogasProduction < 10 && (
                    <li className="pl-2">
                      <strong>Aumentar Produção de Biogás:</strong> Elevar a produção para pelo menos 10 m³/dia através de:
                      <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
                        <li>Aumentar o número de animais em confinamento (mínimo recomendado conforme tipo de criação)</li>
                        <li>Adicionar substratos orgânicos complementares (resíduos agroindustriais, silagem, etc.)</li>
                        <li>Implementar codigestão anaeróbia para otimizar a produção</li>
                      </ul>
                    </li>
                  )}
                  {calculations.monthlyRevenue < 0 && (
                    <li className="pl-2">
                      <strong>Equilibrar Fluxo de Caixa:</strong> Tornar o fluxo mensal positivo através de:
                      <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
                        <li>Aumentar o prazo de financiamento de {financial.installments} para 180 ou 240 meses, reduzindo parcelas</li>
                        <li>Elevar o valor do sinal de {financial.downPaymentPercentage}% para 30-40% do investimento total</li>
                        <li>Negociar taxa de juros reduzida (buscar linhas de crédito verde com juros subsidiados)</li>
                        <li>Aumentar a escala do projeto para gerar mais economia mensal</li>
                      </ul>
                    </li>
                  )}
                  {calculations.paybackYears > 20 && (
                    <li className="pl-2">
                      <strong>Reduzir Período de Retorno:</strong> Buscar payback inferior a 15 anos através de:
                      <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
                        <li>Otimizar custos de investimento (negociar equipamentos, buscar fornecedores alternativos)</li>
                        <li>Aumentar as fontes de receita (venda de excedente de energia, comercialização de biofertilizante)</li>
                        <li>Buscar linhas de financiamento com juros subsidiados para energias renováveis</li>
                        <li>Considerar incentivos fiscais e programas governamentais de bioenergia</li>
                      </ul>
                    </li>
                  )}
                  {calculations.dailyEnergyProduction < currentCosts.monthlyEnergyConsumption / 30 && (
                    <li className="pl-2">
                      <strong>Aumentar Geração de Energia:</strong> Dimensionar para atender 100% da demanda através de:
                      <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
                        <li>Aumentar significativamente o volume de substrato processado</li>
                        <li>Instalar gerador de maior capacidade ({formatNumber(currentCosts.monthlyEnergyConsumption / 30 / 8)} kW mínimo recomendado)</li>
                        <li>Implementar sistema de armazenamento de biogás (gasômetro) para operação contínua</li>
                        <li>Considerar sistema híbrido (bioenergia + solar fotovoltaica) para complementar a geração</li>
                      </ul>
                    </li>
                  )}
                  <li className="pl-2">
                    <strong>Consultoria Técnica Especializada:</strong> Agendar reunião com nossa equipe técnica para:
                    <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
                      <li>Análise in loco da propriedade e disponibilidade de substratos</li>
                      <li>Simulação de cenários alternativos com diferentes configurações</li>
                      <li>Orientação sobre programas de financiamento e incentivos disponíveis</li>
                      <li>Elaboração de plano de viabilização customizado</li>
                    </ul>
                  </li>
                </ul>
                <p className="text-sm mt-3 font-semibold text-yellow-900">
                  📞 Entre em contato conosco para discutir as melhores alternativas para viabilizar seu projeto de bioenergia.
                </p>
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
        
        <CommentField
          value={comments.financial}
          onChange={(value) => updateComment('financial', value)}
          placeholder="Adicione observações sobre condições de pagamento, taxas especiais ou negociações..."
          label="Comentário financeiro"
        />
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
        
        <CommentField
          value={comments.benefits}
          onChange={(value) => updateComment('benefits', value)}
          placeholder="Adicione observações sobre outros benefícios ou incentivos aplicáveis ao projeto..."
          label="Comentário sobre benefícios"
        />
      </Card>

      {/* Financial Indicators - TIR, VPL, Payback */}
      {expandedCalculations && (
        <Card className="p-6 print:break-after-page print:bg-white print:border-gray-300">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary print:text-black" />
            Indicadores Financeiros Avançados
          </h2>
          <FinancialIndicatorsDisplay 
            cashFlow={expandedCalculations.cashFlow} 
            totalInvestment={expandedCalculations.capex.total} 
          />
          
          <CommentField
            value={comments.indicators}
            onChange={(value) => updateComment('indicators', value)}
            placeholder="Adicione observações sobre os indicadores financeiros ou premissas utilizadas..."
            label="Comentário sobre indicadores"
          />
        </Card>
      )}

      {/* CAPEX Breakdown */}
      {expandedCalculations && (
        <Card className="p-6 print:break-after-page print:bg-white print:border-gray-300">
          <CapexBreakdown capex={expandedCalculations.capex} />
        </Card>
      )}

      {/* OPEX Breakdown */}
      {expandedCalculations && (
        <Card className="p-6 print:break-after-page print:bg-white print:border-gray-300">
          <OpexBreakdown opex={expandedCalculations.opex} />
        </Card>
      )}

      {/* Cash Flow Table */}
      {expandedCalculations && (
        <Card className="p-6 print:break-after-page print:bg-white print:border-gray-300">
          <CashFlowTable cashFlow={expandedCalculations.cashFlow} />
        </Card>
      )}
      {/* General Comments */}
      <Card className="p-6 no-print">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Observações Gerais
        </h2>
        <CommentField
          value={comments.general}
          onChange={(value) => updateComment('general', value)}
          placeholder="Adicione observações gerais sobre a proposta, condições especiais, ou informações adicionais para o cliente..."
          label="Adicionar observação"
        />
      </Card>

      {/* Action Buttons - Save Proposal with Multiple Formats */}
      <Card className="p-6 no-print">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Save className="h-5 w-5 text-primary" />
          Salvar Proposta
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Salve a proposta no banco de dados e exporte nos formatos desejados.
        </p>
        
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSaveProposal} variant="default" size="lg" className="gap-2">
            <Save className="h-4 w-4" />
            Salvar no Sistema
          </Button>
          
          <Button onClick={handleExportPDF} variant="outline" size="lg" className="gap-2">
            <Download className="h-4 w-4" />
            Baixar PDF
          </Button>
          
          <Button onClick={handleExportPowerPoint} variant="outline" size="lg" className="gap-2">
            <FileText className="h-4 w-4" />
            Baixar PowerPoint (.pptx)
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-3">
          💡 Dica: O PDF é gerado através da função de impressão do navegador. O PowerPoint pode ser editado no Microsoft PowerPoint ou Google Slides.
        </p>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-8 border-t print:text-gray-600">
        <p className="font-semibold">Data de Emissão: {calculations.proposalDate}</p>
        <p className="mt-1">Esta proposta é válida até: {calculations.validityDate}</p>
        <p className="mt-3">Enermac - Energia Renovável</p>
      </div>
    </div>
  );
}
