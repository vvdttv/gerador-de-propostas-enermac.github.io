// Componente para exibição do breakdown de CAPEX

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DetailedCapex } from '@/types/expandedProposal';
import { getCapexSummary } from '@/utils/capexCalculations';
import { formatCurrency } from '@/utils/financialIndicators';
import { Progress } from '@/components/ui/progress';

interface Props {
  capex: DetailedCapex;
}

export function CapexBreakdown({ capex }: Props) {
  const summary = getCapexSummary(capex);
  
  // Cores para cada categoria
  const categoryColors: Record<string, string> = {
    'Gerenciamento de Projetos': 'bg-blue-500',
    'Pré-Tratamento': 'bg-purple-500',
    'Sistema de Biodigestão': 'bg-green-500',
    'Digestato': 'bg-yellow-500',
    'Tratamento do Biogás': 'bg-orange-500',
    'Geração Elétrica': 'bg-red-500',
    'Aproveitamento Térmico': 'bg-pink-500',
    'Biometano': 'bg-cyan-500',
    'Fábrica Organomineral': 'bg-indigo-500',
    'Infraestrutura': 'bg-gray-500'
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhamento do Investimento (CAPEX)</CardTitle>
        <CardDescription>
          Investimento total: {formatCurrency(capex.total)}
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
                  {formatCurrency(item.value)}
                </span>
              </div>
            </div>
            <Progress 
              value={item.percentage} 
              className="h-2"
            />
          </div>
        ))}
        
        {/* Detalhamento por subcategoria (colapsável) */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-semibold mb-4">Detalhamento por Subcategoria</h4>
          
          {capex.projectManagement.subtotal > 0 && (
            <CategoryDetail
              title="Gerenciamento de Projetos"
              items={[
                { label: 'Projetos Executivos', value: capex.projectManagement.executiveProjects },
                { label: 'Acompanhamento de Obra', value: capex.projectManagement.constructionMonitoring },
                { label: 'Projeto de GD', value: capex.projectManagement.gdProject },
                { label: 'Plano de Inspeção e Testes', value: capex.projectManagement.pitPlan }
              ]}
              total={capex.projectManagement.subtotal}
            />
          )}
          
          {capex.biodigestionSystem.subtotal > 0 && (
            <CategoryDetail
              title="Sistema de Biodigestão"
              items={[
                { label: 'Biodigestor (Civil)', value: capex.biodigestionSystem.biodigester },
                { label: 'Geomembrana', value: capex.biodigestionSystem.geomembrane },
                { label: 'Sistema de Agitação', value: capex.biodigestionSystem.agitationSystem },
                { label: 'Válvulas Reguladoras', value: capex.biodigestionSystem.regulatorValves }
              ]}
              total={capex.biodigestionSystem.subtotal}
            />
          )}
          
          {capex.electricGeneration.subtotal > 0 && (
            <CategoryDetail
              title="Geração Elétrica"
              items={[
                { label: 'Grupo Motogerador', value: capex.electricGeneration.generator },
                { label: 'Painel de Gerenciamento', value: capex.electricGeneration.managementPanel },
                { label: 'Painel de Proteção', value: capex.electricGeneration.protectionPanel },
                { label: 'Casa de Máquinas', value: capex.electricGeneration.machineHouse }
              ]}
              total={capex.electricGeneration.subtotal}
            />
          )}
          
          {capex.infrastructure.subtotal > 0 && (
            <CategoryDetail
              title="Infraestrutura"
              items={[
                { label: 'Serviços Elétricos', value: capex.infrastructure.electricalServices },
                { label: 'Materiais Elétricos', value: capex.infrastructure.electricalMaterials },
                { label: 'Transformadores', value: capex.infrastructure.transformers },
                { label: 'Rede Trifásica', value: capex.infrastructure.threePhaseGrid },
                { label: 'Distância da Rede', value: capex.infrastructure.gridDistance }
              ].filter(i => i.value > 0)}
              total={capex.infrastructure.subtotal}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface CategoryDetailProps {
  title: string;
  items: { label: string; value: number }[];
  total: number;
}

function CategoryDetail({ title, items }: CategoryDetailProps) {
  return (
    <div className="mb-4 p-3 bg-muted/30 rounded-lg">
      <h5 className="font-medium text-sm mb-2">{title}</h5>
      <div className="space-y-1">
        {items.filter(i => i.value > 0).map((item) => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span>{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
