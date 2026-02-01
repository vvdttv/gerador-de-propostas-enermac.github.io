import { useState } from 'react';
import { PreProposalInput } from '@/types/preProposal';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Calculator, ArrowRight, Wand2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { generateMockPreProposalInput } from '@/utils/mockDataGenerator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const LIVESTOCK_CLASSES = {
  suino: [
    { value: 'Matriz', label: 'Matriz' },
    { value: 'Crechário (Lâmina d\'água)', label: 'Crechário' },
    { value: 'Terminação/Maraã', label: 'Terminação' }
  ],
  bovino: [
    { value: 'Matriz UPD', label: 'Matriz UPD' },
    { value: 'Terminação Confinamento', label: 'Terminação Confinamento' }
  ],
  aves: [
    { value: 'Poedeira', label: 'Poedeira' },
    { value: 'Frango de Corte', label: 'Frango de Corte' }
  ]
};

interface Props {
  onCalculate: (data: PreProposalInput) => void;
}

export function PreProposalForm({ onCalculate }: Props) {
  const [data, setData] = useState<PreProposalInput>({
    clientName: '',
    propertyName: '',
    state: '',
    livestockType: '',
    livestockClass: '',
    livestockQuantity: 0,
    confinementHours: 18,
    monthlyEnergyCost: 0,
    energyCostPerKwh: 0.85,
    hasThreePhaseGrid: true,
    gridDistance: 0
  });

  const handleChange = (field: keyof PreProposalInput, value: any) => {
    if (field === 'livestockType') {
      setData(prev => ({ ...prev, [field]: value, livestockClass: '' }));
    } else {
      setData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAutoFill = (viability: 'viable' | 'nonViable') => {
    const mockData = generateMockPreProposalInput(viability);
    setData(mockData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(data);
  };

  const isFormValid = () => {
    return data.clientName && 
           data.state && 
           data.livestockType && 
           data.livestockClass && 
           data.livestockQuantity > 0 && 
           data.monthlyEnergyCost > 0;
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <Calculator className="h-6 w-6" />
            Simulador de Pré-Proposta
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados básicos para receber uma estimativa de investimento
          </p>
          
          {/* Botão de Auto-Preenchimento */}
          <div className="pt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Wand2 className="h-4 w-4" />
                  Preencher Automaticamente
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem onClick={() => handleAutoFill('viable')} className="gap-2 cursor-pointer">
                  <ThumbsUp className="h-4 w-4 text-primary" />
                  <span>Cenário <strong>Viável</strong></span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAutoFill('nonViable')} className="gap-2 cursor-pointer">
                  <ThumbsDown className="h-4 w-4 text-destructive" />
                  <span>Cenário <strong>Não Viável</strong></span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Dados do Cliente */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Identificação</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nome do Cliente *</Label>
              <Input
                id="clientName"
                value={data.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
                placeholder="Ex: João Silva"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyName">Nome da Propriedade</Label>
              <Input
                id="propertyName"
                value={data.propertyName}
                onChange={(e) => handleChange('propertyName', e.target.value)}
                placeholder="Ex: Fazenda São João"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Select value={data.state} onValueChange={(v) => handleChange('state', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Composição do Plantel */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Composição do Plantel</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Animal *</Label>
              <Select value={data.livestockType} onValueChange={(v) => handleChange('livestockType', v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suino">Suíno</SelectItem>
                  <SelectItem value="bovino">Bovino</SelectItem>
                  <SelectItem value="aves">Aves</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Classe *</Label>
              <Select 
                value={data.livestockClass} 
                onValueChange={(v) => handleChange('livestockClass', v)}
                disabled={!data.livestockType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {data.livestockType && LIVESTOCK_CLASSES[data.livestockType]?.map((cls) => (
                    <SelectItem key={cls.value} value={cls.value}>{cls.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={data.livestockQuantity || ''}
                onChange={(e) => handleChange('livestockQuantity', parseInt(e.target.value) || 0)}
                placeholder="Ex: 1000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confinement">Confinamento (h/dia)</Label>
              <Input
                id="confinement"
                type="number"
                min="0"
                max="24"
                value={data.confinementHours || ''}
                onChange={(e) => handleChange('confinementHours', parseFloat(e.target.value) || 0)}
                placeholder="Ex: 18"
              />
            </div>
          </div>
        </div>

        {/* Custos Atuais */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Custos Atuais de Energia</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyCost">Custo Mensal de Energia (R$) *</Label>
              <Input
                id="monthlyCost"
                type="number"
                min="0"
                step="0.01"
                value={data.monthlyEnergyCost || ''}
                onChange={(e) => handleChange('monthlyEnergyCost', parseFloat(e.target.value) || 0)}
                placeholder="Ex: 5000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kwhCost">Custo do kWh (R$)</Label>
              <Input
                id="kwhCost"
                type="number"
                min="0"
                step="0.01"
                value={data.energyCostPerKwh || ''}
                onChange={(e) => handleChange('energyCostPerKwh', parseFloat(e.target.value) || 0)}
                placeholder="Ex: 0.85"
              />
            </div>
          </div>
        </div>

        {/* Infraestrutura */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Infraestrutura Elétrica</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label>Possui rede trifásica?</Label>
              <RadioGroup
                value={data.hasThreePhaseGrid ? 'sim' : 'nao'}
                onValueChange={(v) => handleChange('hasThreePhaseGrid', v === 'sim')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="sim" />
                  <Label htmlFor="sim" className="font-normal cursor-pointer">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="nao" />
                  <Label htmlFor="nao" className="font-normal cursor-pointer">Não (+R$ 20.000)</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gridDistance">Distância da Rede (metros)</Label>
              <Input
                id="gridDistance"
                type="number"
                min="0"
                value={data.gridDistance || ''}
                onChange={(e) => handleChange('gridDistance', parseFloat(e.target.value) || 0)}
                placeholder="Ex: 50"
              />
              <p className="text-xs text-muted-foreground">R$ 500/metro adicional</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <Button 
          type="submit" 
          size="lg" 
          className="w-full gap-2"
          disabled={!isFormValid()}
        >
          Calcular Pré-Proposta
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Card>
    </form>
  );
}
